"use strict";

/* =========================================================
   MONEY RUNNER
   Juego educativo de administración del dinero
   — Versión corregida: salto corto, ítems funcionales, más animaciones
========================================================= */


/* =========================================================
   UTILIDADES
========================================================= */

const $ = (id) => document.getElementById(id);

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    return Math.floor(random(min, max + 1));
}


/* =========================================================
   CANVAS
========================================================= */

const canvas = $("gameCanvas");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;

function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;

function initAudio() {

    if (!audioContext) {
        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (AudioContext) {
            audioContext = new AudioContext();
        }
    }

    if (audioContext && audioContext.state === "suspended") {
        audioContext.resume();
    }
}

function sound(type) {

    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    let frequency = 400;
    let duration = .08;
    let wave = "sine";

    switch (type) {

        case "coin":
            frequency = 850;
            duration = .09;
            wave = "triangle";
            break;

        case "jump":
            frequency = 520;
            duration = .07;
            wave = "sine";
            break;

        case "hit":
            frequency = 100;
            duration = .18;
            wave = "sawtooth";
            break;

        case "buy":
            frequency = 600;
            duration = .12;
            wave = "triangle";
            break;

        case "power":
            frequency = 700;
            duration = .18;
            wave = "square";
            break;

        case "mission":
            frequency = 1000;
            duration = .2;
            wave = "triangle";
            break;

        case "level":
            frequency = 880;
            duration = .25;
            wave = "square";
            break;
    }

    oscillator.type = wave;

    oscillator.frequency.setValueAtTime(
        frequency,
        now
    );

    oscillator.frequency.exponentialRampToValueAtTime(
        frequency * .65,
        now + duration
    );

    gain.gain.setValueAtTime(.0001, now);

    gain.gain.exponentialRampToValueAtTime(
        .08,
        now + .01
    );

    gain.gain.exponentialRampToValueAtTime(
        .0001,
        now + duration
    );

    oscillator.start(now);
    oscillator.stop(now + duration + .02);
}


/* =========================================================
   DATA DEL JUGADOR
========================================================= */

const defaultSave = {
    money: 500,
    saving: 0,
    bestDistance: 0,
    totalCoins: 0,
    purchased: {},
    statistics: {
        needs: 0,
        wants: 0,
        saving: 0
    }
};

let saveData = loadSave();

function loadSave() {

    try {

        const stored =
            localStorage.getItem("moneyRunnerSave");

        if (!stored) {
            return structuredClone(defaultSave);
        }

        const parsed = JSON.parse(stored);

        return {
            ...structuredClone(defaultSave),
            ...parsed,
            statistics: {
                ...defaultSave.statistics,
                ...(parsed.statistics || {})
            },
            purchased: parsed.purchased || {}
        };

    } catch (error) {

        console.warn(
            "No se pudo cargar la partida.",
            error
        );

        return structuredClone(defaultSave);
    }
}

function saveGame() {

    try {

        localStorage.setItem(
            "moneyRunnerSave",
            JSON.stringify(saveData)
        );

    } catch (error) {

        console.warn(
            "No se pudo guardar la partida.",
            error
        );
    }
}


/* =========================================================
   OBJETOS DE LA TIENDA  (con efectos reales)
========================================================= */

const shopItems = [

    {
        id: "backpack",
        name: "Mochila",
        icon: "🎒",
        price: 100,
        category: "utility",
        type: "need",
        description: "Una compra útil para tus estudios.",
        effect: "Magnetismo de monedas +20% y +1 monedas extra al recoger.",
        gameplay: "backpack"
    },

    {
        id: "shoes",
        name: "Zapatillas",
        icon: "👟",
        price: 200,
        category: "utility",
        type: "need",
        description: "Un artículo útil para tu día a día.",
        effect: "Salto más alto y deslizamiento más largo.",
        gameplay: "shoes"
    },

    {
        id: "notebook",
        name: "Cuaderno",
        icon: "📚",
        price: 60,
        category: "utility",
        type: "need",
        description: "Material necesario para estudiar.",
        effect: "Misiones dan +50 Bs extra al completarse.",
        gameplay: "notebook"
    },

    {
        id: "headphones",
        name: "Audífonos",
        icon: "🎧",
        price: 350,
        category: "fun",
        type: "want",
        description: "Un artículo para entretenimiento.",
        effect: "Velocidad máxima +0.15 (más difícil pero más monedas).",
        gameplay: "headphones"
    },

    {
        id: "console",
        name: "Consola",
        icon: "🎮",
        price: 900,
        category: "fun",
        type: "want",
        description: "Un gran gasto de entretenimiento.",
        effect: "Al inicio: 5 segundos de ×2 monedas (pero cuesta mucho).",
        gameplay: "console"
    },

    {
        id: "burger",
        name: "Hamburguesa",
        icon: "🍔",
        price: 45,
        category: "fun",
        type: "want",
        description: "Una comida ocasional.",
        effect: "Escudo de emergencia: se consume al chocar (guarda 1 vida).",
        gameplay: "burger"
    },

    {
        id: "shield",
        name: "Escudo financiero",
        icon: "🛡️",
        price: 250,
        category: "power",
        type: "utility",
        description: "Protege al jugador de un choque.",
        effect: "Inicia la carrera con escudo activo 12 s.",
        gameplay: "shield"
    },

    {
        id: "magnet",
        name: "Imán de monedas",
        icon: "🧲",
        price: 300,
        category: "power",
        type: "utility",
        description: "Atrae monedas cercanas.",
        effect: "Inicia la carrera con imán activo 10 s.",
        gameplay: "magnet"
    },

    {
        id: "double",
        name: "Multiplicador ×2",
        icon: "⚡",
        price: 400,
        category: "power",
        type: "utility",
        description: "Duplica las monedas durante un tiempo.",
        effect: "Inicia la carrera con ×2 monedas 8 s.",
        gameplay: "double"
    }
];


/* =========================================================
   ESTADO DEL JUEGO
========================================================= */

let gameRunning = false;
let gamePaused = false;

let animationId = null;
let lastTime = 0;

let distance = 0;
let runMoney = 0;
let runCoins = 0;

let speed = 0.55;
let maxSpeed = 1.4;
let baseMaxSpeed = 1.4;

let spawnTimer = 0;
let coinTimer = 0;
let powerTimer = 0;

let difficultyTimer = 0;
let level = 1;

let obstacles = [];
let coins = [];
let particles = [];
let buildings = [];
let powerUps = [];

let currentMission = null;

let shieldActive = false;
let magnetActive = false;
let doubleActive = false;

let shieldTimer = 0;
let magnetTimer = 0;
let doubleTimer = 0;

