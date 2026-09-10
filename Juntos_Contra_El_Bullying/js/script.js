/* ============================================================
   BARRA DE PROGRESO + NAV FLOTANTE
============================================================ */
const barraProgreso = document.getElementById('barra-progreso');
const encabezado = document.getElementById('encabezado');
function alDesplazar(){
  const alto = document.documentElement.scrollHeight - window.innerHeight;
  const porcentaje = alto > 0 ? (window.scrollY / alto) * 100 : 0;
  barraProgreso.style.width = porcentaje + '%';
  encabezado.classList.toggle('nav-flotante', window.scrollY > 40);
}
document.addEventListener('scroll', alDesplazar, {passive:true});
alDesplazar();

/* ============================================================
   MENÚ HAMBURGUESA
============================================================ */
const botonHamburguesa = document.getElementById('boton-hamburguesa');
const menuNav = document.getElementById('menu-nav');
botonHamburguesa.addEventListener('click', () => {
  const abierto = menuNav.classList.toggle('abierto');
  botonHamburguesa.classList.toggle('abierto', abierto);
  botonHamburguesa.setAttribute('aria-expanded', abierto);
});
menuNav.querySelectorAll('a').forEach(enlace => {
  enlace.addEventListener('click', () => {
    menuNav.classList.remove('abierto');
    botonHamburguesa.classList.remove('abierto');
    botonHamburguesa.setAttribute('aria-expanded', 'false');
  });
});

/* ============================================================
   ENLACE ACTIVO SEGÚN SECCIÓN VISIBLE
============================================================ */
const enlacesNav = document.querySelectorAll('.menu-nav a');
const seccionesConId = [...document.querySelectorAll('main section[id]')];
const observadorNav = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if(entrada.isIntersecting){
      const id = entrada.target.getAttribute('id');
      enlacesNav.forEach(enlace => {
        enlace.classList.toggle('activo', enlace.getAttribute('href') === '#' + id);
      });
    }
  });
}, {rootMargin:'-45% 0px -50% 0px'});
seccionesConId.forEach(s => observadorNav.observe(s));

/* ============================================================
   REVELADO AL HACER SCROLL
============================================================ */
const elementosRevelar = document.querySelectorAll('.rev');
const observadorRevelado = new IntersectionObserver((entradas, obs) => {
  entradas.forEach(entrada => {
    if(entrada.isIntersecting){
      entrada.target.classList.add('en-vista');
      obs.unobserve(entrada.target);
    }
  });
}, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
elementosRevelar.forEach(el => {
  if(!el.closest('.hero')) observadorRevelado.observe(el);
});

/* Animación de entrada del hero (secuencia orquestada única) */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.hero .rev').forEach(el => el.classList.add('en-vista'));
  }, 120);
});

