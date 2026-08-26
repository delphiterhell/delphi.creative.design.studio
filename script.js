document.addEventListener("DOMContentLoaded", () => {

  /*
  |--------------------------------------------------------------------------
  | HERO LOAD
  |--------------------------------------------------------------------------
  */

  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });


  /*
  |--------------------------------------------------------------------------
  | PALETTE CARDS
  |--------------------------------------------------------------------------
  */

  const paletteCards =
    document.querySelectorAll(".palette-card");

  paletteCards.forEach(card => {
    card.addEventListener("click", () => {
      const alreadyActive =
        card.classList.contains("is-active");

      paletteCards.forEach(item => {
        item.classList.remove("is-active");
      });

      if (!alreadyActive) {
        card.classList.add("is-active");
      }
    });
  });


  /*
  |--------------------------------------------------------------------------
  | HERO IMAGE PARALLAX
  |--------------------------------------------------------------------------
  |
  | Qui viene selezionata .hero-image, non .hero-video.
  |
  */

  const hero =
    document.querySelector(".hero");

  const heroImage =
    document.querySelector(".hero-image");

  const finePointer =
    window.matchMedia("(pointer: fine)");

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  if (
    hero &&
    heroImage &&
    finePointer.matches &&
    !reducedMotion.matches
  ) {
    hero.addEventListener("mousemove", event => {
      const rect =
        hero.getBoundingClientRect();

      const mouseX =
        (
          event.clientX -
          rect.left
        ) /
        rect.width -
        0.5;

      const mouseY =
        (
          event.clientY -
          rect.top
        ) /
        rect.height -
        0.5;

      const moveX =
        mouseX * 7;

      const moveY =
        mouseY * 5;

      heroImage.style.transform =
        `scale(1.025) translate(${moveX}px, ${moveY}px)`;
    });

    hero.addEventListener("mouseleave", () => {
      heroImage.style.transform =
        "scale(1.02) translate(0, 0)";
    });
  }


  /*
  |--------------------------------------------------------------------------
  | CROSS CURSOR FOLLOWER (solo dentro la hero)
  |--------------------------------------------------------------------------
  */

  const crossFollower =
    document.querySelector(".cross-top");

  if (
    hero &&
    crossFollower &&
    finePointer.matches &&
    !reducedMotion.matches
  ) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let crossRafId = null;

    function renderCrossFollower() {
      currentX += (targetX - currentX) * 0.13;
      currentY += (targetY - currentY) * 0.13;

      crossFollower.style.left = `${currentX}px`;
      crossFollower.style.top = `${currentY}px`;

      crossRafId =
        requestAnimationFrame(renderCrossFollower);
    }

    hero.addEventListener("pointerenter", event => {
      const rect =
        hero.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      currentX = targetX;
      currentY = targetY;

      crossFollower.style.left = `${currentX}px`;
      crossFollower.style.top = `${currentY}px`;

      crossFollower.classList.add("is-visible");

      if (crossRafId === null) {
        crossRafId =
          requestAnimationFrame(renderCrossFollower);
      }
    });

    hero.addEventListener("pointermove", event => {
      const rect =
        hero.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
    });

    hero.addEventListener("pointerleave", () => {
      crossFollower.classList.remove("is-visible");

      if (crossRafId !== null) {
        cancelAnimationFrame(crossRafId);
        crossRafId = null;
      }
    });

    paletteCards.forEach(card => {
      card.addEventListener("mouseenter", () => {
        crossFollower.classList.add("is-small");
      });

      card.addEventListener("mouseleave", () => {
        crossFollower.classList.remove("is-small");
      });
    });
  }


  /*
  |--------------------------------------------------------------------------
  | SERVICES FAN / MOBILE ACCORDION
  |--------------------------------------------------------------------------
  */

  const servicePanels = [
    ...document.querySelectorAll(
      ".service-panel"
    )
  ];

  const desktopFan =
    window.matchMedia(
      "(pointer: fine) and (min-width: 701px)"
    );

  function activatePanel(selectedPanel) {
    servicePanels.forEach(panel => {
      const isActive =
        panel === selectedPanel;

      panel.classList.toggle(
        "is-active",
        isActive
      );

      panel.setAttribute(
        "aria-expanded",
        String(isActive)
      );
    });
  }

  servicePanels.forEach(panel => {

    panel.addEventListener("click", () => {
      activatePanel(panel);
    });

    panel.addEventListener("focus", () => {
      activatePanel(panel);
    });

    panel.addEventListener(
      "mouseenter",
      () => {
        if (desktopFan.matches) {
          activatePanel(panel);
        }
      }
    );

    panel.addEventListener(
      "keydown",
      event => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          activatePanel(panel);
        }
      }
    );
  });


  /*
  |--------------------------------------------------------------------------
  | PROJECT VIDEO LAZY LOAD (preview Lorenzo)
  |--------------------------------------------------------------------------
  |
  | Osservatore dedicato: a differenza dello SCROLL REVEAL qui sotto,
  | non basta attivarsi una sola volta — il video deve mettersi in pausa
  | ogni volta che la preview esce dal viewport, quindi resta osservato
  | per tutta la vita della pagina.
  |
  */

  const projectVideos =
    document.querySelectorAll(
      "[data-project-video]"
    );

  if (
    projectVideos.length &&
    "IntersectionObserver" in window
  ) {
    const videoObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const video = entry.target;

            if (entry.isIntersecting) {
              if (!video.src && video.dataset.src) {
                video.src = video.dataset.src;
                video.load();
              }

              if (!reducedMotion.matches) {
                video.play().catch(() => {});
              }
            } else {
              video.pause();
            }
          });
        },
        {
          rootMargin: "400px 0px"
        }
      );

    projectVideos.forEach(video => {
      videoObserver.observe(video);
    });
  }


  /*
  |--------------------------------------------------------------------------
  | LIVE PREVIEW IFRAME LAZY LOAD (Pomeranze / La Maga Alchemy — temporaneo)
  |--------------------------------------------------------------------------
  |
  | Sistema separato dal video Lorenzo qui sopra: qui basta assegnare il
  | src una sola volta quando ci si avvicina, l'iframe resta caricato.
  |
  */

  const liveFrames =
    document.querySelectorAll(
      "[data-live-preview]"
    );

  if (
    liveFrames.length &&
    "IntersectionObserver" in window
  ) {
    const liveFrameObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const container = entry.target;

            const iframe =
              container.querySelector(
                ".project-live-frame__iframe"
              );

            if (
              iframe &&
              !iframe.src &&
              container.dataset.src
            ) {
              iframe.src = container.dataset.src;
            }

            liveFrameObserver.unobserve(container);
          });
        },
        {
          threshold: 0,
          rootMargin: "500px 0px"
        }
      );

    liveFrames.forEach(container => {
      liveFrameObserver.observe(container);
    });
  }


  /*
  |--------------------------------------------------------------------------
  | ABOUT PHOTO MICRO PARALLAX
  |--------------------------------------------------------------------------
  */

  const aboutFrame =
    document.querySelector(".about-frame");

  const aboutPhoto =
    document.querySelector(".about-photo");

  if (
    aboutFrame &&
    aboutPhoto &&
    !reducedMotion.matches
  ) {
    let aboutTicking = false;

    function updateAboutParallax() {
      const rect =
        aboutFrame.getBoundingClientRect();

      const travel =
        window.innerHeight / 2 -
        (rect.top + rect.height / 2);

      const progress =
        Math.max(
          -1,
          Math.min(1, travel / window.innerHeight)
        );

      aboutPhoto.style.transform =
        `translateY(${(progress * 10).toFixed(2)}px)`;

      aboutTicking = false;
    }

    updateAboutParallax();

    window.addEventListener(
      "scroll",
      () => {
        if (aboutTicking) return;
        aboutTicking = true;
        requestAnimationFrame(updateAboutParallax);
      },
      { passive: true }
    );
  }


  /*
  |--------------------------------------------------------------------------
  | SCROLL REVEAL
  |--------------------------------------------------------------------------
  */

  const revealItems =
    document.querySelectorAll(
      "[data-reveal]"
    );

  if (
    reducedMotion.matches ||
    !("IntersectionObserver" in window)
  ) {
    revealItems.forEach(item => {
      item.classList.add("is-visible");
    });
  } else {
    const revealObserver =
      new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add(
                "is-visible"
              );

              revealObserver.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -5%"
        }
      );

    revealItems.forEach(item => {
      revealObserver.observe(item);
    });
  }

});