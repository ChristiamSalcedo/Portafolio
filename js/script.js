let index = 0;
const frasesES = [
  "amante del vino🍷", 
  "viajero del mundo🌍",
  "fan de la playa🏖️",
  "fotógrafo aficionado en mis ratos libres📸",
  "cocinero experimental los fines de semana👨‍🍳",
  "explorador de mundos abiertos🎮"
];
const frasesEN = [
  "wine lover🍷",
  "world traveler🌍",
  "beach enthusiast🏖️",
  "amateur photographer in my free time📸",
  "experimental cook on weekends👨‍🍳",
  "open-world explorer🎮"
];

const dynamicText = document.getElementById("dynamic-text");

function actualizarFraseDinamica() {
  const esModoEn = document.body.classList.contains("modo-en");
  dynamicText.textContent = esModoEn ? frasesEN[index] : frasesES[index];
}

setInterval(() => {
  index = (index + 1) % frasesES.length;
  dynamicText.style.opacity = 0;

  setTimeout(() => {
    actualizarFraseDinamica();
    dynamicText.style.opacity = 1;
  }, 300);
}, 2000);

function cambiarIdioma() {
  document.body.classList.toggle("modo-en");

  document.querySelectorAll("[data-es]").forEach(el => {
    const esModoEn = document.body.classList.contains("modo-en");
    el.textContent = esModoEn ? el.dataset.en : el.dataset.es;
  });

  const toggleBtn = document.getElementById("toggle-language");
  toggleBtn.textContent = document.body.classList.contains("modo-en") ? "ES" : "EN";

  // 🔁 Forzar que la frase dinámica se actualice inmediatamente
  actualizarFraseDinamica();
}


  // Scroll hacia la sección de roles
  window.scrollToNextSection = function (event) {
    if (event) event.preventDefault();
    const nextSection = document.getElementById("roles");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

    // Scroll al inicio
  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

// modo claro-oscuro//

window.toggleDarkMode = function () {
  document.body.classList.toggle("dark-mode");
};

window.toggleDarkMode = function () {
  document.body.classList.toggle("dark-mode");

  const iconoTema = document.getElementById("tema-icono");

  if (document.body.classList.contains("dark-mode")) {
     iconoTema.src = "iconos/moon.png";
    iconoTema.alt = "Modo oscuro";
  } else {
    iconoTema.src = "iconos/sun.png";
    iconoTema.alt = "Modo claro";
  }
};

// Convertidor de lenguaje

function cambiarIdioma() {
  document.body.classList.toggle("modo-en");

  document.querySelectorAll("[data-es]").forEach(el => {
    const esModoEn = document.body.classList.contains("modo-en");
    el.textContent = esModoEn ? el.dataset.en : el.dataset.es;
  });

  document.getElementById("toggle-language").textContent =
    document.body.classList.contains("modo-en") ? "ES" : "EN";

  localStorage.setItem("idioma", document.body.classList.contains("modo-en") ? "en" : "es");
  actualizarFraseDinamica();
}


const idiomaGuardado = localStorage.getItem("idioma");
if (idiomaGuardado === "en") {
  document.body.classList.add("modo-en");
  document.querySelectorAll("[data-es]").forEach(el => {
    el.textContent = el.dataset.en;
  });
  document.getElementById("toggle-language").textContent = "ES";
}