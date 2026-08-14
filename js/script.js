(function () {
  const hero = document.getElementById('hero');
  const stage = document.querySelector('.stage');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const RED_CORE = [255, 59, 47];
  const RED_GLOW = [224, 38, 26];
  const GREEN_CORE = [57, 224, 138];
  const GREEN_GLOW = [31, 174, 99];

  function clamp(v, a, b) {
    return Math.min(b, Math.max(a, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function remap(p, start, end) {
    return clamp((p - start) / (end - start), 0, 1);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }

  function mixColor(c1, c2, t) {
    return `rgb(${Math.round(lerp(c1[0], c2[0], t))}, ${Math.round(lerp(c1[1], c2[1], t))}, ${Math.round(lerp(c1[2], c2[2], t))})`;
  }

  let ticking = false;

  function render() {
    ticking = false;
    const rect = hero.getBoundingClientRect();
    const total = hero.offsetHeight - window.innerHeight;
    const raw = total > 0 ? -rect.top / total : 0;
    const p = clamp(raw, 0, 1);

    // Phase 1: activation (red -> green)
    const colorP = easeInOutQuad(remap(p, 0.10, 0.46));
    const glowP = easeOutCubic(remap(p, 0.08, 0.50));
    const pulseP = Math.sin(clamp(remap(p, 0.34, 0.50), 0, 1) * Math.PI) * (1 - remap(p, 0.46, 0.60));

    const coreColor = mixColor(RED_CORE, GREEN_CORE, colorP);
    const glowColor = mixColor(RED_GLOW, GREEN_GLOW, colorP);

    // Phase 2: identity reveal
    const nameP = easeOutCubic(remap(p, 0.52, 0.66));
    const roleP = easeOutCubic(remap(p, 0.62, 0.76));
    const quoteP = easeOutCubic(remap(p, 0.74, 0.90));
    const shiftP = easeOutCubic(remap(p, 0.50, 0.86));
    const contentT = Math.max(nameP, roleP, quoteP);
    const awakeT = remap(p, 0.30, 0.34);

    stage.style.setProperty('--led-core-color', coreColor);
    stage.style.setProperty('--led-glow-color', glowColor);
    stage.style.setProperty('--led-glow', glowP);
    stage.style.setProperty('--led-pulse', Math.max(0, pulseP));
    stage.style.setProperty('--led-shift', shiftP);
    stage.style.setProperty('--name-t', nameP);
    stage.style.setProperty('--role-t', roleP);
    stage.style.setProperty('--quote-t', quoteP);
    stage.style.setProperty('--content-t', contentT);
    stage.style.setProperty('--awake-t', awakeT);
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(render);
      ticking = true;
    }
  }

  if (reduceMotion) {
    hero.style.height = '100vh';
    stage.style.setProperty('--led-core-color', mixColor(GREEN_CORE, GREEN_CORE, 1));
    stage.style.setProperty('--led-glow-color', mixColor(GREEN_GLOW, GREEN_GLOW, 1));
    stage.style.setProperty('--led-glow', 0.6);
    stage.style.setProperty('--led-shift', 1);
    stage.style.setProperty('--name-t', 1);
    stage.style.setProperty('--role-t', 1);
    stage.style.setProperty('--quote-t', 1);
    stage.style.setProperty('--content-t', 1);
    stage.style.setProperty('--awake-t', 1);
  } else {
    render();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }
})();

// LÓGICA DE TARJETAS APILADAS (TESTIMONIALS STACK)
(function initTestimonialsStack() {
  const cards = Array.from(document.querySelectorAll('.testimonial-card'));
  const dots = Array.from(document.querySelectorAll('.testimonials__dots .dot'));
  const btnNext = document.getElementById('nextTestimonial');
  const btnPrev = document.getElementById('prevTestimonial');

  if (!cards.length) return;

  let currentIndex = 0;
  let isAnimating = false;

  function updateStack() {
    cards.forEach((card, i) => {
      card.classList.remove('active', 'next-1', 'next-2', 'hidden', 'swiping');

      const indexDiff = (i - currentIndex + cards.length) % cards.length;

      if (indexDiff === 0) {
        card.classList.add('active');
      } else if (indexDiff === 1) {
        card.classList.add('next-1');
      } else if (indexDiff === 2) {
        card.classList.add('next-2');
      } else {
        card.classList.add('hidden');
      }
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function nextCard() {
    if (isAnimating) return;
    isAnimating = true;

    const activeCard = cards[currentIndex];
    activeCard.classList.add('swiping');

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      updateStack();
      isAnimating = false;
    }, 350);
  }

  function prevCard() {
    if (isAnimating) return;
    isAnimating = true;

    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    updateStack();

    setTimeout(() => {
      isAnimating = false;
    }, 350);
  }

  if (btnNext) btnNext.addEventListener('click', nextCard);
  if (btnPrev) btnPrev.addEventListener('click', prevCard);

  updateStack();
})();

document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("contactForm");
    const formResult = document.getElementById("form-result");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.getElementById("btnText");

    if (contactForm) {
        contactForm.addEventListener("submit", async function(event) {
            event.preventDefault();
            btnText.textContent = "Enviando...";
            submitBtn.disabled = true;
            formResult.style.display = "block";
            formResult.className = "form-result loading";
            formResult.textContent = "Enviando tu mensaje...";

            const formData = new FormData(contactForm);

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    formResult.className = "form-result success";
                    formResult.textContent = "¡Mensaje enviado con éxito! Te responderé en breve.";
                    contactForm.reset();
                } else {
                    formResult.className = "form-result error";
                    formResult.textContent = "Hubo un problema al enviar el mensaje. Inténtalo de nuevo.";
                }
            } catch (error) {
                formResult.className = "form-result error";
                formResult.textContent = "Error de conexión. Por favor revisa tu red e inténtalo más tarde.";
            } finally {
                btnText.textContent = "Enviar mensaje";
                submitBtn.disabled = false;
            }
        });
    }
});