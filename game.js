(() => {
const $ = s => document.querySelector(s);
const T = 40, W = 46, H = 30, U = 3;   // 타일 크기, 맵 크기(타일), 캐릭터 픽셀 배율

/* ───────── 캐릭터 ───────── */
const P = {
  skin: ['#ffe0c4', '#f6c9a0', '#e0a878', '#b97f52', '#8a5a3a'],
  hairN: ['짧은 머리', '단발', '긴 머리', '포니테일', '양갈래', '삐죽 머리', '똥머리', '곱슬'],
  hairC: ['#2b2320', '#5a3b26', '#8c5a2e', '#d9a441', '#c24d3a', '#7b6fd6', '#e88fb0', '#9aa3ad'],
  hairCN: ['검정', '갈색', '밝은 갈색', '금발', '빨강', '보라', '분홍', '회색'],
  topN: ['티셔츠', '후드티', '줄무늬', '멜빵'],
  topC: ['#7087EC', '#FFD164', '#ef6f6c', '#5fbf8f', '#3f4a5a', '#f29e4c', '#b784e0', '#f5f5f5'],
  topCN: ['파랑', '노랑', '빨강', '초록', '남색', '주황', '보라', '흰색'],
  accN: ['없음', '안경', '모자', '헤드폰', '리본'],
};
const PARTS = [
  ['skin', '피부색', 5, i => (i + 1) + '번'],
  ['hair', '헤어', 8, i => P.hairN[i]],
  ['hairC', '머리색', 8, i => P.hairCN[i]],
  ['top', '옷', 4, i => P.topN[i]],
  ['topC', '옷 색', 8, i => P.topCN[i]],
  ['acc', '소품', 5, i => P.accN[i]],
];
const PANTS = '#3d4663', SHOE = '#2a2a2a', DK = 'rgba(0,0,0,.2)';

function drawChar(c, px, py, u, L, dir, step, sit) {
  const r = (x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(px + x * u), Math.round(py + y * u), w * u, h * u); };
  const skin = P.skin[L.skin], hc = P.hairC[L.hairC], tc = P.topC[L.topC];
  if (sit) { r(3, 13, 2, 1, PANTS); r(7, 13, 2, 1, PANTS); }
  else {
    const a = step === 1 ? 1 : 0, b = step === 2 ? 1 : 0;
    r(3, 13, 2, 2 - a, PANTS); r(3, 15 - a, 2, 1, SHOE);
    r(7, 13, 2, 2 - b, PANTS); r(7, 15 - b, 2, 1, SHOE);
  }
  r(2, 8, 8, 5, tc); r(1, 8, 1, 4, tc); r(10, 8, 1, 4, tc); r(1, 12, 1, 1, skin); r(10, 12, 1, 1, skin);
  if (L.top === 1) { r(5, 8, 2, 1, DK); if (dir !== 'up') r(4, 11, 4, 1, DK); }
  if (L.top === 2) { r(1, 9, 10, 1, DK); r(1, 11, 10, 1, DK); }
  if (L.top === 3) { r(3, 8, 1, 3, '#4a6fa5'); r(8, 8, 1, 3, '#4a6fa5'); r(2, 10, 8, 3, '#4a6fa5'); }
  r(2, 1, 8, 7, skin);
  if (dir === 'up') r(2, 1, 8, 6, hc);
  else {
    const ex = dir === 'left' ? [3, 6] : dir === 'right' ? [5, 8] : [4, 7];
    if (L.acc === 1) r(2, 4, 8, 1, '#3a3a4a');
    r(ex[0], 4, 1, 2, '#2a2320'); r(ex[1], 4, 1, 2, '#2a2320');
    if (dir === 'down') { r(3, 6, 1, 1, 'rgba(255,120,120,.45)'); r(8, 6, 1, 1, 'rgba(255,120,120,.45)'); }
  }
  r(2, 0, 8, 3, hc); r(2, 3, 1, 1, hc); r(9, 3, 1, 1, hc);
  switch (L.hair) {
    case 1: r(1, 1, 1, 6, hc); r(10, 1, 1, 6, hc); break;
    case 2: r(1, 1, 1, 9, hc); r(10, 1, 1, 9, hc); break;
    case 3: r(10, 2, 2, 2, hc); r(11, 4, 1, 3, hc); break;
    case 4: r(0, 3, 2, 4, hc); r(10, 3, 2, 4, hc); break;
    case 5: r(3, -1, 1, 1, hc); r(5, -1, 2, 1, hc); r(8, -1, 1, 1, hc); break;
    case 6: r(4, -2, 4, 2, hc); break;
    case 7: r(1, 0, 10, 2, hc); r(1, 2, 1, 3, hc); r(10, 2, 1, 3, hc); r(3, -1, 6, 1, hc); break;
  }
  if (L.acc === 2) {
    r(2, 0, 8, 2, '#e2574c');
    if (dir === 'down') r(2, 2, 8, 1, '#c9463c');
    if (dir === 'left') r(0, 2, 5, 1, '#c9463c');
    if (dir === 'right') r(7, 2, 5, 1, '#c9463c');
  }
  if (L.acc === 3) { r(2, -1, 8, 1, '#333'); r(1, 0, 1, 3, '#333'); r(10, 0, 1, 3, '#333'); r(1, 3, 1, 3, '#666'); r(10, 3, 1, 3, '#666'); }
  if (L.acc === 4) { r(6, -1, 2, 2, '#ff5c8a'); r(9, -1, 2, 2, '#ff5c8a'); r(8, 0, 1, 1, '#d93b6a'); }
}

/* ───────── 맵: 그리기 도구 ───────── */
const solids = [], walls = [], seats = [], deco = [], decoTop = [], lights = [];
let seed = 11;
const rnd = () => (seed = seed * 16807 % 2147483647) / 2147483647;
const S = (x, y, w, h) => solids.push({ x: x * T, y: y * T, w: w * T, h: h * T });
const wall = (x, y, w, h, glass) => { walls.push({ x, y, w, h, glass }); S(x, y, w, h); };
const light = (x, y, r, seat) => lights.push({ x: x * T, y: y * T, r, seat });
const R = (g, x, y, w, h, col, rad = 0) => { g.fillStyle = col; g.beginPath(); g.roundRect(x * T, y * T, w * T, h * T, rad); g.fill(); };
const C = (g, x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x * T, y * T, r * T, 0, 7); g.fill(); };
const clipRect = (g, x, y, w, h, fn) => { g.save(); g.beginPath(); g.rect(x * T, y * T, w * T, h * T); g.clip(); fn(); g.restore(); };

function seat(x, y, dir, zone, kind = 'chair', lamp) {
  const s = { id: seats.length, x: x * T, y: y * T, dir, zone, kind, by: null };
  const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir], sg = s.id % 2 ? 1 : -1, far = dir === 'up' ? .3 : 0;
  s.lamp = lamp ? { x: lamp[0] * T, y: lamp[1] * T, big: true }
    : { x: s.x + d[0] * .95 * T + d[1] * .42 * T * sg, y: s.y + d[1] * (.95 + far) * T + d[0] * .42 * T * sg };
  const ly = s.lamp.y - (s.lamp.big ? 34 : 6);
  lights.push({ x: s.lamp.x, y: ly, r: s.lamp.big ? 110 : 78, seat: s }, { x: s.lamp.x, y: ly, r: 185, seat: s, soft: true });
  if (!lamp) {   // 자리마다 노트북: 앉으면 화면이 켜짐
    s.pc = { x: s.x + d[0] * .85 * T - d[1] * .14 * T * sg, y: s.y + d[1] * (.85 + far) * T - d[0] * .14 * T * sg };
    lights.push({ x: s.pc.x, y: s.pc.y, r: 48, seat: s, cool: true });
  }
  seats.push(s);
}
function lampIcon(g, l, on) {
  const x = Math.round(l.x), y = Math.round(l.y), shade = on ? '#fff0b0' : '#e6dccb';
  g.fillStyle = '#3a2f2a';
  if (l.big) {
    g.fillRect(x - 6, y - 2, 12, 3); g.fillRect(x - 1, y - 30, 2, 28);
    g.fillStyle = shade; g.beginPath(); g.moveTo(x - 6, y - 44); g.lineTo(x + 6, y - 44); g.lineTo(x + 11, y - 28); g.lineTo(x - 11, y - 28); g.fill();
  } else {
    g.fillRect(x - 4, y + 3, 8, 2); g.fillRect(x - 1, y - 3, 2, 6);
    g.fillStyle = shade; g.beginPath(); g.moveTo(x - 4, y - 12); g.lineTo(x + 4, y - 12); g.lineTo(x + 7, y - 3); g.lineTo(x - 7, y - 3); g.fill();
  }
}
function pcIcon(g, p, on) {
  const x = Math.round(p.x), y = Math.round(p.y);
  g.fillStyle = '#2b303a'; g.beginPath(); g.roundRect(x - 10, y - 7, 20, 14, 3); g.fill();
  g.fillStyle = on ? '#8ff3ff' : '#566070'; g.fillRect(x - 8, y - 5, 16, 8);
  g.fillStyle = on ? '#d9fbff' : '#6b7686'; g.fillRect(x - 6, y - 3, 8, 2);
  g.fillStyle = '#454c59'; g.fillRect(x - 8, y + 4, 16, 2);
}
// 항상 켜져 있는 스탠드
const standLamp = (x, y) => { S(x - .2, y - .2, .4, .3); deco.push(g => lampIcon(g, { x: x * T, y: y * T, big: true }, true)); light(x, y - .85, 130); };