/* Bonos de ítems comprados (se aplican al inicio de carrera) */
let bonusMagnetRange = 180;
let bonusCoinValue = 10;
let bonusJumpHeight = 95;
let bonusSlideDuration = 0.55;
let bonusMissionReward = 100;
let bankedBurgers = 0;


/* =========================================================
   JUGADOR
========================================================= */

const player = {

    lane: 1,
    targetLane: 1,
    x: 0,
    y: 0,
    width: 38,
    height: 65,
    baseY: 0,

    jumping: false,
    sliding: false,

    jumpTime: 0,
    /* Salto más corto y ágil */
    jumpDuration: 0.42,
    jumpHeight: 95,

    slideTime: 0,
    slideDuration: 0.55,

    runAnimation: 0,

    /* Animación de aterrizaje */
    landSquash: 0
};


/* =========================================================
   CARRILES
========================================================= */

function roadMetrics() {

    const roadWidth =
        Math.min(W * .65, 650);

    const left =
        W / 2 - roadWidth / 2;

    const laneWidth =
        roadWidth / 3;

    return {
        roadWidth,
        left,
        laneWidth
    };
}

function laneX(lane) {

    const road = roadMetrics();

    return road.left +
        road.laneWidth * lane +
        road.laneWidth / 2;
}


/* =========================================================
   MISIONES
========================================================= */

const missions = [

    {
        id: "coins",
        title: "RECOLECTA MONEDAS",
        text: "Recolecta 20 monedas",
        target: 20
    },

    {
        id: "distance",
        title: "LLEGAR LEJOS",
        text: "Recorre 800 metros",
        target: 800
    },

    {
        id: "saving",
        title: "PIENSA EN EL FUTURO",
        text: "Ahorra Bs 200",
        target: 200
    },

    {
        id: "coins2",
        title: "INGRESOS INTELIGENTES",
        text: "Consigue 50 monedas",
        target: 50
    }

];

function chooseMission() {

    currentMission =
        missions[
            randomInt(0, missions.length - 1)
        ];

    currentMission.completed = false;

    updateMissionUI();
}

function missionProgress() {

    if (!currentMission) return 0;

    let value = 0;

    switch (currentMission.id) {

        case "coins":
        case "coins2":
            value = runCoins;
            break;

        case "distance":
            value = distance;
            break;

        case "saving":
            value = saveData.saving;
            break;
    }

    return clamp(
        value / currentMission.target,
        0,
        1
    );
}

function updateMissionUI() {

    if (!currentMission) return;

    $("missionTitle").textContent =
        currentMission.title;

    $("missionText").textContent =
        currentMission.text;

    const progress =
        missionProgress();

    $("missionCount").textContent =
        `${Math.min(
            Math.floor(
                progress * currentMission.target
            ),
            currentMission.target
        )}/${currentMission.target}`;

    $("missionProgressBar").style.width =
        `${progress * 100}%`;

    if (progress >= 1) {

        if (!currentMission.completed) {

            currentMission.completed = true;

            completeMission();
        }
    }
}

function completeMission() {

    const reward = bonusMissionReward;

    saveData.saving += reward;
    saveData.statistics.saving += reward;

    saveGame();

    sound("mission");

    createParticles(
        W / 2,
        H * 0.3,
        "#35e59a",
        20
    );

    showToast(
        "🎯 Misión completada",
        `+Bs ${reward} enviados a tu ahorro`
    );

    setTimeout(() => {

        chooseMission();

    }, 1200);
}


/* =========================================================
   APLICAR BONOS DE ÍTEMS COMPRADOS
========================================================= */

function applyOwnedBonuses() {

    /* Reset a valores base */
    bonusMagnetRange = 180;
    bonusCoinValue = 10;
    bonusJumpHeight = 95;
    bonusSlideDuration = 0.55;
    bonusMissionReward = 100;
    maxSpeed = baseMaxSpeed;
    bankedBurgers = 0;

    const p = saveData.purchased;

    /* Mochila: magnetismo más fuerte + monedas extra */
    if ((p.backpack || 0) > 0) {
        const n = Math.min(p.backpack, 5);
        bonusMagnetRange = 180 + n * 40;
        bonusCoinValue = 10 + n * 2;
    }

    /* Zapatillas: salto y slide mejores */
    if ((p.shoes || 0) > 0) {
        const n = Math.min(p.shoes, 3);
        bonusJumpHeight = 95 + n * 18;
        bonusSlideDuration = 0.55 + n * 0.12;
    }

    /* Cuaderno: misiones más rentables */
    if ((p.notebook || 0) > 0) {
        const n = Math.min(p.notebook, 5);
        bonusMissionReward = 100 + n * 50;
    }

    /* Audífonos: más velocidad máxima */
    if ((p.headphones || 0) > 0) {
        const n = Math.min(p.headphones, 2);
        maxSpeed = baseMaxSpeed + n * 0.15;
    }

    /* Hamburguesas: escudos de emergencia */
    bankedBurgers = p.burger || 0;

    /* Aplicar al jugador */
    player.jumpHeight = bonusJumpHeight;
    player.slideDuration = bonusSlideDuration;

    /* Power-ups comprados se activan al inicio */
    if ((p.shield || 0) > 0) {
        shieldActive = true;
        shieldTimer = 12 + Math.min(p.shield - 1, 3) * 3;
        $("shieldIndicator").classList.remove("hidden");
    }

    if ((p.magnet || 0) > 0) {
        magnetActive = true;
        magnetTimer = 10 + Math.min(p.magnet - 1, 3) * 2;
        $("magnetIndicator").classList.remove("hidden");
    }

    if ((p.double || 0) > 0) {
        doubleActive = true;
        doubleTimer = 8 + Math.min(p.double - 1, 3) * 2;
        $("doubleIndicator").classList.remove("hidden");
    }

    /* Consola: burst inicial de ×2 */
    if ((p.console || 0) > 0 && !doubleActive) {
        doubleActive = true;
        doubleTimer = 5;
        $("doubleIndicator").classList.remove("hidden");
    }

    updateBankedShieldUI();
}

function updateBankedShieldUI() {
    const el = $("bankedShieldIndicator");
    const countEl = $("bankedShieldCount");
    if (bankedBurgers > 0) {
        el.classList.remove("hidden");
        countEl.textContent = bankedBurgers;
    } else {
        el.classList.add("hidden");
    }
}


/* =========================================================
   EDIFICIOS
========================================================= */

function createBuildings() {

    buildings = [];

    const road = roadMetrics();

    for (let i = 0; i < 35; i++) {

        const side =
            Math.random() < .5 ? "left" : "right";

        const x = side === "left"
            ? road.left - random(80, 260)
            : road.left + road.roadWidth + random(80, 260);

        buildings.push({
            x,
            y: random(-H, H),
            width: random(50, 120),
            height: random(80, 220),
            speed: random(.35, .8),
            lights: randomInt(2, 6)
        });
    }
}


