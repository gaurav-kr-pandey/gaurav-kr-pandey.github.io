/* ============================================
   Canvas Background — Interactive Particle Mesh
   ============================================ */

const CanvasBG = (() => {
    let canvas, ctx;
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    let animationId;
    let width, height;

    const config = {
        particleCount: 80,
        particleBaseSize: 1.5,
        linkDistance: 150,
        mouseDistance: 200,
        particleSpeed: 0.3,
        // Using OLED dark mode compatible colors
        color: 'rgba(255, 255, 255, 0.15)',
        linkColor: 'rgba(255, 255, 255, 0.05)'
    };

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;
            this.size = Math.random() * config.particleBaseSize + 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse interaction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < config.mouseDistance) {
                const force = (config.mouseDistance - dist) / config.mouseDistance;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = config.color;
            ctx.fill();
        }
    }

    function init() {
        // Disable on mobile to save battery
        if (window.matchMedia('(max-width: 768px)').matches) return;

        canvas = document.getElementById('bg-canvas');
        if (!canvas) return;

        ctx = canvas.getContext('2d');
        
        resize();
        window.addEventListener('resize', resize);
        
        document.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        // Check if dark mode is active to set colors (optional optimization)
        
        createParticles();
        animate();
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        // Adjust particle count based on screen size
        config.particleCount = Math.floor((width * height) / 15000);
        createParticles();
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < config.particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function drawLinks() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < config.linkDistance) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = 1 - (dist / config.linkDistance);
                    ctx.strokeStyle = \`rgba(255, 255, 255, \${opacity * 0.1})\`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLinks();
        animationId = requestAnimationFrame(animate);
    }

    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    CanvasBG.init();
});