function woodFloor(g, x, y, w, h) {
  const cols = ['#d89a50', '#cf8f46', '#e0a65c'];
  clipRect(g, x, y, w, h, () => {
    for (let j = 0; j < h * 2; j++) {
      const yy = y * T + j * 20;
      for (let i = -1; i < w / 3 + 1; i++) {
        const xx = x * T + i * 120 + (j % 2 ? 60 : 0);
        g.fillStyle = cols[(i * 7 + j * 3 + 99) % 3]; g.fillRect(xx, yy, 120, 20);
        g.fillStyle = 'rgba(90,50,20,.22)'; g.fillRect(xx, yy, 1, 20);
      }
      g.fillStyle = 'rgba(90,50,20,.16)'; g.fillRect(x * T, yy + 19, w * T, 1);
    }
  });
}
function stoneFloor(g, x, y, w, h) {
  clipRect(g, x, y, w, h, () => {
    g.fillStyle = '#c3c6ca'; g.fillRect(x * T, y * T, w * T, h * T);
    for (let j = 0; j < h * 2; j++) for (let i = -1; i < w + 1; i++) {
      const xx = x * T + i * 40 + (j % 2 ? 20 : 0), yy = y * T + j * 20;
      g.fillStyle = rnd() < .3 ? '#b8bcc1' : '#c9ccd0'; g.fillRect(xx + 1, yy + 1, 38, 18);
    }
  });
}
function brick(g, x, y, w, h) {
  clipRect(g, x, y, w, h, () => {
    g.fillStyle = '#8f4b2e'; g.fillRect(x * T, y * T, w * T, h * T);
    for (let j = 0; j < h * 4; j++) for (let i = -1; i < w * 2 + 1; i++) {
      g.fillStyle = ['#b8663f', '#b05d39', '#c06f47'][Math.floor(rnd() * 3)];
      g.fillRect(x * T + i * 20 + (j % 2 ? 10 : 0) + 1, y * T + j * 10 + 1, 18, 8);
    }
  });
}
function rug(g, x, y, w, h, c1, c2) {
  R(g, x, y, w, h, c1, 8); R(g, x + .2, y + .2, w - .4, h - .4, c2, 5);
  g.fillStyle = c1; g.globalAlpha = .55;
  for (let yy = y + .7; yy < y + h - .4; yy += .8) for (let xx = x + .7; xx < x + w - .4; xx += .8) {
    g.save(); g.translate(xx * T, yy * T); g.rotate(Math.PI / 4); g.fillRect(-4, -4, 8, 8); g.restore();
  }
  g.globalAlpha = 1;
}
function plant(x, y) {
  S(x - .25, y - .1, .5, .45);
  deco.push(g => {
    R(g, x - .22, y - .02, .44, .4, '#b5764c', 4);
    for (const [dx, dy, r, col] of [[0, -.35, .3, '#3f9a62'], [-.25, -.2, .22, '#2f7d4f'], [.25, -.22, .22, '#58b377'], [0, -.6, .2, '#58b377']]) C(g, x + dx, y + dy, r, col);
  });
}
function tree(x, y) {   // 나뭇잎은 캐릭터보다 위에 그려져서 뒤로 지나갈 수 있음
  S(x - .35, y - .15, .7, .55);
  deco.push(g => { R(g, x - .38, y, .76, .42, '#8a8f98', 5); R(g, x - .1, y - .5, .2, .6, '#6b4a2e'); });
  decoTop.push(g => {
    C(g, x, y - 1, .9, '#2f7d4f'); C(g, x - .3, y - 1.2, .55, '#3f9a62'); C(g, x + .35, y - .8, .45, '#276b43'); C(g, x + .1, y - 1.4, .35, '#58b377');
  });
}
function roundTable(x, y, zone, top = '#d9b38c') {
  S(x, y, 2, 2); seat(x - .65, y + 1, 'right', zone); seat(x + 2.65, y + 1, 'left', zone);
  deco.push(g => {
    C(g, x + 1, y + 1.08, .95, 'rgba(0,0,0,.18)'); C(g, x + 1, y + 1, .95, top); C(g, x + 1, y + 1, .8, 'rgba(255,255,255,.12)');
    C(g, x + 1, y + .45, .14, '#fff'); C(g, x + 1, y + .45, .09, '#7a4a2a');
    R(g, x + .8, y + 1.3, .4, .28, '#ef6f6c', 2); R(g, x + .84, y + 1.24, .4, .28, '#7087EC', 2);
  });
}
function chair(g, s) {
  const col = ['#ffab2e', '#1fae93', '#f25c49', '#4f7df0'][s.id % 4];
  if (s.kind === 'stool') { C(g, s.x / T, s.y / T, .32, '#5a4636'); C(g, s.x / T, s.y / T, .25, col); return; }
  if (s.kind !== 'chair') return;
  g.fillStyle = col; g.beginPath(); g.roundRect(s.x - 13, s.y - 13, 26, 26, 7); g.fill();
  g.fillStyle = 'rgba(0,0,0,.28)';
  const b = { up: [-13, 7, 26, 7], down: [-13, -14, 26, 7], right: [-14, -13, 7, 26], left: [7, -13, 7, 26] }[s.dir];
  g.beginPath(); g.roundRect(s.x + b[0], s.y + b[1], b[2], b[3], 3); g.fill();
}

/* ───────── 맵: 배치 ───────── */
// 벽 (벽돌) + 스터디룸 유리벽
wall(0, 0, W, 2); wall(0, H - 1, W, 1); wall(0, 2, 1, H - 3); wall(W - 1, 2, 1, H - 3);
wall(32, 2, 1, 8); wall(32, 14, 1, 15);
wall(19, 20, 1, 9, 1); wall(20, 20, 1, 1, 1); wall(23, 20, 5, 1, 1); wall(30, 20, 2, 1, 1); wall(25, 21, 1, 8, 1);

// 러그
deco.push(g => {
  rug(g, 2.3, 8.8, 5.2, 7, '#5b3fa0', '#7a5ac8');
  rug(g, 8.5, 11.8, 9, 4.4, '#1f5fa8', '#2f7fd0');
  rug(g, 18.7, 7.2, 11, 8.6, '#177a78', '#22a09c');
  rug(g, 9, 21.5, 2, 7.4, '#2f8a55', '#45ad70');
});

// 바리스타 카운터
S(1, 2, 12, 1); S(1, 4, 12, 1.5); S(13, 2, 1, 3.5);
deco.push(g => {
  R(g, 1, 2, 12, 1, '#6d432a', 4); R(g, 1, 2, 12, .75, '#8f5d3c', 4);
  R(g, 1.5, 2.05, 1.4, .7, '#3b3f47', 4); R(g, 1.65, 2.2, .4, .3, '#8fe0c0', 2); C(g, 2.55, 2.4, .12, '#e2574c');
  for (let i = 0; i < 3; i++) C(g, 3.6 + i * .5, 2.4, .18, '#f4f1ea');
  for (let i = 0; i < 4; i++) R(g, 5.6 + i * .5, 2.1, .3, .55, ['#e9b96e', '#c76b6b', '#8fc27a', '#f4d7a1'][i], 3);
  R(g, 8.4, 2.05, 1.2, .7, '#c9ced4', 3); R(g, 10.4, 2, 1.5, 1, '#dfe8ee', 4); R(g, 10.5, 2.1, .6, .8, '#c5d3dc', 2);
  R(g, 1, 4, 12, 1.5, '#7a4a2e', 5); R(g, 1, 4, 12, .6, '#a87048', 5);
  R(g, 1.3, 4.68, 11.4, .72, 'rgba(205,236,246,.9)', 4);
  for (let i = 0; i < 11; i++) { C(g, 1.8 + i * 1.04, 5.04, .19, '#fff'); C(g, 1.8 + i * 1.04, 5.04, .14, ['#e9b96e', '#d98a5b', '#f4d7a1', '#c76b6b', '#8fc27a'][i % 5]); }
  R(g, 13, 2, 1, 3.5, '#7a4a2e', 5); R(g, 13, 2, 1, .5, '#a87048', 5); R(g, 13.15, 3.3, .7, .6, '#2f3545', 3); R(g, 13.22, 3.36, .56, .3, '#8fe0c0', 2);
  // 바리스타
  drawChar(g, 6.5 * T - 18, 3.95 * T - 48, 3, { skin: 1, hair: 3, hairC: 1, top: 0, topC: 7, acc: 0 }, 'down', 0, false);
  R(g, 6.5 - .22, 3.95 - .52, .44, .3, '#4f7a5c');
  // 벽 장식: 메뉴판, 간판
  for (const x of [2.2, 5]) {
    R(g, x, .35, 2.3, 1.3, '#5a3d2a', 3); R(g, x + .1, .45, 2.1, 1.1, '#2f4a3c', 2);
    g.fillStyle = '#e8efe6'; g.font = '700 11px Pretendard,sans-serif'; g.fillText('MENU', (x + .25) * T, .78 * T);
    for (let i = 0; i < 3; i++) R(g, x + .25, .92 + i * .18, 1.1 + (i % 2) * .5, .05, 'rgba(232,239,230,.7)');
  }
  R(g, 8.4, .4, 4.6, 1.2, '#2e2420', 8);
  g.fillStyle = '#ffe9a8'; g.font = '800 20px Pretendard,sans-serif'; g.textAlign = 'center'; g.fillText('STUDY CAFE', 10.7 * T, 1.2 * T); g.textAlign = 'left';
});
for (const x of [3.5, 7, 10.5]) { decoTop.push(g => { C(g, x, 4.45, .2, '#2e2420'); C(g, x, 4.45, .14, '#fff0b0'); }); light(x, 4.5, 105); }