/* =========================================================
   OBSTÁCULOS
========================================================= */

function spawnObstacle() {

    const lane =
        randomInt(0, 2);

    const type =
        Math.random() < .75
            ? "barrier"
            : "car";

    obstacles.push({

        lane,

        y: -100,

        type,

        width:
            type === "barrier"
                ? 70
                : 62,

        height:
            type === "barrier"
                ? 40
                : 85,

        passed: false

    });
}


/* =========================================================
   MONEDAS
========================================================= */

function spawnCoinPattern() {

    const lane =
        randomInt(0, 2);

    const pattern =
        randomInt(0, 2);

    for (let i = 0; i < 5; i++) {

        let currentLane = lane;

        if (pattern === 1) {
            currentLane =
                clamp(
                    lane + (i % 2 === 0 ? 0 : 1),
                    0,
                    2
                );
        }

        if (pattern === 2) {

            currentLane =
                clamp(
                    lane +
                    Math.round(
                        Math.sin(i * .9)
                    ),
                    0,
                    2
                );
        }

        coins.push({

            lane: currentLane,

            y: -50 - i * 65,

            radius: 12,

            rotation: random(0, Math.PI * 2),

            /* Animación de aparición */
            scale: 0,
            appear: 0

        });
    }
}


/* =========================================================
   POWER UPS
========================================================= */

function spawnPowerUp() {

    const types = [
        "shield",
        "magnet",
        "double"
    ];

    const type =
        types[
            randomInt(0, types.length - 1)
        ];

    powerUps.push({

        lane: randomInt(0, 2),

        y: -70,

        type,

        size: 25,

        rotation: 0,

        pulse: 0

    });
}


/* =========================================================
   PARTÍCULAS
========================================================= */

function createParticles(
    x,
    y,
    color,
    amount = 10
) {

    for (let i = 0; i < amount; i++) {

        particles.push({

            x,
            y,

            vx: random(-3, 3),

            vy: random(-4, -0.5),

            life: random(.35, .9),

            maxLife: .9,

            size: random(2, 6),

            color,

            gravity: random(4, 8)

        });
    }
}

function createSparkle(x, y) {
    for (let i = 0; i < 6; i++) {
        particles.push({
            x: x + random(-8, 8),
            y: y + random(-8, 8),
            vx: random(-1.5, 1.5),
            vy: random(-2.5, -0.5),
            life: random(.2, .5),
            maxLife: .5,
            size: random(1.5, 3.5),
            color: "#fff8c0",
            gravity: 2
        });
    }
}

function updateParticles(dt) {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;

        p.vy += (p.gravity || 5) * dt;

        p.life -= dt;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}

function drawParticles() {

    for (const p of particles) {

        ctx.globalAlpha =
            clamp(
                p.life / p.maxLife,
                0,
                1
            );

        ctx.fillStyle = p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }

    ctx.globalAlpha = 1;
}


/* =========================================================
   DIBUJAR CIUDAD
========================================================= */

