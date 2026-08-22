// ============================================================
// NUTRIMAZE: CARRERA SALUDABLE  v3 - MODO FÁCIL
// Pseudo-3D map · Line-of-sight enemies · Rich player animations
// ============================================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// ---------- CONFIG ----------
const TILE = 40;
const COLS = 18;
const ROWS = 14;
const WALL_H = 18;

// ---------- SKINS ----------
const SKINS = [
  { id: 'nutri', name: 'Chef Nutri', emoji: '🥕', color: '#f97316', unlocked: true },
  { id: 'vegetalin', name: 'Vegetalín', emoji: '🥦', color: '#22c55e', unlocked: true },
  { id: 'manzanito', name: 'Manzanito', emoji: '🍎', color: '#ef4444', unlocked: false },
  { id: 'turbo', name: 'Turbo', emoji: '⚡', color: '#eab308', unlocked: false },
  { id: 'robo', name: 'Robo-Nutri', emoji: '🤖', color: '#3b82f6', unlocked: false },
  { id: 'explorer', name: 'Nutri Explorer', emoji: '🧑‍🚀', color: '#a855f7', unlocked: false }
];

let currentSkin = SKINS[0];

// ---------- LEVEL THEMES ----------
const THEMES = {
  blue: {
    wall: '#1e3a5f',
    wallTop: '#2563eb',
    wallSide: '#1e40af',
    wallEdge: '#3b82f6',
    wallGlow: 'rgba(59,130,246,0.3)',
    path: '#0c1222',
    pathAlt: '#0f172a',
    pathLight: '#1e293b',
    accent: '#3b82f6',
    particle: '#60a5fa',
    nameColor: '#60a5fa',
    ambient: 'rgba(30,58,138,0.15)'
  },

  green: {
    wall: '#14532d',
    wallTop: '#16a34a',
    wallSide: '#166534',
    wallEdge: '#22c55e',
    wallGlow: 'rgba(34,197,94,0.3)',
    path: '#052e16',
    pathAlt: '#0a1f12',
    pathLight: '#14532d',
    accent: '#22c55e',
    particle: '#4ade80',
    nameColor: '#4ade80',
    ambient: 'rgba(20,83,45,0.18)'
  },

  red: {
    wall: '#450a0a',
    wallTop: '#dc2626',
    wallSide: '#7f1d1d',
    wallEdge: '#ef4444',
    wallGlow: 'rgba(239,68,68,0.35)',
    path: '#1c0a0a',
    pathAlt: '#2a0f0f',
    pathLight: '#450a0a',
    accent: '#ef4444',
    particle: '#f87171',
    nameColor: '#f87171',
    ambient: 'rgba(127,29,29,0.2)'
  }
};

// ---------- LEVELS ----------
const LEVELS = [
  {
    name: 'Escuela Saludable',
    theme: 'blue',

    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
      [1,1,0,0,1,1,1,1,0,1,1,1,0,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
      [1,0,1,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],

    // MÁS FÁCIL
    healthyCount: 12,
    junkCount: 3,

    // MENOS ENEMIGOS
    enemies: [
      { type:'roko', x:9, y:5 },
      { type:'bombo', x:4, y:9 },
      { type:'chispa', x:14, y:3 }
    ],

    edu: 'Las verduras y frutas aportan vitaminas, minerales y fibra. ¡Comerlas te da energía real y te hace más ágil!'
  },

  {
    name: 'Parque de las Frutas',
    theme: 'green',

    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
      [1,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
      [1,1,0,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1],
      [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,1,0,1,0,1,1,1,1,1,1,0,1,0,1,1,0,1],
      [1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,0,1,1,0,1,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],

    healthyCount: 15,
    junkCount: 4,

    enemies: [
      { type:'roko', x:8, y:3 },
      { type:'chispa', x:14, y:5 },
      { type:'bombo', x:3, y:7 },
      { type:'traga', x:11, y:9 }
    ],

    edu: 'Una manzana 🍎 da energía sostenida. Una hamburguesa 🍔 da energía rápida pero poca nutrición. ¡El equilibrio es la clave!'
  },

  {
    name: 'Centro de Fuego',
    theme: 'red',

    map: [
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,3,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1],
      [1,0,1,1,1,1,0,1,0,1,1,0,1,1,1,1,0,1],
      [1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1],
      [1,1,1,0,0,1,1,1,0,1,1,1,1,0,0,1,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,0,1],
      [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,1],
      [1,1,0,0,1,1,0,1,1,1,1,0,1,1,1,0,1,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ],

    healthyCount: 18,
    junkCount: 5,

    enemies: [
      { type:'roko', x:9, y:5 },
      { type:'roko', x:4, y:7 },
      { type:'chispa', x:13, y:3 },
      { type:'bombo', x:2, y:9 },
      { type:'traga', x:6, y:3 }
    ],

    edu: '¡Felicidades! Has aprendido que las decisiones alimenticias influyen en tu energía y rendimiento. Come variado y equilibrado.'
  }
];

// ---------- FOOD / POWERUPS ----------
const HEALTHY = [
  { emoji:'🥦', points:15 },
  { emoji:'🥕', points:12 },
  { emoji:'🍎', points:14 },
  { emoji:'🍓', points:13 },
  { emoji:'🫛', points:16 },
  { emoji:'🍊', points:12 },
  { emoji:'🥬', points:11 },
  { emoji:'🍇', points:13 }
];

const JUNK = [
  { emoji:'🍔', points:25 },
  { emoji:'🍟', points:20 },
  { emoji:'🍩', points:22 },
  { emoji:'🍕', points:28 },
  { emoji:'🍬', points:18 },
  { emoji:'🥤', points:15 },
  { emoji:'🍦', points:24 }
];

const POWERUPS = [
  { emoji:'⚡', type:'speed', duration:7000 },
  { emoji:'🛡️', type:'shield', duration:12000 },
  { emoji:'🥕', type:'cleanse', duration:0 },
  { emoji:'✨', type:'multiplier', duration:9000 }
];

// ---------- ENEMY DEFS ----------
// DIFICULTAD REDUCIDA
const ENEMY_DEFS = {
  roko: {
    color:'#ef4444',
    speed:1.55,
    emoji:'🔴',
    vision:190,
    chaseChance:0.65
  },

  bombo: {
    color:'#a855f7',
    speed:1.15,
    emoji:'🟣',
    vision:130,
    chaseChance:0.2
  },

  chispa: {
    color:'#22c55e',
    speed:1.7,
    emoji:'🟢',
    vision:160,
    chaseChance:0.4
  },

  traga: {
    color:'#f97316',
    speed:1.05,
    emoji:'🟠',
    vision:150,
    chaseChance:0.3
  }
};

// ---------- STATE ----------
let state = {
  level:0,
  score:0,

  // MÁS VIDAS
  lives:5,

  running:false,
  paused:false,

  // BALANCE MÁS TOLERANTE
  balance:65,

  size:1.0,

  // JUGADOR UN POCO MÁS RÁPIDO
  baseSpeed:2.75,

  speedMult:1.0,

  multiplier:1,
  shield:false,
  powerupTimer:0,
  powerupType:null,

  foods:[],
  powerups:[],
  enemies:[],
  particles:[],

  player:null,
  exit:null,
  map:null,
  theme:null,

  startTime:0,
  collectedHealthy:0,
  totalHealthy:0,

  exploding:false,
  explodeTimer:0,

  time:0,
  wallPulse:0,
  exitPulse:0,
  levelIntroTimer:0
};

// ---------- INPUT ----------
const keys = {};
let touchDir = null;

document.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;

  if (
    ['arrowup','arrowdown','arrowleft','arrowright',' ']
      .includes(e.key.toLowerCase())
  ) {
    e.preventDefault();
  }
});

