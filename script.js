const canvas = document.getElementById('galaxy');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];
let stars = [];
let shootingStars = [];

const messages = [
  "Te amo", "Eres mi luz", "Siempre juntos", "Mi corazón", "Eres mi todo",
  "Contigo siempre", "Amor eterno", "Mi vida", "Para siempre", "Mi sol",
  "Te adoro", "Eres especial", "Mi alegría", "Mi inspiración", "Eres mi mundo"
];

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

class Particle {
  constructor(angle, radius, speed, message) {
    this.angle = angle;
    this.radius = radius;
    this.speed = speed;
    this.message = message;
    this.fontSize = 14 + Math.random() * 8;
    this.pulse = Math.random() * Math.PI * 2;
    this.colorPhase = Math.random() * 360;
    this.baseRadius = radius;
  }
  update() {
    this.angle += this.speed;
    this.pulse += 0.07;
    this.colorPhase = (this.colorPhase + 1) % 360;
    // Oscilar el radio para efecto de acercamiento/alejamiento
    this.radius = this.baseRadius + 10 * Math.sin(this.angle * 3);
  }
  draw() {
    const x = width / 2 + Math.cos(this.angle) * this.radius;
    const y = height / 2 + Math.sin(this.angle) * this.radius * 0.6;

    const glow = 15 + 15 * Math.sin(this.pulse);
    ctx.shadowColor = `rgba(179, 102, 255, 0.9)`;
    ctx.shadowBlur = glow;

    const hue = this.colorPhase;
    ctx.fillStyle = `hsl(${hue}, 70%, 80%)`;
    ctx.font = `${this.fontSize}px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.message, x, y);

    ctx.shadowBlur = 0;
  }
}

class Star {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.radius = Math.random() * 1.5;
    this.alpha = Math.random();
    this.alphaChange = 0.01 + Math.random() * 0.02;
  }
  update() {
    this.alpha += this.alphaChange;
    if (this.alpha <= 0 || this.alpha >= 1) {
      this.alphaChange = -this.alphaChange;
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height / 2;
    this.len = 100 + Math.random() * 100;
    this.speed = 10 + Math.random() * 10;
    this.size = 1 + Math.random() * 2;
    this.waitTime = 0;
    this.active = false;
  }
  update() {
    if (!this.active) {
      this.waitTime++;
      if (this.waitTime > 100) {
        this.active = true;
      }
    } else {
      this.x += this.speed;
      this.y += this.speed * 0.5;
      if (this.x > width || this.y > height) {
        this.reset();
      }
    }
  }
  draw() {
    if (!this.active) return;
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = this.size;
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.len, this.y - this.len * 0.5);
    ctx.stroke();
  }
}

function createParticles() {
  particles = [];
  const arms = 4;
  const armSeparation = (Math.PI * 2) / arms;
  for (let i = 0; i < 60; i++) {
    const arm = i % arms;
    const angle = arm * armSeparation + Math.random() * 0.5;
    const radius = 50 + Math.random() * (width / 3);
    const speed = 0.001 + Math.random() * 0.002;
    const message = messages[i % messages.length];
    particles.push(new Particle(angle, radius, speed, message));
  }
}

function createStars() {
  stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push(new Star());
  }
}

function createShootingStars() {
  shootingStars = [];
  for (let i = 0; i < 5; i++) {
    shootingStars.push(new ShootingStar());
  }
}

createParticles();
createStars();
createShootingStars();

let zoom = 1;
let zoomDirection = 1;

function animate() {
  ctx.clearRect(0, 0, width, height);

  // Zoom suave para dar sensación de movimiento
  zoom += 0.0005 * zoomDirection;
  if (zoom > 1.05 || zoom < 0.95) zoomDirection *= -1;

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-width / 2, -height / 2);

  // Fondo con leve brillo morado
  ctx.fillStyle = 'rgba(26, 0, 26, 0.15)';
  ctx.fillRect(0, 0, width, height);

  // Dibujar estrellas parpadeantes
  stars.forEach(star => {
    star.update();
    star.draw();
  });

  // Dibujar partículas con efecto profundidad
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Dibujar estrellas fugaces
  shootingStars.forEach(s => {
    s.update();
    s.draw();
  });

  ctx.restore();

  requestAnimationFrame(animate);
}

animate();
