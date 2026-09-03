document.addEventListener("DOMContentLoaded", () => {

  /*
  |--------------------------------------------------------------------------
  | GLOBAL MEDIA QUERIES
  |--------------------------------------------------------------------------
  */

  const finePointer =
    window.matchMedia(
      "(pointer: fine)"
    );

  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

  const mobileLayout =
    window.matchMedia(
      "(max-width: 700px)"
    );


  /*
  |--------------------------------------------------------------------------
  | HERO LOAD
  |--------------------------------------------------------------------------
  */

  requestAnimationFrame(() => {
    document.body.classList.add(
      "loaded"
    );
  });


  /*
  |--------------------------------------------------------------------------
  | PALETTE CARDS
  |--------------------------------------------------------------------------
  */

  const paletteCards =
    document.querySelectorAll(
      ".palette-card"
    );


  paletteCards.forEach(card => {

    card.addEventListener(
      "click",
      () => {

        const alreadyActive =
          card.classList.contains(
            "is-active"
          );


        paletteCards.forEach(item => {
          item.classList.remove(
            "is-active"
          );
        });


        if (!alreadyActive) {
          card.classList.add(
            "is-active"
          );
        }

      }
    );

  });


  /*
  |--------------------------------------------------------------------------
  | HERO IMAGE PARALLAX
  |--------------------------------------------------------------------------
  */

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
          `
            scale(1.025)
            translate(
              ${moveX}px,
              ${moveY}px
            )
          `;

      }
    );


    hero.addEventListener(
      "mouseleave",
      () => {

        heroImage.style.transform =
          `
            scale(1.02)
            translate(0, 0)
          `;

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | CUSTOM HERO CURSOR
  |--------------------------------------------------------------------------
  */

  const heroCursor =
    document.querySelector(
      ".hero-cursor"
    );


  const interactiveHeroEls =
    document.querySelectorAll(
      `
        .hero a,
        .hero button,
        .hero .palette-card
      `
    );


  if (
    hero &&
    heroCursor &&
    finePointer.matches
  ) {

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let cursorRafId =
      null;


    function setCursorPosition(
      x,
      y
    ) {

      heroCursor.style.transform =
        `
          translate3d(
            ${x}px,
            ${y}px,
            0
          )
        `;

    }


    function renderCursor() {

      currentX +=
        (
          targetX -
          currentX
        ) *
        0.18;


      currentY +=
        (
          targetY -
          currentY
        ) *
        0.18;


      setCursorPosition(
        currentX,
        currentY
      );


      cursorRafId =
        requestAnimationFrame(
          renderCursor
        );

    }


    hero.addEventListener(
      "pointerenter",
      event => {

        const rect =
          hero.getBoundingClientRect();


        targetX =
          event.clientX -
          rect.left;


        targetY =
          event.clientY -
          rect.top;


        currentX =
          targetX;


        currentY =
          targetY;


        setCursorPosition(
          currentX,
          currentY
        );


        heroCursor.classList.add(
          "is-visible"
        );


        if (
          !reducedMotion.matches &&
          cursorRafId === null
        ) {

          cursorRafId =
            requestAnimationFrame(
              renderCursor
            );

        }

      }
    );


    hero.addEventListener(
      "pointermove",
      event => {

        const rect =
          hero.getBoundingClientRect();


        targetX =
          event.clientX -
          rect.left;


        targetY =
          event.clientY -
          rect.top;


        if (
          reducedMotion.matches
        ) {

          currentX =
            targetX;


          currentY =
            targetY;


          setCursorPosition(
            currentX,
            currentY
          );

        }

      }
    );


    hero.addEventListener(
      "pointerleave",
      () => {

        heroCursor.classList.remove(
          "is-visible"
        );


        heroCursor.classList.remove(
          "is-interactive"
        );


        if (
          cursorRafId !== null
        ) {

          cancelAnimationFrame(
            cursorRafId
          );


          cursorRafId =
            null;

        }

      }
    );


    interactiveHeroEls.forEach(
      element => {

        element.addEventListener(
          "mouseenter",
          () => {

            heroCursor.classList.add(
              "is-interactive"
            );

          }
        );


        element.addEventListener(
          "mouseleave",
          () => {

            heroCursor.classList.remove(
              "is-interactive"
            );

          }
        );

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | SERVICES
  | Editorial Index + Visual Stage
  |--------------------------------------------------------------------------
  */

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


  /*
  |--------------------------------------------------------------------------
  | ACTIVATE SERVICE
  |--------------------------------------------------------------------------
  */

  function activateService(
    serviceName,
    moveFocus = false
  ) {

    /*
    |--------------------------------------------------------------------------
    | LEFT INDEX
    |--------------------------------------------------------------------------
    */

    serviceTabs.forEach(
      tab => {

        const isActive =
          tab.dataset.serviceTab ===
          serviceName;


        tab.classList.toggle(
          "is-active",
          isActive
        );


        tab.setAttribute(
          "aria-selected",
          String(isActive)
        );


        tab.tabIndex =
          isActive
            ? 0
            : -1;


        if (
          isActive &&
          moveFocus
        ) {

          tab.focus();

        }

      }
    );


    /*
    |--------------------------------------------------------------------------
    | RIGHT STAGE
    |--------------------------------------------------------------------------
    */

    serviceScenes.forEach(
      scene => {

        const isActive =
          scene.dataset.serviceScene ===
          serviceName;


        scene.classList.toggle(
          "is-active",
          isActive
        );


        scene.setAttribute(
          "aria-hidden",
          String(!isActive)
        );

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | SERVICES CLICK + KEYBOARD
  |--------------------------------------------------------------------------
  */

  serviceTabs.forEach(
    (tab, index) => {

      /*
      |--------------------------------------------------------------------------
      | CLICK
      |--------------------------------------------------------------------------
      */

      tab.addEventListener(
        "click",
        () => {

          activateService(
            tab.dataset.serviceTab
          );

        }
      );


      /*
      |--------------------------------------------------------------------------
      | KEYBOARD
      |--------------------------------------------------------------------------
      */

      tab.addEventListener(
        "keydown",
        event => {

          const navigationKeys = [
            "ArrowDown",
            "ArrowRight",
            "ArrowUp",
            "ArrowLeft",
            "Home",
            "End"
          ];


          if (
            !navigationKeys.includes(
              event.key
            )
          ) {
            return;
          }


          event.preventDefault();


          let nextIndex =
            index;


          /*
          |--------------------------------------------------------------------------
          | NEXT
          |--------------------------------------------------------------------------
          */

          if (
            event.key ===
              "ArrowDown" ||

            event.key ===
              "ArrowRight"
          ) {

            nextIndex =
              (
                index + 1
              ) %
              serviceTabs.length;

          }


          /*
          |--------------------------------------------------------------------------
          | PREVIOUS
          |--------------------------------------------------------------------------
          */

          if (
            event.key ===
              "ArrowUp" ||

            event.key ===
              "ArrowLeft"
          ) {

            nextIndex =
              (
                index -
                1 +
                serviceTabs.length
              ) %
              serviceTabs.length;

          }


          /*
          |--------------------------------------------------------------------------
          | HOME
          |--------------------------------------------------------------------------
          */

          if (
            event.key ===
            "Home"
          ) {

            nextIndex = 0;

          }


          /*
          |--------------------------------------------------------------------------
          | END
          |--------------------------------------------------------------------------
          */

          if (
            event.key ===
            "End"
          ) {

            nextIndex =
              serviceTabs.length -
              1;

          }


          const nextTab =
            serviceTabs[
              nextIndex
            ];


          if (!nextTab) {
            return;
          }


          activateService(
            nextTab.dataset.serviceTab,
            true
          );

        }
      );

    }
  );


  /*
  |--------------------------------------------------------------------------
  | INITIAL SERVICE
  |--------------------------------------------------------------------------
  */

  if (
    serviceTabs.length &&
    serviceScenes.length
  ) {

    const initialTab =
      serviceTabs.find(
        tab =>
          tab.classList.contains(
            "is-active"
          )
      ) ||
      serviceTabs[0];


    activateService(
      initialTab.dataset.serviceTab
    );

  }


  /*
  |--------------------------------------------------------------------------
  | SERVICES TRANSITION
  | HERO → GOLD THRESHOLD → SERVICES
  |--------------------------------------------------------------------------
  */

  const servicesSection =
    document.querySelector(
      ".services-section"
    );


  const servicesInner =
    document.querySelector(
      ".services-section__inner"
    );


  if (
    servicesSection &&
    servicesInner &&
    !mobileLayout.matches
  ) {

    let servicesTicking =
      false;


    /*
    |--------------------------------------------------------------------------
    | UPDATE TRANSITION
    |--------------------------------------------------------------------------
    */

    function updateServicesTransition() {

      const rect =
        servicesSection
          .getBoundingClientRect();


      /*
      |--------------------------------------------------------------------------
      | SCROLL RANGE
      |--------------------------------------------------------------------------
      |
      | La transizione comincia quando il top di Services raggiunge
      | il fondo della viewport.
      |
      | Finisce quando Services arriva circa al 56% della viewport.
      |
      */

      const start =
        window.innerHeight;


      const end =
        window.innerHeight *
        0.56;


      const rawProgress =
        (
          start -
          rect.top
        ) /
        (
          start -
          end
        );


      const progress =
        Math.max(
          0,
          Math.min(
            1,
            rawProgress
          )
        );


      /*
      |--------------------------------------------------------------------------
      | REDUCED MOTION
      |--------------------------------------------------------------------------
      */

      if (
        reducedMotion.matches
      ) {

        servicesSection.style.setProperty(
          "--services-enter-y",
          "0px"
        );


        servicesSection.style.setProperty(
          "--services-intro-shift",
          "0px"
        );


        servicesSection.style.setProperty(
          "--services-threshold-scale",
          "1"
        );


        servicesSection.style.setProperty(
          "--services-threshold-copy",
          "1"
        );


        servicesSection.style.setProperty(
          "--services-threshold-copy-y",
          "0px"
        );


        servicesTicking =
          false;


        return;

      }


      /*
      |--------------------------------------------------------------------------
      | SERVICES SHEET MOVEMENT
      |--------------------------------------------------------------------------
      |
      | L'intera sezione parte leggermente più in basso
      | e si sistema progressivamente.
      |
      */

      const enterY =
        (
          1 -
          progress
        ) *
        70;


      /*
      |--------------------------------------------------------------------------
      | INTRO MICRO MOVEMENT
      |--------------------------------------------------------------------------
      */

      const introY =
        progress *
        -20;


      servicesSection.style.setProperty(
        "--services-enter-y",
        `${enterY.toFixed(2)}px`
      );


      servicesSection.style.setProperty(
        "--services-intro-shift",
        `${introY.toFixed(2)}px`
      );


      /*
      |--------------------------------------------------------------------------
      | GOLD THRESHOLD
      |--------------------------------------------------------------------------
      |
      | La fascia gold parte come una linea sottile.
      |
      | 0.15 * 54px ≈ 8px
      |
      | Poi si apre progressivamente fino a 54px.
      |
      */

      const thresholdScale =
        0.15 +
        progress *
        0.85;


      servicesSection.style.setProperty(
        "--services-threshold-scale",
        thresholdScale.toFixed(3)
      );


      /*
      |--------------------------------------------------------------------------
      | GOLD COPY
      |--------------------------------------------------------------------------
      |
      | Il testo non compare immediatamente.
      |
      | Prima vediamo il gold aprirsi.
      | Poi appaiono:
      |
      | 02 / SERVICES
      | DELPHI — DIGITAL CREATIVE STUDIO
      | ↓
      |
      */

      const copyProgress =
        Math.max(
          0,
          Math.min(
            1,
            (
              progress -
              0.38
            ) /
            0.36
          )
        );


      const thresholdCopyY =
        (
          1 -
          copyProgress
        ) *
        6;


      servicesSection.style.setProperty(
        "--services-threshold-copy",
        copyProgress.toFixed(3)
      );


      servicesSection.style.setProperty(
        "--services-threshold-copy-y",
        `${thresholdCopyY.toFixed(2)}px`
      );


      servicesTicking =
        false;

    }


    /*
    |--------------------------------------------------------------------------
    | INITIAL STATE
    |--------------------------------------------------------------------------
    */

    updateServicesTransition();


    /*
    |--------------------------------------------------------------------------
    | SCROLL
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
      "scroll",
      () => {

        if (
          servicesTicking
        ) {
          return;
        }


        servicesTicking =
          true;


        requestAnimationFrame(
          updateServicesTransition
        );

      },
      {
        passive: true
      }
    );


    /*
    |--------------------------------------------------------------------------
    | RESIZE
    |--------------------------------------------------------------------------
    */

    window.addEventListener(
      "resize",
      () => {

        if (
          servicesTicking
        ) {
          return;
        }


        servicesTicking =
          true;


        requestAnimationFrame(
          updateServicesTransition
        );

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | MOBILE GOLD THRESHOLD
  |--------------------------------------------------------------------------
  |
  | Su mobile niente scroll-linked motion complesso.
  | La fascia resta semplicemente completa.
  |
  */

  if (
    servicesSection &&
    mobileLayout.matches
  ) {

    servicesSection.style.setProperty(
      "--services-threshold-scale",
      "1"
    );


    servicesSection.style.setProperty(
      "--services-threshold-copy",
      "1"
    );


    servicesSection.style.setProperty(
      "--services-threshold-copy-y",
      "0px"
    );


    servicesSection.style.setProperty(
      "--services-enter-y",
      "0px"
    );


    servicesSection.style.setProperty(
      "--services-intro-shift",
      "0px"
    );

  }


  /*
  |--------------------------------------------------------------------------
  | PROJECT VIDEO LAZY LOAD
  | Lorenzo Magnanini
  |--------------------------------------------------------------------------
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

          entries.forEach(
            entry => {

              const video =
                entry.target;


              if (
                entry.isIntersecting
              ) {

                /*
                |--------------------------------------------------------------------------
                | LOAD
                |--------------------------------------------------------------------------
                */

                if (
                  !video.getAttribute(
                    "src"
                  ) &&
                  video.dataset.src
                ) {

                  video.src =
                    video.dataset.src;


                  video.load();

                }


                /*
                |--------------------------------------------------------------------------
                | PLAY
                |--------------------------------------------------------------------------
                */

                if (
                  !reducedMotion.matches
                ) {

                  video
                    .play()
                    .catch(
                      () => {}
                    );

                }

              }


              else {

                /*
                |--------------------------------------------------------------------------
                | PAUSE OUTSIDE VIEW
                |--------------------------------------------------------------------------
                */

                video.pause();

              }

            }
          );

        },

        {
          rootMargin:
            "400px 0px"
        }

      );


    projectVideos.forEach(
      video => {

        videoObserver.observe(
          video
        );

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | VIDEO FALLBACK
  |--------------------------------------------------------------------------
  */

  else if (
    projectVideos.length
  ) {

    projectVideos.forEach(
      video => {

        if (
          video.dataset.src
        ) {

          video.src =
            video.dataset.src;


          video.load();

        }

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | LIVE IFRAME PREVIEWS
  | Pomeranze + La Maga Alchemy
  |--------------------------------------------------------------------------
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

          entries.forEach(
            entry => {

              if (
                !entry.isIntersecting
              ) {
                return;
              }


              const container =
                entry.target;


              const iframe =
                container.querySelector(
                  ".project-live-frame__iframe"
                );


              if (
                iframe &&
                !iframe.getAttribute(
                  "src"
                ) &&
                container.dataset.src
              ) {

                iframe.setAttribute(
                  "src",
                  container.dataset.src
                );

              }


              liveFrameObserver.unobserve(
                container
              );

            }
          );

        },

        {
          threshold: 0,

          rootMargin:
            "500px 0px"
        }

      );


    liveFrames.forEach(
      container => {

        liveFrameObserver.observe(
          container
        );

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | IFRAME FALLBACK
  |--------------------------------------------------------------------------
  */

  else if (
    liveFrames.length
  ) {

    liveFrames.forEach(
      container => {

        const iframe =
          container.querySelector(
            ".project-live-frame__iframe"
          );


        if (
          iframe &&
          container.dataset.src
        ) {

          iframe.setAttribute(
            "src",
            container.dataset.src
          );

        }

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | ABOUT PHOTO MICRO PARALLAX
  |--------------------------------------------------------------------------
  */

  const aboutFrame =
    document.querySelector(
      ".about-frame"
    );


  const aboutPhoto =
    document.querySelector(
      ".about-photo"
    );


  if (
    aboutFrame &&
    aboutPhoto &&
    !reducedMotion.matches
  ) {

    let aboutTicking =
      false;


    function updateAboutParallax() {

      const rect =
        aboutFrame
          .getBoundingClientRect();


      const frameCenter =
        rect.top +
        rect.height /
        2;


      const viewportCenter =
        window.innerHeight /
        2;


      const distance =
        viewportCenter -
        frameCenter;


      const progress =
        Math.max(
          -1,
          Math.min(
            1,
            distance /
            window.innerHeight
          )
        );


      const movement =
        progress *
        10;


      aboutPhoto.style.transform =
        `
          translate3d(
            0,
            ${movement.toFixed(2)}px,
            0
          )
        `;


      aboutTicking =
        false;

    }


    updateAboutParallax();


    window.addEventListener(
      "scroll",
      () => {

        if (
          aboutTicking
        ) {
          return;
        }


        aboutTicking =
          true;


        requestAnimationFrame(
          updateAboutParallax
        );

      },
      {
        passive: true
      }
    );


    window.addEventListener(
      "resize",
      () => {

        if (
          aboutTicking
        ) {
          return;
        }


        aboutTicking =
          true;


        requestAnimationFrame(
          updateAboutParallax
        );

      }
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


  /*
  |--------------------------------------------------------------------------
  | FALLBACK / REDUCED MOTION
  |--------------------------------------------------------------------------
  */

  if (
    reducedMotion.matches ||
    !(
      "IntersectionObserver" in
      window
    )
  ) {

    revealItems.forEach(
      item => {

        item.classList.add(
          "is-visible"
        );

      }
    );

  }


  /*
  |--------------------------------------------------------------------------
  | REVEAL OBSERVER
  |--------------------------------------------------------------------------
  */

  else {

    const revealObserver =
      new IntersectionObserver(

        entries => {

          entries.forEach(
            entry => {

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

            }
          );

        },

        {
          threshold: 0.12,

          rootMargin:
            "0px 0px -5%"
        }

      );


    revealItems.forEach(
      item => {

        revealObserver.observe(
          item
        );

      }
    );

  }

});