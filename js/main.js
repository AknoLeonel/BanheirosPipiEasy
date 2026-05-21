document.addEventListener('DOMContentLoaded', () => {
    // 1. Lógica do Menu Mobile
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');

    if(btn && menu) {
        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

        // Fechar menu ao clicar em um link
        const mobileLinks = menu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.add('hidden');
            });
        });
    }

    // 2. Estilizar Header ao Rolar a Página (UX)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('shadow-md');
            header.classList.remove('shadow-sm');
        } else {
            header.classList.remove('shadow-md');
            header.classList.add('shadow-sm');
        }
    });
});