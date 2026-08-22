/* =====================================================
   reciclajEZ - LÓGICA DEL JUEGO
===================================================== */


/* =====================================================
   RESIDUOS
===================================================== */

const residuos = [

    // =========================
    // ORGÁNICOS
    // =========================

    {
        nombre: "Cáscara de banana",
        emoji: "🍌",
        tipo: "organico",
        explicacion: "La cáscara de banana es un residuo orgánico.",
        contenedor: "ORGÁNICO"
    },

    {
        nombre: "Manzana",
        emoji: "🍎",
        tipo: "organico",
        explicacion: "Los restos de frutas son residuos orgánicos.",
        contenedor: "ORGÁNICO"
    },

    {
        nombre: "Zanahoria",
        emoji: "🥕",
        tipo: "organico",
        explicacion: "Los restos de verduras pertenecen a los residuos orgánicos.",
        contenedor: "ORGÁNICO"
    },

    {
        nombre: "Restos de comida",
        emoji: "🍽️",
        tipo: "organico",
        explicacion: "Los restos de comida son residuos orgánicos.",
        contenedor: "ORGÁNICO"
    },

    {
        nombre: "Hojas",
        emoji: "🍂",
        tipo: "organico",
        explicacion: "Las hojas y restos vegetales son residuos orgánicos.",
        contenedor: "ORGÁNICO"
    },


    // =========================
    // PAPEL
    // =========================

    {
        nombre: "Hoja de papel",
        emoji: "📄",
        tipo: "papel",
        explicacion: "Las hojas de papel pertenecen al contenedor de papel y cartón.",
        contenedor: "PAPEL Y CARTÓN"
    },

    {
        nombre: "Caja de cartón",
        emoji: "📦",
        tipo: "papel",
        explicacion: "Las cajas de cartón pertenecen al contenedor de papel y cartón.",
        contenedor: "PAPEL Y CARTÓN"
    },

    {
        nombre: "Periódico",
        emoji: "📰",
        tipo: "papel",
        explicacion: "Los periódicos están hechos principalmente de papel.",
        contenedor: "PAPEL Y CARTÓN"
    },

    {
        nombre: "Revista",
        emoji: "📖",
        tipo: "papel",
        explicacion: "Las revistas pertenecen a la categoría de papel.",
        contenedor: "PAPEL Y CARTÓN"
    },


    // =========================
    // PLÁSTICO
    // =========================

    {
        nombre: "Botella de plástico",
        emoji: "🧴",
        tipo: "plastico",
        explicacion: "Las botellas de plástico pertenecen a la categoría de plástico y envases.",
        contenedor: "PLÁSTICO"
    },

    {
        nombre: "Vaso plástico",
        emoji: "🥤",
        tipo: "plastico",
        explicacion: "Los vasos plásticos son envases de plástico.",
        contenedor: "PLÁSTICO"
    },

    {
        nombre: "Bolsa plástica",
        emoji: "🛍️",
        tipo: "plastico",
        explicacion: "Las bolsas plásticas pertenecen a la categoría de plástico.",
        contenedor: "PLÁSTICO"
    },

    {
        nombre: "Envase plástico",
        emoji: "🧃",
        tipo: "plastico",
        explicacion: "Los envases plásticos pertenecen a la categoría de plástico.",
        contenedor: "PLÁSTICO"
    },


    // =========================
    // VIDRIO
    // =========================

    {
        nombre: "Botella de vidrio",
        emoji: "🍾",
        tipo: "vidrio",
        explicacion: "Las botellas de vidrio deben colocarse en el contenedor de vidrio.",
        contenedor: "VIDRIO"
    },

    {
        nombre: "Frasco de vidrio",
        emoji: "🫙",
        tipo: "vidrio",
        explicacion: "Los frascos de vidrio pertenecen a la categoría de vidrio.",
        contenedor: "VIDRIO"
    },

    {
        nombre: "Vaso de vidrio",
        emoji: "🥛",
        tipo: "vidrio",
        explicacion: "Los recipientes de vidrio pertenecen al contenedor de vidrio.",
        contenedor: "VIDRIO"
    }

];


/* =====================================================
   NIVELES
===================================================== */