// 창가 바
S(17, 2, 12, 1);
deco.push(g => {
  for (let x = 17; x < 29; x += 3) {
    R(g, x + .1, .25, 2.8, 1.45, '#5a3d2a', 4); R(g, x + .2, .35, 2.6, 1.25, '#1b2550', 3);
    for (let i = 0; i < 9; i++) C(g, x + .35 + rnd() * 2.3, .45 + rnd() * 1, .03, '#fff');
    C(g, x + 2.2, .75, .2, '#fff3c4'); C(g, x + 2.3, .7, .17, '#1b2550');
    R(g, x + 1.45, .35, .1, 1.25, '#5a3d2a'); R(g, x + .2, .93, 2.6, .08, '#5a3d2a');
  }
  const bk = ['#ef6f6c', '#7087EC', '#FFD164', '#5fbf8f', '#b784e0', '#f29e4c'];
  for (const x of [14.2, 29.3]) {
    R(g, x, .3, 2.5, 1.4, '#5a3d2a', 3);
    for (let r = 0; r < 2; r++) { R(g, x + .1, .4 + r * .65, 2.3, .55, '#3a2a22'); for (let i = 0; i < 11; i++) R(g, x + .15 + i * .2, .45 + r * .65 + rnd() * .1, .15, .5, bk[Math.floor(rnd() * 6)]); }
  }
  C(g, 13.6, 1, .32, '#5a3d2a'); C(g, 13.6, 1, .25, '#fff8e8'); R(g, 13.58, .82, .04, .2, '#333'); R(g, 13.6, .98, .14, .04, '#333');
  R(g, 17, 2.08, 12, 1, 'rgba(0,0,0,.18)', 4); R(g, 17, 2, 12, 1, '#9a6642', 4); R(g, 17, 2, 12, .15, '#b98458', 4);
});
for (let x = 18; x <= 28; x += 2) seat(x, 3.65, 'up', '창가 바', 'stool');
for (const x of [20, 23, 26]) { decoTop.push(g => { R(g, x - .08, 1.55, .16, .2, '#3a2a22'); C(g, x, 1.85, .13, '#fff0b0'); }); light(x, 1.85, 70); }

// 메인 홀 원형 테이블
for (const [x, y] of [[20, 8], [26, 8], [20, 13], [26, 13]]) roundTable(x, y, '메인 홀');

// 공유 테이블 (큰 원목)
S(9, 13, 8, 2);
deco.push(g => {
  R(g, 9, 13.1, 8, 2, 'rgba(0,0,0,.2)', 8); R(g, 9, 13, 8, 2, '#8a5a36', 8); R(g, 9.12, 13.1, 7.76, 1.7, '#a06c42', 6);
  for (let i = 1; i < 4; i++) R(g, 9.1, 13 + i * .5, 7.8, .03, 'rgba(60,30,10,.25)');
  R(g, 12.5, 13.6, .9, .7, '#e9e4da', 3); C(g, 13.9, 14, .22, '#4fa36a'); C(g, 13.9, 13.92, .14, '#6cc088');
});
for (const x of [10, 12, 14, 16]) { seat(x, 12.35, 'down', '공유 테이블'); seat(x, 15.65, 'up', '공유 테이블'); }

// 피아노
S(9, 8, 3, 1);
deco.push(g => {
  R(g, 9, 8.08, 3, 1, 'rgba(0,0,0,.2)', 4); R(g, 9, 8, 3, 1, '#1d1d22', 4); R(g, 9.12, 8.6, 2.76, .32, '#f4f4f4', 2);
  for (let i = 0; i < 13; i++) if (i % 7 !== 2 && i % 7 !== 6) R(g, 9.27 + i * .2, 8.6, .1, .2, '#1d1d22');
  C(g, 10.5, 9.55, .3, '#3a2a22'); C(g, 10.5, 9.52, .24, '#7a4a2e');
  g.fillStyle = '#9fc1ff'; g.font = '16px sans-serif'; g.fillText('♪ ♫', 9.4 * T, 8.42 * T);
});

// 북카페 라운지: 책장, 소파, 안락의자, 스탠드
S(1, 8, 1, 9); S(3, 9, 3, .4); S(4, 11.3, 2, 1.2); S(2.2, 9.25, .5, .5); S(6.3, 9.25, .5, .5); S(2.2, 14, .4, .4); S(6.4, 14, .4, .4);
deco.push(g => {
  R(g, 1, 8, 1, 9, '#5f4330', 3);
  const bc = ['#ef6f6c', '#7087EC', '#FFD164', '#5fbf8f', '#b784e0', '#f29e4c', '#e8e2d6'];
  for (let i = 0; i < 20; i++) R(g, 1.12, 8.12 + i * .44, .5 + rnd() * .3, .32, bc[Math.floor(rnd() * 7)], 2);
  R(g, 2.8, 9, 3.4, 1.5, '#5d74c9', 12); R(g, 3, 9, 3, .45, '#4a5fae', 8); R(g, 3.05, 9.5, 1.42, .9, '#7d93e0', 8); R(g, 4.53, 9.5, 1.42, .9, '#7d93e0', 8);
  for (const x of [2.45, 6.55]) C(g, x, 9.5, .26, '#8a5a36');
  R(g, 4, 11.38, 2, 1.2, 'rgba(0,0,0,.18)', 6); R(g, 4, 11.3, 2, 1.2, '#b98458', 6); R(g, 4.3, 11.55, .6, .45, '#f4f1ea', 2); C(g, 5.4, 11.9, .15, '#fff'); C(g, 5.4, 11.9, .09, '#7a4a2a');
  for (const x of [3.5, 5.5]) { R(g, x - .5, 13.65, 1, 1.05, '#d98a5b', 10); R(g, x - .5, 14.4, 1, .35, '#b96c42', 6); R(g, x - .36, 13.75, .72, .62, '#ecab7f', 8); }
});
seat(3.76, 9.95, 'down', '북카페 라운지', 'none', [2.45, 9.55]); seat(5.24, 9.95, 'down', '북카페 라운지', 'none', [6.55, 9.55]);
seat(3.5, 14.1, 'up', '북카페 라운지', 'none', [2.4, 14.25]); seat(5.5, 14.1, 'up', '북카페 라운지', 'none', [6.6, 14.25]);

// 로비: 화단 칸막이, 키오스크, 벤치, 입간판
const KIOSK = { x: 12.5 * T, y: 25.5 * T };
S(1, 19, 6, 1); S(13, 19, 5, 1); S(12, 25, 1, 1); S(2, 23, 4, 1); S(6.6, 25.6, .9, .7);
deco.push(g => {
  for (const [x, w] of [[1, 6], [13, 5]]) {
    R(g, x, 19.25, w, .75, '#7a5a40', 5);
    for (let i = 0; i < w * 2.2; i++) C(g, x + .3 + i * .45, 19.2 + rnd() * .15, .3, ['#2f7d4f', '#3f9a62', '#58b377'][i % 3]);
    for (let i = 0; i < w * 1.5; i++) C(g, x + .3 + rnd() * (w - .6), 19.05 + rnd() * .35, .07, ['#ff8fb0', '#FFD164', '#fff'][i % 3]);
  }
  R(g, 12.1, 24.5, .8, 1.5, '#2f3545', 6); R(g, 12.2, 24.65, .6, .65, '#7ee0c3', 3); R(g, 12.3, 25.45, .4, .1, '#FFD164', 2);
  g.fillStyle = '#fff'; g.font = '700 12px Pretendard,sans-serif'; g.textAlign = 'center';
  g.fillText('퇴장 키오스크', 12.5 * T, 24.3 * T);
  R(g, 2, 23, 4, 1, '#6aa58b', 10); R(g, 2, 23, 4, .35, '#4f8a70', 8);
  R(g, 6.6, 25.4, .9, 1.1, '#5a3d2a', 3); R(g, 6.68, 25.48, .74, .8, '#2f4a3c', 2);
  g.fillStyle = '#e8efe6'; g.font = '700 10px Pretendard,sans-serif'; g.fillText('WELCOME', 7.05 * T, 25.85 * T); g.fillText('☕', 7.05 * T, 26.15 * T);
  R(g, 9, 29, 2, 1, '#c9a27a'); g.fillStyle = '#5a3d2a'; g.font = '700 12px Pretendard,sans-serif'; g.fillText('입구', 10 * T, 29.65 * T); g.textAlign = 'left';
});
plant(17.4, 21.4); plant(1.6, 21.6);

