// script.js - Funcionalidades EducaFinance by SAMGROWTHLABS

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initAnimations();
    initHeaderScroll();
    highlightActiveNav();
});

/* ============================
   MENU MOBILE
   ============================ */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navList) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.style.overflow = navList.classList.contains('active') ? 'hidden' : '';
    });
    
    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        if (!menuToggle.contains(event.target) && !navList.contains(event.target)) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Fechar menu ao redimensionar para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================
   SCROLL SUAVE
   ============================ */
function initSmoothScroll() {
    // Links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
}

/* ============================
   ANIMAÇÕES
   ============================ */
function initAnimations() {
    // Observer para animações ao scroll
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos para animação
        const animateElements = document.querySelectorAll('.sidebar-card, .section-header');
        animateElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
        
        // Adicionar classe CSS para animação
        const style = document.createElement('style');
        style.textContent = `
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.6s ease, transform 0.6s ease;
            }
            
            .animate-on-scroll.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .sidebar-card {
                transition-delay: calc(var(--index, 0) * 100ms);
            }
        `;
        document.head.appendChild(style);
        
        // Adicionar índice para stagger animation
        document.querySelectorAll('.sidebar-card').forEach((card, index) => {
            card.style.setProperty('--index', index);
        });
    }
}

/* ============================
   HEADER SCROLL EFFECT
   ============================ */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Rolar para baixo
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Rolar para cima
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        
        lastScroll = currentScroll;
    });
}

/* ============================
   DESTACAR LINK ATIVO
   ============================ */
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        
        // Remover classe active de todos
        link.classList.remove('active');
        
        // Verificar qual link corresponde à página atual
        if (currentPath === linkPath) {
            link.classList.add('active');
        } else if (currentPath === '/' && linkPath === '/') {
            link.classList.add('active');
        } else if (currentPath.includes(linkPath.replace('/', '')) && linkPath !== '/') {
            link.classList.add('active');
        }
    });
}

// Executar após carregamento
setTimeout(() => {
    highlightActiveNav();
}, 100);