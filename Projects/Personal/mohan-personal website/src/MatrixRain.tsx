import React, { useRef, useEffect } from 'react';

const MATRIX_COLORS = [
  '#00ff00', // green
];

function randomColor() {
  return MATRIX_COLORS[Math.floor(Math.random() * MATRIX_COLORS.length)];
}

const FONT_SIZE = 12;
const CHARACTERS = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン' + // Japanese
  'அஆஇஈஉஊஎஏஐஒஓஔகஙசஜஞடணதநனபமயரலவழளறன' + // Tamil
  '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发' + // Chinese
  'ابتثجحخدذرزسشصضطظعغفقكلمنهوي' + // Arabic
  '☢☣☠☮☯☸☹☺♠♣♥♦♤♧♡♢⚛⚜⚝⚞⚟⚡⚢⚣⚤⚥⚦⚧⚨⚩⚪⚫⚬⚭⚮⚯⚰⚱⚲⚳⚴⚵⚶⚷⚸⚹⚺⚻⚼⚽⚾⚿⛀⛁⛂⛃⛅⛆⛇⛈⛉⛊⛋⛌⛍⛎⛏⛐⛑⛒⛓⛔⛕⛖⛗⛘⛙⛚⛛⛜⛝⛞⛟⛠⛡⛢⛣⛤⛥⛦⛧⛨⛩⛪⛫⛬⛭⛮⛯⛰⛱⛲⛳⛴⛵⛶⛷⛸⛹⛺⛻⛼⛽⛾⛿' + // Alien/Cryptic symbols
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Latin and numbers

const SPEED = 0.35; // 1 is default, <1 is slower, >1 is faster

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let columns = Math.floor(width / FONT_SIZE);
    let drops: number[] = Array(columns).fill(1);
    let colors: string[] = Array(columns).fill('').map(randomColor);

    function draw() {
      ctx.fillStyle = 'rgba(0,0,0,0.15)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${FONT_SIZE}px IBM Plex Mono, monospace`;
      ctx.shadowColor = '#00ffea';
      ctx.shadowBlur = 0;
      for (let i = 0; i < columns; i++) {
        ctx.fillStyle = colors[i];
        const text = CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
        ctx.fillText(text, i * FONT_SIZE, drops[i] * FONT_SIZE);
        if (Math.random() > 0.975) colors[i] = randomColor();
        if (drops[i] * FONT_SIZE > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += SPEED;
      }
      ctx.shadowBlur = 0;
      animationRef.current = requestAnimationFrame(draw);
    }

    draw();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      columns = Math.floor(width / FONT_SIZE);
      drops = Array(columns).fill(1);
      colors = Array(columns).fill('').map(randomColor);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        opacity: 0.55,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default MatrixRain; 