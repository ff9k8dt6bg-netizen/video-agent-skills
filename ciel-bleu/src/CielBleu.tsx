import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, interpolateColors, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import mots from './mots.json';

// Pourquoi le ciel est bleu : 30 s, 1080x1920, synchronisé sur voix.mp3 (edge-tts, fr-FR-HenriNeural).
// Les temps (en secondes) viennent de src/mots.json (début de chaque mot dans la voix).

type Mot = {text: string; start: number; end: number};
const W = mots as Mot[];

const FONT = 'Bricolage';
const RED = '#E5202E';
const INK = '#14161B';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.out(Easing.cubic);
// 0 -> 1 entre at et at + d, avec une sortie douce
const k = (t: number, at: number, d = 0.45) => interpolate(t, [at, at + d], [0, 1], {...clamp, easing: ease});
// visibilité d'une scène : entre en `from`, sort en `to`
const vis = (t: number, from: number, to: number) => k(t, from, 0.35) * (1 - k(t, to - 0.3, 0.3));

// --------------------------------------------------------------- fond (ciel)
const SKY_T = [0, 4.6, 5.2, 12.8, 16.5, 20.8, 22.5, 26, 30];
const SKY_TOP = ['#2C7BF2', '#2C7BF2', '#0B1430', '#0B1430', '#2A74E6', '#2A74E6', '#3B2A6E', '#2B1640', '#2B1640'];
const SKY_BOT = ['#8EC5FF', '#8EC5FF', '#152452', '#152452', '#8CC2FF', '#8CC2FF', '#FF9A4D', '#FF5A2E', '#FF5A2E'];

