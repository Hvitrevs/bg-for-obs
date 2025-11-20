const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.style.margin = "0";
document.body.style.overflow = "hidden";
document.body.appendChild(canvas);

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// Background gradient
function drawGradient() {
    const g = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        20,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
    );
    g.addColorStop(0, "#031014");
    g.addColorStop(1, "#06000c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Fireflies (unchanged)
class Firefly {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 0.01 + Math.random() * 2;
        this.alpha = 0;
        this.life = 0;
        this.maxLife = 5 + Math.random() * 500;
        this.color = Math.random() > 0.5 ? "rgba(0,255,255," : "rgba(5,65,155,";
        this.vx = (Math.random() - 0.2) * 0.1;
        this.vy = (Math.random() - 0.5) * 0.1;
    }
    update() {
        this.life++;
        if (this.life < 50) this.alpha += 0.02;
        else if (this.life > this.maxLife - 60) this.alpha -= 0.05;
        this.x += this.vx;
        this.y += this.vy;
        if (this.life > this.maxLife || this.alpha <= 0) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.shadowBlur = 25;
        ctx.shadowColor = this.color + this.alpha + ")";
        ctx.fillStyle = this.color + this.alpha + ")";
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 4);
        ctx.fill();
    }
}

// Smoke texture setup
const smokeImg = new Image();
smokeImg.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png";

// Smoke sprite class with color cycling
class SmokeSprite {
    constructor() { this.reset(); }
    reset() {
        this.x = canvas.width / 2 + (Math.random() - 0.5) * 2000;
        this.y = canvas.height + Math.random() * 1900;
        this.size = 600 + Math.random() * 1200; // bigger clouds
        this.alpha = 0.00001 + Math.random() * 0.02;
        this.vy = -0.05 - Math.random() * 0.15;
        this.vx = (Math.random() - 0.5) * 0.1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.003;
        this.life = 0;
        this.maxLife = 1900 + Math.random() * 600;
        this.colorPhase = Math.random() * Math.PI * 2; // for color cycling
    }
    update() {
        this.life++;
        this.y += this.vy;
        this.x += this.vx;
        this.rotation += this.rotationSpeed;

        // Color phase
        this.colorPhase += 0.00;

        if (this.life > this.maxLife - 200) this.alpha -= 0.0005;
        if (this.life > this.maxLife || this.alpha <= 0) this.reset();
    }
    draw() {
        if (!smokeImg.complete) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;

        // Cyan ↔ Pink color cycling
        const r = 255 * (0.5 + 0.5 * Math.sin(this.colorPhase));
        const g = 255 * (0.5 + 0.5 * Math.cos(this.colorPhase * 0.7));
        const b = 255 * (0.5 + 0.5 * Math.sin(this.colorPhase + 2));
        ctx.filter = `hue-rotate(${Math.sin(this.colorPhase) * 180}deg)`;

        ctx.drawImage(
            smokeImg,
            -this.size / 2,
            -this.size / 2,
            this.size,
            this.size
        );

        ctx.restore();
        ctx.filter = "none";
    }
}

const fireflies = Array.from({ length: 80 }, () => new Firefly());
const smokeSprites = Array.from({ length: 180 }, () => new SmokeSprite());

// Animation loop
function animate() {
    drawGradient();
    smokeSprites.forEach(s => { s.update(); s.draw(); });
    fireflies.forEach(f => { f.update(); f.draw(); });
    requestAnimationFrame(animate);
}

animate();