// 화상회의룸 (유리방): 앉으면 같은 방 사람끼리 카메라·마이크 연결
for (const [x, z] of [[21, '화상회의룸 A'], [27.5, '화상회의룸 B']]) {
  S(x, 23, 3, 2);
  seat(x + .7, 22.35, 'down', z); seat(x + 2.3, 22.35, 'down', z); seat(x + .7, 25.65, 'up', z); seat(x + 2.3, 25.65, 'up', z);
  deco.push(g => {
    R(g, x, 23.08, 3, 2, 'rgba(0,0,0,.18)', 8); R(g, x, 23, 3, 2, '#e9e4da', 8); R(g, x + .15, 23.15, 2.7, 1.7, '#f6f2ea', 6);
    R(g, x + .3, 28.2, 2.4, .6, '#fff', 3); R(g, x + .45, 28.35, 1.2, .06, '#7087EC'); R(g, x + .45, 28.5, 1.7, .06, '#ef6f6c');
    g.fillStyle = 'rgba(255,255,255,.85)'; g.font = '700 13px Pretendard,sans-serif'; g.fillText(z, (x - .7) * T, 21.6 * T);
  });
}

// 테라스 정원
for (const [x, y, col] of [[37, 5, '#e4705a'], [40, 12, '#f2a541'], [37, 19, '#6f8fd8']]) {
  roundTable(x, y, '테라스', '#f1efe9');
  deco.push(g => {   // 파라솔
    g.globalAlpha = .82;
    for (let i = 0; i < 8; i++) {
      g.fillStyle = i % 2 ? '#fff' : col; g.beginPath(); g.moveTo((x + 1) * T, (y + 1) * T);
      g.arc((x + 1) * T, (y + 1) * T, 1.2 * T, i * Math.PI / 4, (i + 1) * Math.PI / 4); g.fill();
    }
    g.globalAlpha = 1; C(g, x + 1, y + 1, .08, '#5a4636');
  });
}
S(44, 6, 1, 9); S(35, 28, 8, 1); S(34, 23, 2, 2);
deco.push(g => {
  for (const [x, y, w, h] of [[44, 6, 1, 9], [35, 28, 8, 1]]) {
    R(g, x, y, w, h, '#6b4a2e', 5);
    for (let i = 0; i < w * h * 5; i++) C(g, x + .2 + rnd() * (w - .4), y + .2 + rnd() * (h - .4), .2, ['#2f7d4f', '#3f9a62'][i % 2]);
    for (let i = 0; i < w * h * 4; i++) C(g, x + .2 + rnd() * (w - .4), y + .2 + rnd() * (h - .4), .09, ['#ff8fb0', '#FFD164', '#fff', '#b784e0', '#ef6f6c'][i % 5]);
  }
  C(g, 35, 24, 1, '#8d939b'); C(g, 35, 24, .84, '#7cc4e8'); C(g, 35, 24, .6, '#9ad6f2'); C(g, 35, 24, .34, '#8d939b'); C(g, 35, 24, .2, '#d5f0fb');
  // 벽 위 덩굴
  for (let i = 0; i < 60; i++) C(g, 33.2 + rnd() * 11.6, 1.5 + rnd() * .6, .16 + rnd() * .12, ['#2f7d4f', '#3f9a62', '#58b377'][i % 3]);
});
for (let i = 0; i <= 14; i++) {   // 꼬마전구
  const x = 33.4 + i * .8, y = 2.5 + Math.sin(i / 14 * Math.PI) * .45;
  decoTop.push(g => C(g, x, y, .07, '#fff0b0')); light(x, y, 34);
}
standLamp(33.6, 9.2); standLamp(43.4, 22.5); standLamp(33.6, 17); standLamp(43.4, 3.6);
tree(34.2, 4.6); tree(43.5, 17.5); tree(34.2, 27.6); tree(43.5, 27.2);

// 실내 화분, 나무
tree(23.5, 11.8); tree(30.8, 18.6); tree(15.2, 6.5);
for (const [x, y] of [[1.5, 6.6], [18.2, 6.4], [30.6, 6.4], [7.6, 17.6], [18.2, 18.4], [1.5, 28.4], [17.5, 28.4], [30.6, 11.5], [14.5, 10.4], [31, 2.8], [16.3, 2.8]]) plant(x, y);

let bg, fg;
const Q = 2;   // 배경 해상도 배율
function buildBg() {
  bg = document.createElement('canvas'); bg.width = W * T * Q; bg.height = H * T * Q;
  const g = bg.getContext('2d'); g.scale(Q, Q);
  woodFloor(g, 1, 2, 31, 27); stoneFloor(g, 33, 2, 12, 27); R(g, 32, 10, 1, 4, '#a87048');
  for (const [x, w] of [[20, 5], [26, 6]]) { R(g, x, 21, w, 8, '#3f9a66'); for (let i = 0; i < 120; i++) C(g, x + rnd() * w, 21 + rnd() * 8, .04, 'rgba(255,255,255,.25)'); }
  walls.forEach(w => { g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(w.x * T, (w.y + w.h) * T, w.w * T, 7); });
  walls.forEach(w => {
    if (w.glass) { R(g, w.x, w.y, w.w, w.h, '#48545f'); R(g, w.x + .12, w.y + .12, w.w - .24, w.h - .24, '#a9d6e6'); R(g, w.x + .2, w.y + .2, w.w - .4, .12, 'rgba(255,255,255,.6)'); }
    else { brick(g, w.x, w.y, w.w, w.h); g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(w.x * T, (w.y + w.h) * T - 5, w.w * T, 5); }
  });
  deco.forEach(d => d(g));
  seats.forEach(s => chair(g, s));
  seats.forEach(s => { lampIcon(g, s.lamp, false); s.pc && pcIcon(g, s.pc, false); });
  fg = document.createElement('canvas'); fg.width = bg.width; fg.height = bg.height;
  const f = fg.getContext('2d'); f.scale(Q, Q); decoTop.forEach(d => d(f));
}
// 불빛 번짐
const mkGlow = (a, b, c0) => {
  const cvs = document.createElement('canvas'); cvs.width = cvs.height = 128;
  const g = cvs.getContext('2d'), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, a); gr.addColorStop(.35, b); gr.addColorStop(1, c0);
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return cvs;
};
const glow = mkGlow('rgba(255,225,150,.9)', 'rgba(255,190,95,.38)', 'rgba(255,180,90,0)');
const glowC = mkGlow('rgba(150,240,255,.85)', 'rgba(90,210,255,.3)', 'rgba(80,200,255,0)');