document.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

document.querySelectorAll('.dpad button').forEach(btn => {
  const dir = btn.dataset.dir;

  btn.addEventListener('touchstart', e => {
    e.preventDefault();
    touchDir = dir;
  });

  btn.addEventListener('touchend', e => {
    e.preventDefault();
    if (touchDir === dir) touchDir = null;
  });

  btn.addEventListener('mousedown', () => {
    touchDir = dir;
  });

  btn.addEventListener('mouseup', () => {
    if (touchDir === dir) touchDir = null;
  });
});

// ---------- UTILS ----------
function rand(a,b) {
  return Math.random()*(b-a)+a;
}

function randInt(a,b) {
  return Math.floor(rand(a,b+1));
}

function dist(ax,ay,bx,by) {
  return Math.hypot(ax-bx,ay-by);
}

function lerp(a,b,t) {
  return a+(b-a)*t;
}

function clamp(v,a,b) {
  return Math.max(a,Math.min(b,v));
}

function getPathTiles(map) {
  const tiles=[];

  for(let y=0;y<ROWS;y++) {
    for(let x=0;x<COLS;x++) {
      if(map[y][x]===0 || map[y][x]===3) {
        tiles.push({x,y});
      }
    }
  }

  return tiles;
}

function isWall(x,y) {
  if(x<0 || y<0 || x>=COLS || y>=ROWS) return true;
  return state.map[y][x]===1;
}

// ---------- LINE OF SIGHT ----------
function hasLineOfSight(x0,y0,x1,y1) {

  let tx0=Math.floor(x0/TILE);
  let ty0=Math.floor(y0/TILE);

  let tx1=Math.floor(x1/TILE);
  let ty1=Math.floor(y1/TILE);

  let dx=Math.abs(tx1-tx0);
  let dy=Math.abs(ty1-ty0);

  let sx=tx0<tx1?1:-1;
  let sy=ty0<ty1?1:-1;

  let err=dx-dy;

  while(true){

    if(tx0===tx1 && ty0===ty1) return true;

    if(
      !(tx0===Math.floor(x0/TILE) &&
        ty0===Math.floor(y0/TILE))
    ){
      if(isWall(tx0,ty0)) return false;
    }

    const e2=2*err;

    if(e2>-dy){
      err-=dy;
      tx0+=sx;
    }

    if(e2<dx){
      err+=dx;
      ty0+=sy;
    }
  }
}

// ---------- PLAYER ----------
function createPlayer(tx,ty){

  return {
    x:tx*TILE+TILE/2,
    y:ty*TILE+TILE/2,

    radius:12,

    dir:{x:0,y:0},
    nextDir:{x:0,y:0},

    walkCycle:0,
    bob:0,
    squash:1,
    lean:0,

    blinkTimer:rand(40,120),
    blinking:0,

    armSwing:0,
    trail:[],

    facing:1,
    landSquash:0
  };
}

// ---------- ENEMY ----------
function createEnemy(type,tx,ty){

  const def=ENEMY_DEFS[type];

  return {
    type,

    x:tx*TILE+TILE/2,
    y:ty*TILE+TILE/2,

    radius:13,

    color:def.color,
    baseSpeed:def.speed,
    speed:def.speed,

    emoji:def.emoji,

    dir:{x:0,y:0},
    timer:rand(0,1),

    patrolTarget:null,
    wobble:rand(0,Math.PI*2),

    angry:0,

    chaseChance:def.chaseChance,
    vision:def.vision,

    seesPlayer:false,
    alertTimer:0,
    alertScale:1
  };
}

// ---------- FOOD ----------
function spawnFoods(map,healthyN,junkN){

  const paths=getPathTiles(map)
    .filter(t=>!(map[t.y][t.x]===3 || map[t.y][t.x]===2));

  for(let i=paths.length-1;i>0;i--){

    const j=randInt(0,i);

    [paths[i],paths[j]]=[
      paths[j],
      paths[i]
    ];
  }

  const foods=[];
  let idx=0;

  for(
    let i=0;
    i<healthyN && idx<paths.length;
    i++,idx++
  ){

    const t=paths[idx];

    const f=
      HEALTHY[randInt(0,HEALTHY.length-1)];

    foods.push({
      x:t.x*TILE+TILE/2,
      y:t.y*TILE+TILE/2,

      type:'healthy',

      emoji:f.emoji,
      points:f.points,

      collected:false,

      bob:rand(0,Math.PI*2),
      collectAnim:0
    });
  }

  for(
    let i=0;
    i<junkN && idx<paths.length;
    i++,idx++
  ){

    const t=paths[idx];

    const f=
      JUNK[randInt(0,JUNK.length-1)];

    foods.push({
      x:t.x*TILE+TILE/2,
      y:t.y*TILE+TILE/2,

      type:'junk',

      emoji:f.emoji,
      points:f.points,

      collected:false,

      bob:rand(0,Math.PI*2),
      collectAnim:0
    });
  }

  // MÁS POWERUPS
  const puCount=state.level>=1?3:2;

  for(
    let i=0;
    i<puCount && idx<paths.length;
    i++,idx++
  ){

    const t=paths[idx];

    const p=
      POWERUPS[randInt(0,POWERUPS.length-1)];

    state.powerups.push({
      x:t.x*TILE+TILE/2,
      y:t.y*TILE+TILE/2,

      ...p,

      collected:false,

      bob:rand(0,Math.PI*2)
    });
  }

  return foods;
}

// ---------- PARTICLES ----------
function spawnParticles(
  x,
  y,
  color,
  count=12,
  speed=3,
  life=40
){

  for(let i=0;i<count;i++){

    const a=rand(0,Math.PI*2);
    const sp=rand(0.5,speed);

    state.particles.push({
      x,
      y,

      vx:Math.cos(a)*sp,
      vy:Math.sin(a)*sp,

      life:rand(life*0.5,life),
      maxLife:life,

      color,

      size:rand(2,5.5),

      gravity:rand(0.04,0.12)
    });
  }
}

function spawnRing(x,y,color,count=16){

  for(let i=0;i<count;i++){

    const a=(i/count)*Math.PI*2;

    state.particles.push({
      x,
      y,

      vx:Math.cos(a)*3.5,
      vy:Math.sin(a)*3.5,

      life:25,
      maxLife:25,

      color,

      size:3.5,
      gravity:0
    });
  }
}

