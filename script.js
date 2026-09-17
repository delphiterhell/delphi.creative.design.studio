document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     GLOBAL
     ============================================================ */

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  const finePointer =
    window.matchMedia(
      "(pointer: fine)"
    );

  const mobileLayout =
    window.matchMedia(
      "(max-width: 700px)"
    );


  /* ============================================================
     HERO PALETTE
     ============================================================ */

  document
    .querySelectorAll(
      ".palette-card"
    )
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const wasActive =
            card.classList.contains(
              "is-active"
            );


          document
            .querySelectorAll(
              ".palette-card"
            )
            .forEach(item => {

              item.classList.remove(
                "is-active"
              );

            });


          if (!wasActive) {

            card.classList.add(
              "is-active"
            );

          }

        }
      );

    });


  /* ============================================================
     HERO IMAGE PARALLAX
     ============================================================ */

  const hero =
    document.querySelector(
      ".hero"
    );

  const heroImage =
    document.querySelector(
      ".hero-image"
    );


  if (
    hero &&
    heroImage &&
    finePointer.matches &&
    !reducedMotion.matches
  ) {

    hero.addEventListener(
      "mousemove",
      event => {

        const rect =
          hero.getBoundingClientRect();


        const x =
          (
            event.clientX -
            rect.left
          ) /
          rect.width -
          0.5;


        const y =
          (
            event.clientY -
            rect.top
          ) /
          rect.height -
          0.5;


        heroImage.style.transform = `
          scale(1.035)
          translate(
            ${x * 8}px,
            ${y * 6}px
          )
        `;

      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        heroImage.style.transform =
          "scale(1.02) translate(0, 0)";

      }
    );

  }


  /* ============================================================
     SERVICES
     ============================================================ */

  const serviceTabs = [
    ...document.querySelectorAll(
      "[data-service-tab]"
    )
  ];


  const serviceScenes = [
    ...document.querySelectorAll(
      "[data-service-scene]"
    )
  ];


  function activateService(
    name
  ) {

    serviceTabs.forEach(tab => {

      const active =
        tab.dataset.serviceTab ===
        name;


      tab.classList.toggle(
        "is-active",
        active
      );


      tab.setAttribute(
        "aria-selected",
        String(active)
      );

    });


    serviceScenes.forEach(scene => {

      const active =
        scene.dataset.serviceScene ===
        name;


      scene.classList.toggle(
        "is-active",
        active
      );


      scene.setAttribute(
        "aria-hidden",
        String(!active)
      );

    });

  }


  serviceTabs.forEach(tab => {

    tab.addEventListener(
      "click",
      () => {

        activateService(
          tab.dataset.serviceTab
        );

      }
    );

  });


  /* ============================================================
     SERVICES — 3D SCENE PARALLAX
     ============================================================ */

  const serviceStage =
    document.querySelector(
      "[data-service-stage]"
    );

  const stage3dEls = [
    ...document.querySelectorAll(
      "[data-stage3d] .stage3d-inner"
    )
  ];


  if (
    serviceStage &&
    stage3dEls.length &&
    finePointer.matches &&
    !reducedMotion.matches
  ) {

    const MAX_TILT_X = 9;
    const MAX_TILT_Y = 12;
    const IDLE_TILT_X = 5;
    const IDLE_TILT_Y = -8;
    const IDLE_DELAY = 1400;

    let targetX = IDLE_TILT_X;
    let targetY = IDLE_TILT_Y;
    let currentX = IDLE_TILT_X;
    let currentY = IDLE_TILT_Y;

    let pointerActive = false;
    let idleTimer = null;


    serviceStage.addEventListener(
      "mousemove",
      event => {

        const rect =
          serviceStage.getBoundingClientRect();

        const px =
          (
            event.clientX -
            rect.left
          ) /
          rect.width -
          0.5;

        const py =
          (
            event.clientY -
            rect.top
          ) /
          rect.height -
          0.5;


        targetX =
          IDLE_TILT_X -
          py * MAX_TILT_X * 2;

        targetY =
          IDLE_TILT_Y +
          px * MAX_TILT_Y * 2;


        pointerActive = true;

        clearTimeout(idleTimer);

        idleTimer =
          setTimeout(
            () => {
              pointerActive = false;
            },
            IDLE_DELAY
          );

      }
    );


    serviceStage.addEventListener(
      "mouseleave",
      () => {

        pointerActive = false;

        clearTimeout(idleTimer);

      }
    );


    function tick(
      time
    ) {

      if (!pointerActive) {

        targetX =
          IDLE_TILT_X +
          Math.sin(time / 4200) * 1.1;

        targetY =
          IDLE_TILT_Y +
          Math.cos(time / 5300) * 1.6;

      }


      currentX +=
        (
          targetX -
          currentX
        ) * 0.06;

      currentY +=
        (
          targetY -
          currentY
        ) * 0.06;


      const activeStage3d =
        stage3dEls.find(el =>
          el
            .closest(
              ".service-scene"
            )
            .classList
            .contains(
              "is-active"
            )
        );


      if (activeStage3d) {

        activeStage3d.style.setProperty(
          "--tilt-x",
          `${currentX}deg`
        );

        activeStage3d.style.setProperty(
          "--tilt-y",
          `${currentY}deg`
        );

      }


      requestAnimationFrame(tick);

    }


    requestAnimationFrame(tick);

  }


  /* ============================================================
     PROJECT VIDEO — LAZY LOAD
     ============================================================ */

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

            const video =
              entry.target;


            if (
              entry.isIntersecting
            ) {

              if (
                !video.src &&
                video.dataset.src
              ) {

                video.src =
                  video.dataset.src;

                video.load();

              }


              if (
                !reducedMotion.matches
              ) {

                video
                  .play()
                  .catch(() => {});

              }

            }

            else {

              video.pause();

            }

          });

        },
        {
          rootMargin:
            "350px 0px"
        }
      );


    projectVideos.forEach(video => {

      videoObserver.observe(
        video
      );

    });

  }


  /* ============================================================
     GENERIC REVEALS
     ============================================================ */

  const revealItems =
    document.querySelectorAll(
      "[data-reveal]"
    );


  if (
    reducedMotion.matches ||
    !(
      "IntersectionObserver" in window
    )
  ) {

    revealItems.forEach(item => {

      item.classList.add(
        "is-visible"
      );

    });

  }

  else {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry.target
              .classList
              .add(
                "is-visible"
              );


            revealObserver
              .unobserve(
                entry.target
              );

          });

        },
        {
          threshold:
            0.12,

          rootMargin:
            "0px 0px -6% 0px"
        }
      );


    revealItems.forEach(item => {

      revealObserver.observe(
        item
      );

    });

  }


  /* ============================================================
     GSAP
     ============================================================ */

  const gsapReady =
    typeof window.gsap !==
      "undefined" &&
    typeof window.ScrollTrigger !==
      "undefined";


  if (
    gsapReady &&
    !reducedMotion.matches
  ) {

    gsap.registerPlugin(
      ScrollTrigger
    );


    /* ==========================================================
       INTRO TITLE
       ========================================================== */

    document
      .querySelectorAll(
        "[data-motion-title]"
      )
      .forEach(title => {

        gsap.fromTo(
          title,
          {
            yPercent:
              105,

            opacity:
              0
          },
          {
            yPercent:
              0,

            opacity:
              1,

            duration:
              1,

            ease:
              "power4.out",

            scrollTrigger: {

              trigger:
                title,

              start:
                "top 86%",

              once:
                true

            }
          }
        );

      });


    /* ==========================================================
       INTRO COPY
       ========================================================== */

    const introCopy =
      document.querySelectorAll(
        "[data-motion-copy]"
      );


    if (
      introCopy.length
    ) {

      gsap.fromTo(
        introCopy,
        {
          y:
            30,

          opacity:
            0
        },
        {
          y:
            0,

          opacity:
            1,

          duration:
            .9,

          stagger:
            .12,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              ".intro-copy",

            start:
              "top 84%",

            once:
              true

          }
        }
      );

    }


    /* ==========================================================
       INTRO IMAGE REVEAL
       ========================================================== */

    const introReveal =
      document.querySelector(
        ".intro-portrait__reveal"
      );


    if (
      introReveal
    ) {

      gsap.to(
        introReveal,
        {
          xPercent:
            102,

          duration:
            1.15,

          ease:
            "power4.inOut",

          scrollTrigger: {

            trigger:
              ".intro-portrait__image",

            start:
              "top 72%",

            once:
              true

          }
        }
      );

    }


    /* ==========================================================
       INTRO IMAGE PARALLAX
       ========================================================== */

    const introPhoto =
      document.querySelector(
        ".intro-portrait__image img"
      );


    if (
      introPhoto &&
      !mobileLayout.matches
    ) {

      gsap.fromTo(
        introPhoto,
        {
          yPercent:
            -2
        },
        {
          yPercent:
            4,

          ease:
            "none",

          scrollTrigger: {

            trigger:
              ".intro-portrait",

            start:
              "top bottom",

            end:
              "bottom top",

            scrub:
              1.2

          }
        }
      );

    }


    /* ==========================================================
       SELECTED WORK INTRO
       ========================================================== */

    const worksIntro =
      document.querySelector(
        ".works-intro__bottom"
      );


    if (
      worksIntro
    ) {

      gsap.fromTo(
        worksIntro,
        {
          y:
            22,

          opacity:
            0
        },
        {
          y:
            0,

          opacity:
            1,

          duration:
            .8,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              ".works-intro",

            start:
              "top 88%",

            once:
              true

          }
        }
      );

    }


    /* ==========================================================
       LORENZO — SMOOTH IMMERSIVE PROJECT
       ========================================================== */

    const project =
      document.querySelector(
        "[data-project-hero]"
      );


    const projectFrame =
      document.querySelector(
        "[data-project-frame]"
      );


    const projectMeta =
      document.querySelector(
        "[data-project-meta]"
      );


    const projectVideo =
      project &&
      project.querySelector(
        ".lorenzo-preview__video"
      );


    if (
      project &&
      projectFrame
    ) {

      const desktop =
        window.matchMedia(
          "(min-width: 701px)"
        );


      /*
       * IMPORTANTISSIMO:
       *
       * NON animiamo più la width.
       *
       * Il frame ha già la sua width finale nel CSS
       * (92vw desktop / 100vw mobile).
       *
       * Usiamo solo scale.
       * In questo modo non ci sono continui
       * ricalcoli del layout durante lo scroll.
       */


      gsap.set(
        projectFrame,
        {

          xPercent:
            -50,

          yPercent:
            -50,

          scale:
            .68,

          force3D:
            true

        }
      );


      if (
        projectVideo &&
        !desktop.matches
      ) {

        gsap.set(
          projectVideo,
          {

            scale:
              1.08,

            force3D:
              true

          }
        );

      }


      if (
        projectMeta
      ) {

        gsap.set(
          projectMeta,
          {

            opacity:
              0,

            y:
              24

          }
        );

      }


      const projectTimeline =
        gsap.timeline({

          scrollTrigger: {

            trigger:
              project,

            start:
              "top top",

            end:
              "bottom bottom",

            scrub:
              .85,

            invalidateOnRefresh:
              true

          }

        });


      /*
       * PHASE 1:
       *
       * Lorenzo si ingrandisce
       * restando perfettamente centrato.
       */

      projectTimeline.to(
        projectFrame,
        {

          scale:
            1,

          ease:
            "none",

          duration:
            .70

        },
        0
      );


      /*
       * In parallelo, solo su mobile,
       * il video interno si "assesta"
       * con un piccolo effetto cinematic/parallax.
       */

      if (
        projectVideo &&
        !desktop.matches
      ) {

        projectTimeline.to(
          projectVideo,
          {

            scale:
              1,

            ease:
              "none",

            duration:
              .70

          },
          0
        );

      }


      /*
       * PHASE 2:
       *
       * Solo alla fine facciamo salire
       * leggermente il progetto.
       *
       * Così sotto compare la descrizione.
       */

      projectTimeline.to(
        projectFrame,
        {

          yPercent:
            desktop.matches
              ? -57
              : -60,

          ease:
            "none",

          duration:
            .30

        },
        .70
      );


      /*
       * PROJECT META
       */

      if (
        projectMeta
      ) {

        projectTimeline.to(
          projectMeta,
          {

            opacity:
              1,

            y:
              0,

            duration:
              .20,

            ease:
              "power2.out"

          },
          .76
        );

      }

    }


    /* ==========================================================
       MAGA + POMERANZE
       ========================================================== */

    gsap
      .utils
      .toArray(
        ".project-browser"
      )
      .forEach(browser => {

        gsap.fromTo(
          browser,
          {

            y:
              26,

            scale:
              .985

          },
          {

            y:
              -10,

            scale:
              1,

            ease:
              "none",

            scrollTrigger: {

              trigger:
                browser,

              start:
                "top bottom",

              end:
                "bottom top",

              scrub:
                1

            }

          }
        );

      });


    /* ==========================================================
       CONCEPT CARDS
       ========================================================== */

    const conceptCards =
      gsap.utils.toArray(
        "[data-concept-card]"
      );


    if (
      conceptCards.length
    ) {

      conceptCards.forEach(
        (
          card,
          index
        ) => {

          gsap.fromTo(
            card,
            {

              y:
                40,

              scale:
                .97,

              opacity:
                0

            },
            {

              y:
                0,

              scale:
                1,

              opacity:
                1,

              duration:
                .9,

              delay:
                index * .08,

              ease:
                "power3.out",

              clearProps:
                "filter",

              scrollTrigger: {

                trigger:
                  ".concepts-grid",

                start:
                  "top 80%",

                once:
                  true

              }

            }
          );

        }
      );

    }


    /* ==========================================================
       SERVICES HEADING
       ========================================================== */

    const servicesHeading =
      document.querySelector(
        ".services__heading"
      );


    if (
      servicesHeading
    ) {

      gsap.fromTo(
        servicesHeading,
        {

          y:
            45,

          opacity:
            0

        },
        {

          y:
            0,

          opacity:
            1,

          duration:
            .95,

          ease:
            "power4.out",

          scrollTrigger: {

            trigger:
              ".services",

            start:
              "top 78%",

            once:
              true

          }

        }
      );

    }


    /* ==========================================================
       SERVICE BUTTONS
       ========================================================== */

    const serviceButtons =
      gsap.utils.toArray(
        ".service-tab"
      );


    if (
      serviceButtons.length
    ) {

      gsap.fromTo(
        serviceButtons,
        {

          x:
            -28,

          opacity:
            0

        },
        {

          x:
            0,

          opacity:
            1,

          duration:
            .75,

          stagger:
            .09,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              ".service-list",

            start:
              "top 84%",

            once:
              true

          }

        }
      );

    }


    /* ==========================================================
       SERVICE STAGE
       ========================================================== */

    const serviceStage =
      document.querySelector(
        ".service-stage"
      );


    if (
      serviceStage
    ) {

      gsap.fromTo(
        serviceStage,
        {

          y:
            40,

          scale:
            .98,

          opacity:
            .55

        },
        {

          y:
            0,

          scale:
            1,

          opacity:
            1,

          duration:
            .9,

          ease:
            "power3.out",

          scrollTrigger: {

            trigger:
              ".services__layout",

            start:
              "top 84%",

            once:
              true

          }

        }
      );

    }


    /* ==========================================================
       PACKAGES
       ========================================================== */

    const packageCards =
      gsap.utils.toArray(
        ".package-card"
      );


    packageCards.forEach(
      (
        card,
        index
      ) => {

        gsap.fromTo(
          card,
          {

            y:
              50,

            opacity:
              0,

            scale:
              .98

          },
          {

            y:
              0,

            opacity:
              1,

            scale:
              1,

            duration:
              .9,

            delay:
              index * .07,

            ease:
              "power4.out",

            scrollTrigger: {

              trigger:
                ".packages__grid",

              start:
                "top 84%",

              once:
                true

            }

          }
        );

      }
    );


    /* ==========================================================
       CONTACT
       ========================================================== */

    const contact =
      document.querySelector(
        ".contact"
      );


    if (
      contact
    ) {

      gsap.fromTo(
        ".contact h2",
        {

          yPercent:
            28,

          opacity:
            0

        },
        {

          yPercent:
            0,

          opacity:
            1,

          duration:
            1.05,

          ease:
            "power4.out",

          scrollTrigger: {

            trigger:
              contact,

            start:
              "top 76%",

            once:
              true

          }

        }
      );

    }


    /* ==========================================================
       REFRESH
       ========================================================== */

    window.addEventListener(
      "load",
      () => {

        ScrollTrigger.refresh();

      }
    );


    if (
      document.fonts &&
      document.fonts.ready
    ) {

      document
        .fonts
        .ready
        .then(() => {

          ScrollTrigger.refresh();

        });

    }

  }


  /* ============================================================
     FALLBACK
     ============================================================ */

  else {

    document
      .querySelectorAll(`
        [data-motion-title],
        [data-motion-copy],
        [data-concept-card],
        [data-reveal]
      `)
      .forEach(element => {

        element.style.opacity =
          "1";

        element.style.transform =
          "none";

        element.style.filter =
          "none";

        element.style.clipPath =
          "none";

      });


    const introReveal =
      document.querySelector(
        ".intro-portrait__reveal"
      );


    if (
      introReveal
    ) {

      introReveal.style.display =
        "none";

    }


    const projectFrame =
      document.querySelector(
        "[data-project-frame]"
      );


    const projectMeta =
      document.querySelector(
        "[data-project-meta]"
      );


    if (
      projectFrame
    ) {

      projectFrame.style.transform =
        `
          translate3d(
            -50%,
            -50%,
            0
          )
          scale(1)
        `;

    }


    if (
      projectMeta
    ) {

      projectMeta.style.opacity =
        "1";

      projectMeta.style.transform =
        "none";

    }

  }

});