/* ============================================================
   CONTADORES ANIMADOS + BARRAS COMPARATIVAS
============================================================ */
function animarContador(el){
  const meta = parseInt(el.dataset.contador, 10);
  const spanUnidad = el.querySelector('span');
  const textoUnidad = spanUnidad ? spanUnidad.outerHTML : '';
  let actual = 0;
  const duracion = 1200;
  const inicio = performance.now();
  function paso(ahora){
    const progreso = Math.min((ahora - inicio) / duracion, 1);
    actual = Math.round(progreso * meta);
    el.innerHTML = actual + textoUnidad;
    if(progreso < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
}
const observadorDatos = new IntersectionObserver((entradas, obs) => {
  entradas.forEach(entrada => {
    if(entrada.isIntersecting){
      const el = entrada.target;
      if(el.dataset.contador) animarContador(el);
      if(el.dataset.ancho) el.style.width = el.dataset.ancho + '%';
      obs.unobserve(el);
    }
  });
}, {threshold:.4});
document.querySelectorAll('[data-contador], [data-ancho]').forEach(el => observadorDatos.observe(el));

/* ============================================================
   ACTIVIDAD INTERACTIVA — ¿QUÉ HARÍAS TÚ?
============================================================ */
const escenarios = [
  {
    pregunta: "Ves que un compañero está siendo excluido constantemente por otros estudiantes en el receso.",
    opciones: [
      { texto: "Ignoro la situación, no es asunto mío.", recomendada:false, retro:"Quedarse indiferente permite que la exclusión continúe. Aunque no la provoques, tu silencio también pesa." },
      { texto: "Me acerco, lo incluyo en mi grupo y luego lo comento con un profesor de confianza.", recomendada:true, retro:"Acompañar e informar es la forma más segura de ayudar: nadie queda solo y un adulto puede intervenir." },
      { texto: "Me río también para no quedar mal con el grupo.", recomendada:false, retro:"Sumarse, aunque sea por presión del grupo, refuerza el acoso. Puedes elegir no participar." }
    ]
  },
  {
    pregunta: "Un compañero te cuenta en privado que recibe mensajes ofensivos por redes sociales de otros estudiantes del curso.",
    opciones: [
      { texto: "Le digo que guarde las capturas de pantalla, lo acompaño y avisamos juntos a un adulto de confianza.", recomendada:true, retro:"Guardar la evidencia y buscar apoyo juntos ayuda a que la situación se atienda correctamente." },
      { texto: "Le digo que lo bloquee y no hable más del tema con nadie.", recomendada:false, retro:"Bloquear puede ayudar, pero no basta por sí solo: la situación también necesita el apoyo de un adulto." },
      { texto: "Comparto lo que me contó con otros compañeros del curso.", recomendada:false, retro:"Romper su confianza puede empeorar la situación. Lo que te confía en privado debe mantenerse así, salvo para pedir ayuda a un adulto." }
    ]
  },
  {
    pregunta: "Durante un trabajo en grupo, un compañero se queda callado y con la mirada baja mientras otros hacen comentarios burlones sobre su forma de hablar.",
    opciones: [
      { texto: "Cambio de tema con naturalidad y después hablo con él en privado para saber cómo está.", recomendada:true, retro:"Frenar el momento y luego acompañar en privado combina rapidez y cuidado por la otra persona." },
      { texto: "No digo nada, prefiero no involucrarme en el momento.", recomendada:false, retro:"Entendible sentir duda, pero el silencio deja a tu compañero sin apoyo justo cuando más lo necesita." },
      { texto: "Le digo al grupo, con respeto, que ese comentario no está bien.", recomendada:true, retro:"Nombrar la situación con respeto, sin agredir a nadie, es una forma valiente y directa de poner un límite." }
    ]
  }
];

let indiceActual = 0;
const contenedorPreguntas = document.getElementById('contenedor-preguntas');
const puntosProgreso = document.querySelectorAll('.punto-progreso');
const pantallaFinal = document.getElementById('pantalla-final');
const tarjetaActividad = document.querySelector('.tarjeta-actividad');

function renderizarEscenario(indice){
  const datos = escenarios[indice];
  contenedorPreguntas.innerHTML = `
    <p class="contador-actividad">Situación ${indice + 1} de ${escenarios.length}</p>
    <p class="pregunta-actividad">${datos.pregunta}</p>
    <div class="opciones-actividad" id="opciones-actividad"></div>
    <div class="retro-actividad" id="retro-actividad">
      <span class="etiqueta-retro">Reflexión</span>
      <p id="texto-retro"></p>
    </div>
    <div class="pie-actividad">
      <button class="btn btn-primario" id="boton-siguiente" style="display:none;">${indice === escenarios.length - 1 ? 'Ver resultado' : 'Siguiente situación'}</button>
    </div>
  `;
  const contOpciones = document.getElementById('opciones-actividad');
  datos.opciones.forEach((op, i) => {
    const boton = document.createElement('button');
    boton.className = 'opcion-actividad';
    boton.textContent = op.texto;
    boton.addEventListener('click', () => {
      contOpciones.querySelectorAll('.opcion-actividad').forEach(b => b.classList.remove('elegida'));
      boton.classList.add('elegida');
      const retro = document.getElementById('retro-actividad');
      const textoRetro = document.getElementById('texto-retro');
      const etiqueta = retro.querySelector('.etiqueta-retro');
      etiqueta.textContent = op.recomendada ? 'Buena elección' : 'Reflexión';
      textoRetro.textContent = op.retro;
      retro.classList.add('visible');
      document.getElementById('boton-siguiente').style.display = 'inline-flex';
      contOpciones.querySelectorAll('.opcion-actividad').forEach(b => b.disabled = true);
    });
    contOpciones.appendChild(boton);
  });
  document.getElementById('boton-siguiente').addEventListener('click', () => {
    indiceActual++;
    if(indiceActual < escenarios.length){
      actualizarPuntos(indiceActual);
      renderizarEscenario(indiceActual);
    } else {
      contenedorPreguntas.style.display = 'none';
      document.getElementById('progreso-actividad').style.display = 'none';
      pantallaFinal.classList.add('visible');
    }
  });
}

function actualizarPuntos(indice){
  puntosProgreso.forEach((p, i) => {
    p.classList.toggle('activo', i === indice);
    p.classList.toggle('hecho', i < indice);
  });
}

document.getElementById('boton-reiniciar').addEventListener('click', () => {
  indiceActual = 0;
  actualizarPuntos(0);
  contenedorPreguntas.style.display = 'block';
  document.getElementById('progreso-actividad').style.display = 'flex';
  pantallaFinal.classList.remove('visible');
  renderizarEscenario(0);
});

renderizarEscenario(0);

/* ============================================================
   CARRUSEL DE FRASES
============================================================ */
const rielesCarrusel = document.getElementById('rieles-carrusel');
const diapositivas = document.querySelectorAll('.diapositiva');
const puntosCarruselCont = document.getElementById('puntos-carrusel');
let indiceCarrusel = 0;

diapositivas.forEach((_, i) => {
  const punto = document.createElement('button');
  punto.className = 'punto-carrusel' + (i === 0 ? ' activo' : '');
  punto.setAttribute('aria-label', 'Ir a la frase ' + (i + 1));
  punto.addEventListener('click', () => irADiapositiva(i));
  puntosCarruselCont.appendChild(punto);
});
const puntosCarrusel = document.querySelectorAll('.punto-carrusel');

function irADiapositiva(i){
  indiceCarrusel = (i + diapositivas.length) % diapositivas.length;
  rielesCarrusel.style.transform = `translateX(-${indiceCarrusel * 100}%)`;
  puntosCarrusel.forEach((p, idx) => p.classList.toggle('activo', idx === indiceCarrusel));
}
document.getElementById('flecha-anterior').addEventListener('click', () => irADiapositiva(indiceCarrusel - 1));
document.getElementById('flecha-siguiente').addEventListener('click', () => irADiapositiva(indiceCarrusel + 1));

let reproduccionAutomatica = setInterval(() => irADiapositiva(indiceCarrusel + 1), 5500);
const carruselEl = document.querySelector('.carrusel');
carruselEl.addEventListener('mouseenter', () => clearInterval(reproduccionAutomatica));
carruselEl.addEventListener('mouseleave', () => {
  reproduccionAutomatica = setInterval(() => irADiapositiva(indiceCarrusel + 1), 5500);
});

/* ============================================================
   COMPROMISO ESCOLAR
============================================================ */
const botonCompromiso = document.getElementById('boton-compromiso');
const estadoInicial = document.getElementById('estado-compromiso-inicial');
const estadoGracias = document.getElementById('estado-gracias');
botonCompromiso.addEventListener('click', () => {
  estadoInicial.style.display = 'none';
  estadoGracias.classList.add('visible');
});