// ---------- LEVEL INIT ----------
function initLevel(idx){

  const lvl=LEVELS[idx];

  state.level=idx;

  state.map=lvl.map.map(r=>[...r]);

  state.theme=THEMES[lvl.theme];

  // BALANCE MAIS FÁCIL
  state.balance=65;

  state.size=1;
  state.speedMult=1;

  state.multiplier=1;
  state.shield=false;

  state.powerupTimer=0;
  state.powerupType=null;

  state.particles=[];
  state.powerups=[];

  state.exploding=false;
  state.explodeTimer=0;

  state.collectedHealthy=0;
  state.totalHealthy=lvl.healthyCount;

  state.startTime=performance.now();

  state.levelIntroTimer=100;

  let px=1;
  let py=1;

  let ex=COLS-2;
  let ey=ROWS-2;

  for(let y=0;y<ROWS;y++){

    for(let x=0;x<COLS;x++){

      if(lvl.map[y][x]===3){
        px=x;
        py=y;
      }

      if(lvl.map[y][x]===2){
        ex=x;
        ey=y;
      }
    }
  }

  state.player=createPlayer(px,py);

  state.exit={
    x:ex*TILE+TILE/2,
    y:ey*TILE+TILE/2
  };

  state.foods=
    spawnFoods(
      lvl.map,
      lvl.healthyCount,
      lvl.junkCount
    );

  // ENEMIGOS MÁS LENTOS
  const aggression=0.75+idx*0.08;

  state.enemies=lvl.enemies.map(e=>{

    const en=
      createEnemy(
        e.type,
        e.x,
        e.y
      );

    en.speed=
      en.baseSpeed*aggression;

    return en;
  });

  updateHUD();

  spawnRing(
    state.player.x,
    state.player.y,
    state.theme.particle,
    20
  );
}

// ---------- BALANCE ----------
function applyHealthy(){

  state.balance=
    Math.min(
      100,
      state.balance+8
    );

  state.size=
    Math.max(
      0.72,
      state.size-0.055
    );

  updateSpeedFromBalance();
}

function applyJunk(){

  // PENALIZA MENOS
  state.balance=
    Math.max(
      0,
      state.balance-7
    );

  state.size=
    Math.min(
      1.75,
      state.size+0.06
    );

  updateSpeedFromBalance();

  // SOLO EXPLOTA CON BALANCE MUY BAJO
  if(state.balance<=0){
    triggerExplode();
  }
}

function updateSpeedFromBalance(){

  const t=state.balance/100;

  state.speedMult=
    0.65+t*0.85;
}

function getBalanceLabel(){

  if(state.balance>=70)
    return 'Ágil';

  if(state.balance>=35)
    return 'Equilibrado';

  return 'Pesado';
}

function triggerExplode(){

  state.exploding=true;
  state.explodeTimer=0;
  state.running=false;

  spawnParticles(
    state.player.x,
    state.player.y,
    '#fbbf24',
    50,
    7,
    55
  );

  spawnParticles(
    state.player.x,
    state.player.y,
    '#ef4444',
    35,
    5,
    45
  );

  spawnRing(
    state.player.x,
    state.player.y,
    '#f97316',
    24
  );
}

// ---------- MOVEMENT ----------
function canMove(px,py,radius){

  const r=radius*0.82;

  const pts=[
    [px-r,py-r],
    [px+r,py-r],
    [px-r,py+r],
    [px+r,py+r]
  ];

  for(const [x,y] of pts){

    if(
      isWall(
        Math.floor(x/TILE),
        Math.floor(y/TILE)
      )
    ){
      return false;
    }
  }

  return true;
}

function getInputDir(){

  let dx=0;
  let dy=0;

  if(
    keys['arrowup'] ||
    keys['w'] ||
    touchDir==='up'
  ){
    dy=-1;
  }

  else if(
    keys['arrowdown'] ||
    keys['s'] ||
    touchDir==='down'
  ){
    dy=1;
  }

  if(
    keys['arrowleft'] ||
    keys['a'] ||
    touchDir==='left'
  ){
    dx=-1;
  }

  else if(
    keys['arrowright'] ||
    keys['d'] ||
    touchDir==='right'
  ){
    dx=1;
  }

  return {x:dx,y:dy};
}

// ---------- PLAYER UPDATE ----------
function updatePlayer(dt){

  if(state.exploding) return;

  const p=state.player;

  const input=getInputDir();

  if(input.x!==0 || input.y!==0){
    p.nextDir=input;
  }

  const speed=
    state.baseSpeed*
    state.speedMult*
    (state.powerupType==='speed'?1.6:1);

  const tryDirs=[
    p.nextDir,
    p.dir
  ];

  let moved=false;

  for(const d of tryDirs){

    if(d.x===0 && d.y===0)
      continue;

    const nx=p.x+d.x*speed;
    const ny=p.y+d.y*speed;

    if(
      canMove(
        nx,
        ny,
        p.radius*state.size
      )
    ){

      p.dir={...d};

      p.x=nx;
      p.y=ny;

      moved=true;

      if(d.x!==0)
        p.facing=d.x;

      break;
    }
  }

  // ---------- ANIMATIONS ----------
  if(moved){

    p.walkCycle=
      (p.walkCycle+
      dt*9*
      state.speedMult)%1;

    p.bob=
      Math.sin(
        p.walkCycle*Math.PI*2
      )*2.8;

    p.armSwing=
      Math.sin(
        p.walkCycle*Math.PI*2
      )*0.55;

    p.squash=
      lerp(
        p.squash,
        0.88+
        Math.abs(
          Math.sin(
            p.walkCycle*Math.PI*2
          )
        )*0.08,
        0.25
      );

    p.lean=
      lerp(
        p.lean,
        (p.dir.x||p.dir.y)?0.12:0,
        0.2
      );

    if(state.speedMult>1.05){

      p.trail.push({
        x:p.x,
        y:p.y,
        life:14
      });

      if(p.trail.length>10)
        p.trail.shift();
    }

  }else{

    p.walkCycle=
      lerp(
        p.walkCycle,
        0,
        0.1
      );

    p.bob=
      lerp(
        p.bob,
        Math.sin(state.time*0.004)*1.2,
        0.1
      );

    p.armSwing=
      lerp(
        p.armSwing,
        0,
        0.15
      );

    p.squash=
      lerp(
        p.squash,
        1+
        Math.sin(
          state.time*0.003
        )*0.03,
        0.12
      );

    p.lean=
      lerp(
        p.lean,
        0,
        0.15
      );

    p.trail.forEach(
      t=>t.life--
    );

    p.trail=
      p.trail.filter(
        t=>t.life>0
      );
  }

  // ---------- BLINK ----------
  p.blinkTimer--;

  if(p.blinkTimer<=0){

    p.blinking=6;

    p.blinkTimer=
      rand(50,140);
  }

  if(p.blinking>0)
    p.blinking--;

  // ---------- FOOD ----------
  for(const f of state.foods){

    if(f.collected)
      continue;

    if(
      dist(
        p.x,
        p.y,
        f.x,
        f.y
      ) <
      (p.radius*state.size+11)
    ){

      f.collected=true;
      f.collectAnim=20;

      state.score +=
        Math.floor(
          f.points*
          state.multiplier
        );

      if(f.type==='healthy'){

        state.collectedHealthy++;

        applyHealthy();

        spawnParticles(
          f.x,
          f.y,
          '#4ade80',
          14,
          3,
          35
        );

        spawnRing(
          f.x,
          f.y,
          '#86efac',
          10
        );

      }else{

        applyJunk();

        spawnParticles(
          f.x,
          f.y,
          '#f97316',
          12,
          2.5,
          30
        );
      }

      p.landSquash=0.75;

      updateHUD();
    }
  }

  p.landSquash=
    lerp(
      p.landSquash,
      1,
      0.12
    );

  // ---------- POWERUPS ----------
  for(const pu of state.powerups){

    if(pu.collected)
      continue;

    if(
      dist(
        p.x,
        p.y,
        pu.x,
        pu.y
      ) <
      (p.radius*state.size+13)
    ){

      pu.collected=true;

      activatePowerup(pu);

      spawnParticles(
        pu.x,
        pu.y,
        '#fbbf24',
        20,
        4,
        40
      );

      spawnRing(
        pu.x,
        pu.y,
        '#fde68a',
        14
      );
    }
  }

  // ---------- EXIT ----------
  if(
    state.collectedHealthy>=
    state.totalHealthy &&
    dist(
      p.x,
      p.y,
      state.exit.x,
      state.exit.y
    )<22
  ){

    levelComplete();
  }

  // ---------- ENEMY COLLISION ----------
  for(const e of state.enemies){

    if(
      dist(
        p.x,
        p.y,
        e.x,
        e.y
      ) <
      (p.radius*state.size+
       e.radius-3)
    ){

      if(state.shield){

        state.shield=false;
        state.powerupType=null;

        e.angry=50;

        spawnParticles(
          p.x,
          p.y,
          '#3b82f6',
          25,
          5,
          35
        );

        spawnRing(
          p.x,
          p.y,
          '#93c5fd',
          16
        );

      }else{

        playerHit();
      }

      break;
    }
  }
}