/* ───────── 저장 (지금은 이 브라우저에만 저장, 서버 연결 단계에서 옮김) ───────── */
const store = {
  key: (n, p) => `studycafe:${n}:${p}`,
  get(n, p) { try { return JSON.parse(localStorage.getItem(this.key(n, p))); } catch { return null; } },
  set(n, p, v) { try { localStorage.setItem(this.key(n, p), JSON.stringify(v)); } catch { } },
};
const p2 = n => String(n).padStart(2, '0');
const fmt = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 3600)}:${p2(Math.floor(s % 3600 / 60))}:${p2(s % 60)}`; };

/* ───────── 서버 (Supabase) ───────── */
const CFG = window.CAFE_CONFIG || {};
const sb = (window.supabase && CFG.url && CFG.key) ? window.supabase.createClient(CFG.url, CFG.key) : null;
let online = !!sb, channel = null, ready = false;
const myId = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
const others = new Map();   // 다른 참가자
// 결과: 값(성공) / null(기록 없음) / undefined(서버 오류)
async function rpc(fn, args) {
  if (!sb) return undefined;
  try {
    const { data, error } = await sb.rpc(fn, args);
    if (error) { console.warn(fn, error); rpc.lastError = error; return undefined; }
    return data;
  } catch (e) { console.warn(fn, e); rpc.lastError = e; return undefined; }
}
const myState = () => ({ id: myId, nick: me.nick, look: me.look, seat: me.sit ? me.sit.id : null, acc: me.acc, since: me.sit ? me.since : null });
const syncMe = () => { channel && channel.track(myState()); };
const cast = (event, payload) => { channel && channel.send({ type: 'broadcast', event, payload }); };
const sendPos = () => cast('pos', { id: myId, x: Math.round(me.x), y: Math.round(me.y), dir: me.dir });
const spanOf = o => o.acc + (o.since ? Math.max(0, Date.now() - o.since) : 0);

function onSync() {
  const st = channel.presenceState(), seen = new Set();
  for (const key in st) {
    if (key === myId || !st[key].length) continue;
    const p = st[key][st[key].length - 1]; seen.add(key);
    let o = others.get(key);
    if (!o) {
      o = { id: key, x: 10 * T, y: 28.2 * T, tx: 10 * T, ty: 28.2 * T, dir: 'up', step: 0, anim: 0, emote: null, seat: null };
      others.set(key, o); if (ready) addMsg({ sys: `${p.nick}님이 입장했습니다.` });
    } else if (ready && o.seat !== p.seat) {
      addMsg({ sys: p.seat != null && seats[p.seat] ? `${p.nick}님이 ${seats[p.seat].zone}에서 공부를 시작했습니다.` : `${p.nick}님이 자리에서 일어났습니다.` });
    }
    Object.assign(o, { nick: String(p.nick).slice(0, 10), look: p.look || {}, seat: p.seat, acc: +p.acc || 0, since: p.since });
  }
  for (const [k, o] of others) if (!seen.has(k)) { others.delete(k); addMsg({ sys: `${o.nick}님이 퇴장했습니다.` }); }
  seats.forEach(s => s.by = null);
  for (const o of others.values()) {
    const s = o.seat != null && seats[o.seat]; if (!s) continue;
    if (me.sit === s) {   // 같은 자리에 동시에 앉은 경우: 먼저 앉은 사람이 유지
      if (o.since < me.since || (o.since === me.since && o.id < myId)) {
        me.sit = null; me.dir = 'down'; for (let i = 0; i < 20 && hit(me.x, me.y); i++) me.y += 4; me.y += 30;
        addMsg({ sys: '다른 분이 먼저 앉은 자리예요. 다른 자리를 찾아 주세요.' }); syncMe(); sendPos();
      } else continue;
    }
    s.by = o.nick; o.x = o.tx = s.x; o.y = o.ty = s.y; o.dir = s.dir;
  }
  if (me.sit) me.sit.by = me.nick;
  ready = true; updateHud(); syncVideo();
}
function joinRoom() {
  channel = sb.channel('cafe-main', { config: { broadcast: { self: false }, presence: { key: myId } } });
  channel
    .on('presence', { event: 'sync' }, onSync)
    .on('presence', { event: 'join' }, ({ key }) => { if (key !== myId) setTimeout(sendPos, 300 + Math.random() * 600); })
    .on('broadcast', { event: 'pos' }, ({ payload: p }) => {
      const o = others.get(p.id); if (!o || o.seat != null) return;
      o.tx = +p.x; o.ty = +p.y; o.dir = p.dir; if (Math.hypot(o.tx - o.x, o.ty - o.y) > 400) { o.x = o.tx; o.y = o.ty; }
    })
    .on('broadcast', { event: 'rtc' }, ({ payload }) => onRtc(payload))
    .on('broadcast', { event: 'chat' }, ({ payload: m }) => {
      addMsg(m);
      const o = others.get(m.id); if (o && m.big) o.emote = { e: String(m.text).slice(0, 4), until: performance.now() + 3000 };
    })
    .subscribe(status => {
      if (status === 'SUBSCRIBED') { syncMe(); sendPos(); }
      else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') addMsg({ sys: '실시간 연결이 불안정합니다. 다시 연결하는 중이에요.' });
    });
}

/* ───────── 입장 화면 ───────── */
let look = { skin: 0, hair: 0, hairC: 0, top: 0, topC: 0, acc: 0 };
const pv = $('#preview').getContext('2d');
function drawPreview() {
  pv.clearRect(0, 0, 160, 200); pv.imageSmoothingEnabled = false;
  drawChar(pv, 80 - 6 * 9, 36, 9, look, 'down', 0, false);
}
function buildParts() {
  const box = $('#parts'); box.innerHTML = '';
  PARTS.forEach(([k, label, n, name]) => {
    const row = document.createElement('div'); row.className = 'part';
    row.innerHTML = `<span class="k">${label}</span><button>◀</button><span class="v">${name(look[k])}</span><button>▶</button>`;
    const [prev, next] = row.querySelectorAll('button');
    const go = d => { look[k] = (look[k] + d + n) % n; row.querySelector('.v').textContent = name(look[k]); drawPreview(); };
    prev.onclick = () => go(-1); next.onclick = () => go(1);
    box.appendChild(row);
  });
  drawPreview();
}
const randomLook = () => { PARTS.forEach(([k, , n]) => look[k] = Math.floor(Math.random() * n)); buildParts(); };
$('#random').onclick = randomLook;
randomLook();

let lookupTimer;
function checkReturning() {
  const n = $('#nick').value.trim(), p = $('#pin').value;
  $('#welcome').textContent = ''; clearTimeout(lookupTimer);
  if (!n || !/^\d{4}$/.test(p)) return;
  lookupTimer = setTimeout(async () => {
    let d = await rpc('cafe_lookup', { p_nick: n, p_pin: p });
    if (d === undefined) d = store.get(n, p);
    if (!d || n !== $('#nick').value.trim() || p !== $('#pin').value) return;
    look = { ...look, ...d.look }; buildParts();
    const total = d.total != null ? +d.total : d.sessions.reduce((a, s) => a + s.ms, 0);
    $('#welcome').textContent = `다시 오셨네요! 지금까지 ${fmt(total)} 공부했어요.`;
  }, 400);
}
$('#nick').oninput = checkReturning;
$('#pin').oninput = e => { e.target.value = e.target.value.replace(/\D/g, ''); checkReturning(); };

/* ───────── 게임 ───────── */
const cv = $('#game'), c = cv.getContext('2d');
const keys = {};
let me = null, near = null, running = false, last = 0;
let dpr = 1;
const resize = () => {
  dpr = Math.min(3, window.devicePixelRatio || 1);
  cv.width = Math.round($('#stage').clientWidth * dpr); cv.height = Math.round($('#stage').clientHeight * dpr);
};
addEventListener('resize', resize);

$('#enter').onclick = async () => {
  const n = $('#nick').value.trim(), p = $('#pin').value;
  if (!n) return $('#err').textContent = '닉네임을 입력해 주세요.';
  if (!/^\d{4}$/.test(p)) return $('#err').textContent = '전화번호 뒷자리 숫자 4자리를 입력해 주세요.';
  $('#enter').disabled = true; $('#err').textContent = '';
  if (sb && await rpc('cafe_enter', { p_nick: n, p_pin: p, p_look: look }) === undefined) online = false;
  $('#enter').disabled = false;
  me = { nick: n, pin: p, look: { ...look }, x: 10 * T, y: 28.2 * T, dir: 'up', step: 0, anim: 0, sit: null, acc: 0, since: 0, emote: null };
  if (!online) { const d = store.get(n, p) || { sessions: [] }; d.look = me.look; store.set(n, p, d); }
  buildBg(); buildGrid();
  $('#entry').classList.add('hidden'); $('#side').classList.remove('hidden'); $('#help').classList.remove('hidden');
  resize();
  running = true; last = performance.now(); requestAnimationFrame(loop);
  setInterval(updateHud, 500); updateHud();
  addMsg({ sys: `${n}님이 입장했습니다.` });
  if (online) joinRoom();
  else {
    const e = rpc.lastError, missing = e && /cafe_|PGRST202|schema cache/i.test(`${e.code} ${e.message}`);
    addMsg({ sys: !sb ? '서버 설정이 없어 혼자 보기로 실행합니다.' : missing ? '서버에 설정 SQL이 아직 적용되지 않았어요. 지금은 혼자 보기로 실행합니다.' : '서버에 연결하지 못해 혼자 보기로 실행합니다. 기록은 이 브라우저에만 저장돼요.' });
  }
};

const studied = () => me.acc + (me.sit ? Date.now() - me.since : 0);
const hit = (x, y) => solids.some(s => x - 10 < s.x + s.w && x + 10 > s.x && y - 10 < s.y + s.h && y + 2 > s.y);

addEventListener('keydown', e => {
  if (!running) return;
  if (e.code === 'Escape' && !$('#kiosk').classList.contains('hidden')) { $('#kiosk').classList.add('hidden'); e.preventDefault(); return; }   // ESC로 키오스크 창 닫기
  if (/^(INPUT|TEXTAREA)$/.test(e.target.tagName)) { if (e.code === 'Escape') e.target.blur(); return; }
  keys[e.code] = true;
  if ((e.code === 'KeyE' || e.code === 'Space') && !e.repeat) { e.preventDefault(); interact(); }
  if (e.code.startsWith('Arrow')) e.preventDefault();
});
addEventListener('keyup', e => keys[e.code] = false);
cv.addEventListener('pointerdown', e => onPoint(e));
$('#hint').onclick = () => { if (running) interact(); };

function interact() {
  if (!$('#kiosk').classList.contains('hidden')) return;
  if (me.sit) {                       // 일어나기 → 스탠드 꺼짐
    me.acc += Date.now() - me.since; me.sit.by = null; me.sit = null; me.dir = 'down'; me.path = me.goal = null;
    for (let i = 0; i < 20 && hit(me.x, me.y); i++) me.y += 4;
    addMsg({ sys: `${me.nick}님이 자리에서 일어났습니다.` });
  } else if (near && near.seat) {     // 앉기 → 스탠드 켜짐
    const s = near.seat; s.by = me.nick; me.sit = s; me.x = s.x; me.y = s.y; me.dir = s.dir; me.step = 0; me.since = Date.now();
    addMsg({ sys: `${me.nick}님이 ${s.zone}에서 공부를 시작했습니다.` });
  } else if (near && near.kiosk) {
    $('#kioskTime').textContent = fmt(studied()); $('#kiosk').classList.remove('hidden');
  }
  syncMe(); sendPos();
  updateHud(); syncVideo();
}

/* 클릭·터치 이동: 격자 길찾기 */
const G = 20, GW = W * T / G, GH = H * T / G, cam = { x: 0, y: 0 };
let grid = null, marker = null;
const cellOk = (i, j) => i >= 0 && j >= 0 && i < GW && j < GH && grid[j * GW + i];
function buildGrid() {
  grid = new Uint8Array(GW * GH);
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) grid[j * GW + i] = hit(i * G + G / 2, j * G + G / 2) ? 0 : 1;
}
function nearestCell(x, y) {
  const ci = Math.max(0, Math.min(GW - 1, Math.floor(x / G))), cj = Math.max(0, Math.min(GH - 1, Math.floor(y / G)));
  if (cellOk(ci, cj)) return [ci, cj];
  for (let r = 1; r <= 14; r++) {
    let best = null, bd = 1e9;
    for (let j = cj - r; j <= cj + r; j++) for (let i = ci - r; i <= ci + r; i++) {
      if (Math.max(Math.abs(i - ci), Math.abs(j - cj)) !== r || !cellOk(i, j)) continue;
      const d = Math.hypot(i * G + G / 2 - x, j * G + G / 2 - y); if (d < bd) { bd = d; best = [i, j]; }
    }
    if (best) return best;
  }
  return null;
}
function los(a, b) {
  const d = Math.hypot(b.x - a.x, b.y - a.y), n = Math.ceil(d / 5);
  for (let k = 1; k <= n; k++) if (hit(a.x + (b.x - a.x) * k / n, a.y + (b.y - a.y) * k / n)) return false;
  return true;
}
function findPath(sx, sy, tx, ty) {
  const s = nearestCell(sx, sy), t = nearestCell(tx, ty); if (!s || !t) return null;
  const prev = new Int32Array(GW * GH).fill(-1), si = s[1] * GW + s[0], ti = t[1] * GW + t[0], q = [si]; prev[si] = si;
  for (let h = 0; h < q.length && prev[ti] < 0; h++) {
    const c = q[h], i = c % GW, j = (c - i) / GW;
    for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const ni = i + di, nj = j + dj, n = nj * GW + ni;
      if (!cellOk(ni, nj) || prev[n] >= 0 || (di && dj && (!cellOk(i + di, j) || !cellOk(i, j + dj)))) continue;
      prev[n] = c; q.push(n);
    }
  }
  if (prev[ti] < 0) return null;
  const pts = [];
  for (let c = ti; c !== si; c = prev[c]) pts.push({ x: (c % GW) * G + G / 2, y: Math.floor(c / GW) * G + G / 2 });
  pts.push({ x: s[0] * G + G / 2, y: s[1] * G + G / 2 }, { x: sx, y: sy }); pts.reverse();
  if (!hit(tx, ty) && los(pts[pts.length - 1], { x: tx, y: ty })) pts.push({ x: tx, y: ty });
  const out = [];   // 꺾이는 곳만 남겨 자연스럽게 걷기
  for (let i = 0; i < pts.length - 1;) { let j = pts.length - 1; while (j > i + 1 && !los(pts[i], pts[j])) j--; out.push(pts[j]); i = j; }
  return out;
}
function arrive() {
  const g = me.goal; me.goal = me.path = null;
  if (g && g.seat && !g.seat.by) { near = { seat: g.seat }; interact(); }
  else if (g && g.kiosk) { near = { kiosk: true }; interact(); }
}
function onPoint(e) {
  if (document.activeElement) document.activeElement.blur();
  if (!running || me.sit || !$('#kiosk').classList.contains('hidden')) return;
  const r = cv.getBoundingClientRect(), wx = e.clientX - r.left + cam.x, wy = e.clientY - r.top + cam.y;
  let goal = null, tx = wx, ty = wy;
  const s = seats.find(s => !s.by && Math.hypot(s.x - wx, s.y - wy) < 28);
  if (s) { goal = { seat: s }; tx = s.x; ty = s.y; }
  else if (Math.abs(KIOSK.x - wx) < 34 && wy > KIOSK.y - 70 && wy < KIOSK.y + 30) { goal = { kiosk: true }; tx = KIOSK.x; ty = KIOSK.y + T; }
  const path = findPath(me.x, me.y, tx, ty);
  if (!path || !path.length) return;
  me.path = path; me.goal = goal;
  const end = s || path[path.length - 1]; marker = { x: end.x, y: end.y, until: performance.now() + 700 };
}

let lastSent = 0, wasMoving = false;
function tickOthers(dt) {
  for (const o of others.values()) {
    const dx = o.tx - o.x, dy = o.ty - o.y, d = Math.hypot(dx, dy);
    if (d > 1.5 && o.seat == null) {
      const k = Math.min(1, dt * 10); o.x += dx * k; o.y += dy * k;
      o.anim += dt; o.step = 1 + Math.floor(o.anim / .16) % 2;
    } else o.step = 0;
  }
}
function update(dt) {
  if (me.sit || !$('#kiosk').classList.contains('hidden')) return;
  const dx = (keys.ArrowRight || keys.KeyD ? 1 : 0) - (keys.ArrowLeft || keys.KeyA ? 1 : 0);
  const dy = (keys.ArrowDown || keys.KeyS ? 1 : 0) - (keys.ArrowUp || keys.KeyW ? 1 : 0);
  let moved = false, arrived = false;
  if (dx || dy) {   // 키보드 이동 (클릭 이동은 취소)
    me.path = me.goal = null;
    const k = 200 * dt / Math.hypot(dx, dy);
    if (!hit(me.x + dx * k, me.y)) me.x += dx * k;
    if (!hit(me.x, me.y + dy * k)) me.y += dy * k;
    me.dir = dx ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'); moved = true;
  } else if (me.path && me.path.length) {   // 클릭한 곳으로 걸어가기
    const p = me.path[0], ex = p.x - me.x, ey = p.y - me.y, d = Math.hypot(ex, ey), k = 200 * dt;
    if (d <= k) { me.x = p.x; me.y = p.y; me.path.shift(); arrived = !me.path.length; }
    else { me.x += ex / d * k; me.y += ey / d * k; }
    if (d > 1) me.dir = Math.abs(ex) > Math.abs(ey) ? (ex > 0 ? 'right' : 'left') : (ey > 0 ? 'down' : 'up');
    moved = true;
  }
  if (moved) {
    me.anim += dt; me.step = 1 + Math.floor(me.anim / .16) % 2;
    const now = performance.now(); wasMoving = true;
    if (now - lastSent > 110) { sendPos(); lastSent = now; }
  } else { me.step = 0; if (wasMoving) { sendPos(); wasMoving = false; } }
  if (arrived) { arrive(); if (me.sit) return; }
  near = null; let best = 50;
  for (const s of seats) if (!s.by) { const d = Math.hypot(s.x - me.x, s.y - me.y); if (d < best) { best = d; near = { seat: s }; } }
  if (!near && Math.hypot(KIOSK.x - me.x, KIOSK.y - me.y) < 75) near = { kiosk: true };
}

function render(t) {
  const vw = cv.width / dpr, vh = cv.height / dpr, ww = W * T, wh = H * T;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  const cx = vw > ww ? (ww - vw) / 2 : Math.max(0, Math.min(ww - vw, me.x - vw / 2));
  const cy = vh > wh ? (wh - vh) / 2 : Math.max(0, Math.min(wh - vh, me.y - vh / 2));
  c.fillStyle = '#1f1a17'; c.fillRect(0, 0, vw, vh);
  cam.x = Math.round(cx * dpr) / dpr; cam.y = Math.round(cy * dpr) / dpr;
  c.save(); c.translate(-cam.x, -cam.y); c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
  c.drawImage(bg, 0, 0, ww, wh);
  if (!me.sit && near && near.seat) {
    c.strokeStyle = '#FFD164'; c.lineWidth = 3; c.beginPath(); c.roundRect(near.seat.x - 17, near.seat.y - 17, 34, 34, 10); c.stroke();
  }
  if (marker && marker.until > t) {
    const k = (marker.until - t) / 700;
    c.strokeStyle = `rgba(255,209,100,${k})`; c.lineWidth = 3; c.beginPath(); c.arc(marker.x, marker.y, 6 + (1 - k) * 16, 0, 7); c.stroke();
  }
  const people = [...others.values()].map(o => ({ p: o, sit: o.seat != null && seats[o.seat] || null }));
  people.push({ p: me, sit: me.sit, mine: true });
  people.forEach(q => { q.fy = q.sit ? q.p.y + 12 : q.p.y; });
  people.sort((a, b) => a.fy - b.fy);
  for (const q of people) {
    c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(q.p.x, q.fy, 14, 5, 0, 0, 7); c.fill();
    drawChar(c, q.p.x - 6 * U, q.fy - 16 * U, U, { skin: 0, hair: 0, hairC: 0, top: 0, topC: 0, acc: 0, ...q.p.look }, q.p.dir, q.p.step, !!q.sit);
  }
  c.drawImage(fg, 0, 0, ww, wh);
  // 저녁 분위기 + 불빛
  c.globalCompositeOperation = 'multiply'; c.fillStyle = '#a69fd6'; c.fillRect(0, 0, ww, wh);
  c.globalCompositeOperation = 'source-over';
  seats.forEach(s => { if (s.by) { lampIcon(c, s.lamp, true); s.pc && pcIcon(c, s.pc, true); } });
  c.globalCompositeOperation = 'screen';
  for (const l of lights) {
    if (l.seat && !l.seat.by) continue;
    const r = l.r * (1 + .04 * Math.sin(t / 420 + l.x));
    c.globalAlpha = l.soft ? .5 : 1; c.drawImage(l.cool ? glowC : glow, l.x - r, l.y - r, r * 2, r * 2);
  }
  c.globalAlpha = 1; c.globalCompositeOperation = 'source-over';
  // 이름표, 이모지 말풍선
  for (const { p, sit, fy, mine } of people) {
    const tag = `${mine ? '나 · ' : ''}${p.nick} · ${sit ? '공부 중' : '쉬는 중'}`;
    c.font = '700 13px Pretendard,sans-serif'; const tw = c.measureText(tag).width + 30, ty = sit ? fy + 8 : fy - 16 * U - 32;
    c.fillStyle = sit ? '#fff7dc' : '#2c3350'; c.beginPath(); c.roundRect(p.x - tw / 2, ty, tw, 22, 11); c.fill();
    c.fillStyle = sit ? '#35c46f' : '#9aa3c0'; c.beginPath(); c.arc(p.x - tw / 2 + 11, ty + 11, 4, 0, 7); c.fill();
    c.fillStyle = sit ? '#3a2f10' : '#fff'; c.textAlign = 'center'; c.fillText(tag, p.x + 7, ty + 16);
    if (p.emote && p.emote.until > t) {
      c.fillStyle = '#fff'; c.beginPath(); c.roundRect(p.x - 20, fy - 16 * U - (sit ? 46 : 76), 40, 38, 12); c.fill();
      c.font = '24px sans-serif'; c.fillText(p.emote.e, p.x, fy - 16 * U - (sit ? 18 : 48));
    }
  }
  c.textAlign = 'left';
  c.restore();
  const h = $('#hint');
  const msg = me.sit ? '일어나기 (E 키 또는 여기 클릭)' : near && near.seat ? '앉기 (E 키 또는 여기 클릭)' : near && near.kiosk ? '키오스크 사용 (E 키 또는 여기 클릭)' : '';
  h.textContent = msg; h.classList.toggle('hidden', !msg);
}

function loop(t) {
  if (!running) return;
  const dt = Math.min(.05, (t - last) / 1000); last = t;
  update(dt); tickOthers(dt); render(t); requestAnimationFrame(loop);
}

function updateHud() {
  if (!me) return;
  const rows = [...others.values()].map(o => ({ name: o.nick, ms: spanOf(o), zone: o.seat != null && seats[o.seat] && seats[o.seat].zone }))
    .sort((a, b) => b.ms - a.ms);
  rows.unshift({ name: me.nick, ms: studied(), zone: me.sit && me.sit.zone, me: true });
  $('#count').textContent = `${rows.length}명`;
  $('#board').innerHTML = rows.map(r =>
    `<li class="${r.zone ? 'on' : ''} ${r.me ? 'me' : ''}"><span class="dot"></span><div class="who"><span class="name"></span><small></small></div><span class="time">${fmt(r.ms)}</span></li>`).join('');
  $('#board').querySelectorAll('li').forEach((li, i) => {
    li.querySelector('.name').textContent = rows[i].name + (rows[i].me ? ' (나)' : '');
    li.querySelector('small').textContent = rows[i].zone ? `${rows[i].zone}에서 공부 중` : '쉬는 중';
  });
  $('#seatinfo').textContent = `빈자리 ${seats.filter(s => !s.by).length}/${seats.length}`;
}

/* ───────── 채팅 ───────── */
function addMsg({ sys, who, text, big, file }) {
  const li = document.createElement('li'), d = new Date();
  if (sys) { li.className = 'sys'; li.textContent = sys; }
  else {
    const b = document.createElement('b'); b.textContent = who;
    const tm = document.createElement('span'); tm.className = 't'; tm.textContent = `${p2(d.getHours())}:${p2(d.getMinutes())}`; b.appendChild(tm);
    li.appendChild(b);
    if (file) {
      const okUrl = String(file.url).startsWith('blob:') || (CFG.url && String(file.url).startsWith(CFG.url + '/storage/'));
      const a = document.createElement(okUrl ? 'a' : 'span');
      if (okUrl) { a.href = file.url; a.target = '_blank'; a.rel = 'noopener'; a.download = file.name; }
      a.textContent = `📎 ${String(file.name).slice(0, 80)} (${Math.max(1, Math.round(file.size / 1024))}KB)`; li.appendChild(a);
    } else { const s = document.createElement('span'); s.textContent = text; if (big) li.className = 'big'; li.appendChild(s); }
  }
  const box = $('#msgs'); box.appendChild(li); box.scrollTop = box.scrollHeight;
}
const say = m => { const msg = { id: myId, who: me.nick, ...m }; addMsg(msg); cast('chat', msg); };
['👍', '❤️', '😂', '🔥', '👏', '☕'].forEach(e => {
  const b = document.createElement('button'); b.type = 'button'; b.textContent = e;
  b.onclick = () => { say({ text: e, big: true }); me.emote = { e, until: performance.now() + 3000 }; };
  $('#emojis').appendChild(b);
});
$('#chatInput').addEventListener('keydown', e => {   // Enter 전송, Shift+Enter 줄바꿈 (한글 조합 중에는 무시)
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); $('#chatForm').requestSubmit(); }
});
$('#chatForm').onsubmit = e => {
  e.preventDefault();
  const v = $('#chatInput').value.trim(), f = pendingFile; if ((!v && !f) || !me) return;
  if (v) say({ text: v });
  $('#chatInput').value = ''; setAttach(null);
  if (f) sendFile(f);
};
// 파일은 고른 뒤 '전송'을 눌러야 올라감
let pendingFile = null;
function setAttach(f) {
  pendingFile = f; $('#attach').classList.toggle('hidden', !f);
  if (f) $('#attachName').textContent = `📎 ${f.name} (${Math.max(1, Math.round(f.size / 1024))}KB)`;
}
$('#attachX').onclick = () => setAttach(null);
$('#file').onchange = e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f || !me) return;
  if (f.size > 10 * 1024 * 1024) return addMsg({ sys: '파일은 10MB까지 올릴 수 있어요.' });
  setAttach(f); $('#chatInput').focus();
};
async function sendFile(f) {
  if (!online) return addMsg({ who: me.nick, file: { name: f.name, size: f.size, url: URL.createObjectURL(f) } });
  addMsg({ sys: `${f.name} 올리는 중…` });
  const ext = (f.name.match(/\.[A-Za-z0-9]{1,8}$/) || [''])[0];
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const { error } = await sb.storage.from('cafe-files').upload(path, f);
  if (error) return addMsg({ sys: `파일을 올리지 못했어요. (${error.message})` });
  say({ file: { name: f.name, size: f.size, url: sb.storage.from('cafe-files').getPublicUrl(path).data.publicUrl } });
}

/* ───────── 화상회의룸 (WebRTC: 같은 방에 앉은 사람끼리 직접 연결) ───────── */
const peers = new Map();
let localStream = null, myRoom = null;
const ICE = { iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun.cloudflare.com:3478'] }] };
const roomOf = s => s && s.zone.startsWith('화상회의룸') ? s.zone : null;
const mateIds = () => [...others.values()].filter(o => o.seat != null && seats[o.seat] && seats[o.seat].zone === myRoom).map(o => o.id);

function tile(id, name) {
  let el = document.getElementById('tile-' + id);
  if (!el) {
    el = document.createElement('div'); el.className = 'tile novideo'; el.id = 'tile-' + id;
    const v = document.createElement('video'); v.autoplay = true; v.playsInline = true;
    if (id === 'me') { v.muted = true; el.classList.add('me'); }
    el.append(v, document.createElement('span')); $('#tiles').appendChild(el);
  }
  el.querySelector('span').textContent = name; return el;
}
function refreshTile(id, stream) {
  const el = document.getElementById('tile-' + id); if (!el) return;
  const v = el.querySelector('video');
  if (stream && v.srcObject !== stream) { v.srcObject = stream; v.play && v.play().catch(() => { }); }
  const s = v.srcObject;
  el.classList.toggle('novideo', !(s && s.getVideoTracks().some(t => t.readyState === 'live' && !t.muted)));
}
function peer(id) {
  let pc = peers.get(id); if (pc) return pc;
  pc = new RTCPeerConnection(ICE); pc.polite = myId < id; pc.born = Date.now(); peers.set(id, pc);
  pc.onnegotiationneeded = async () => {
    try { pc.makingOffer = true; await pc.setLocalDescription(); cast('rtc', { from: myId, to: id, desc: { type: pc.localDescription.type, sdp: pc.localDescription.sdp } }); }
    catch (e) { console.warn(e); } finally { pc.makingOffer = false; }
  };
  pc.onicecandidate = ({ candidate }) => { if (candidate) cast('rtc', { from: myId, to: id, cand: candidate.toJSON() }); };
  pc.ontrack = ({ track, streams }) => {
    const st = streams[0] || (pc.rs = pc.rs || new MediaStream()); if (!streams[0]) st.addTrack(track);
    track.onunmute = track.onmute = track.onended = () => refreshTile(id);
    refreshTile(id, st);
  };
  pc.oniceconnectionstatechange = () => { if (pc.iceConnectionState === 'failed') pc.restartIce(); };
  if (localStream) localStream.getTracks().forEach(t => pc.addTrack(t, localStream));
  return pc;
}
function closePeer(id) {
  const pc = peers.get(id); if (pc) { pc.close(); peers.delete(id); }
  const el = document.getElementById('tile-' + id); if (el) el.remove();
}
async function onRtc({ from, to, desc, cand }) {
  if (to !== myId || !myRoom || !others.has(from)) return;
  const pc = peer(from);
  try {
    if (desc) {
      const collision = desc.type === 'offer' && (pc.makingOffer || pc.signalingState !== 'stable');
      pc.ignoreOffer = !pc.polite && collision; if (pc.ignoreOffer) return;
      await pc.setRemoteDescription(desc);
      if (desc.type === 'offer') { await pc.setLocalDescription(); cast('rtc', { from: myId, to: from, desc: { type: pc.localDescription.type, sdp: pc.localDescription.sdp } }); }
    } else if (cand) {
      try { await pc.addIceCandidate(cand); } catch (e) { if (!pc.ignoreOffer) throw e; }
    }
  } catch (e) { console.warn('rtc', e); }
}
function setVideoBtns() {
  const cam = !!(localStream && localStream.getVideoTracks().length), mic = !!(localStream && localStream.getAudioTracks().length);
  $('#camBtn').textContent = cam ? '🎥 카메라 끄기' : '🎥 카메라 켜기'; $('#camBtn').classList.toggle('on', cam);
  $('#micBtn').textContent = mic ? '🎤 마이크 끄기' : '🎤 마이크 켜기'; $('#micBtn').classList.toggle('on', mic);
}
function leaveVideo() {
  for (const id of [...peers.keys()]) closePeer(id);
  if (localStream) { localStream.getTracks().forEach(t => t.stop()); localStream = null; }
  $('#tiles').innerHTML = ''; $('#video').classList.add('hidden'); setVideoBtns();
}
function syncVideo() {
  const room = online && me ? roomOf(me.sit) : null;
  if (room !== myRoom) {
    leaveVideo(); myRoom = room;
    if (room) {
      $('#video').classList.remove('hidden'); $('#roomName').textContent = room; tile('me', `${me.nick} (나)`);
      addMsg({ sys: `${room}입니다. 오른쪽 위에서 카메라와 마이크를 켜면 같은 방 사람과 대화할 수 있어요.` });
    }
  }
  if (!myRoom) return;
  const mates = new Set(mateIds());
  for (const id of mates) { tile(id, others.get(id).nick); if (localStream && localStream.getTracks().length) peer(id); }
  for (const [id, pc] of [...peers]) if (!mates.has(id) && Date.now() - pc.born > 5000) closePeer(id);
  document.querySelectorAll('#tiles .tile').forEach(el => { const id = el.id.slice(5); if (id !== 'me' && !mates.has(id) && !peers.has(id)) el.remove(); });
}
async function toggleMedia(kind) {
  if (!myRoom) return;
  localStream = localStream || new MediaStream();
  const cur = (kind === 'video' ? localStream.getVideoTracks() : localStream.getAudioTracks())[0];
  if (cur) {   // 끄기: 장치도 함께 꺼짐
    cur.stop(); localStream.removeTrack(cur);
    for (const pc of peers.values()) { const s = pc.getSenders().find(x => x.track === cur); if (s) pc.removeTrack(s); }
  } else {
    let ms;
    try {
      ms = await navigator.mediaDevices.getUserMedia(kind === 'video'
        ? { video: { width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 15 } } }
        : { audio: { echoCancellation: true, noiseSuppression: true } });
    } catch (e) {
      return addMsg({ sys: `${kind === 'video' ? '카메라' : '마이크'}를 켤 수 없어요. 브라우저 주소창의 권한 설정을 확인해 주세요.` });
    }
    const tr = ms.getTracks()[0];
    if (!myRoom) return tr.stop();
    for (const pc of peers.values()) pc.addTrack(tr, localStream);
    localStream.addTrack(tr);
    for (const id of mateIds()) peer(id);
  }
  refreshTile('me', localStream); setVideoBtns();
}
$('#camBtn').onclick = () => toggleMedia('video');
$('#micBtn').onclick = () => toggleMedia('audio');

/* ───────── 퇴장과 기록 ───────── */
$('#stay').onclick = () => $('#kiosk').classList.add('hidden');
$('#leave').onclick = async () => {
  const ms = studied(), now = Date.now();
  $('#leave').disabled = true;
  let d = online ? await rpc('cafe_leave', { p_nick: me.nick, p_pin: me.pin, p_ms: Math.round(ms) }) : null;
  $('#leave').disabled = false;
  const saved = !!d;
  if (!d) {   // 서버에 저장하지 못하면 이 브라우저에 보관
    d = store.get(me.nick, me.pin) || { look: me.look, sessions: [] };
    if (ms >= 1000) d.sessions.push({ t: now, ms });
    store.set(me.nick, me.pin, d);
  }
  leaveVideo(); myRoom = null;
  if (channel) { sb.removeChannel(channel); channel = null; }
  running = false;
  const day0 = new Date(); day0.setHours(0, 0, 0, 0);
  const week0 = new Date(day0); week0.setDate(day0.getDate() - (day0.getDay() + 6) % 7);
  const sum = from => d.sessions.filter(s => s.t >= from).reduce((a, s) => a + s.ms, 0);
  $('#recTitle').textContent = `${me.nick}님, 수고하셨어요!`;
  if (online && !saved) $('#recTitle').textContent += ' (서버 저장 실패, 이 브라우저에 보관)';
  $('#recStats').innerHTML = [['이번 공부', ms], ['오늘', sum(day0.getTime())], ['이번 주', sum(week0.getTime())], ['전체 누적', d.total != null ? +d.total : sum(0)]]
    .map(([k, v]) => `<div><small>${k}</small><b>${fmt(v)}</b></div>`).join('');
  $('#recList').innerHTML = d.sessions.slice(-5).reverse().map(s => {
    const t = new Date(s.t);
    return `<li><span>${t.getMonth() + 1}월 ${t.getDate()}일 ${p2(t.getHours())}:${p2(t.getMinutes())}</span><b>${fmt(s.ms)}</b></li>`;
  }).join('') || '<li>아직 기록이 없어요.</li>';
  ['kiosk', 'help', 'hint'].forEach(i => $('#' + i).classList.add('hidden'));
  $('#record').classList.remove('hidden');
};
$('#again').onclick = () => location.reload();
})();