const Sky: React.FC<{t: number}> = ({t}) => {
  const top = interpolateColors(t, SKY_T, SKY_TOP);
  const bot = interpolateColors(t, SKY_T, SKY_BOT);
  return <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${bot} 100%)`}} />;
};

// --------------------------------------------------------------- formes
const Cloud: React.FC<{x: number; y: number; s: number; o?: number}> = ({x, y, s, o = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={20} rx={120} ry={46} fill="#fff" />
    <circle cx={-50} cy={0} r={52} fill="#fff" />
    <circle cx={30} cy={-18} r={68} fill="#fff" />
  </g>
);

const Sun: React.FC<{x: number; y: number; r: number; t: number; color?: string}> = ({x, y, r, t, color = '#FFD43B'}) => (
  <g transform={`translate(${x} ${y})`}>
    <g transform={`rotate(${t * 18})`}>
      {Array.from({length: 12}, (_, i) => (
        <rect key={i} x={r + 18} y={-7} width={46} height={14} rx={7} fill={color} transform={`rotate(${i * 30})`} />
      ))}
    </g>
    <circle r={r} fill={color} />
  </g>
);

const Eye: React.FC<{x: number; y: number; open: number; look: number; s?: number}> = ({x, y, open, look, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g transform={`scale(1 ${Math.max(0.04, open)})`}>
      <path d="M-260 0 Q0 -200 260 0 Q0 200 -260 0 Z" fill="#fff" stroke={INK} strokeWidth={14} />
      <circle cx={look * 70} cy={0} r={92} fill="#2C7BF2" />
      <circle cx={look * 70} cy={0} r={42} fill={INK} />
      <circle cx={look * 70 + 26} cy={-28} r={16} fill="#fff" />
    </g>
  </g>
);

const RAINBOW = ['#FF3B3B', '#FF8A1F', '#FFD43B', '#3DDC6A', '#2C7BF2', '#7A4DFF'];

// molécules d'air : positions fixes (pseudo-aléatoires mais déterministes)
const rand = (i: number) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
const MOLS = Array.from({length: 70}, (_, i) => ({x: 60 + rand(i) * 960, y: 260 + rand(i + 100) * 1000, r: 10 + rand(i + 200) * 10, d: rand(i + 300)}));

// --------------------------------------------------------------- texte
const Title: React.FC<{text: React.ReactNode; y: number; o: number; size?: number; color?: string}> = ({text, y, o, size = 96, color = '#fff'}) => (
  <div style={{position: 'absolute', left: 60, right: 60, top: y, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: size,
    lineHeight: 1.05, letterSpacing: -2, color, opacity: o, transform: `translateY(${(1 - o) * 40}px)`, textShadow: '0 4px 18px rgba(0,0,0,.25)'}}>
    {text}
  </div>
);
const Hi: React.FC<{children: React.ReactNode; bg?: string}> = ({children, bg = RED}) => (
  <span style={{background: bg, color: '#fff', padding: '0 18px', borderRadius: 14, display: 'inline-block'}}>{children}</span>
);

// --------------------------------------------------------------- sous-titres
// groupes de 3 mots max, coupés aux pauses (> 0,25 s)
const CHUNKS: Mot[][] = [];
W.forEach((w, i) => {
  const cur = CHUNKS[CHUNKS.length - 1];
  const prev = W[i - 1];
  if (!cur || cur.length >= 3 || (prev && w.start - prev.end > 0.25)) CHUNKS.push([w]);
  else cur.push(w);
});

const Captions: React.FC<{t: number}> = ({t}) => {
  const idx = CHUNKS.findIndex((c, i) => t >= c[0].start - 0.05 && t < (CHUNKS[i + 1] ? CHUNKS[i + 1][0].start - 0.05 : c[c.length - 1].end + 0.6));
  if (idx < 0) return null;
  const c = CHUNKS[idx];
  const o = k(t, c[0].start - 0.05, 0.12);
  return (
    <div style={{position: 'absolute', left: 50, right: 50, top: 1380, display: 'flex', justifyContent: 'center', opacity: o,
      transform: `translateY(${(1 - o) * 14}px)`}}>
      <div style={{background: 'rgba(20,22,27,.82)', borderRadius: 28, padding: '18px 30px', display: 'flex', gap: 18, flexWrap: 'wrap',
        justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 84, lineHeight: 1.1, letterSpacing: -1.5}}>
        {c.map((w, i) => {
          const on = t >= w.start - 0.03 && t < (c[i + 1] ? c[i + 1].start - 0.03 : 99);
          return (
            <span key={i} style={{color: '#fff', background: on ? RED : 'transparent', borderRadius: 14, padding: '0 12px', margin: '0 -12px'}}>{w.text}</span>
          );
        })}
      </div>
    </div>
  );
};

// --------------------------------------------------------------- vidéo
export const CielBleu: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  // A. 0 -> 2.3 : « Le ciel n'est pas vraiment bleu. »
  const vA = vis(t, -1, 2.3);
  const strike = k(t, 1.2, 0.3);
  // B. 2.3 -> 4.8 : « Et pourtant, tu le vois bleu. »
  const vB = vis(t, 2.3, 4.8);
  const openB = k(t, 2.45, 0.35) * (t > 3.9 && t < 4.05 ? 0.1 : 1);
  // C. 4.8 -> 8.7 : la lumière du Soleil est blanche, toutes les couleurs
  const vC = vis(t, 4.8, 8.7);
  const beam = k(t, 5.85, 0.5);
  const split = k(t, 6.97, 0.6);
  // D. 8.7 -> 13.2 : traverse l'air, milliards de molécules
  const vD = vis(t, 8.7, 13.2);
  const travel = interpolate(t, [8.9, 11.6], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  // E. 13.2 -> 17.2 : les molécules dévient surtout le bleu, onde plus courte
  const vE1 = vis(t, 13.2, 15.35);
  const vE2 = vis(t, 15.3, 17.2);
  const rays = k(t, 13.4, 0.5);
  const scatter = k(t, 13.96, 0.6);
  // F. 17.2 -> 21.3 : le bleu rebondit partout et arrive dans tes yeux
  const vF = vis(t, 17.2, 21.3);
  // G. 21.3 -> 26.3 : le soir, beaucoup plus d'air, le bleu se perd
  const vG = vis(t, 21.3, 26.3);
  const sunDown = interpolate(t, [21.4, 23.4], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lost = k(t, 24.7, 0.9);
  // H. 26.3 -> 30 : il ne reste que l'orange et le rouge
  const vH = vis(t, 26.3, 31);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <style>{`@font-face { font-family: 'Bricolage'; src: url('${staticFile('BricolageGrotesque.ttf')}'); font-weight: 200 800; }`}</style>
      <Audio src={staticFile('voix.mp3')} />
      <Sky t={t} />

      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        {/* A + B : nuages qui dérivent */}
        <g opacity={Math.max(vA, vB)}>
          <Cloud x={200 + t * 30} y={200} s={1.0} />
          <Cloud x={820 - t * 22} y={1150} s={0.9} />
          <Cloud x={760 + t * 18} y={1000} s={0.7} o={0.85} />
        </g>
        {/* B : l'œil s'ouvre et regarde autour */}
        <g opacity={vB}>
          <Eye x={540} y={760} open={openB} look={Math.sin((t - 2.4) * 3) * 0.8} />
        </g>

        {/* C : soleil, rayon blanc, puis éventail de couleurs */}
        <g opacity={vC}>
          <Sun x={230} y={420} r={110} t={t} />
          <line x1={300} y1={500} x2={300 + 560 * beam} y2={500 + 520 * beam} stroke="#fff" strokeWidth={46} strokeLinecap="round" opacity={1 - split} />
          {RAINBOW.map((c, i) => {
            const a = ((i - 2.5) * 7 * split * Math.PI) / 180;
            const L = 760 * split;
            const dx = Math.cos(Math.PI / 4.4 + a) * L, dy = Math.sin(Math.PI / 4.4 + a) * L;
            return <line key={c} x1={300} y1={500} x2={300 + dx} y2={500 + dy} stroke={c} strokeWidth={26} strokeLinecap="round" opacity={split} />;
          })}
        </g>

        {/* D : le faisceau traverse l'air, les molécules apparaissent */}
        <g opacity={vD}>
          {MOLS.map((m, i) => {
            const o = k(t, 10.5 + m.d * 1.3, 0.3);
            return <circle key={i} cx={m.x + Math.sin(t * 2 + i) * 8} cy={m.y + Math.cos(t * 1.7 + i) * 8} r={m.r * o} fill="#BFD8FF" opacity={0.85} />;
          })}
          {RAINBOW.map((c, i) => (
            <rect key={c} x={-40} y={700 + i * 26} width={1160 * travel} height={22} rx={11} fill={c} />
          ))}
        </g>

        {/* E1 : une molécule, le bleu est dévié dans tous les sens */}
        <g opacity={vE1}>
          {RAINBOW.map((c, i) => {
            const y = 640 + i * 34;
            const isBlue = c === '#2C7BF2';
            const x2 = isBlue ? 40 + 500 * rays : 40 + 1100 * rays;
            return <line key={c} x1={40} y1={y} x2={x2} y2={y} stroke={c} strokeWidth={20} strokeLinecap="round" />;
          })}
          <circle cx={540} cy={725} r={86} fill="#BFD8FF" stroke="#fff" strokeWidth={8} />
          {Array.from({length: 10}, (_, i) => {
            const a = (i / 10) * Math.PI * 2 + 0.3;
            const r0 = 100, r1 = 100 + 330 * scatter;
            return <line key={i} x1={540 + Math.cos(a) * r0} y1={725 + Math.sin(a) * r0} x2={540 + Math.cos(a) * r1} y2={725 + Math.sin(a) * r1}
              stroke="#2C7BF2" strokeWidth={18} strokeLinecap="round" opacity={scatter} />;
          })}
        </g>

        {/* E2 : onde bleue courte, onde rouge longue */}
        <g opacity={vE2}>
          {[{c: '#2C7BF2', y: 560, wl: 120}, {c: '#FF3B3B', y: 900, wl: 330}].map(({c, y, wl}) => {
            const pts = Array.from({length: 121}, (_, i) => {
              const x = 80 + i * 7.6;
              return `${x},${y + Math.sin(((x - t * 260) / wl) * Math.PI * 2) * 70}`;
            }).join(' ');
            return <polyline key={c} points={pts} fill="none" stroke={c} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />;
          })}
        </g>

        {/* F : le bleu arrive dans l'œil depuis tous les côtés */}
        <g opacity={vF}>
          {Array.from({length: 16}, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const p = ((t - 17.3) * 0.9 + rand(i + 400)) % 1;
            const r = 640 - p * 420;
            return <circle key={i} cx={540 + Math.cos(a) * r} cy={760 + Math.sin(a) * r * 1.2} r={22} fill="#2C7BF2" stroke="#fff" strokeWidth={6} opacity={p < 0.9 ? 1 : (1 - p) * 10} />;
          })}
          <Eye x={540} y={760} open={k(t, 17.3, 0.35)} look={0} s={0.8} />
        </g>

        {/* G + H : le soleil se couche, long trajet dans l'air, le bleu se perd */}
        <g opacity={Math.max(vG, vH)}>
          <Sun x={interpolate(sunDown, [0, 1], [760, 880])} y={interpolate(sunDown, [0, 1], [380, 1060])} r={100} t={t}
            color={interpolateColors(sunDown, [0, 1], ['#FFD43B', '#FF7A2E'])} />
          <circle cx={540} cy={3300} r={2200} fill="#1A1030" />
          <rect x={0} y={1080} width={1080} height={40} fill="rgba(255,255,255,.12)" opacity={vG} />
        </g>
        <g opacity={vG}>
          {Array.from({length: 9}, (_, i) => {
            const x = 740 - i * 78;
            const fall = lost * (0.4 + rand(i + 500) * 0.6);
            const isBlue = i % 3 === 0;
            const c = isBlue ? '#2C7BF2' : i % 3 === 1 ? '#FF8A1F' : '#FF3B3B';
            const o = k(t, 23.0 + i * 0.08, 0.25) * (isBlue ? 1 - fall : 1);
            return <circle key={i} cx={x} cy={1000 + (isBlue ? fall * 300 : 0)} r={20} fill={c} opacity={o} />;
          })}
        </g>
      </svg>

      {/* textes */}
      <Title y={520} o={vA} size={130} text={<>
        Le ciel n'est pas{' '}
        <span style={{position: 'relative', display: 'inline-block'}}>bleu&nbsp;?
          <span style={{position: 'absolute', left: -10, top: '52%', height: 18, width: `${strike * 110}%`, background: RED, borderRadius: 9, transform: 'rotate(-6deg)'}} />
        </span></>} />
      <Title y={400} o={vB} text={<>Et pourtant…</>} />
      <Title y={1020} o={vC * k(t, 5.0)} size={82} text={<>Lumière <Hi bg="#fff"><span style={{color: INK}}>blanche</span></Hi></>} />
      <Title y={1150} o={vC * split} size={70} text={<>= toutes les couleurs</>} />
      <Title y={300} o={vD * k(t, 10.6)} size={86} text={<>Des <Hi>milliards</Hi><br />de molécules d'air</>} />
      <Title y={300} o={vE1 * k(t, 13.96)} size={86} text={<>Le <Hi bg="#2C7BF2">bleu</Hi> est dévié</>} />
      <Title y={380} o={vE2} size={64} text={<>Bleu : onde <Hi bg="#2C7BF2">courte</Hi></>} />
      <Title y={1030} o={vE2 * k(t, 15.7)} size={64} text={<>Rouge : onde longue</>} />
      <Title y={250} o={vF} size={86} text={<>Il arrive<br />de <Hi bg="#2C7BF2">partout</Hi></>} />
      <Title y={240} o={vG} size={90} text={<>Le soir…</>} />
      <Title y={1150} o={vG * k(t, 23.1)} size={60} text={<>beaucoup plus d'air à traverser</>} />
      <Title y={320} o={vH * k(t, 26.5)} size={104} text={<>Bleu le jour,<br /><Hi>rouge</Hi> le soir</>} />

      <Captions t={t} />
    </AbsoluteFill>
  );
};