// ---------- POWERUPS ----------
function activatePowerup(pu){

  state.powerupType=pu.type;
  state.powerupTimer=pu.duration;

  if(pu.type==='shield'){

    state.shield=true;

  }

  else if(pu.type==='cleanse'){

    state.balance=
      Math.min(
        100,
        state.balance+35
      );

    state.size=
      Math.max(
        0.72,
        state.size-0.25
      );

    updateSpeedFromBalance();

    state.powerupType=null;

    spawnParticles(
      state.player.x,
      state.player.y,
      '#4ade80',
      30,
      4,
      40
    );

  }

  else if(pu.type==='multiplier'){

    state.multiplier=2;
  }

  updateHUD();
}

// ---------- PLAYER HIT ----------
function playerHit(){

  state.lives--;

  updateHUD();

  spawnParticles(
    state.player.x,
    state.player.y,
    '#ef4444',
    28,
    5,
    40
  );

  spawnRing(
    state.player.x,
    state.player.y,
    '#fca5a5',
    18
  );

  if(state.lives<=0){

    gameOver(
      '¡Te atraparon!',
      'Los enemigos te vieron y te alcanzaron. ¡Mantén el equilibrio y usa los pasillos!'
    );

  }else{

    const lvl=LEVELS[state.level];

    for(let y=0;y<ROWS;y++){

      for(let x=0;x<COLS;x++){

        if(lvl.map[y][x]===3){

          state.player.x=
            x*TILE+TILE/2;

          state.player.y=
            y*TILE+TILE/2;

          state.player.dir={
            x:0,
            y:0
          };

          state.player.trail=[];

          // ESCUDO MÁS LARGO DESPUÉS DE RECIBIR DAÑO
          state.shield=true;
          state.powerupType='shield';
          state.powerupTimer=3000;

          return;
        }
      }
    }
  }
}

// ---------- ENEMY AI ----------
function updateEnemies(dt){

  const p=state.player;

  for(const e of state.enemies){

    e.timer+=dt;
    e.wobble+=0.16;

    if(e.angry>0)
      e.angry--;

    const d=
      dist(
        e.x,
        e.y,
        p.x,
        p.y
      );

    const canSee=
      d<e.vision &&
      hasLineOfSight(
        e.x,
        e.y,
        p.x,
        p.y
      );

    e.seesPlayer=canSee;

    if(canSee){

      e.alertTimer=
        Math.min(
          20,
          e.alertTimer+1
        );

      e.alertScale=
        lerp(
          e.alertScale,
          1.12,
          0.2
        );

    }else{

      e.alertTimer=
        Math.max(
          0,
          e.alertTimer-1.5
        );

      e.alertScale=
        lerp(
          e.alertScale,
          1,
          0.1
        );
    }

    const aggressive=
      canSee ||
      e.alertTimer>8 ||
      e.angry>0;

    // ---------- ROKO ----------
    if(e.type==='roko'){

      if(aggressive){

        const dx=p.x-e.x;
        const dy=p.y-e.y;

        const len=
          Math.hypot(dx,dy)||1;

        // MÁS LENTO AL PERSEGUIR
        let spd=
          e.speed*
          (d<140?1.08:0.92);

        if(e.angry)
          spd*=1.2;

        tryMoveEnemy(
          e,
          (dx/len)*spd,
          (dy/len)*spd
        );

      }else{

        if(e.timer>1.6){

          e.timer=0;

          const dirs=[
            {x:1,y:0},
            {x:-1,y:0},
            {x:0,y:1},
            {x:0,y:-1}
          ];

          e.dir=
            dirs[
              randInt(0,3)
            ];
        }

        tryMoveEnemy(
          e,
          e.dir.x*
          e.speed*0.32,

          e.dir.y*
          e.speed*0.32
        );
      }
    }

    // ---------- BOMBO ----------
    else if(e.type==='bombo'){

      if(
        e.timer>0.8 ||
        (e.dir.x===0 &&
         e.dir.y===0)
      ){

        e.timer=0;

        if(
          aggressive &&
          Math.random()<0.4
        ){

          const dx=p.x-e.x;
          const dy=p.y-e.y;

          if(
            Math.abs(dx)>
            Math.abs(dy)
          ){

            e.dir={
              x:Math.sign(dx),
              y:0
            };

          }else{

            e.dir={
              x:0,
              y:Math.sign(dy)
            };
          }

        }else{

          const dirs=[
            {x:1,y:0},
            {x:-1,y:0},
            {x:0,y:1},
            {x:0,y:-1}
          ];

          e.dir=
            dirs[
              randInt(0,3)
            ];
        }
      }

      const spd=
        aggressive?
        e.speed*0.85:
        e.speed*0.45;

      tryMoveEnemy(
        e,
        e.dir.x*spd,
        e.dir.y*spd
      );
    }

    // ---------- CHISPA ----------
    else if(e.type==='chispa'){

      if(e.timer>0.3){

        e.timer=0;

        if(aggressive){

          const dx=p.x-e.x;
          const dy=p.y-e.y;

          if(
            Math.abs(dx)>
            Math.abs(dy)
          ){

            e.dir={
              x:Math.sign(dx),
              y:0
            };

          }else{

            e.dir={
              x:0,
              y:Math.sign(dy)
            };
          }

        }else{

          const dirs=[
            {x:1,y:0},
            {x:-1,y:0},
            {x:0,y:1},
            {x:0,y:-1}
          ];

          e.dir=
            dirs[
              randInt(0,3)
            ];
        }
      }

      const spd=
        aggressive?
        e.speed*0.95:
        e.speed*0.55;

      tryMoveEnemy(
        e,
        e.dir.x*spd,
        e.dir.y*spd
      );
    }

    // ---------- TRAGA ----------
    else if(e.type==='traga'){

      if(
        !e.patrolTarget ||
        dist(
          e.x,
          e.y,
          e.patrolTarget.x,
          e.patrolTarget.y
        )<16
      ){

        if(
          aggressive &&
          Math.random()<0.5
        ){

          e.patrolTarget={
            x:p.x,
            y:p.y
          };

        }else{

          const paths=
            getPathTiles(
              state.map
            );

          const t=
            paths[
              randInt(
                0,
                paths.length-1
              )
            ];

          e.patrolTarget={
            x:t.x*TILE+TILE/2,
            y:t.y*TILE+TILE/2
          };
        }
      }

      const dx=
        e.patrolTarget.x-e.x;

      const dy=
        e.patrolTarget.y-e.y;

      const len=
        Math.hypot(dx,dy)||1;

      const spd=
        aggressive?
        e.speed*0.9:
        e.speed*0.45;

      tryMoveEnemy(
        e,
        (dx/len)*spd,
        (dy/len)*spd
      );
    }
  }
}

