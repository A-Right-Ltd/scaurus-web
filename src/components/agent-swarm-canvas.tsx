import { useEffect, useRef } from "react";

interface AgentSwarmCanvasProps {
  brandLetter: "Q" | "D" | "A" | "S";
}

interface Agent {
  id: number;
  letter: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  messages: string[];
  pulsePhase: number;
  pulseSpeed: number;
  isHex: boolean;
  glowIntensity: number;
  glowTarget: number;
}

interface Pulse {
  fromId: number;
  toId: number;
  progress: number;
  speed: number;
  trail: { x: number; y: number; alpha: number }[];
  hasPacket: boolean;
  packetText: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function AgentSwarmCanvas({ brandLetter }: AgentSwarmCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const letters = ["A", brandLetter, "D", "U", "A", "V", "R", "S", "P", "X"];
    const agentMessages: Record<string, string[]> = {
      A: ["ANALYZE", "PROCESS", "INTAKE", "PARSE"],
      Q: ["QUERY", "SEARCH", "FETCH", "LOOKUP"],
      D: ["DECIDE", "SELECT", "ROUTE", "CHOOSE"],
      U: ["UPDATE", "SYNC", "PROPAGATE", "MERGE"],
      V: ["VALIDATE", "CHECK", "VERIFY", "TEST"],
      R: ["RENDER", "OUTPUT", "DELIVER", "EMIT"],
      S: ["SCAN", "SWEEP", "DETECT", "PROBE"],
      P: ["PREDICT", "FORECAST", "MODEL", "INFER"],
      X: ["EXECUTE", "DEPLOY", "LAUNCH", "RUN"],
    };

    const agents: Agent[] = [];
    const margin = 0.05;
    const cols = 12;
    const rows = 7;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const baseX = margin + (col / (cols - 1)) * (1 - margin * 2);
        const baseY = margin + (row / (rows - 1)) * (1 - margin * 2);
        const letter = letters[(row * cols + col) % letters.length];
        agents.push({
          id: agents.length,
          letter,
          x: (baseX + (Math.random() - 0.5) * 0.03) * w,
          y: (baseY + (Math.random() - 0.5) * 0.03) * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: letter === brandLetter ? 26 : 20,
          messages: agentMessages[letter] || ["DATA"],
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          isHex: letter === brandLetter,
          glowIntensity: 0,
          glowTarget: 0,
        });
      }
    }

    for (let i = 0; i < 20; i++) {
      const letter = letters[Math.floor(Math.random() * letters.length)];
      agents.push({
        id: agents.length,
        letter,
        x: (margin + Math.random() * (1 - margin * 2)) * w,
        y: (margin + Math.random() * (1 - margin * 2)) * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: letter === brandLetter ? 26 : 20,
        messages: agentMessages[letter] || ["DATA"],
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.02,
        isHex: letter === brandLetter,
        glowIntensity: 0,
        glowTarget: 0,
      });
    }

    const connections: [number, number][] = [];
    agents.forEach((a, i) => {
      const dists = agents
        .map((b, j) => ({ j, dist: i === j ? Infinity : Math.hypot(a.x - b.x, a.y - b.y) }))
        .sort((x, y) => x.dist - y.dist);
      for (let k = 0; k < 4 && k < dists.length; k++) {
        const j = dists[k].j;
        if (!connections.some(([x, y]) => (x === i && y === j) || (x === j && y === i))) {
          connections.push([i, j]);
        }
      }
    });

    for (let i = 0; i < agents.length; i++) {
      const j = Math.floor(Math.random() * agents.length);
      if (i !== j && !connections.some(([x, y]) => (x === i && y === j) || (x === j && y === i))) {
        connections.push([i, j]);
      }
    }

    const pulses: Pulse[] = [];
    const particles: Particle[] = [];

    function spawnPulse(fromId: number, toId: number, fast = false) {
      const from = agents[fromId];
      const to = agents[toId];
      if (!from || !to) return;
      pulses.push({
        fromId,
        toId,
        progress: 0,
        speed: fast ? 0.025 + Math.random() * 0.015 : 0.012 + Math.random() * 0.008,
        trail: [],
        hasPacket: Math.random() > 0.5,
        packetText: from.messages[Math.floor(Math.random() * from.messages.length)],
      });
    }

    function spawnParticles(x: number, y: number, count: number) {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 30 + Math.random() * 30,
          size: 1 + Math.random() * 2,
        });
      }
    }

    function triggerRandomPulse() {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      if (conn) spawnPulse(conn[0], conn[1]);
    }

    function triggerBurst() {
      const count = 8 + Math.floor(Math.random() * 12);
      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const conn = connections[Math.floor(Math.random() * connections.length)];
          if (conn) spawnPulse(conn[0], conn[1], true);
        }, i * 30);
      }
    }

    function triggerChain() {
      const startIdx = Math.floor(Math.random() * agents.length);
      let currentIdx = startIdx;
      const chainLen = 4 + Math.floor(Math.random() * 6);
      const visited = new Set<number>();

      for (let i = 0; i < chainLen; i++) {
        const ci = currentIdx;
        visited.add(ci);
        setTimeout(() => {
          const neighbors = connections
            .filter(([a, b]) => a === ci || b === ci)
            .map(([a, b]) => (a === ci ? b : a))
            .filter((n) => !visited.has(n));
          if (neighbors.length > 0) {
            const nextIdx = neighbors[Math.floor(Math.random() * neighbors.length)];
            spawnPulse(ci, nextIdx, true);
            agents[ci].glowTarget = 1;
            currentIdx = nextIdx;
            visited.add(nextIdx);
          }
        }, i * 100);
      }
    }

    function triggerWave() {
      const centerX = Math.random() * w;
      const centerY = Math.random() * h;
      agents.forEach((agent) => {
        const dist = Math.hypot(agent.x - centerX, agent.y - centerY);
        const delay = dist * 0.5;
        setTimeout(() => {
          agent.glowTarget = 1;
          spawnParticles(agent.x, agent.y, 3);
          const neighborConns = connections.filter(([a, b]) => a === agent.id || b === agent.id);
          if (neighborConns.length > 0) {
            const conn = neighborConns[Math.floor(Math.random() * neighborConns.length)];
            spawnPulse(conn[0], conn[1], true);
          }
        }, delay);
      });
    }

    const intervals = [
      setInterval(triggerRandomPulse, 80),
      setInterval(triggerBurst, 400),
      setInterval(triggerChain, 600),
      setInterval(triggerWave, 3000),
      setInterval(() => {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        agent.glowTarget = 1;
        spawnParticles(agent.x, agent.y, 5);
      }, 200),
    ];

    function drawHexagon(cx: number, cy: number, r: number) {
      ctx!.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);
        if (i === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.closePath();
    }

    let lastTime = 0;
    function animate(time: number) {
      const dt = Math.min((time - lastTime) / 16.67, 3);
      lastTime = time;

      ctx!.fillStyle = "#fff";
      ctx!.fillRect(0, 0, w, h);

      const t = time * 0.0001;
      ctx!.strokeStyle = "rgba(0,0,0,0.015)";
      ctx!.lineWidth = 1;
      for (let x = 0; x < w; x += 120) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      for (let y = 0; y < h; y += 120) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }

      for (let i = 0; i < 200; i++) {
        const px = ((i * 137.5 + t * 8) % (w + 100)) - 50;
        const py = ((i * 93.7 + Math.sin(t + i) * 40) % (h + 100)) - 50;
        const sz = 0.6 + Math.sin(t * 2 + i) * 0.3;
        ctx!.beginPath();
        ctx!.arc(px, py, sz, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0,0,0,${0.06 + Math.sin(t + i) * 0.02})`;
        ctx!.fill();
      }

      agents.forEach((agent) => {
        agent.x += agent.vx * dt;
        agent.y += agent.vy * dt;
        if (agent.x < 20 || agent.x > w - 20) agent.vx *= -1;
        if (agent.y < 20 || agent.y > h - 20) agent.vy *= -1;
        agent.x = Math.max(20, Math.min(w - 20, agent.x));
        agent.y = Math.max(20, Math.min(h - 20, agent.y));
        agent.pulsePhase += agent.pulseSpeed * dt;
        agent.glowIntensity += (agent.glowTarget - agent.glowIntensity) * 0.1 * dt;
        agent.glowTarget *= 0.97;
      });

      connections.forEach(([fromIdx, toIdx]) => {
        const from = agents[fromIdx];
        const to = agents[toIdx];
        const dist = Math.hypot(to.x - from.x, to.y - from.y);
        const alpha = Math.max(0.03, 0.12 - dist / 2000);
        ctx!.beginPath();
        ctx!.moveTo(from.x, from.y);
        ctx!.lineTo(to.x, to.y);
        ctx!.strokeStyle = `rgba(0,0,0,${alpha})`;
        ctx!.lineWidth = 0.5;
        ctx!.stroke();

        const dotCount = Math.floor(dist / 50);
        for (let i = 1; i < dotCount; i++) {
          const frac = i / dotCount;
          const dx = from.x + (to.x - from.x) * frac;
          const dy = from.y + (to.y - from.y) * frac;
          ctx!.beginPath();
          ctx!.arc(dx, dy, 1.2, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(0,0,0,${0.08 + Math.sin(t * 3 + i + fromIdx) * 0.04})`;
          ctx!.fill();
        }
      });

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.progress += p.speed * dt;

        const from = agents[p.fromId];
        const to = agents[p.toId];
        const ease = 1 - Math.pow(1 - p.progress, 3);
        const px = from.x + (to.x - from.x) * ease;
        const py = from.y + (to.y - from.y) * ease;

        p.trail.push({ x: px, y: py, alpha: 1 });
        if (p.trail.length > 12) p.trail.shift();

        p.trail.forEach((tp, j) => {
          tp.alpha *= 0.88;
          ctx!.beginPath();
          ctx!.arc(tp.x, tp.y, 2 + (j / p.trail.length) * 2, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(0,0,0,${tp.alpha * 0.4})`;
          ctx!.fill();
        });

        ctx!.beginPath();
        ctx!.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx!.fillStyle = "#000";
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(px, py, 6, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0,0,0,${0.1 + Math.sin(time * 0.01) * 0.05})`;
        ctx!.fill();

        if (p.hasPacket && p.progress > 0.15 && p.progress < 0.85) {
          ctx!.font = "bold 7px 'SF Mono', 'Courier New', monospace";
          ctx!.fillStyle = `rgba(0,0,0,${0.7})`;
          ctx!.fillText(p.packetText, px + 8, py - 6);
        }

        if (p.progress >= 1) {
          to.glowTarget = 1;
          spawnParticles(to.x, to.y, 4);
          pulses.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= dt / p.maxLife;
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0,0,0,${p.life * 0.3})`;
        ctx!.fill();
      }

      agents.forEach((agent) => {
        const breathe = 1 + Math.sin(agent.pulsePhase) * 0.06;
        const glow = agent.glowIntensity;
        const r = agent.size * breathe;

        if (glow > 0.05) {
          ctx!.beginPath();
          if (agent.isHex) {
            drawHexagon(agent.x, agent.y, r + 8);
          } else {
            ctx!.arc(agent.x, agent.y, r + 8, 0, Math.PI * 2);
          }
          ctx!.fillStyle = `rgba(0,0,0,${glow * 0.12})`;
          ctx!.fill();
        }

        if (agent.isHex) {
          drawHexagon(agent.x, agent.y, r + 2);
          ctx!.fillStyle = glow > 0.3 ? "#000" : "#1a1a1a";
          ctx!.fill();
          drawHexagon(agent.x, agent.y, r);
          ctx!.fillStyle = glow > 0.3 ? "#333" : "#fff";
          ctx!.fill();
        } else {
          ctx!.beginPath();
          ctx!.arc(agent.x, agent.y, r, 0, Math.PI * 2);
          ctx!.fillStyle = glow > 0.3 ? "#000" : "#fff";
          ctx!.fill();
          ctx!.strokeStyle = "#000";
          ctx!.lineWidth = 1.5;
          ctx!.stroke();
        }

        ctx!.font = `bold ${agent.isHex ? 14 : 11}px 'SF Mono', 'Courier New', monospace`;
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillStyle = glow > 0.3 ? "#fff" : "#000";
        ctx!.fillText(agent.letter, agent.x, agent.y + 1);

        if (glow > 0.5) {
          const msg = agent.messages[Math.floor(Math.random() * agent.messages.length)];
          ctx!.font = "bold 7px 'SF Mono', 'Courier New', monospace";
          ctx!.fillStyle = `rgba(0,0,0,${glow * 0.6})`;
          const tw = ctx!.measureText(msg).width;
          const bx = agent.x - tw / 2 - 4;
          const by = agent.y - r - 16;
          ctx!.fillStyle = `rgba(0,0,0,${glow * 0.85})`;
          const br = 3;
          const bw = tw + 8;
          const bh = 14;
          ctx!.beginPath();
          ctx!.moveTo(bx + br, by);
          ctx!.lineTo(bx + bw - br, by);
          ctx!.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
          ctx!.lineTo(bx + bw, by + bh - br);
          ctx!.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
          ctx!.lineTo(bx + br, by + bh);
          ctx!.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
          ctx!.lineTo(bx, by + br);
          ctx!.quadraticCurveTo(bx, by, bx + br, by);
          ctx!.fill();
          ctx!.fillStyle = "#fff";
          ctx!.textAlign = "center";
          ctx!.fillText(msg, agent.x, by + 8);
        }
      });

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);

    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      intervals.forEach(clearInterval);
      window.removeEventListener("resize", handleResize);
    };
  }, [brandLetter]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-[0.4]"
      style={{ pointerEvents: "none" }}
    />
  );
}
