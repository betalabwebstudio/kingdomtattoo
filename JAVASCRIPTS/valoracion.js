// ========== SISTEMA DE COMENTARIOS CON LOCALSTORAGE ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de comentarios cargado');
    
    // VARIABLES GLOBALES
    const estrellas = document.querySelectorAll('.estrella');
    let puntuacion = 0;
    
    // ========== 1. INICIALIZAR ==========
    inicializarSistema();
    
    // ========== 2. CONFIGURAR ESTRELLAS ==========
    configurarEstrellas();
    
    // ========== 3. CONFIGURAR BOTÓN ==========
    configurarBotonEnviar();
    
    // ========== FUNCIONES ==========
    
    function inicializarSistema() {
        console.log('Inicializando sistema de comentarios...');
        
        // Verificar si localStorage está disponible
        if (!estaLocalStorageDisponible()) {
            console.error('LocalStorage no disponible');
            mostrarMensaje('Error: No se pueden guardar comentarios en este navegador', 'error');
            return;
        }
        
        // Cargar comentarios existentes AL INICIAR
        cargarComentariosGuardados();
    }
    
    function estaLocalStorageDisponible() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.error('LocalStorage no disponible:', e);
            return false;
        }
    }
    
    function configurarEstrellas() {
        const textosPuntuacion = ['', 'Malo', 'Regular', 'Bueno', 'Muy Bueno', 'Excelente'];
        
        estrellas.forEach((estrella, index) => {
            // CLICK en estrella
            estrella.addEventListener('click', function() {
                puntuacion = index + 1;
                console.log('Puntuación seleccionada:', puntuacion);
                
                // Resetear todas
                estrellas.forEach(e => {
                    e.style.color = '#d0d0d0';
                    e.classList.remove('seleccionada');
                });
                
                // Pintar seleccionadas
                for(let i = 0; i < puntuacion; i++) {
                    estrellas[i].style.color = '#222';
                    estrellas[i].classList.add('seleccionada');
                }
                
                // Actualizar texto
                const textoElemento = document.querySelector('.puntuacion-texto');
                if(textoElemento) {
                    textoElemento.textContent = textosPuntuacion[puntuacion] || 'Selecciona estrellas';
                }
            });
            
            // HOVER sobre estrella
            estrella.addEventListener('mouseover', function() {
                for(let i = 0; i <= index; i++) {
                    estrellas[i].style.color = '#222';
                }
            });
            
            // MOUSEOUT de estrella
            estrella.addEventListener('mouseout', function() {
                estrellas.forEach((e, i) => {
                    if(i >= puntuacion || !e.classList.contains('seleccionada')) {
                        e.style.color = '#d0d0d0';
                    }
                });
            });
        });
    }
    
    function configurarBotonEnviar() {
        const btnEnviar = document.querySelector('.btn-enviar');
        
        if(!btnEnviar) {
            console.error('No se encontró el botón .btn-enviar');
            return;
        }
        
        btnEnviar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón enviar clickeado');
            
            enviarComentario();
        });
    }
    
    function enviarComentario() {
        const nombreInput = document.getElementById('nombre');
        const comentarioInput = document.getElementById('comentario');
        
        if(!nombreInput || !comentarioInput) {
            console.error('No se encontraron los campos de entrada');
            return;
        }
        
        const nombre = nombreInput.value.trim();
        const comentario = comentarioInput.value.trim();
        
        console.log('Validando:', { nombre, comentario, puntuacion });
        
        // VALIDACIONES
        if(nombre === '') {
            mostrarMensaje('✏️ Escribe tu nombre', 'error');
            nombreInput.focus();
            return;
        }
        
        if(puntuacion === 0) {
            mostrarMensaje('⭐ Selecciona estrellas', 'error');
            return;
        }
        
        if(comentario === '') {
            mostrarMensaje('💬 Escribe tu comentario', 'error');
            comentarioInput.focus();
            return;
        }
        
        // CREAR OBJETO COMENTARIO
        const nuevoComentario = {
            id: Date.now(), // ID único
            nombre: nombre,
            comentario: comentario,
            puntuacion: puntuacion,
            fecha: obtenerFechaActual(),
            timestamp: new Date().getTime()
        };
        
        console.log('Nuevo comentario:', nuevoComentario);
        
        // INTENTAR GUARDAR
        try {
            guardarComentarioEnStorage(nuevoComentario);
            
            // ✅ IMPORTANTE: Recargar la lista completa después de guardar
            cargarComentariosGuardados();
            
            // MOSTRAR CONFIRMACIÓN
            mostrarMensaje('✅ Comentario publicado', 'exito');
            
            // LIMPIAR FORMULARIO
            limpiarFormulario();
            
        } catch (error) {
            console.error('Error al guardar:', error);
            mostrarMensaje('❌ Error al guardar el comentario', 'error');
        }
    }
    
    function guardarComentarioEnStorage(comentario) {
        try {
            // Obtener comentarios existentes
            const comentariosStr = localStorage.getItem('kingdomTattooComentarios');
            let comentarios = [];
            
            if(comentariosStr) {
                comentarios = JSON.parse(comentariosStr);
                if(!Array.isArray(comentarios)) {
                    comentarios = [];
                }
            }
            
            console.log('Comentarios existentes:', comentarios.length);
            
            // Agregar nuevo comentario al inicio
            comentarios.unshift(comentario);
            
            // Limitar a máximo 20 comentarios (guardamos extras por si acaso)
            if(comentarios.length > 20) {
                comentarios = comentarios.slice(0, 20);
            }
            
            // Guardar en localStorage
            localStorage.setItem('kingdomTattooComentarios', JSON.stringify(comentarios));
            
            console.log('Comentario guardado exitosamente. Total:', comentarios.length);
            return true;
            
        } catch (error) {
            console.error('Error en guardarComentarioEnStorage:', error);
            throw error;
        }
    }
    
    // ✅ FUNCIÓN PARA CARGAR COMENTARIOS GUARDADOS
    function cargarComentariosGuardados() {
        console.log('📂 Cargando comentarios guardados...');
        
        try {
            const comentariosStr = localStorage.getItem('kingdomTattooComentarios');
            const listaComentarios = document.querySelector('.lista-comentarios');
            
            if(!listaComentarios) {
                console.error('❌ No se encontró .lista-comentarios en el HTML');
                return;
            }
            
            console.log('🔍 Buscando comentarios en localStorage...');
            
            // Si NO hay comentarios guardados
            if(!comentariosStr || comentariosStr === '[]' || comentariosStr === 'null') {
                console.log('📭 No hay comentarios guardados');
                listaComentarios.innerHTML = '<p class="sin-comentarios">Sé el primero en comentar...</p>';
                return;
            }
            
            console.log('📄 Comentarios encontrados en localStorage:', comentariosStr);
            
            // Intentar parsear los comentarios
            let comentarios = [];
            try {
                comentarios = JSON.parse(comentariosStr);
                console.log('✅ Comentarios parseados:', comentarios);
            } catch (parseError) {
                console.error('❌ Error al parsear JSON:', parseError);
                listaComentarios.innerHTML = '<p class="sin-comentarios">Error al cargar comentarios</p>';
                return;
            }
            
            // Verificar que sea un array
            if(!Array.isArray(comentarios)) {
                console.error('❌ Los comentarios guardados no son un array válido');
                listaComentarios.innerHTML = '<p class="sin-comentarios">Error en formato de comentarios</p>';
                return;
            }
            
            console.log(`📊 Cargando ${comentarios.length} comentarios guardados`);
            
            // Limpiar lista actual
            listaComentarios.innerHTML = '';
            
            // Si no hay comentarios, mostrar mensaje
            if(comentarios.length === 0) {
                listaComentarios.innerHTML = '<p class="sin-comentarios">Sé el primero en comentar...</p>';
                return;
            }
            
            // Tomar solo los primeros 5 comentarios (más recientes)
            const comentariosAMostrar = comentarios.slice(0, 5);
            console.log(`🎯 Mostrando ${comentariosAMostrar.length} comentarios`);
            
            // Agregar cada comentario a la lista
            comentariosAMostrar.forEach((comentario, index) => {
                console.log(`➕ Agregando comentario ${index + 1}:`, comentario.nombre);
                agregarComentarioALista(comentario, false); // false = sin animación
            });
            
            console.log('✅ Comentarios cargados exitosamente');
            
        } catch (error) {
            console.error('❌ Error al cargar comentarios:', error);
            const listaComentarios = document.querySelector('.lista-comentarios');
            if(listaComentarios) {
                listaComentarios.innerHTML = '<p class="sin-comentarios">Error al cargar comentarios</p>';
            }
        }
    }
    
    function agregarComentarioALista(comentario, animar = true) {
        const listaComentarios = document.querySelector('.lista-comentarios');
        
        if(!listaComentarios) {
            console.error('❌ No se encontró .lista-comentarios');
            return;
        }
        
        // Remover mensaje "sin comentarios" si existe
        const sinComentarios = listaComentarios.querySelector('.sin-comentarios');
        if(sinComentarios) {
            console.log('🗑️ Removiendo mensaje "sin comentarios"');
            sinComentarios.remove();
        }
        
        // Crear HTML del comentario
        const estrellasHTML = '★'.repeat(comentario.puntuacion) + '☆'.repeat(5 - comentario.puntuacion);
        
        const comentarioHTML = `
            <div class="comentario">
                <div class="comentario-header">
                    <span class="nombre-cliente">${escapeHTML(comentario.nombre)}</span>
                    <div class="estrellas-comentario">${estrellasHTML}</div>
                </div>
                <p class="texto-comentario">${escapeHTML(comentario.comentario)}</p>
                <span class="fecha">${escapeHTML(comentario.fecha)}</span>
            </div>
        `;
        
        console.log(`🖨️ Creando HTML para comentario de ${comentario.nombre}`);
        
        // Agregar al principio si es nuevo, al final si es carga inicial
        if(animar) {
            console.log('🎬 Agregando con animación');
            listaComentarios.insertAdjacentHTML('afterbegin', comentarioHTML);
            
            // Animar entrada
            const nuevoComentario = listaComentarios.firstElementChild;
            if(nuevoComentario) {
                nuevoComentario.style.opacity = '0';
                nuevoComentario.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    nuevoComentario.style.transition = 'opacity 0.3s, transform 0.3s';
                    nuevoComentario.style.opacity = '1';
                    nuevoComentario.style.transform = 'translateY(0)';
                }, 10);
            }
        } else {
            console.log('📄 Agregando sin animación (carga inicial)');
            listaComentarios.insertAdjacentHTML('beforeend', comentarioHTML);
        }
        
        // Mantener máximo 5 comentarios visibles
        const todosComentarios = listaComentarios.querySelectorAll('.comentario');
        if(todosComentarios.length > 5) {
            console.log(`✂️ Limpiando comentarios extras (${todosComentarios.length} encontrados)`);
            todosComentarios[5].remove();
        }
    }
    
    function escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function obtenerFechaActual() {
        const ahora = new Date();
        const horas = ahora.getHours().toString().padStart(2, '0');
        const minutos = ahora.getMinutes().toString().padStart(2, '0');
        return `Hoy ${horas}:${minutos}`;
    }
    
    function limpiarFormulario() {
        const nombreInput = document.getElementById('nombre');
        const comentarioInput = document.getElementById('comentario');
        
        if(nombreInput) nombreInput.value = '';
        if(comentarioInput) comentarioInput.value = '';
        
        // Resetear estrellas
        puntuacion = 0;
        estrellas.forEach(e => {
            e.style.color = '#d0d0d0';
            e.classList.remove('seleccionada');
        });
        
        const textoElemento = document.querySelector('.puntuacion-texto');
        if(textoElemento) {
            textoElemento.textContent = 'Selecciona estrellas';
        }
    }
    
    function mostrarMensaje(texto, tipo) {
        // Remover mensaje anterior
        const mensajeAnterior = document.querySelector('.mensaje-flotante');
        if(mensajeAnterior) {
            mensajeAnterior.remove();
        }
        
        // Crear nuevo mensaje
        const mensaje = document.createElement('div');
        mensaje.className = 'mensaje-flotante';
        mensaje.textContent = texto;
        
        // Estilos
        mensaje.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(-20px);
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s, transform 0.3s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            pointer-events: none;
        `;
        
        if(tipo === 'error') {
            mensaje.style.background = '#ffebee';
            mensaje.style.color = '#c62828';
            mensaje.style.border = '1px solid #ffcdd2';
        } else {
            mensaje.style.background = '#e8f5e9';
            mensaje.style.color = '#2e7d32';
            mensaje.style.border = '1px solid #c8e6c9';
        }
        
        document.body.appendChild(mensaje);
        
        // Animar entrada
        setTimeout(() => {
            mensaje.style.opacity = '1';
            mensaje.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        // Auto-eliminar después de 3 segundos
        setTimeout(() => {
            mensaje.style.opacity = '0';
            mensaje.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => {
                if(mensaje.parentNode) {
                    mensaje.parentNode.removeChild(mensaje);
                }
            }, 300);
        }, 3000);
    }
    
    // ✅ DEBUG: Botón para ver contenido de localStorage
    function agregarBotonDebug() {
        const debugBtn = document.createElement('button');
        debugBtn.textContent = '🐛 Debug Comentarios';
        debugBtn.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: #666;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            z-index: 9999;
            font-size: 12px;
            opacity: 0.7;
        `;
        
        debugBtn.addEventListener('click', function() {
            const comentarios = localStorage.getItem('kingdomTattooComentarios');
            console.log('🔍 DEBUG - localStorage contenido:', comentarios);
            alert(`Comentarios en localStorage:\n${comentarios || 'Vacío'}`);
        });
        
        document.body.appendChild(debugBtn);
    }
    
    // Descomenta para activar el botón de debug
    // agregarBotonDebug();
});