// ---------- ENEMY MOVEMENT ----------
function tryMoveEnemy(e,vx,vy){

  const nx=e.x+vx;
  const ny=e.y+vy;

  if(
    canMove(
      nx,
      e.y,
      e.radius
    )
  ){

    e.x=nx;

  }else{

    e.dir.x*=-1;
    e.timer=99;
  }

  if(
    canMove(
      e.x,
      ny,
      e.radius
    )
  ){

    e.y=ny;

  }else{

    e.dir.y*=-1;
    e.timer=99;
  }
}

// ---------- PARTICLES ----------
function updateParticles(){

  for(
    let i=state.particles.length-1;
    i>=0;
    i--
  ){

    const p=state.particles[i];

    p.x+=p.vx;
    p.y+=p.vy;

    p.vy+=p.gravity||0.08;

    p.life--;

    if(p.life<=0)
      state.particles.splice(i,1);
  }
}

// ============================================================
// DRAW
// ============================================================

function drawWall3D(x,y,theme){

  const px=x*TILE;
  const py=y*TILE;

  const h=WALL_H;

  ctx.fillStyle=theme.wallSide;

  ctx.fillRect(
    px,
    py+TILE-4,
    TILE,
    h
  );

  ctx.fillStyle=theme.wall;

  ctx.fillRect(
    px,
    py-h+4,
    TILE,
    TILE+h-4
  );

  ctx.fillStyle=theme.wallTop;

  ctx.beginPath();

  ctx.moveTo(
    px,
    py-h+4
  );

  ctx.lineTo(
    px+TILE,
    py-h+4
  );

  ctx.lineTo(
    px+TILE-3,
    py-h+10
  );

  ctx.lineTo(
    px+3,
    py-h+10
  );

  ctx.closePath();

  ctx.fill();

  ctx.strokeStyle=
    theme.wallEdge;

  ctx.globalAlpha=
    0.4+
    state.wallPulse*0.2;

  ctx.lineWidth=1.5;

  ctx.strokeRect(
    px+1,
    py-h+5,
    TILE-2,
    TILE+h-8
  );

  ctx.globalAlpha=1;

  ctx.fillStyle=
    'rgba(255,255,255,0.08)';

  ctx.fillRect(
    px+3,
    py-h+6,
    TILE-6,
    3
  );
}

