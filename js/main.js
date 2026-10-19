// PipiEasy — interações leves (sem dependências)
window.pipiReady = true;
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const desktop = matchMedia('(min-width: 960px)');

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

    // 2. Carrosséis: só são roláveis (e focáveis) no mobile
    const rails = document.querySelectorAll('.rail');
    const syncLayout = () => {
        if (desktop.matches) setMenu(false);
        rails.forEach((r) => {
            if (desktop.matches) {
                r.removeAttribute('tabindex');
                r.removeAttribute('role');
            } else {
                r.tabIndex = 0;
                r.setAttribute('role', 'region');
            }
        });
    };
    syncLayout();
    desktop.addEventListener('change', syncLayout);

    const header = document.getElementById('navbar');
    const dock = document.getElementById('dock');
    const dockLink = dock.querySelector('a');
    const items = document.querySelectorAll('.reveal');
    const showDock = (on) => {
        dock.classList.toggle('is-on', on);
        dock.setAttribute('aria-hidden', !on);
        dockLink.tabIndex = on ? 0 : -1;
    };

    if (!('IntersectionObserver' in window)) {
        items.forEach((el) => el.classList.add('is-in'));
        header.classList.add('is-stuck');
        showDock(true);
        return;
    }

    // 3. Sombra no header: sentinela no topo da página
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:0;height:10px;width:1px;pointer-events:none';
    document.body.prepend(sentinel);
    new IntersectionObserver(([e]) => header.classList.toggle('is-stuck', !e.isIntersecting)).observe(sentinel);

    // 4. Barra fixa de WhatsApp: entre o fim do hero e a chamada final
    let pastHero = false, atCta = false;
    const syncDock = () => showDock(pastHero && !atCta);
    new IntersectionObserver(([e]) => {
        pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        syncDock();
    }, { rootMargin: '-80px 0px 0px 0px' }).observe(document.getElementById('inicio'));
    new IntersectionObserver(([e]) => { atCta = e.isIntersecting; syncDock(); }).observe(document.querySelector('.cta'));

    // 5. Revelar ao rolar (opacity/transform apenas)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