const niveles = {

    1: {
        objetivo: 20,
        nombre: "Aprendiendo a reciclar"
    },

    2: {
        objetivo: 30,
        nombre: "Reciclando más rápido"
    },

    3: {
        objetivo: 40,
        nombre: "Reciclaje avanzado"
    },

    4: {
        objetivo: 50,
        nombre: "Caos reciclable"
    }

};


/* =====================================================
   CONSEJOS EDUCATIVOS
===================================================== */

const consejos = [

    "Antes de reciclar un envase, comprueba si está limpio.",

    "No todos los residuos deben colocarse en el mismo contenedor.",

    "Separar correctamente los residuos facilita el reciclaje.",

    "Aprender a identificar los materiales ayuda a reciclar mejor.",

    "Reciclar correctamente ayuda a reducir la contaminación."

];


/* =====================================================
   ESTADO DEL JUEGO
===================================================== */

let estado = crearEstado();


function crearEstado() {

    return {

        puntos: 0,

        vidas: 3,

        combo: 0,

        mejorCombo: 0,

        nivel: 1,

        aciertosNivel: 0,

        errores: 0,

        residuoActual: null,

        jugando: false,

        bloqueado: false,

        inicioResiduo: 0

    };

}


/* =====================================================
   ELEMENTOS HTML
===================================================== */

const menuInicio =
    document.getElementById("menuInicio");

const juego =
    document.getElementById("juego");

const escenario =
    document.getElementById("escenario");

const btnJugar =
    document.getElementById("btnJugar");


/* HUD */

const puntosHTML =
    document.getElementById("puntos");

const vidasHTML =
    document.getElementById("vidas");

const comboHTML =
    document.getElementById("combo");

const nivelHTML =
    document.getElementById("nivel");

const barraProgreso =
    document.getElementById("barraProgreso");

const progresoTexto =
    document.getElementById("progresoTexto");


/* RESIDUO */

const zonaResiduo =
    document.getElementById("zonaResiduo");

const residuoHTML =
    document.getElementById("residuo");

const nombreResiduoHTML =
    document.getElementById("nombreResiduo");


/* CAÑÓN */

const zonaCanon =
    document.getElementById("zonaCanon");

const canon =
    document.getElementById("canon");

const canonTubo =
    document.getElementById("canonTubo");

const proyectil =
    document.getElementById("proyectil");

const trayectoria =
    document.getElementById("trayectoria");


/* FEEDBACK */

const feedback =
    document.getElementById("feedback");

const particulas =
    document.getElementById("particulas");


/* MODAL ERROR */

const modalError =
    document.getElementById("modalError");

const textoError =
    document.getElementById("textoError");

const respuestaCorrecta =
    document.getElementById("respuestaCorrecta");

const btnContinuar =
    document.getElementById("btnContinuar");


/* MODAL NIVEL */

const modalNivel =
    document.getElementById("modalNivel");

const evaluacionNivel =
    document.getElementById("evaluacionNivel");

const nivelPuntos =
    document.getElementById("nivelPuntos");

const nivelAciertos =
    document.getElementById("nivelAciertos");

const nivelCombo =
    document.getElementById("nivelCombo");

const btnSiguienteNivel =
    document.getElementById("btnSiguienteNivel");


/* GAME OVER */

const modalGameOver =
    document.getElementById("modalGameOver");

const puntosFinales =
    document.getElementById("puntosFinales");

const nivelFinal =
    document.getElementById("nivelFinal");

const btnReintentar =
    document.getElementById("btnReintentar");

const btnMenu =
    document.getElementById("btnMenu");


/* CONSEJO */

const consejo =
    document.getElementById("consejo");

const textoConsejo =
    document.getElementById("textoConsejo");


/* VARIABLE PARA EL MOVIMIENTO */

let movimientoCanon = null;


/* =====================================================
   BOTÓN JUGAR
===================================================== */

btnJugar.addEventListener(
    "click",
    iniciarJuego
);


/* =====================================================
   INICIAR JUEGO
===================================================== */

function iniciarJuego() {

    estado = crearEstado();

    estado.jugando = true;


    modalError.classList.add("oculto");

    modalNivel.classList.add("oculto");

    modalGameOver.classList.add("oculto");

    consejo.classList.add("oculto");


    menuInicio.classList.add("oculto");

    juego.classList.remove("oculto");


    iniciarMovimientoCanon();

    actualizarHUD();

    generarResiduo();

}


/* =====================================================
   CAÑÓN MÓVIL
===================================================== */

