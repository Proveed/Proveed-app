window.onload = () => {
    const container = document.getElementById('particle-canvas');
    const brand = document.getElementById('brand-core');
    const auth = document.getElementById('auth-module');
    const dotsCount = 40;

    // 1. Inyectar partículas
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = '-20px';
        container.appendChild(dot);

        // Caída controlada
        setTimeout(() => {
            dot.style.transition = `top ${1 + Math.random()}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            dot.style.top = '50%';
        }, i * 80);
    }

    // 2. Ejecutar impacto PROVEED
    setTimeout(() => {
        // Efecto de choque
        const dots = document.querySelectorAll('.dot');
        dots.forEach(d => {
            const x = (Math.random() - 0.5) * 1500;
            const y = (Math.random() - 0.5) * 1500;
            d.style.setProperty('--x', `${x}px`);
            d.style.setProperty('--y', `${y}px`);
            d.classList.add('scatter');
        });

        // Revelar Login con clase moderna
        auth.classList.remove('hidden');
        auth.classList.add('visible');
    }, (dotsCount * 80) + 1000);
};

function validate() {
    const btn = document.querySelector('.btn-glow');
    btn.innerHTML = "AUTENTICANDO...";
    btn.style.opacity = "0.7";
}
