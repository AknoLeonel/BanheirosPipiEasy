// PipiEasy — interações leves (sem dependências)
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Menu mobile
    const btn = document.getElementById('menu-btn');
    const menu = document.getElementById('menu');
    const setMenu = (open) => {
        btn.setAttribute('aria-expanded', open);
        btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        menu.hidden = !open;
    };
    btn.addEventListener('click', () => setMenu(menu.hidden));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); btn.focus(); } });

    // 2. Sombra no header + barra fixa de WhatsApp após o hero (sem listener de scroll)
    const header = document.getElementById('navbar');
    const dock = document.getElementById('dock');
    const dockLink = dock.querySelector('a');
    const hero = document.getElementById('inicio');
    const cta = document.querySelector('.cta');
    let pastHero = false, atCta = false;
    const syncDock = () => {
        const on = pastHero && !atCta;
        dock.classList.toggle('is-on', on);
        dock.setAttribute('aria-hidden', !on);
        dockLink.tabIndex = on ? 0 : -1;
    };
    new IntersectionObserver(([e]) => {
        header.classList.toggle('is-stuck', e.boundingClientRect.top < 0);
        pastHero = !e.isIntersecting;
        syncDock();
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
    new IntersectionObserver(([e]) => { atCta = e.isIntersecting; syncDock(); }).observe(cta);

    // 3. Revelar ao rolar (opacity/transform apenas)
    const items = document.querySelectorAll('.reveal');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-in'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.classList.add('is-in');
            io.unobserve(e.target);
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    items.forEach((el) => io.observe(el));
});