function iniciarMovimientoCanon() {

    if (movimientoCanon) {

        clearInterval(movimientoCanon);

    }


    let direccion = 1;

    let posicion = 50;


    movimientoCanon = setInterval(() => {

        if (!estado.jugando ||
            estado.bloqueado) {

            return;

        }


        posicion += direccion * 0.25;


        if (posicion >= 67) {

            direccion = -1;

        }


        if (posicion <= 33) {

            direccion = 1;

        }


        zonaCanon.style.left =
            `${posicion}%`;


        apuntarCanon();

    }, 30);

}


/* =====================================================
   APUNTAR EL CAÑÓN AL RESIDUO
===================================================== */

function apuntarCanon() {

    const residuoRect =
        zonaResiduo.getBoundingClientRect();

    const canonRect =
        canonTubo.getBoundingClientRect();


    const cx =
        canonRect.left +
        canonRect.width / 2;

    const cy =
        canonRect.top +
        canonRect.height / 2;


    const rx =
        residuoRect.left +
        residuoRect.width / 2;

    const ry =
        residuoRect.top +
        residuoRect.height / 2;


    const angulo =
        Math.atan2(
            ry - cy,
            rx - cx
        ) * 180 / Math.PI;


    canonTubo.style.transform =
        `rotate(${angulo}deg)`;

}


/* =====================================================
   GENERAR RESIDUO
===================================================== */

function generarResiduo() {

    if (!estado.jugando) {

        return;

    }


    estado.bloqueado = false;


    const indice =
        Math.floor(
            Math.random() *
            residuos.length
        );


    estado.residuoActual =
        residuos[indice];


    residuoHTML.textContent =
        estado.residuoActual.emoji;


    nombreResiduoHTML.textContent =
        estado.residuoActual.nombre;


    zonaResiduo.classList.remove(
        "nuevo-residuo"
    );


    void zonaResiduo.offsetWidth;


    zonaResiduo.classList.add(
        "nuevo-residuo"
    );


    estado.inicioResiduo =
        Date.now();


    setTimeout(
        apuntarCanon,
        50
    );

}


/* =====================================================
   CONTENEDORES
===================================================== */

document
    .querySelectorAll(".contenedor")
    .forEach(contenedor => {

        contenedor.addEventListener(
            "click",
            () => {

                clasificarResiduo(
                    contenedor.dataset.tipo,
                    contenedor
                );

            }
        );

    });


/* =====================================================
   CLASIFICAR RESIDUO
===================================================== */

function clasificarResiduo(
    tipoSeleccionado,
    contenedorObjetivo = null
) {

    if (!estado.jugando ||
        estado.bloqueado ||
        !estado.residuoActual) {

        return;

    }


    estado.bloqueado = true;


    const residuo =
        estado.residuoActual;


    const tiempo =
        (Date.now() -
            estado.inicioResiduo) / 1000;


    dispararCanon(
        contenedorObjetivo,
        residuo.emoji,
        () => {

            if (
                tipoSeleccionado ===
                residuo.tipo
            ) {

                acertarResiduo(
                    tiempo
                );

            }

            else {

                fallarResiduo();

            }

        }
    );

}


/* =====================================================
   DISPARO ANIMADO
===================================================== */

