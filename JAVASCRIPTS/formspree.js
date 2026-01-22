// ========== SISTEMA CON FORMSPREE ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script de comentarios cargado');
    
    const estrellas = document.querySelectorAll('.estrella');
    let puntuacion = 0;
    
    // Configurar estrellas (igual que antes)
    estrellas.forEach((estrella, index) => {
        estrella.addEventListener('click', function() {
            puntuacion = index + 1;
            
            // Actualizar campo oculto
            const hiddenField = document.getElementById('puntuacion-hidden');
            if(hiddenField) hiddenField.value = puntuacion;
            
            // Resetear todas
            estrellas.forEach(e => e.style.color = '#d0d0d0');
            
            // Pintar seleccionadas
            for(let i = 0; i < puntuacion; i++) {
                estrellas[i].style.color = '#222';
            }
        });
    });
    
    // Interceptar el envío del formulario
    const form = document.getElementById('form-comentarios');
    if(form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar
            const nombre = document.getElementById('nombre').value.trim();
            const comentario = document.getElementById('comentario').value.trim();
            
            if(!nombre || !comentario || puntuacion === 0) {
                mostrarMensaje('Completa todos los campos y selecciona estrellas', 'error');
                return;
            }
            
            mostrarMensaje('Enviando comentario...', 'info');
            
            try {
                // Enviar usando Formspree
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if(response.ok) {
                    mostrarMensaje('✅ Comentario enviado. Se mostrará pronto.', 'exito');
                    form.reset();
                    
                    // Resetear estrellas
                    puntuacion = 0;
                    estrellas.forEach(e => e.style.color = '#d0d0d0');
                } else {
                    throw new Error('Error en el envío');
                }
                
            } catch (error) {
                mostrarMensaje('❌ Error al enviar. Intenta nuevamente.', 'error');
            }
        });
    }
    
    function mostrarMensaje(texto, tipo) {
        // (Misma función de mensajes que ya tenías)
    }
});