// ---------- DRAW ----------
function draw(){

  const theme=
    state.theme ||
    THEMES.blue;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  state.wallPulse=
    0.5+
    0.5*
    Math.sin(
      state.time*0.004
    );

  ctx.fillStyle=
    theme.ambient;

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  // ---------- FLOOR ----------
  for(let y=0;y<ROWS;y++){

    for(let x=0;x<COLS;x++){

      if(state.map[y][x]===1)
        continue;

      const px=x*TILE;
      const py=y*TILE;

      const base=
        (x+y)%2===0?
        theme.path:
        theme.pathAlt;

      ctx.fillStyle=base;

      ctx.fillRect(
        px,
        py,
        TILE,
        TILE
      );

      ctx.fillStyle=
        theme.pathLight;

      ctx.globalAlpha=0.12;

      ctx.fillRect(
        px+6,
        py+6,
        TILE-12,
        TILE-12
      );

      ctx.globalAlpha=1;

      if(
        (x*3+y*7)%5===0
      ){

        ctx.beginPath();

        ctx.arc(
          px+TILE/2,
          py+TILE/2,
          1.3,
          0,
          Math.PI*2
        );

        ctx.fillStyle=
          theme.wallGlow;

        ctx.fill();
      }
    }
  }

  // ---------- WALLS ----------
  for(let y=0;y<ROWS;y++){

    for(let x=0;x<COLS;x++){

      if(state.map[y][x]===1){

        drawWall3D(
          x,
          y,
          theme
        );
      }
    }
  }

  // ---------- EXIT ----------
  const exitReady=
    state.collectedHealthy>=
    state.totalHealthy;

  state.exitPulse=
    0.5+
    0.5*
    Math.sin(
      state.time*0.008
    );

  if(exitReady){

    const r=
      18+
      state.exitPulse*12;

    const grd=
      ctx.createRadialGradient(
        state.exit.x,
        state.exit.y,
        3,
        state.exit.x,
        state.exit.y,
        r+14
      );

    grd.addColorStop(
      0,
      theme.accent
    );

    grd.addColorStop(
      0.45,
      theme.wallGlow
    );

    grd.addColorStop(
      1,
      'transparent'
    );

    ctx.fillStyle=grd;

    ctx.beginPath();

    ctx.arc(
      state.exit.x,
      state.exit.y,
      r+14,
      0,
      Math.PI*2
    );

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
      state.exit.x,
      state.exit.y,
      13+
      state.exitPulse*5,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      theme.accent;

    ctx.globalAlpha=
      0.75+
      state.exitPulse*0.25;

    ctx.fill();

    ctx.globalAlpha=1;

    ctx.save();

    ctx.translate(
      state.exit.x,
      state.exit.y
    );

    ctx.rotate(
      state.time*0.004
    );

    ctx.strokeStyle=
      theme.accent;

    ctx.lineWidth=2;

    ctx.globalAlpha=0.6;

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      20+
      state.exitPulse*3,
      0,
      Math.PI*1.3
    );

    ctx.stroke();

    ctx.restore();

    ctx.globalAlpha=1;

    ctx.font='26px serif';

    ctx.textAlign='center';
    ctx.textBaseline='middle';

    ctx.fillText(
      '🚪',
      state.exit.x,
      state.exit.y
    );

  }else{

    ctx.globalAlpha=0.28;

    ctx.font='20px serif';

    ctx.textAlign='center';
    ctx.textBaseline='middle';

    ctx.fillText(
      '🚪',
      state.exit.x,
      state.exit.y
    );

    ctx.globalAlpha=1;
  }

  // ---------- FOODS ----------
  for(const f of state.foods){

    if(f.collected){

      if(f.collectAnim>0){

        f.collectAnim--;

        const s=
          1+
          (20-f.collectAnim)*0.09;

        ctx.globalAlpha=
          f.collectAnim/20;

        ctx.font=
          `${20*s}px serif`;

        ctx.textAlign='center';
        ctx.textBaseline='middle';

        ctx.fillText(
          f.emoji,
          f.x,
          f.y-
          (20-f.collectAnim)*1.6
        );

        ctx.globalAlpha=1;
      }

      continue;
    }

    const bobY=
      Math.sin(
        state.time*0.006+
        f.bob
      )*3.8;

    const scale=
      1+
      0.09*
      Math.sin(
        state.time*0.005+
        f.bob
      );

    ctx.save();

    ctx.translate(
      f.x,
      f.y+bobY
    );

    ctx.scale(
      scale,
      scale
    );

    if(f.type==='healthy'){

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        12,
        0,
        Math.PI*2
      );

      ctx.fillStyle=
        'rgba(74,222,128,0.18)';

      ctx.fill();
    }

    ctx.beginPath();

    ctx.ellipse(
      0,
      8,
      8,
      3,
      0,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      'rgba(0,0,0,0.25)';

    ctx.fill();

    ctx.font='22px serif';

    ctx.textAlign='center';
    ctx.textBaseline='middle';

    ctx.fillText(
      f.emoji,
      0,
      0
    );

    ctx.restore();
  }

  // ---------- POWERUPS ----------
  for(const pu of state.powerups){

    if(pu.collected)
      continue;

    const bobY=
      Math.sin(
        state.time*0.007+
        pu.bob
      )*5;

    const scale=
      1+
      0.16*
      Math.sin(
        state.time*0.01+
        pu.bob
      );

    ctx.save();

    ctx.translate(
      pu.x,
      pu.y+bobY
    );

    ctx.scale(
      scale,
      scale
    );

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      15,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      'rgba(251,191,36,0.22)';

    ctx.fill();

    ctx.font='25px serif';

    ctx.textAlign='center';
    ctx.textBaseline='middle';

    ctx.fillText(
      pu.emoji,
      0,
      0
    );

    ctx.restore();
  }

  // ---------- ENEMIES ----------
  for(const e of state.enemies){

    const wob=
      Math.sin(e.wobble)*1.8;

    const sc=
      e.alertScale*
      (e.angry>0?1.12:1);

    ctx.beginPath();

    ctx.ellipse(
      e.x,
      e.y+e.radius*0.8,
      e.radius*0.7*sc,
      e.radius*0.24,
      0,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      'rgba(0,0,0,0.35)';

    ctx.fill();

    ctx.beginPath();

    ctx.arc(
      e.x,
      e.y+wob*0.35,
      e.radius*sc,
      0,
      Math.PI*2
    );

    ctx.fillStyle=e.color;

    ctx.fill();

    if(
      e.seesPlayer ||
      e.alertTimer>8
    ){

      ctx.beginPath();

      ctx.arc(
        e.x,
        e.y+wob*0.35,
        e.radius*sc+5,
        0,
        Math.PI*2
      );

      ctx.strokeStyle=
        `rgba(255,80,80,${
          0.35+
          0.3*
          Math.sin(
            state.time*0.02
          )
        })`;

      ctx.lineWidth=2.5;

      ctx.stroke();

      ctx.font=
        'bold 14px sans-serif';

      ctx.fillStyle='#ef4444';

      ctx.textAlign='center';

      ctx.fillText(
        '!',
        e.x,
        e.y-
        e.radius*sc-
        10+
        Math.sin(
          state.time*0.02
        )*2
      );
    }

    if(e.angry>0){

      ctx.strokeStyle=
        `rgba(255,255,255,${
          e.angry/50
        })`;

      ctx.lineWidth=3;

      ctx.stroke();
    }

    const lookX=
      Math.sign(
        state.player.x-e.x
      )*2;

    const lookY=
      Math.sign(
        state.player.y-e.y
      )*1.6;

    ctx.fillStyle='#fff';

    ctx.beginPath();

    ctx.arc(
      e.x-4.5,
      e.y-3+wob*0.2,
      4.3,
      0,
      Math.PI*2
    );

    ctx.arc(
      e.x+4.5,
      e.y-3+wob*0.2,
      4.3,
      0,
      Math.PI*2
    );

    ctx.fill();

    ctx.fillStyle='#111';

    ctx.beginPath();

    ctx.arc(
      e.x-4.5+lookX,
      e.y-3+lookY+wob*0.2,
      2.2,
      0,
      Math.PI*2
    );

    ctx.arc(
      e.x+4.5+lookX,
      e.y-3+lookY+wob*0.2,
      2.2,
      0,
      Math.PI*2
    );

    ctx.fill();

    if(
      e.seesPlayer ||
      e.alertTimer>8
    ){

      ctx.fillStyle='#fff';

      ctx.beginPath();

      ctx.moveTo(
        e.x-6,
        e.y+5
      );

      ctx.lineTo(
        e.x-2.5,
        e.y+10
      );

      ctx.lineTo(
        e.x+1,
        e.y+5
      );

      ctx.lineTo(
        e.x+4.5,
        e.y+10
      );

      ctx.lineTo(
        e.x+8,
        e.y+5
      );

      ctx.fill();
    }
  }

  // ---------- PLAYER ----------
  const p=state.player;

  const r=
    p.radius*
    state.size*
    p.landSquash;

  // TRAIL
  for(let i=0;i<p.trail.length;i++){

    const t=p.trail[i];

    ctx.globalAlpha=
      (t.life/14)*0.3;

    ctx.beginPath();

    ctx.arc(
      t.x,
      t.y,
      r*0.65,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      currentSkin.color;

    ctx.fill();
  }

  ctx.globalAlpha=1;

  if(state.exploding){

    const t=
      state.explodeTimer;

    const grow=
      1+t*0.09;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      r*grow,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      `rgba(251,191,36,${
        Math.max(
          0,
          1-t/65
        )
      })`;

    ctx.fill();

    if(t>25){

      ctx.font=
        `${28+t*0.8}px serif`;

      ctx.textAlign='center';

      ctx.fillText(
        '💥',
        p.x,
        p.y
      );
    }

  }else{

    const drawY=
      p.y+p.bob;

    // SHADOW
    ctx.beginPath();

    ctx.ellipse(
      p.x,
      p.y+r*0.85,
      r*0.75*(2-p.squash),
      r*0.22,
      0,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      'rgba(0,0,0,0.35)';

    ctx.fill();

    ctx.save();

    ctx.translate(
      p.x,
      drawY
    );

    ctx.scale(
      p.squash*
      (p.facing>=0?1:-1),
      2-p.squash
    );

    ctx.rotate(
      p.lean*p.facing
    );

    const grd=
      ctx.createRadialGradient(
        -r*0.3,
        -r*0.35,
        r*0.1,
        0,
        0,
        r*1.1
      );

    grd.addColorStop(
      0,
      lighten(
        currentSkin.color,
        40
      )
    );

    grd.addColorStop(
      0.55,
      currentSkin.color
    );

    grd.addColorStop(
      1,
      darken(
        currentSkin.color,
        35
      )
    );

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      r,
      0,
      Math.PI*2
    );

    ctx.fillStyle=grd;

    ctx.fill();

    // HIGHLIGHT
    ctx.beginPath();

    ctx.arc(
      -r*0.28,
      -r*0.32,
      r*0.28,
      0,
      Math.PI*2
    );

    ctx.fillStyle=
      'rgba(255,255,255,0.22)';

    ctx.fill();

    // SHIELD
    if(state.shield){

      ctx.beginPath();

      ctx.arc(
        0,
        0,
        r+
        6+
        Math.sin(
          state.time*0.014
        )*2.5,
        0,
        Math.PI*2
      );

      ctx.strokeStyle=
        `rgba(59,130,246,${
          0.5+
          0.3*
          Math.sin(
            state.time*0.012
          )
        })`;

      ctx.lineWidth=3.5;

      ctx.stroke();
    }

    // EYES
    const eyeY=
      p.blinking>0?
      0:
      -r*0.12;

    const eyeH=
      p.blinking>0?
      1.2:
      r*0.2;

    ctx.fillStyle='#fff';

    ctx.beginPath();

    ctx.ellipse(
      r*0.22,
      eyeY-r*0.08,
      r*0.18,
      eyeH,
      0,
      0,
      Math.PI*2
    );

    ctx.ellipse(
      r*0.22,
      eyeY+r*0.18,
      r*0.18,
      eyeH,
      0,
      0,
      Math.PI*2
    );

    ctx.fill();

    if(p.blinking<=0){

      ctx.fillStyle='#111';

      ctx.beginPath();

      ctx.arc(
        r*0.28,
        -r*0.2,
        r*0.09,
        0,
        Math.PI*2
      );

      ctx.arc(
        r*0.28,
        r*0.16,
        r*0.09,
        0,
        Math.PI*2
      );

      ctx.fill();
    }

    // MOUTH
    ctx.strokeStyle='#111';

    ctx.lineWidth=1.7;

    ctx.lineCap='round';

    if(state.balance>=55){

      ctx.beginPath();

      ctx.arc(
        r*0.08,
        r*0.05,
        r*0.26,
        0.3,
        Math.PI-0.3
      );

      ctx.stroke();

    }else if(state.balance<30){

      ctx.beginPath();

      ctx.arc(
        r*0.08,
        r*0.25,
        r*0.2,
        Math.PI+0.3,
        -0.3
      );

      ctx.stroke();

    }else{

      ctx.beginPath();

      ctx.moveTo(
        r*0.0,
        r*0.18
      );

      ctx.lineTo(
        r*0.22,
        r*0.18
      );

      ctx.stroke();
    }

    // ARMS
    ctx.strokeStyle=
      darken(
        currentSkin.color,
        20
      );

    ctx.lineWidth=3.2;

    ctx.lineCap='round';

    const arm=
      p.armSwing;

    ctx.beginPath();

    ctx.moveTo(
      -r*0.55,
      r*0.1
    );

    ctx.quadraticCurveTo(
      -r*0.9,
      r*0.1+
      arm*r*0.6,
      -r*0.7,
      r*0.45+
      arm*r*0.4
    );

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(
      r*0.55,
      r*0.1
    );

    ctx.quadraticCurveTo(
      r*0.9,
      r*0.1-
      arm*r*0.6,
      r*0.7,
      r*0.45-
      arm*r*0.4
    );

    ctx.stroke();

    ctx.restore();

    // SKIN BADGE
    ctx.font=
      `${Math.max(12,r*0.75)}px serif`;

    ctx.textAlign='center';
    ctx.textBaseline='middle';

    ctx.globalAlpha=0.92;

    ctx.fillText(
      currentSkin.emoji,
      p.x,
      drawY-r-11
    );

    ctx.globalAlpha=1;
  }

  // ---------- PARTICLES ----------
  for(const pt of state.particles){

    ctx.globalAlpha=
      Math.max(
        0,
        pt.life/pt.maxLife
      );

    ctx.beginPath();

    ctx.arc(
      pt.x,
      pt.y,
      pt.size*
      (
        pt.life/
        pt.maxLife+
        0.3
      ),
      0,
      Math.PI*2
    );

    ctx.fillStyle=pt.color;

    ctx.fill();
  }

  ctx.globalAlpha=1;

  // ---------- POWERUP BAR ----------
  if(
    state.powerupType &&
    state.powerupTimer>0
  ){

    ctx.fillStyle=
      'rgba(0,0,0,0.55)';

    ctx.beginPath();

    ctx.roundRect(
      canvas.width/2-80,
      6,
      160,
      28,
      8
    );

    ctx.fill();

    ctx.fillStyle='#fbbf24';

    ctx.font=
      'bold 13px Nunito,sans-serif';

    ctx.textAlign='center';

    const names={
      speed:'⚡ Súper Energía',
      shield:'🛡️ Escudo Activo',
      multiplier:'✨ Puntos x2'
    };

    ctx.fillText(
      names[state.powerupType]||'',
      canvas.width/2,
      24
    );
  }

  // ---------- LEVEL INTRO ----------
  if(state.levelIntroTimer>0){

    state.levelIntroTimer--;

    const alpha=
      Math.min(
        1,
        state.levelIntroTimer/30
      );

    ctx.globalAlpha=alpha;

    ctx.fillStyle=
      'rgba(0,0,0,0.6)';

    ctx.fillRect(
      0,
      canvas.height/2-42,
      canvas.width,
      84
    );

    ctx.fillStyle=
      theme.nameColor;

    ctx.font=
      'bold 28px Nunito,sans-serif';

    ctx.textAlign='center';

    ctx.fillText(
      LEVELS[state.level].name,
      canvas.width/2,
      canvas.height/2-6
    );

    ctx.fillStyle='#e2e8f0';

    ctx.font=
      '15px Nunito,sans-serif';

    ctx.fillText(
      `Nivel ${state.level+1} · ${state.enemies.length} enemigos · ¡Ocúltate de su vista!`,
      canvas.width/2,
      canvas.height/2+24
    );

    ctx.globalAlpha=1;
  }
}

// ---------- COLOR HELPERS ----------
function lighten(hex,amt){

  const c=
    parseInt(
      hex.slice(1),
      16
    );

  const r=
    Math.min(
      255,
      ((c>>16)&0xff)+amt
    );

  const g=
    Math.min(
      255,
      ((c>>8)&0xff)+amt
    );

  const b=
    Math.min(
      255,
      (c&0xff)+amt
    );

  return `rgb(${r},${g},${b})`;
}

function darken(hex,amt){

  const c=
    parseInt(
      hex.slice(1),
      16
    );

  const r=
    Math.max(
      0,
      ((c>>16)&0xff)-amt
    );

  const g=
    Math.max(
      0,
      ((c>>8)&0xff)-amt
    );

  const b=
    Math.max(
      0,
      (c&0xff)-amt
    );

  return `rgb(${r},${g},${b})`;
}

// ---------- HUD ----------
function updateHUD(){

  document.getElementById(
    'score'
  ).textContent=state.score;

  document.getElementById(
    'food-left'
  ).textContent=
    Math.max(
      0,
      state.totalHealthy-
      state.collectedHealthy
    );

  document.getElementById(
    'lives'
  ).textContent=
    state.lives;

  document.getElementById(
    'level-num'
  ).textContent=
    state.level+1;

  document.getElementById(
    'balance-bar'
  ).style.width=
    state.balance+'%';

  document.getElementById(
    'balance-label'
  ).textContent=
    getBalanceLabel();

  document.getElementById(
    'speed-val'
  ).textContent=
    Math.round(
      state.speedMult*100
    )+'%';
}

// ---------- LEVEL COMPLETE ----------
function levelComplete(){

  state.running=false;

  const elapsed=
    Math.round(
      (performance.now()-
       state.startTime)/1000
    );

  state.score+=
    Math.max(
      0,
      40-elapsed
    )*6+
    Math.floor(
      state.balance*1.5
    )+
    150;

  if(state.level>=0)
    SKINS[2].unlocked=true;

  if(state.level>=1)
    SKINS[3].unlocked=true;

  if(state.level>=2){

    SKINS[4].unlocked=true;
    SKINS[5].unlocked=true;
  }

  document.getElementById(
    'lc-score'
  ).textContent=
    state.score;

  document.getElementById(
    'lc-time'
  ).textContent=
    elapsed+'s';

  document.getElementById(
    'lc-balance'
  ).textContent=
    getBalanceLabel();

  document.getElementById(
    'level-complete'
  ).classList.remove('hidden');
}

// ---------- EDUCATION ----------
function showEduThenNext(){

  document.getElementById(
    'edu-text'
  ).textContent=
    LEVELS[state.level].edu;

  document.getElementById(
    'level-complete'
  ).classList.add('hidden');

  document.getElementById(
    'edu-card'
  ).classList.remove('hidden');
}

// ---------- NEXT LEVEL ----------
function nextLevel(){

  document.getElementById(
    'edu-card'
  ).classList.add('hidden');

  if(
    state.level+1>=
    LEVELS.length
  ){

    document.getElementById(
      'vic-score'
    ).textContent=
      state.score;

    document.getElementById(
      'victory'
    ).classList.remove('hidden');

  }else{

    initLevel(
      state.level+1
    );

    state.running=true;

    lastTime=
      performance.now();

    requestAnimationFrame(
      loop
    );
  }
}

// ---------- GAME OVER ----------
function gameOver(title,msg){

  state.running=false;

  document.getElementById(
    'go-title'
  ).textContent=title;

  document.getElementById(
    'go-msg'
  ).textContent=msg;

  document.getElementById(
    'go-score'
  ).textContent=
    state.score;

  document.getElementById(
    'game-over'
  ).classList.remove('hidden');
}

// ---------- START GAME ----------
function startGame(){

  document.getElementById(
    'start-screen'
  ).classList.add('hidden');

  document.getElementById(
    'skin-select'
  ).classList.add('hidden');

  document.getElementById(
    'hud'
  ).classList.remove('hidden');

  document.getElementById(
    'game-wrapper'
  ).classList.remove('hidden');

  document.getElementById(
    'mobile-controls'
  ).classList.remove('hidden');

  document.getElementById(
    'game-over'
  ).classList.add('hidden');

  document.getElementById(
    'victory'
  ).classList.add('hidden');

  document.getElementById(
    'level-complete'
  ).classList.add('hidden');

  document.getElementById(
    'edu-card'
  ).classList.add('hidden');

  document.getElementById(
    'pause-menu'
  ).classList.add('hidden');

  state.score=0;

  // MÁS VIDAS
  state.lives=5;

  initLevel(0);

  state.running=true;
  state.paused=false;

  lastTime=
    performance.now();

  requestAnimationFrame(
    loop
  );
}

// ---------- LOOP ----------
let lastTime=0;

function loop(now){

  if(
    !state.running &&
    !state.exploding
  ){
    return;
  }

  requestAnimationFrame(loop);

  const dt=
    Math.min(
      (now-lastTime)/1000,
      0.05
    );

  lastTime=now;

  state.time=now;

  if(state.paused){

    draw();

    return;
  }

  if(state.exploding){

    state.explodeTimer++;

    updateParticles();

    draw();

    if(
      state.explodeTimer>75
    ){

      gameOver(
        '¡Demasiada comida chatarra!',
        '¡Inténtalo de nuevo y busca un mejor equilibrio!'
      );
    }

    return;
  }

  if(state.powerupTimer>0){

    state.powerupTimer-=
      dt*1000;

    if(
      state.powerupTimer<=0
    ){

      if(
        state.powerupType===
        'multiplier'
      ){
        state.multiplier=1;
      }

      if(
        state.powerupType===
        'shield'
      ){
        state.shield=false;
      }

      state.powerupType=null;
    }
  }

  updatePlayer(dt);

  updateEnemies(dt);

  updateParticles();

  draw();
}

// ---------- UI ----------
document.getElementById(
  'btn-start'
).onclick=startGame;

document.getElementById(
  'btn-retry'
).onclick=startGame;

document.getElementById(
  'btn-victory-restart'
).onclick=startGame;

document.getElementById(
  'btn-go-menu'
).onclick=()=>{

  document.getElementById(
    'game-over'
  ).classList.add('hidden');

  document.getElementById(
    'hud'
  ).classList.add('hidden');

  document.getElementById(
    'game-wrapper'
  ).classList.add('hidden');

  document.getElementById(
    'mobile-controls'
  ).classList.add('hidden');

  document.getElementById(
    'start-screen'
  ).classList.remove('hidden');
};

document.getElementById(
  'btn-next'
).onclick=
  showEduThenNext;

document.getElementById(
  'btn-edu-ok'
).onclick=
  nextLevel;

document.getElementById(
  'btn-pause'
).onclick=()=>{

  state.paused=true;

  document.getElementById(
    'pause-menu'
  ).classList.remove('hidden');
};

document.getElementById(
  'btn-resume'
).onclick=()=>{

  state.paused=false;

  document.getElementById(
    'pause-menu'
  ).classList.add('hidden');

  lastTime=
    performance.now();
};

document.getElementById(
  'btn-restart'
).onclick=()=>{

  document.getElementById(
    'pause-menu'
  ).classList.add('hidden');

  state.paused=false;

  initLevel(
    state.level
  );

  state.running=true;

  lastTime=
    performance.now();

  requestAnimationFrame(
    loop
  );
};

document.getElementById(
  'btn-quit'
).onclick=()=>{

  state.running=false;
  state.paused=false;

  document.getElementById(
    'pause-menu'
  ).classList.add('hidden');

  document.getElementById(
    'hud'
  ).classList.add('hidden');

  document.getElementById(
    'game-wrapper'
  ).classList.add('hidden');

  document.getElementById(
    'mobile-controls'
  ).classList.add('hidden');

  document.getElementById(
    'start-screen'
  ).classList.remove('hidden');
};

// ---------- SKINS ----------
document.getElementById(
  'btn-skins'
).onclick=()=>{

  document.getElementById(
    'start-screen'
  ).classList.add('hidden');

  renderSkinGrid();

  document.getElementById(
    'skin-select'
  ).classList.remove('hidden');
};

document.getElementById(
  'btn-skin-back'
).onclick=()=>{

  document.getElementById(
    'skin-select'
  ).classList.add('hidden');

  document.getElementById(
    'start-screen'
  ).classList.remove('hidden');
};

function renderSkinGrid(){

  const grid=
    document.getElementById(
      'skin-grid'
    );

  grid.innerHTML='';

  SKINS.forEach(s=>{

    const card=
      document.createElement('div');

    card.className=
      'skin-card'+
      (
        s.id===currentSkin.id?
        ' selected':
        ''
      );

    card.innerHTML=`
      <span class="skin-emoji">
        ${s.emoji}
      </span>

      <div>
        ${s.name}
      </div>

      <div style="
        font-size:0.75rem;
        color:${s.unlocked?'#22c55e':'#94a3b8'}
      ">
        ${
          s.unlocked?
          'Disponible':
          '🔒 Bloqueado'
        }
      </div>
    `;

    if(s.unlocked){

      card.onclick=()=>{

        currentSkin=s;

        renderSkinGrid();
      };
    }

    grid.appendChild(card);
  });
}

// ---------- CANVAS ----------
function fitCanvas(){

  const maxW=
    Math.min(
      720,
      window.innerWidth-16
    );

  const scale=
    maxW/720;

  canvas.style.width=
    maxW+'px';

  canvas.style.height=
    (560*scale)+'px';
}

window.addEventListener(
  'resize',
  fitCanvas
);

fitCanvas();

document.body.addEventListener(
  'touchmove',
  e=>{

    if(
      e.target.closest('.dpad') ||
      e.target.tagName==='CANVAS'
    ){
      e.preventDefault();
    }

  },
  {passive:false}
);