function dispararCanon(
    contenedorObjetivo,
    emoji,
    callback
) {

    canon.classList.remove(
        "disparando",
        "exito"
    );


    void canon.offsetWidth;


    canon.classList.add(
        "disparando"
    );


    crearExplosionBoca();


    const inicio =
        obtenerPuntoBocaCanon();


    const fin =
        contenedorObjetivo

            ? obtenerCentro(
                contenedorObjetivo
            )

            : {
                x: window.innerWidth / 2,
                y: window.innerHeight
            };


    proyectil.textContent =
        emoji;


    proyectil.classList.remove(
        "volando"
    );


    void proyectil.offsetWidth;


    proyectil.classList.add(
        "volando"
    );


    proyectil.style.left =
        `${inicio.x}px`;

    proyectil.style.top =
        `${inicio.y}px`;

    proyectil.style.transition =
        "none";


    /* TRAYECTORIA */

    trayectoria.style.left =
        `${inicio.x}px`;

    trayectoria.style.top =
        `${inicio.y}px`;


    trayectoria.style.width =
        `${Math.hypot(
            fin.x - inicio.x,
            fin.y - inicio.y
        )}px`;


    trayectoria.style.transform =
        `rotate(${
            Math.atan2(
                fin.y - inicio.y,
                fin.x - inicio.x
            ) * 180 / Math.PI
        }deg)`;


    trayectoria.classList.add(
        "mostrar-trayectoria"
    );


    /* MOVIMIENTO */

    requestAnimationFrame(() => {

        proyectil.style.transition =
            "left .55s cubic-bezier(.25,.7,.35,1), " +
            "top .55s cubic-bezier(.25,.7,.35,1), " +
            "transform .55s ease";


        proyectil.style.left =
            `${fin.x}px`;


        proyectil.style.top =
            `${fin.y}px`;


        proyectil.style.transform =
            "translate(-50%, -50%) " +
            "scale(.65) " +
            "rotate(360deg)";

    });


    /* FINAL DEL DISPARO */

    setTimeout(() => {

        proyectil.classList.remove(
            "volando"
        );


        trayectoria.classList.remove(
            "mostrar-trayectoria"
        );


        crearImpacto(
            fin.x,
            fin.y
        );


        callback();

    }, 600);

}


/* =====================================================
   OBTENER BOCA DEL CAÑÓN
===================================================== */

function obtenerPuntoBocaCanon() {

    const rect =
        canonTubo.getBoundingClientRect();


    const angulo =
        parseFloat(

            canonTubo.style.transform
                .replace(
                    "rotate(",
                    ""
                )
                .replace(
                    "deg)",
                    ""
                )

        ) || 0;


    const rad =
        angulo *
        Math.PI /
        180;


    return {

        x:
            rect.left +
            rect.width / 2 +
            Math.cos(rad) * 48,

        y:
            rect.top +
            rect.height / 2 +
            Math.sin(rad) * 48

    };

}


/* =====================================================
   OBTENER CENTRO DEL CONTENEDOR
===================================================== */

function obtenerCentro(elemento) {

    const rect =
        elemento.getBoundingClientRect();


    return {

        x:
            rect.left +
            rect.width / 2,

        y:
            rect.top +
            rect.height / 2

    };

}


/* =====================================================
   EXPLOSIÓN EN LA BOCA DEL CAÑÓN
===================================================== */

function crearExplosionBoca() {

    const punto =
        obtenerPuntoBocaCanon();


    const flash =
        document.createElement("div");


    flash.className =
        "flash-disparo";


    flash.style.left =
        `${punto.x}px`;


    flash.style.top =
        `${punto.y}px`;


    document.body.appendChild(
        flash
    );


    setTimeout(
        () => flash.remove(),
        350
    );

}


/* =====================================================
   IMPACTO
===================================================== */

function crearImpacto(x, y) {

    const impacto =
        document.createElement("div");


    impacto.className =
        "impacto";


    impacto.style.left =
        `${x}px`;


    impacto.style.top =
        `${y}px`;


    document.body.appendChild(
        impacto
    );


    for (
        let i = 0;
        i < 8;
        i++
    ) {

        const particula =
            document.createElement(
                "span"
            );


        particula.className =
            "mini-particula";


        particula.style.setProperty(
            "--dx",
            `${Math.cos(i) * 45}px`
        );


        particula.style.setProperty(
            "--dy",
            `${Math.sin(i) * 45}px`
        );


        impacto.appendChild(
            particula
        );

    }


    setTimeout(
        () => impacto.remove(),
        500
    );

}


/* =====================================================
   ACIERTO
===================================================== */

function acertarResiduo(tiempo) {

    estado.aciertosNivel++;

    estado.combo++;


    if (
        estado.combo >
        estado.mejorCombo
    ) {

        estado.mejorCombo =
            estado.combo;

    }


    /* MULTIPLICADOR */

    let multiplicador = 1;


    if (estado.combo >= 10) {

        multiplicador = 5;

    }

    else if (estado.combo >= 5) {

        multiplicador = 3;

    }

    else if (estado.combo >= 3) {

        multiplicador = 2;

    }


    /* PUNTOS */

    let puntosGanados =
        tiempo <= 1.5
            ? 150
            : 100;


    puntosGanados *=
        multiplicador;


    estado.puntos +=
        puntosGanados;


    canon.classList.add(
        "exito"
    );


    mostrarFeedback(
        `+${puntosGanados} ⭐`,
        "exito"
    );


    crearParticulasVerdes();


    actualizarHUD();


    setTimeout(
        comprobarNivel,
        350
    );

}