function drawBackground(dt) {

    /* Ciclo día/noche según nivel */
    let skyTop, skyMid, skyBot, moonAlpha;

    if (level === 1) {
        skyTop = "#071727";
        skyMid = "#102b3c";
        skyBot = "#06121e";
        moonAlpha = 0.12;
    } else if (level === 2) {
        skyTop = "#0a1a2e";
        skyMid = "#1a3a4e";
        skyBot = "#0a1825";
        moonAlpha = 0.18;
    } else {
        skyTop = "#050d18";
        skyMid = "#0c1f30";
        skyBot = "#030a12";
        moonAlpha = 0.25;
    }

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(0, skyTop);
    gradient.addColorStop(.55, skyMid);
    gradient.addColorStop(1, skyBot);

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );


    /* Luna / sol */

    ctx.beginPath();

    ctx.arc(
        W * .82,
        H * .17,
        50,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        `rgba(255,220,140,${moonAlpha})`;

    ctx.fill();

    /* Halo */
    ctx.beginPath();
    ctx.arc(W * .82, H * .17, 70, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,220,140,${moonAlpha * 0.35})`;
    ctx.fill();


    /* Edificios */

    for (const building of buildings) {

        building.y +=
            speed * 70 *
            building.speed *
            dt;

        if (building.y > H + 300) {
            building.y =
                -building.height -
                random(50, 300);
        }

        drawBuilding(building);
    }
}

function drawBuilding(building) {

    const x = building.x;
    const y = building.y;

    ctx.fillStyle =
        "rgba(10,25,40,.95)";

    ctx.fillRect(
        x,
        y,
        building.width,
        building.height
    );

    ctx.strokeStyle =
        "rgba(255,255,255,.04)";

    ctx.strokeRect(
        x,
        y,
        building.width,
        building.height
    );

    for (
        let i = 0;
        i < building.lights;
        i++
    ) {

        const wx =
            x +
            10 +
            (i % 3) *
            Math.max(
                15,
                building.width / 4
            );

        const wy =
            y +
            15 +
            Math.floor(i / 3) * 25;

        ctx.fillStyle =
            Math.random() > .08
                ? "rgba(255,211,78,.35)"
                : "rgba(255,255,255,.05)";

        ctx.fillRect(
            wx,
            wy,
            7,
            10
        );
    }
}


/* =========================================================
   CARRETERA
========================================================= */

function drawRoad(dt) {

    const road =
        roadMetrics();

    /* Acera izquierda */

    ctx.fillStyle = "#162d3c";

    ctx.fillRect(
        road.left - 70,
        0,
        70,
        H
    );

    /* Acera derecha */

    ctx.fillRect(
        road.left + road.roadWidth,
        0,
        70,
        H
    );


    /* Carretera */

    const roadGradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    roadGradient.addColorStop(
        0,
        "#202b35"
    );

    roadGradient.addColorStop(
        1,
        "#111920"
    );

    ctx.fillStyle =
        roadGradient;

    ctx.fillRect(
        road.left,
        0,
        road.roadWidth,
        H
    );


    /* Líneas de carril */

    ctx.strokeStyle =
        "rgba(255,255,255,.17)";

    ctx.lineWidth = 3;

    const offset =
        (distance * 2.2) % 80;

    for (let lane = 1; lane < 3; lane++) {

        const x =
            road.left +
            road.laneWidth * lane;

        ctx.setLineDash([45, 35]);

        ctx.lineDashOffset =
            offset;

        ctx.beginPath();

        ctx.moveTo(
            x,
            0
        );

        ctx.lineTo(
            x,
            H
        );

        ctx.stroke();
    }

    ctx.setLineDash([]);


    /* Bordes */

    ctx.fillStyle =
        "rgba(53,229,154,.25)";

    ctx.fillRect(
        road.left,
        0,
        3,
        H
    );

    ctx.fillRect(
        road.left + road.roadWidth - 3,
        0,
        3,
        H
    );
}


/* =========================================================
   JUGADOR
========================================================= */

function updatePlayer(dt) {

    player.x +=
        (
            laneX(player.targetLane) -
            player.x
        ) *
        Math.min(
            1,
            dt * 14
        );

    player.lane =
        player.targetLane;

    player.runAnimation +=
        dt * (10 + speed * 10);


    if (player.jumping) {

        player.jumpTime += dt;

        if (
            player.jumpTime >=
            player.jumpDuration
        ) {

            player.jumping = false;
            player.jumpTime = 0;
            /* Squash al aterrizar */
            player.landSquash = 1;
        }
    }

    if (player.sliding) {

        player.slideTime += dt;

        if (
            player.slideTime >=
            player.slideDuration
        ) {

            player.sliding = false;
            player.slideTime = 0;
        }
    }

    /* Decaimiento del squash de aterrizaje */
    if (player.landSquash > 0) {
        player.landSquash = Math.max(0, player.landSquash - dt * 5);
    }

    player.baseY =
        H * .77;
}

function getPlayerY() {

    let y = player.baseY;

    if (player.jumping) {

        const progress =
            player.jumpTime /
            player.jumpDuration;

        /* Curva más natural (ease-out en subida) */
        const arc = Math.sin(progress * Math.PI);

        y -= arc * player.jumpHeight;
    }

    return y;
}

function drawPlayer() {

    const x = player.x;
    const y = getPlayerY();

    const running =
        Math.sin(
            player.runAnimation
        ) * 5;

    /* Squash & stretch */
    let scaleX = 1;
    let scaleY = 1;

    if (player.jumping) {
        const p = player.jumpTime / player.jumpDuration;
        /* Estirar en el aire */
        scaleY = 1 + Math.sin(p * Math.PI) * 0.12;
        scaleX = 1 - Math.sin(p * Math.PI) * 0.08;
    } else if (player.landSquash > 0) {
        scaleY = 1 - player.landSquash * 0.18;
        scaleX = 1 + player.landSquash * 0.15;
    } else if (player.sliding) {
        scaleY = 0.55;
        scaleX = 1.25;
    }

    ctx.save();

    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);


    /* sombra */

    ctx.globalAlpha = .25;

    ctx.fillStyle = "#000";

    ctx.beginPath();

    ctx.ellipse(
        0,
        7 + (player.jumping ? 8 : 0),
        28 * (1 / scaleX),
        8,
        0,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.globalAlpha = 1;


    /* escudo */

    if (shieldActive) {

        const pulse = 0.7 + Math.sin(Date.now() / 180) * 0.15;

        ctx.strokeStyle =
            `rgba(73,184,255,${pulse})`;

        ctx.lineWidth = 4;

        ctx.beginPath();

        ctx.arc(
            0,
            -25,
            42,
            0,
            Math.PI * 2
        );

        ctx.stroke();

        ctx.fillStyle =
            "rgba(73,184,255,.08)";

        ctx.fill();
    }


    /* piernas */

    ctx.strokeStyle = "#182b3d";

    ctx.lineWidth = 9;

    ctx.lineCap = "round";

    if (player.sliding) {

        ctx.beginPath();

        ctx.moveTo(
            -5,
            8
        );

        ctx.lineTo(
            27,
            14
        );

        ctx.stroke();

    } else {

        ctx.beginPath();

        ctx.moveTo(
            -6,
            20
        );

        ctx.lineTo(
            -12 + running,
            48
        );

        ctx.moveTo(
            6,
            20
        );

        ctx.lineTo(
            12 - running,
            48
        );

        ctx.stroke();
    }


    /* cuerpo */

    ctx.fillStyle = "#35e59a";

    ctx.beginPath();

    ctx.roundRect(
        -17,
        -20,
        34,
        45,
        10
    );

    ctx.fill();


    /* camiseta */

    ctx.fillStyle =
        "#0d5e47";

    ctx.fillRect(
        -17,
        5,
        34,
        20
    );


    /* brazos */

    ctx.strokeStyle =
        "#ffd0ad";

    ctx.lineWidth = 8;

    ctx.beginPath();

    ctx.moveTo(
        -14,
        -10
    );

    ctx.lineTo(
        -27,
        10 + running
    );

    ctx.moveTo(
        14,
        -10
    );

    ctx.lineTo(
        27,
        10 - running
    );

    ctx.stroke();


    /* cabeza */

    ctx.fillStyle =
        "#ffd0ad";

    ctx.beginPath();

    ctx.arc(
        0,
        -36,
        15,
        0,
        Math.PI * 2
    );

    ctx.fill();


    /* cabello */

    ctx.fillStyle =
        "#1a1b22";

    ctx.beginPath();

    ctx.arc(
        0,
        -42,
        15,
        Math.PI,
        Math.PI * 2
    );

    ctx.fill();


    /* mochila (si tiene) */

    if ((saveData.purchased.backpack || 0) > 0) {
        ctx.fillStyle = "#ff9b42";
        ctx.beginPath();
        ctx.roundRect(-24, -16, 9, 28, 5);
        ctx.fill();
    } else {
        ctx.fillStyle = "#ff9b42";
        ctx.beginPath();
        ctx.roundRect(-24, -16, 9, 28, 5);
        ctx.fill();
    }

    ctx.restore();
}


/* =========================================================
   DIBUJAR OBSTÁCULOS
========================================================= */

function drawObstacle(obstacle) {

    const x =
        laneX(obstacle.lane);

    const y =
        obstacle.y;

    ctx.save();

    ctx.translate(
        x,
        y
    );

    if (obstacle.type === "barrier") {

        ctx.fillStyle =
            "#ff5f6d";

        ctx.beginPath();

        ctx.roundRect(
            -35,
            -20,
            70,
            40,
            7
        );

        ctx.fill();

        ctx.fillStyle =
            "#ffd34e";

        for (let i = -25; i < 30; i += 20) {

            ctx.save();

            ctx.translate(
                i,
                0
            );

            ctx.rotate(-.55);

            ctx.fillRect(
                -5,
                -20,
                10,
                40
            );

            ctx.restore();
        }

    } else {

        /* coche */

        ctx.fillStyle =
            "#263d52";

        ctx.beginPath();

        ctx.roundRect(
            -31,
            -42,
            62,
            84,
            14
        );

        ctx.fill();

        ctx.fillStyle =
            "#7ed5ff";

        ctx.beginPath();

        ctx.roundRect(
            -20,
            -28,
            40,
            25,
            7
        );

        ctx.fill();

        ctx.fillStyle =
            "#ff5f6d";

        ctx.fillRect(
            -26,
            23,
            9,
            7
        );

        ctx.fillRect(
            17,
            23,
            9,
            7
        );
    }

    ctx.restore();
}


/* =========================================================
   DIBUJAR MONEDAS
========================================================= */

function drawCoin(coin) {

    const x =
        laneX(coin.lane);

    const y =
        coin.y;

    coin.rotation += .1;
    coin.appear = Math.min(1, (coin.appear || 0) + 0.08);
    coin.scale = coin.appear;

    const scale =
        (Math.abs(
            Math.cos(
                coin.rotation
            )
        ) * .55 + .45) * coin.scale;

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.scale(
        scale,
        coin.scale
    );

    ctx.fillStyle =
        "#ffd34e";

    ctx.shadowColor =
        "rgba(255,211,78,.55)";

    ctx.shadowBlur = 18;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        coin.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.fillStyle =
        "#a96c00";

    ctx.font =
        "bold 13px Inter";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "Bs",
        0,
        1
    );

    ctx.restore();
}


/* =========================================================
   POWER UPS
========================================================= */

function drawPowerUp(power) {

    const x =
        laneX(power.lane);

    const y =
        power.y;

    const icons = {
        shield: "🛡️",
        magnet: "🧲",
        double: "×2"
    };

    power.rotation += .05;
    power.pulse = (power.pulse || 0) + 0.08;

    const pulseScale = 1 + Math.sin(power.pulse) * 0.12;

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.scale(pulseScale, pulseScale);

    ctx.rotate(
        Math.sin(power.rotation) * .12
    );

    ctx.shadowBlur = 22;

    ctx.shadowColor =
        "#35e59a";

    ctx.fillStyle =
        "rgba(53,229,154,.22)";

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        30,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.font =
        "26px sans-serif";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        icons[power.type],
        0,
        0
    );

    ctx.restore();
}


/* =========================================================
   MOVIMIENTO DE OBJETOS
========================================================= */

function updateObjects(dt) {

    const movement =
        speed *
        620 *
        dt;


    /* Obstáculos */

    for (
        let i = obstacles.length - 1;
        i >= 0;
        i--
    ) {

        const obstacle =
            obstacles[i];

        obstacle.y += movement;

        if (
            obstacle.y >
            H + 150
        ) {

            obstacles.splice(i, 1);

            continue;
        }

        if (
            !obstacle.passed &&
            obstacle.y >
            player.baseY - 100
        ) {

            obstacle.passed = true;
        }

        if (
            checkObstacleCollision(
                obstacle
            )
        ) {

            obstacles.splice(i, 1);

            handleCollision();

            continue;
        }
    }


    /* Monedas */

    for (
        let i = coins.length - 1;
        i >= 0;
        i--
    ) {

        const coin =
            coins[i];

        coin.y += movement;

        let coinX =
            laneX(coin.lane);

        let playerX =
            player.x;

        if (magnetActive) {

            const dx =
                playerX - coinX;

            if (
                Math.abs(dx) < bonusMagnetRange &&
                Math.abs(
                    player.baseY -
                    coin.y
                ) < bonusMagnetRange
            ) {

                coinX +=
                    dx *
                    Math.min(
                        1,
                        dt * 8
                    );

                /* Mover también el lane visualmente aproximando */
                coin.lane = coin.lane + (player.targetLane - coin.lane) * Math.min(1, dt * 3);
            }
        }

        if (
            Math.abs(
                playerX - coinX
            ) < 48 &&
            Math.abs(
                getPlayerY() -
                coin.y
            ) < 70
        ) {

            collectCoin();

            createSparkle(coinX, coin.y);

            coins.splice(i, 1);

            continue;
        }

        if (
            coin.y >
            H + 100
        ) {

            coins.splice(i, 1);
        }
    }


    /* Power ups */

    for (
        let i = powerUps.length - 1;
        i >= 0;
        i--
    ) {

        const power =
            powerUps[i];

        power.y += movement;

        if (
            Math.abs(
                player.x -
                laneX(power.lane)
            ) < 48 &&
            Math.abs(
                getPlayerY() -
                power.y
            ) < 75
        ) {

            activatePower(
                power.type
            );

            createParticles(
                laneX(power.lane),
                power.y,
                "#35e59a",
                18
            );

            powerUps.splice(
                i,
                1
            );

            continue;
        }

        if (
            power.y >
            H + 100
        ) {

            powerUps.splice(
                i,
                1
            );
        }
    }
}


/* =========================================================
   COLISIONES
========================================================= */

function checkObstacleCollision(
    obstacle
) {

    const sameLane =
        Math.abs(
            player.x -
            laneX(obstacle.lane)
        ) < 40;

    if (!sameLane) {
        return false;
    }

    const playerY =
        getPlayerY();

    const vertical =
        Math.abs(
            playerY -
            obstacle.y
        );

    /* Saltar (más tolerante en el pico) */
    if (
        player.jumping &&
        vertical > 38
    ) {
        return false;
    }

    /* Deslizar */
    if (
        player.sliding &&
        obstacle.type === "barrier"
    ) {
        return false;
    }

    return vertical < 58;
}

function handleCollision() {

    if (shieldActive) {

        shieldActive = false;

        $("shieldIndicator")
            .classList.add("hidden");

        createParticles(
            player.x,
            getPlayerY(),
            "#49b8ff",
            28
        );

        flashScreen("hit");

        showToast(
            "🛡️ ESCUDO ACTIVADO",
            "Evitaste perder una vida"
        );

        sound("power");

        return;
    }

    /* Escudos de emergencia (hamburguesas) */
    if (bankedBurgers > 0) {

        bankedBurgers--;
        saveData.purchased.burger = Math.max(0, (saveData.purchased.burger || 0) - 1);
        saveGame();
        updateBankedShieldUI();

        createParticles(
            player.x,
            getPlayerY(),
            "#ff9b42",
            22
        );

        flashScreen("hit");

        showToast(
            "🍔 ESCUDO DE EMERGENCIA",
            "¡La hamburguesa te salvó!"
        );

        sound("power");

        return;
    }

    sound("hit");

    createParticles(
        player.x,
        getPlayerY(),
        "#ff5f6d",
        35
    );

    flashScreen("hit");
    shakeCanvas();

    endGame(
        "collision"
    );
}

function flashScreen(type) {
    const el = $("screenFlash");
    el.classList.remove("hit", "levelup");
    void el.offsetWidth;
    el.classList.add(type);
    setTimeout(() => {
        el.classList.remove(type);
    }, 120);
}

function shakeCanvas() {
    canvas.classList.remove("shake");
    void canvas.offsetWidth;
    canvas.classList.add("shake");
    setTimeout(() => {
        canvas.classList.remove("shake");
    }, 350);
}


/* =========================================================
   MONEDAS
========================================================= */

function collectCoin() {

    runCoins++;

    const value =
        (doubleActive
            ? bonusCoinValue * 2
            : bonusCoinValue);

    runMoney += value;

    /* Solo se suma totalCoins al final de la carrera para evitar doble conteo */

    createParticles(
        player.x,
        getPlayerY() - 30,
        "#ffd34e",
        12
    );

    sound("coin");

    updateHUD();
    updateMissionUI();
}


/* =========================================================
   POWER UPS
========================================================= */

function activatePower(type) {

    sound("power");

    if (type === "shield") {

        shieldActive = true;

        shieldTimer = 15;

        $("shieldIndicator")
            .classList.remove("hidden");

        showToast(
            "🛡️ ESCUDO",
            "El próximo obstáculo no te afectará"
        );
    }

    if (type === "magnet") {

        magnetActive = true;

        magnetTimer = 12;

        $("magnetIndicator")
            .classList.remove("hidden");

        showToast(
            "🧲 IMÁN",
            "Las monedas cercanas vienen hacia ti"
        );
    }

    if (type === "double") {

        doubleActive = true;

        doubleTimer = 10;

        $("doubleIndicator")
            .classList.remove("hidden");

        showToast(
            "⚡ ×2",
            "Tus monedas valen el doble"
        );
    }
}

function updatePowers(dt) {

    if (shieldActive) {

        shieldTimer -= dt;

        if (shieldTimer <= 0) {

            shieldActive = false;

            $("shieldIndicator")
                .classList.add("hidden");
        }
    }

    if (magnetActive) {

        magnetTimer -= dt;

        if (magnetTimer <= 0) {

            magnetActive = false;

            $("magnetIndicator")
                .classList.add("hidden");
        }
    }

    if (doubleActive) {

        doubleTimer -= dt;

        if (doubleTimer <= 0) {

            doubleActive = false;

            $("doubleIndicator")
                .classList.add("hidden");
        }
    }
}


/* =========================================================
   INPUT
========================================================= */

function moveLeft() {

    if (!gameRunning || gamePaused) return;

    player.targetLane =
        clamp(
            player.targetLane - 1,
            0,
            2
        );
}

function moveRight() {

    if (!gameRunning || gamePaused) return;

    player.targetLane =
        clamp(
            player.targetLane + 1,
            0,
            2
        );
}

function jump() {

    if (!gameRunning || gamePaused) return;

    if (
        !player.jumping &&
        !player.sliding
    ) {

        player.jumping = true;

        player.jumpTime = 0;
        player.landSquash = 0;

        sound("jump");
    }
}

function slide() {

    if (!gameRunning || gamePaused) return;

    if (
        !player.jumping &&
        !player.sliding
    ) {

        player.sliding = true;

        player.slideTime = 0;
    }
}

window.addEventListener(
    "keydown",
    (event) => {

        if (
            [
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
                " "
            ].includes(event.key)
        ) {
            event.preventDefault();
        }

        switch (event.key.toLowerCase()) {

            case "arrowleft":
            case "a":
                moveLeft();
                break;

            case "arrowright":
            case "d":
                moveRight();
                break;

            case "arrowup":
            case "w":
            case " ":
                jump();
                break;

            case "arrowdown":
            case "s":
                slide();
                break;

            case "p":
                togglePause();
                break;
        }
    }
);


/* =========================================================
   TOUCH
========================================================= */

$("leftControl").addEventListener(
    "pointerdown",
    moveLeft
);

$("rightControl").addEventListener(
    "pointerdown",
    moveRight
);

$("jumpControl").addEventListener(
    "pointerdown",
    jump
);

$("slideControl").addEventListener(
    "pointerdown",
    slide
);


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(timestamp) {

    if (!gameRunning) {
        return;
    }

    if (!lastTime) {
        lastTime = timestamp;
    }

    const dt =
        Math.min(
            (timestamp - lastTime) / 1000,
            .05
        );

    lastTime = timestamp;

    if (!gamePaused) {

        updateGame(dt);

        drawGame();
    }

    animationId =
        requestAnimationFrame(
            gameLoop
        );
}

function updateGame(dt) {

    distance +=
        speed *
        45 *
        dt;

    runMoney =
        Math.max(
            0,
            runMoney
        );

    speed +=
        .008 *
        dt;

    speed =
        clamp(
            speed,
            .55,
            maxSpeed
        );

    spawnTimer -= dt;
    coinTimer -= dt;
    powerTimer -= dt;
    difficultyTimer -= dt;

    if (spawnTimer <= 0) {

        spawnObstacle();

        spawnTimer =
            random(
                .65,
                1.2
            ) /
            (speed / .55);
    }

    if (coinTimer <= 0) {

        spawnCoinPattern();

        coinTimer =
            random(
                1.1,
                2
            );
    }

    if (powerTimer <= 0) {

        spawnPowerUp();

        powerTimer =
            random(
                8,
                14
            );
    }

    if (difficultyTimer <= 0) {

        difficultyTimer = 10;

        if (
            speed < maxSpeed
        ) {

            speed += .05;
        }

        /* Subir de nivel cada ~1000 m */
        const newLevel = Math.min(3, 1 + Math.floor(distance / 1000));
        if (newLevel > level) {
            level = newLevel;
            sound("level");
            flashScreen("levelup");
            showToast(
                `🌅 NIVEL ${level}`,
                level === 2 ? "Atardecer — más obstáculos" : "Noche — máxima dificultad"
            );
            updateLevelUI();
        }
    }

    updatePlayer(dt);
    updateObjects(dt);
    updateParticles(dt);
    updatePowers(dt);

    updateHUD();
    updateMissionUI();

    if (distance >= 3000) {

        endGame(
            "victory"
        );
    }
}

function updateLevelUI() {
    const icons = ["🌞", "🌅", "🌙"];
    $("phaseIcon").textContent = icons[level - 1] || "🌞";
    $("levelDisplay").textContent = level;
}

function drawGame() {

    ctx.clearRect(
        0,
        0,
        W,
        H
    );

    drawBackground(
        1 / 60
    );

    drawRoad(
        1 / 60
    );

    for (const coin of coins) {
        drawCoin(coin);
    }

    for (const power of powerUps) {
        drawPowerUp(power);
    }

    for (const obstacle of obstacles) {
        drawObstacle(obstacle);
    }

    drawPlayer();

    drawParticles();
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    $("moneyDisplay").textContent =
        `Bs ${Math.floor(
            saveData.money +
            runMoney
        )}`;

    $("distanceDisplay").textContent =
        `${Math.floor(distance)} m`;

    $("savingDisplay").textContent =
        `Bs ${Math.floor(
            saveData.saving
        )}`;

    const speedPercent =
        clamp(
            (
                (speed - .55) /
                (maxSpeed - .55)
            ) * 100,
            0,
            100
        );

    $("speedBar").style.width =
        `${speedPercent}%`;
}


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    initAudio();

    showScreen(
        "gameScreen"
    );

    gameRunning = true;
    gamePaused = false;

    distance = 0;

    runMoney = 0;

    runCoins = 0;

    speed = .55;
    level = 1;

    spawnTimer = .8;
    coinTimer = .5;
    powerTimer = 5;

    difficultyTimer = 10;

    obstacles = [];
    coins = [];
    particles = [];
    powerUps = [];

    shieldActive = false;
    magnetActive = false;
    doubleActive = false;

    $("shieldIndicator").classList.add("hidden");
    $("magnetIndicator").classList.add("hidden");
    $("doubleIndicator").classList.add("hidden");

    player.targetLane = 1;
    player.lane = 1;

    player.x =
        laneX(1);

    player.jumping = false;
    player.sliding = false;
    player.landSquash = 0;
    player.jumpDuration = 0.42;

    lastTime = 0;

    createBuildings();

    /* Aplicar bonos de ítems comprados */
    applyOwnedBonuses();

    chooseMission();

    updateHUD();
    updateLevelUI();

    cancelAnimationFrame(
        animationId
    );

    animationId =
        requestAnimationFrame(
            gameLoop
        );
}


/* =========================================================
   END GAME
========================================================= */

function endGame(reason) {

    if (!gameRunning) return;

    gameRunning = false;

    cancelAnimationFrame(
        animationId
    );

    const finalMoney =
        saveData.money +
        runMoney;

    saveData.money =
        finalMoney;

    /* Corregido: totalCoins se suma solo aquí */
    saveData.totalCoins +=
        runCoins;

    if (
        distance >
        saveData.bestDistance
    ) {

        saveData.bestDistance =
            Math.floor(distance);
    }

    saveGame();

    showResults(reason);
}


/* =========================================================
   RESULTADOS
========================================================= */

function showResults(reason) {

    showScreen(
        "resultScreen"
    );

    $("finalDistance").textContent =
        `${Math.floor(distance)} m`;

    $("finalCoins").textContent =
        runCoins;

    $("finalMoney").textContent =
        `Bs ${Math.floor(
            saveData.money
        )}`;

    $("finalSaving").textContent =
        `Bs ${Math.floor(
            saveData.saving
        )}`;


    let score =
        calculateFinancialScore();

    $("resultFinancialScore").textContent =
        `${score}%`;


    const totalSpent =
        saveData.statistics.needs +
        saveData.statistics.wants +
        1;

    const needs =
        clamp(
            Math.round(
                (saveData.statistics.needs / totalSpent) * 100
            ),
            0,
            100
        );

    const wants =
        clamp(
            Math.round(
                (saveData.statistics.wants / totalSpent) * 100
            ),
            0,
            100
        );

    const saving =
        clamp(
            100 - needs - wants + Math.min(30, Math.floor(saveData.statistics.saving / 50)),
            0,
            100
        );

    setReport(
        "needs",
        needs
    );

    setReport(
        "wants",
        wants
    );

    setReport(
        "saving",
        saving
    );


    if (reason === "victory") {

        $("resultIcon").textContent =
            "🏆";

        $("resultTitle").textContent =
            "¡META CONSEGUIDA!";

        $("resultMessage").textContent =
            "Has demostrado que puedes correr y administrar tu dinero al mismo tiempo.";
    }

    else {

        $("resultIcon").textContent =
            "💥";

        $("resultTitle").textContent =
            "¡FIN DE LA CARRERA!";

        $("resultMessage").textContent =
            "No pasa nada. Cada partida es una oportunidad para mejorar tus decisiones.";
    }
}

function setReport(
    type,
    value
) {

    $(`${type}Percent`).textContent =
        `${value}%`;

    $(`${type}Bar`).style.width =
        `${value}%`;
}

function calculateFinancialScore() {

    const total =
        saveData.statistics.needs +
        saveData.statistics.wants +
        saveData.statistics.saving;

    if (total <= 0) {
        return 50;
    }

    const savingRatio =
        saveData.statistics.saving /
        total;

    const wantsRatio =
        saveData.statistics.wants /
        total;

    let score =
        50 +
        savingRatio * 40 -
        wantsRatio * 25;

    return clamp(
        Math.round(score),
        0,
        100
    );
}


/* =========================================================
   PAUSA
========================================================= */

function togglePause() {

    if (!gameRunning) return;

    gamePaused =
        !gamePaused;

    $("pauseOverlay")
        .classList.toggle(
            "hidden",
            !gamePaused
        );
}

function resumeGame() {

    gamePaused = false;

    $("pauseOverlay")
        .classList.add(
            "hidden"
        );

    lastTime =
        performance.now();
}


/* =========================================================
   PANTALLAS
========================================================= */

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(
            screen => {
                screen.classList.remove(
                    "active"
                );
            }
        );

    $(id).classList.add(
        "active"
    );
}


/* =========================================================
   TIENDA
========================================================= */

let currentCategory = "all";

function renderShop() {

    $("shopMoney").textContent =
        `Bs ${Math.floor(
            saveData.money
        )}`;

    const grid =
        $("shopGrid");

    grid.innerHTML = "";

    const filtered =
        shopItems.filter(
            item =>
                currentCategory === "all" ||
                item.category === currentCategory
        );

    filtered.forEach(
        item => {

            const owned =
                saveData.purchased[item.id] || 0;

            const canBuy =
                saveData.money >= item.price;

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "shop-card";

            card.innerHTML = `

                <div class="item-icon">
                    ${item.icon}
                </div>

                <div class="item-category">
                    ${getCategoryName(item.category)}
                </div>

                <h3>${item.name}</h3>

                <p class="item-description">
                    ${item.description}
                </p>

                <div class="item-effect-tag">
                    ${item.effect}
                </div>

                ${owned > 0 ? `<div class="owned-badge">×${owned} en inventario</div>` : ""}

                <div class="item-price">

                    <strong>
                        💰 Bs ${item.price}
                    </strong>

                    <button
                        class="buy-button ${
                            canBuy
                                ? ""
                                : "disabled"
                        }"
                        data-buy="${item.id}"
                        ${canBuy ? "" : "disabled"}
                    >
                        COMPRAR
                    </button>

                </div>

            `;

            grid.appendChild(card);
        }
    );

    grid
        .querySelectorAll(
            "[data-buy]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        buyItem(
                            button.dataset.buy
                        );
                    }
                );
            }
        );
}

function getCategoryName(category) {

    switch (category) {

        case "utility":
            return "🟢 ÚTIL";

        case "fun":
            return "🟡 DESEO";

        case "power":
            return "⚡ POWER-UP";

        default:
            return "ITEM";
    }
}

function buyItem(id) {

    const item =
        shopItems.find(
            product =>
                product.id === id
        );

    if (!item) return;

    if (
        saveData.money <
        item.price
    ) {

        showToast(
            "❌ DINERO INSUFICIENTE",
            `Necesitas Bs ${item.price}`
        );

        return;
    }

    saveData.money -=
        item.price;

    saveData.purchased[id] =
        (saveData.purchased[id] || 0) + 1;


    if (item.type === "need") {

        saveData.statistics.needs +=
            item.price;
    }

    else if (
        item.type === "want"
    ) {

        saveData.statistics.wants +=
            item.price;
    }

    saveGame();

    sound("buy");

    showToast(
        `🛒 ${item.name}`,
        `Comprado por Bs ${item.price} — efecto activo en la próxima carrera`
    );

    renderShop();
}


/* =========================================================
   INVENTARIO
========================================================= */

function renderInventory() {

    $("inventoryMoney").textContent =
        `Bs ${Math.floor(
            saveData.money
        )}`;

    $("inventoryCash").textContent =
        `Bs ${Math.floor(
            saveData.money
        )}`;

    $("inventorySaving").textContent =
        `Bs ${Math.floor(
            saveData.saving
        )}`;

    $("invFinancialScore").textContent =
        `${calculateFinancialScore()}%`;

    const grid =
        $("inventoryGrid");

    grid.innerHTML = "";

    const ownedItems =
        shopItems.filter(
            item =>
                (saveData.purchased[item.id] || 0) > 0
        );

    if (
        ownedItems.length === 0
    ) {

        grid.innerHTML = `

            <div class="empty-inventory">

                <div>🎒</div>

                <h2>Tu inventario está vacío</h2>

                <p>
                    Compra algunos objetos
                    para comenzar tu colección.
                    Cada uno te da una ventaja real.
                </p>

            </div>

        `;

        return;
    }

    ownedItems.forEach(
        item => {

            const quantity =
                saveData.purchased[item.id];

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "inventory-card";

            card.innerHTML = `

                <span class="inventory-count">
                    ×${quantity}
                </span>

                <div class="item-icon">
                    ${item.icon}
                </div>

                <div class="item-category">
                    ${getCategoryName(item.category)}
                </div>

                <h3>${item.name}</h3>

                <p class="item-description">
                    ${item.effect}
                </p>

            `;

            grid.appendChild(card);
        }
    );
}


/* =========================================================
   TOAST
========================================================= */

function showToast(
    title,
    message
) {

    const container =
        $("toastContainer");

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "toast";

    toast.innerHTML = `
        <strong>${title}</strong>
        <span>${message}</span>
    `;

    container.appendChild(
        toast
    );

    setTimeout(
        () => {
            toast.remove();
        },
        3100
    );
}


/* =========================================================
   EVENTOS DE INTERFAZ
========================================================= */

$("startButton").addEventListener(
    "click",
    startGame
);

$("howButton").addEventListener(
    "click",
    () => {

        $("howOverlay")
            .classList.remove(
                "hidden"
            );
    }
);

$("closeHow").addEventListener(
    "click",
    () => {

        $("howOverlay")
            .classList.add(
                "hidden"
            );
    }
);

$("pauseButton").addEventListener(
    "click",
    togglePause
);

$("resumeButton").addEventListener(
    "click",
    resumeGame
);

$("pauseHomeButton").addEventListener(
    "click",
    () => {

        gameRunning = false;
        gamePaused = false;

        $("pauseOverlay")
            .classList.add(
                "hidden"
            );

        showScreen(
            "startScreen"
        );
    }
);


/* =========================
   TIENDA
========================= */

document
    .querySelectorAll(".shop-tab")
    .forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".shop-tab"
                        )
                        .forEach(
                            t =>
                                t.classList.remove(
                                    "active"
                                )
                        );

                    tab.classList.add(
                        "active"
                    );

                    currentCategory =
                        tab.dataset.category;

                    renderShop();
                }
            );
        }
    );

$("shopBackButton")
    .addEventListener(
        "click",
        () => {

            startGame();
        }
    );

$("shopInventoryButton")
    .addEventListener(
        "click",
        () => {

            renderInventory();

            showScreen(
                "inventoryScreen"
            );
        }
    );


/* =========================
   INVENTARIO
========================= */

$("inventoryShopButton")
    .addEventListener(
        "click",
        () => {

            renderShop();

            showScreen(
                "shopScreen"
            );
        }
    );

$("inventoryBackButton")
    .addEventListener(
    "click",
    () => {

        if (gameRunning) {

            showScreen(
                "gameScreen"
            );

        } else {

            showScreen(
                "startScreen"
            );
        }
    }
);


/* =========================
   RESULTADOS
========================= */

$("restartButton")
    .addEventListener(
        "click",
        startGame
    );

$("resultShopButton")
    .addEventListener(
        "click",
        () => {

            renderShop();

            showScreen(
                "shopScreen"
            );
        }
    );

$("resultHomeButton")
    .addEventListener(
        "click",
        () => {

            showScreen(
                "startScreen"
            );
        }
    );


/* =========================================================
   TOUCH SWIPE
========================================================= */

let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener(
    "touchstart",
    event => {

        const touch =
            event.changedTouches[0];

        touchStartX =
            touch.clientX;

        touchStartY =
            touch.clientY;
    },
    {
        passive: true
    }
);

canvas.addEventListener(
    "touchend",
    event => {

        const touch =
            event.changedTouches[0];

        const dx =
            touch.clientX -
            touchStartX;

        const dy =
            touch.clientY -
            touchStartY;

        const minSwipe = 35;

        if (
            Math.abs(dx) >
            Math.abs(dy)
        ) {

            if (
                Math.abs(dx) >
                minSwipe
            ) {

                if (dx > 0) {
                    moveRight();
                } else {
                    moveLeft();
                }
            }

        } else {

            if (
                Math.abs(dy) >
                minSwipe
            ) {

                if (dy < 0) {
                    jump();
                } else {
                    slide();
                }
            }
        }
    },
    {
        passive: true
    }
);


/* =========================================================
   GUARDAR AL CERRAR
========================================================= */

window.addEventListener(
    "beforeunload",
    saveGame
);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function initialize() {

    updateHUD();

    renderShop();

    renderInventory();

    console.log(
        "%c MONEY RUNNER ",
        "background:#35e59a;color:#06131d;font-weight:900;padding:8px"
    );

    console.log(
        "Juego inicializado correctamente. Ítems funcionales + salto corto."
    );
}

initialize();
