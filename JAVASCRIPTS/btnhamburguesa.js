
    // JavaScript para el menú hamburguesa que se cierra automáticamente
    document.addEventListener('DOMContentLoaded', function() {
        const menuBtn = document.getElementById('menuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (menuBtn && mobileMenu && menuOverlay) {
            // Abrir menú al hacer clic en las rayitas
            menuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                // Bloquear scroll cuando el menú está abierto
                document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
            });
            
            // Cerrar menú al hacer clic en el overlay (área oscura)
            menuOverlay.addEventListener('click', function() {
                closeMenu();
            });
            
            // Cerrar menú al hacer clic en cualquier enlace del menú
            const mobileLinks = mobileMenu.querySelectorAll('.paginas-header');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    
                    // Cerrar el menú primero
                    closeMenu();
                    
                    // Luego navegar a la sección
                    setTimeout(() => {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }
                    }, 300); // Pequeña pausa para que se cierre el menú
                });
            });
            
            // Cerrar menú al presionar la tecla Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    closeMenu();
                }
            });
            
            // Cerrar menú al redimensionar la ventana
            window.addEventListener('resize', function() {
                if (window.innerWidth > 768) {
                    closeMenu();
                }
            });
            
            // Función para cerrar el menú
            function closeMenu() {
                menuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = ''; // Restaurar scroll
            }
            
            // Cerrar menú al hacer clic fuera de él
            document.addEventListener('click', function(event) {
                if (mobileMenu.classList.contains('active') && 
                    !mobileMenu.contains(event.target) && 
                    !menuBtn.contains(event.target)) {
                    closeMenu();
                }
            });
        }
    });

    /*Movimiento header */
    // Efecto scroll para el header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.inicio');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});