/* =====================================================
   ERROR
===================================================== */

function fallarResiduo() {

    estado.vidas--;

    estado.errores++;

    estado.combo = 0;


    estado.puntos =
        Math.max(
            0,
            estado.puntos - 50
        );


    mostrarFeedback(
        "-50 ❤️",
        "error"
    );


    actualizarHUD();


    setTimeout(
        mostrarError,
        350
    );

}


/* =====================================================
   MOSTRAR ERROR
===================================================== */

function mostrarError() {

    const residuo =
        estado.residuoActual;


    textoError.textContent =
        `🍃 ${residuo.explicacion}`;


    respuestaCorrecta.textContent =
        residuo.contenedor;


    modalError.classList.remove(
        "oculto"
    );

}


/* =====================================================
   CONTINUAR DESPUÉS DEL ERROR
===================================================== */

btnContinuar.addEventListener(
    "click",
    () => {

        modalError.classList.add(
            "oculto"
        );


        if (estado.vidas <= 0) {

            terminarJuego();

            return;

        }


        comprobarNivel();

    }
);


/* =====================================================
   COMPROBAR NIVEL
===================================================== */

function comprobarNivel() {

    const objetivo =
        niveles[
            estado.nivel
        ].objetivo;


    if (
        estado.aciertosNivel >=
        objetivo
    ) {

        completarNivel();

    }

    else {

        generarResiduo();

    }

}


/* =====================================================
   COMPLETAR NIVEL
===================================================== */

function completarNivel() {

    estado.bloqueado = true;


    nivelPuntos.textContent =
        estado.puntos;


    nivelAciertos.textContent =
        estado.aciertosNivel;


    nivelCombo.textContent =
        estado.mejorCombo;


    if (
        estado.mejorCombo >= 10
    ) {

        evaluacionNivel.textContent =
            "🏆 ¡Excelente reciclador!";

    }

    else if (
        estado.mejorCombo >= 5
    ) {

        evaluacionNivel.textContent =
            "🌱 ¡Buen trabajo!";

    }

    else {

        evaluacionNivel.textContent =
            "♻️ Reciclador en progreso";

    }


    btnSiguienteNivel.textContent =

        estado.nivel >= 4

            ? "🏆 TERMINAR JUEGO"

            : "SIGUIENTE NIVEL ▶";


    modalNivel.classList.remove(
        "oculto"
    );

}


/* =====================================================
   SIGUIENTE NIVEL
===================================================== */

btnSiguienteNivel.addEventListener(
    "click",
    () => {

        modalNivel.classList.add(
            "oculto"
        );


        if (
            estado.nivel >= 4
        ) {

            mostrarVictoria();

            return;

        }


        estado.nivel++;

        estado.aciertosNivel = 0;

        estado.combo = 0;


        actualizarHUD();

        mostrarConsejo();


        setTimeout(
            generarResiduo,
            1000
        );

    }
);


/* =====================================================
   CONSEJO EDUCATIVO
===================================================== */

function mostrarConsejo() {

    const indice =
        Math.floor(
            Math.random() *
            consejos.length
        );


    textoConsejo.textContent =
        consejos[indice];


    consejo.classList.remove(
        "oculto"
    );


    setTimeout(
        () => {

            consejo.classList.add(
                "oculto"
            );

        },
        4500
    );

}


/* =====================================================
   VICTORIA
===================================================== */

function mostrarVictoria() {

    estado.jugando = false;


    puntosFinales.textContent =
        estado.puntos;


    nivelFinal.textContent =
        "4";


    modalGameOver
        .querySelector(
            ".modal-icon"
        )
        .textContent = "🌎";


    modalGameOver
        .querySelector("h2")
        .textContent =
            "¡Salvaste la ciudad!";


    modalGameOver
        .querySelector("p")
        .textContent =
            "Has completado todos los niveles. ¡Eres un verdadero defensor del planeta!";


    btnReintentar.textContent =
        "🔄 JUGAR DE NUEVO";


    modalGameOver.classList.remove(
        "oculto"
    );

}


/* =====================================================
   GAME OVER
===================================================== */

function terminarJuego() {

    estado.jugando = false;


    puntosFinales.textContent =
        estado.puntos;


    nivelFinal.textContent =
        estado.nivel;


    modalGameOver
        .querySelector(
            ".modal-icon"
        )
        .textContent = "🌱";


    modalGameOver
        .querySelector("h2")
        .textContent =
            "¡Casi lo logras!";


    modalGameOver
        .querySelector("p")
        .textContent =
            "Repasemos tus errores. Cada intento te ayuda a aprender a reciclar mejor.";


    btnReintentar.textContent =
        "🔄 REINTENTAR";


    modalGameOver.classList.remove(
        "oculto"
    );

}


/* =====================================================
   REINTENTAR
===================================================== */

btnReintentar.addEventListener(
    "click",
    () => {

        iniciarJuego();

    }
);


/* =====================================================
   VOLVER AL MENÚ
===================================================== */

btnMenu.addEventListener(
    "click",
    () => {

        estado.jugando = false;


        if (movimientoCanon) {

            clearInterval(
                movimientoCanon
            );

        }


        modalGameOver.classList.add(
            "oculto"
        );


        modalNivel.classList.add(
            "oculto"
        );


        modalError.classList.add(
            "oculto"
        );


        juego.classList.add(
            "oculto"
        );


        menuInicio.classList.remove(
            "oculto"
        );

    }
);


/* =====================================================
   ACTUALIZAR HUD
===================================================== */

function actualizarHUD() {

    puntosHTML.textContent =
        estado.puntos;


    vidasHTML.textContent =
        estado.vidas;


    comboHTML.textContent =
        estado.combo;


    nivelHTML.textContent =
        estado.nivel;


    const objetivo =
        niveles[
            estado.nivel
        ].objetivo;


    const progreso =
        Math.min(

            (
                estado.aciertosNivel /
                objetivo
            ) * 100,

            100

        );


    barraProgreso.style.width =
        `${progreso}%`;


    progresoTexto.textContent =
        `${estado.aciertosNivel} / ${objetivo}`;


    cambiarAmbiente();

}


/* =====================================================
   FEEDBACK
===================================================== */

function mostrarFeedback(
    texto,
    clase
) {

    feedback.textContent =
        texto;


    feedback.className =
        "feedback";


    void feedback.offsetWidth;


    feedback.classList.add(
        clase
    );

}


/* =====================================================
   PARTÍCULAS VERDES
===================================================== */

function crearParticulasVerdes() {

    const rect =
        zonaResiduo.getBoundingClientRect();


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const p =
            document.createElement(
                "span"
            );


        p.className =
            "particula-verde";


        p.style.left =
            `${rect.left +
            rect.width / 2}px`;


        p.style.top =
            `${rect.top +
            rect.height / 2}px`;


        p.style.setProperty(
            "--x",
            `${(
                Math.random() - .5
            ) * 160}px`
        );


        p.style.setProperty(
            "--y",
            `${(
                Math.random() - .5
            ) * 100}px`
        );


        document.body.appendChild(
            p
        );


        setTimeout(
            () => p.remove(),
            650
        );

    }

}


/* =====================================================
   TECLADO
   1 = Orgánico
   2 = Papel
   3 = Plástico
   4 = Vidrio
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (!estado.jugando) return;


        const teclas = {

            "1": "organico",

            "2": "papel",

            "3": "plastico",

            "4": "vidrio"

        };


        if (teclas[event.key]) {

            const contenedor =
                document.querySelector(
                    `.contenedor[data-tipo="${teclas[event.key]}"]`
                );


            clasificarResiduo(
                teclas[event.key],
                contenedor
            );

        }

    }
);


/* =====================================================
   CAMBIAR AMBIENTE SEGÚN NIVEL
===================================================== */

function cambiarAmbiente() {

    if (!escenario) return;


    if (estado.nivel === 1) {

        escenario.style.filter =
            "saturate(1)";

    }

    else if (estado.nivel === 2) {

        escenario.style.filter =
            "saturate(1.08)";

    }

    else if (estado.nivel === 3) {

        escenario.style.filter =
            "saturate(1.18)";

    }

    else {

        escenario.style.filter =
            "saturate(1.28)";

    }

}


/* =====================================================
   AJUSTAR CAÑÓN AL CAMBIAR TAMAÑO
===================================================== */

window.addEventListener(
    "resize",
    () => {

        if (estado.jugando) {

            apuntarCanon();

        }

    }
);
