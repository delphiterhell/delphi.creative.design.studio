document.addEventListener("DOMContentLoaded", () => {

  /* ============================================================
     GLOBAL
     ============================================================ */

  const finePointer = window.matchMedia("(pointer: fine)");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  const mobileLayout = window.matchMedia("(max-width: 700px)");

  document.body.classList.add("loaded");


  /* ============================================================
     HERO PALETTE
     ============================================================ */

  const paletteCards = document.querySelectorAll(".palette-card");

  paletteCards.forEach(card => {
    card.addEventListener("click", () => {

      const active = card.classList.contains("is-active");

      paletteCards.forEach(item => {
        item.classList.remove("is-active");
      });

      if (!active) {
        card.classList.add("is-active");
      }

    });
  });


  /* ============================================================
     HERO IMAGE PARALLAX
     ============================================================ */

  const hero = document.querySelector(".hero");
  const heroImage = document.querySelector(".hero-image");

  if (
    hero &&
    heroImage &&
    finePointer.matches &&
    !reducedMotion.matches
  ) {

    hero.addEventListener("mousemove", event => {

      const rect = hero.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      heroImage.style.transform = `
        scale(1.025)
        translate(
          ${x * 7}px,
          ${y * 5}px
        )
      `;

    });

    hero.addEventListener("mouseleave", () => {
      heroImage.style.transform =
        "scale(1.02) translate(0, 0)";
    });

  }


  /* ============================================================
     CUSTOM HERO CURSOR
     ============================================================ */

  const heroCursor = document.querySelector(".hero-cursor");

  if (
    hero &&
    heroCursor &&
    finePointer.matches
  ) {

    const dot = heroCursor.querySelector(
      ".hero-cursor__dot"
    );

    let targetX = 0;
    let targetY = 0;

    let currentX = 0;
    let currentY = 0;

    let cursorFrame = null;


    function animateCursor() {

      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;

      heroCursor.style.transform = `
        translate3d(
          ${currentX}px,
          ${currentY}px,
          0
        )
      `;

      cursorFrame = requestAnimationFrame(
        animateCursor
      );

    }


    hero.addEventListener("pointerenter", event => {

      const rect = hero.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

      currentX = targetX;
      currentY = targetY;

      heroCursor.classList.add("is-visible");

      if (!cursorFrame) {
        cursorFrame = requestAnimationFrame(
          animateCursor
        );
      }

    });


    hero.addEventListener("pointermove", event => {

      const rect = hero.getBoundingClientRect();

      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;

    });


    hero.addEventListener("pointerleave", () => {

      heroCursor.classList.remove(
        "is-visible",
        "is-interactive"
      );

      if (cursorFrame) {
        cancelAnimationFrame(cursorFrame);
        cursorFrame = null;
      }

    });


    hero
      .querySelectorAll(
        "a, button, .palette-card"
      )
      .forEach(element => {

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

      });

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
    serviceName,
    focus = false
  ) {

    serviceTabs.forEach(tab => {

      const active =
        tab.dataset.serviceTab ===
        serviceName;

      tab.classList.toggle(
        "is-active",
        active
      );

      tab.setAttribute(
        "aria-selected",
        active
      );

      tab.tabIndex = active ? 0 : -1;

      if (
        active &&
        focus
      ) {
        tab.focus();
      }

    });


    serviceScenes.forEach(scene => {

      const active =
        scene.dataset.serviceScene ===
        serviceName;

      scene.classList.toggle(
        "is-active",
        active
      );

      scene.setAttribute(
        "aria-hidden",
        !active
      );

    });

  }


  serviceTabs.forEach((tab, index) => {

    tab.addEventListener("click", () => {

      activateService(
        tab.dataset.serviceTab
      );

    });


    tab.addEventListener(
      "keydown",
      event => {

        let nextIndex = index;

        if (
          event.key === "ArrowRight" ||
          event.key === "ArrowDown"
        ) {

          nextIndex =
            (index + 1) %
            serviceTabs.length;

        }

        else if (
          event.key === "ArrowLeft" ||
          event.key === "ArrowUp"
        ) {

          nextIndex =
            (
              index -
              1 +
              serviceTabs.length
            ) %
            serviceTabs.length;

        }

        else if (
          event.key === "Home"
        ) {

          nextIndex = 0;

        }

        else if (
          event.key === "End"
        ) {

          nextIndex =
            serviceTabs.length - 1;

        }

        else {
          return;
        }

        event.preventDefault();

        activateService(
          serviceTabs[nextIndex]
            .dataset
            .serviceTab,
          true
        );

      }
    );

  });


  if (serviceTabs.length) {

    const active =
      serviceTabs.find(
        tab =>
          tab.classList.contains(
            "is-active"
          )
      ) || serviceTabs[0];

    activateService(
      active.dataset.serviceTab
    );

  }


  /* ============================================================
     VIDEO LAZY LOAD
     ============================================================ */

  const videos =
    document.querySelectorAll(
      "[data-project-video]"
    );


  if (
    videos.length &&
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            const video = entry.target;

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
          rootMargin: "400px 0px"
        }
      );


    videos.forEach(video => {
      observer.observe(video);
    });

  }


  /* ============================================================
     IFRAME LAZY LOAD
     ============================================================ */

  const liveFrames =
    document.querySelectorAll(
      "[data-live-preview]"
    );


  if (
    liveFrames.length &&
    "IntersectionObserver" in window
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

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
              !iframe.src &&
              container.dataset.src
            ) {

              iframe.src =
                container.dataset.src;

            }

            observer.unobserve(
              container
            );

          });

        },
        {
          rootMargin: "500px 0px"
        }
      );


    liveFrames.forEach(frame => {
      observer.observe(frame);
    });

  }


  /* ============================================================
     SELECTED WORK
     ============================================================ */

  const gallery =
    document.querySelector(
      "[data-work-gallery]"
    );


  if (gallery) {

    const tabs = [
      ...gallery.querySelectorAll(
        "[data-work-tab]"
      )
    ];

    const panels = [
      ...gallery.querySelectorAll(
        "[data-work-panel]"
      )
    ];

    const titles = [
      ...gallery.querySelectorAll(
        "[data-work-title]"
      )
    ];

    const previous =
      gallery.querySelector(
        "[data-work-prev]"
      );

    const next =
      gallery.querySelector(
        "[data-work-next]"
      );

    const order =
      tabs.map(
        tab => tab.dataset.workTab
      );

    let current =
      tabs.find(
        tab =>
          tab.classList.contains(
            "is-active"
          )
      )?.dataset.workTab ||
      order[0];

    let timeout;


    function changeProject(name) {

      if (
        !name ||
        name === current
      ) {
        return;
      }

      gallery.classList.add(
        "is-switching"
      );

      clearTimeout(timeout);

      const delay =
        reducedMotion.matches
          ? 0
          : 300;


      setTimeout(() => {

        current = name;

        tabs.forEach(tab => {

          const active =
            tab.dataset.workTab === name;

          tab.classList.toggle(
            "is-active",
            active
          );

          tab.setAttribute(
            "aria-selected",
            active
          );

        });


        panels.forEach(panel => {

          const active =
            panel.dataset.workPanel ===
            name;

          panel.classList.toggle(
            "is-active",
            active
          );

          panel.setAttribute(
            "aria-hidden",
            !active
          );

        });


        titles.forEach(title => {

          const active =
            title.dataset.workTitle ===
            name;

          title.classList.toggle(
            "is-active",
            active
          );

          title.setAttribute(
            "aria-hidden",
            !active
          );

        });

      }, delay);


      timeout = setTimeout(
        () => {

          gallery.classList.remove(
            "is-switching"
          );

        },
        reducedMotion.matches
          ? 20
          : 760
      );

    }


    function move(direction) {

      const index =
        order.indexOf(current);

      const nextIndex =
        (
          index +
          direction +
          order.length
        ) %
        order.length;

      changeProject(
        order[nextIndex]
      );

    }


    tabs.forEach(tab => {

      tab.addEventListener(
        "click",
        () => {

          changeProject(
            tab.dataset.workTab
          );

        }
      );

    });


    previous?.addEventListener(
      "click",
      () => move(-1)
    );

    next?.addEventListener(
      "click",
      () => move(1)
    );

  }


  /* ============================================================
     MATERIAL TRANSITION
     NO GSAP
     ============================================================ */

  const material =
    document.querySelector(
      ".material-transition"
    );


  if (
    material &&
    !reducedMotion.matches
  ) {

    const sage =
      material.querySelector(
        ".material-transition__layer--sage"
      );

    const gold =
      material.querySelector(
        ".material-transition__layer--gold"
      );

    const line =
      material.querySelector(
        ".material-transition__line"
      );


    let currentProgress = 0;
    let targetProgress = 0;
    let frame = null;


    const clamp = (
      value,
      min,
      max
    ) =>
      Math.min(
        Math.max(
          value,
          min
        ),
        max
      );


    const lerp = (
      from,
      to,
      amount
    ) =>
      from +
      (to - from) *
      amount;


    function getProgress() {

      const rect =
        material.getBoundingClientRect();

      const vh =
        window.innerHeight;

      const distance =
        vh + rect.height;

      const travelled =
        vh - rect.top;

      return clamp(
        travelled / distance,
        0,
        1
      );

    }


    function renderMaterial() {

      currentProgress =
        lerp(
          currentProgress,
          targetProgress,
          0.16
        );

      const p =
        currentProgress;


      /* SAGE */

      if (sage) {

        const x =
          lerp(
            -360,
            520,
            p
          );

        const y =
          lerp(
            80,
            -90,
            p
          );

        const scale =
          lerp(
            0.62,
            1.60,
            p
          );

        const rotate =
          lerp(
            -10,
            10,
            p
          );

        const opacity =
          lerp(
            0.30,
            0.98,
            p
          );


        sage.style.transform = `
          translate3d(
            ${x}px,
            ${y}px,
            0
          )
          rotate(
            ${rotate}deg
          )
          scale(
            ${scale}
          )
        `;

        sage.style.opacity =
          opacity;

      }


      /* GOLD */

      if (gold) {

        const x =
          lerp(
            440,
            -560,
            p
          );

        const y =
          lerp(
            -80,
            90,
            p
          );

        const scale =
          lerp(
            1.60,
            0.68,
            p
          );

        const rotate =
          lerp(
            10,
            -10,
            p
          );

        const opacity =
          lerp(
            0.28,
            0.92,
            p
          );


        gold.style.transform = `
          translate3d(
            ${x}px,
            ${y}px,
            0
          )
          rotate(
            ${rotate}deg
          )
          scale(
            ${scale}
          )
        `;

        gold.style.opacity =
          opacity;

      }


      /* LINE */

      if (line) {

        const scale =
          lerp(
            0.03,
            1,
            p
          );

        const x =
          lerp(
            -120,
            130,
            p
          );

        const opacity =
          lerp(
            0.08,
            0.95,
            p
          );


        line.style.transform = `
          translate3d(
            ${x}px,
            0,
            0
          )
          scaleX(
            ${scale}
          )
        `;

        line.style.opacity =
          opacity;

      }


      /* CSS pseudo-elements */

      material.style.setProperty(
        "--material-progress",
        p
      );

      material.style.setProperty(
        "--material-shine-x",
        `${lerp(
          -180,
          300,
          p
        )}px`
      );


      if (
        Math.abs(
          targetProgress -
          currentProgress
        ) >
        0.001
      ) {

        frame =
          requestAnimationFrame(
            renderMaterial
          );

      }

      else {

        frame = null;

      }

    }


    function updateMaterial() {

      targetProgress =
        getProgress();

      if (!frame) {

        frame =
          requestAnimationFrame(
            renderMaterial
          );

      }

    }


    targetProgress =
      getProgress();

    currentProgress =
      targetProgress;

    renderMaterial();


    window.addEventListener(
      "scroll",
      updateMaterial,
      {
        passive: true
      }
    );


    window.addEventListener(
      "resize",
      updateMaterial
    );

  }


  /* ============================================================
     GSAP PREMIUM MOTION
     ============================================================ */

  const gsapReady =
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !==
      "undefined";


  if (
    gsapReady &&
    !reducedMotion.matches
  ) {

    gsap.registerPlugin(
      ScrollTrigger
    );

    document.documentElement
      .classList
      .add("motion-enabled");


    /* ==========================================================
       SECTION TITLES
       ========================================================== */

    document
      .querySelectorAll(
        "[data-motion-title]"
      )
      .forEach(title => {

        const wrapper =
          title.closest(
            ".motion-title-wrap"
          );

        if (!wrapper) {
          return;
        }

        gsap.fromTo(
          title,
          {
            yPercent: 115,
            opacity: 0,
            rotate: 1
          },
          {
            yPercent: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.05,
            ease: "power4.out",

            scrollTrigger: {
              trigger: wrapper,
              start: "top 84%",
              once: true
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

    if (introCopy.length) {

      gsap.fromTo(
        introCopy,
        {
          y: 34,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.14,
          ease: "power3.out",

          scrollTrigger: {
            trigger: ".intro-copy",
            start: "top 82%",
            once: true
          }
        }
      );

    }


    /* ==========================================================
       INTRO PHOTO REVEAL
       ========================================================== */

    const introReveal =
      document.querySelector(
        ".intro-portrait__reveal"
      );

    if (introReveal) {

      gsap.set(
        introReveal,
        {
          xPercent: 0
        }
      );

      gsap.to(
        introReveal,
        {
          xPercent: 102,
          duration: 1.2,
          ease: "power4.inOut",

          scrollTrigger: {
            trigger:
              ".intro-portrait__image",

            start:
              "top 64%",

            once: true
          }
        }
      );

    }


    /* ==========================================================
       INTRO PHOTO PARALLAX
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
          yPercent: -2
        },
        {
          yPercent: 4,
          ease: "none",

          scrollTrigger: {
            trigger:
              ".intro-portrait",

            start:
              "top bottom",

            end:
              "bottom top",

            scrub: 1.2
          }
        }
      );

    }


    /* ==========================================================
       SERVICES
       ========================================================== */

    const servicesSection =
      document.querySelector(
        ".services-section"
      );

    if (servicesSection) {

      gsap.fromTo(
        ".services-section__inner",
        {
          y: 60
        },
        {
          y: 0,
          ease: "none",

          scrollTrigger: {
            trigger:
              ".services-section",

            start:
              "top 96%",

            end:
              "top 50%",

            scrub: 1.1
          }
        }
      );


      gsap.fromTo(
        ".services-stage",
        {
          y: 55,
          scale: 0.965,
          opacity: 0.5
        },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: "power3.out",

          scrollTrigger: {
            trigger:
              ".services-editorial",

            start:
              "top 80%",

            once: true
          }
        }
      );


      gsap.fromTo(
        ".service-tab",
        {
          x: -30,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.1,
          ease: "power3.out",

          scrollTrigger: {
            trigger:
              ".services-index",

            start:
              "top 80%",

            once: true
          }
        }
      );

    }


    /* ==========================================================
       SELECTED WORK
       ========================================================== */

    if (
      document.querySelector(
        ".work-gallery"
      )
    ) {

      gsap.fromTo(
        ".work-gallery__meta",
        {
          y: 34,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",

          scrollTrigger: {
            trigger:
              ".work-gallery__meta",

            start:
              "top 84%",

            once: true
          }
        }
      );


      const workReveal =
        document.querySelector(
          ".work-gallery__reveal"
        );

      if (workReveal) {

        gsap.set(
          workReveal,
          {
            xPercent: 0
          }
        );


        gsap.fromTo(
          ".work-gallery__frame",
          {
            scaleX: 0.80,
            scaleY: 0.93,
            transformOrigin:
              "right center"
          },
          {
            scaleX: 1,
            scaleY: 1,
            duration: 1.05,
            ease: "power4.out",

            scrollTrigger: {
              trigger:
                ".work-gallery__frame",

              start:
                "top 82%",

              once: true
            }
          }
        );


        gsap.to(
          workReveal,
          {
            xPercent: 102,
            duration: 1.1,
            ease: "power4.inOut",

            scrollTrigger: {
              trigger:
                ".work-gallery__frame",

              start:
                "top 78%",

              once: true
            }
          }
        );

      }

    }


    /* ==========================================================
       CONCEPT CARDS
       ========================================================== */

    const conceptCards =
      gsap.utils.toArray(
        "[data-concept-card]"
      );

    if (conceptCards.length) {

      const states = [
        {
          x: -65,
          y: 90,
          rotation: -1.5,
          scale: 0.89
        },
        {
          x: 0,
          y: 125,
          rotation: 0,
          scale: 0.87
        },
        {
          x: 65,
          y: 90,
          rotation: 1.5,
          scale: 0.89
        }
      ];


      conceptCards.forEach(
        (card, index) => {

          const state =
            states[index] ||
            states[1];

          gsap.fromTo(
            card,
            {
              x:
                mobileLayout.matches
                  ? 0
                  : state.x,

              y:
                mobileLayout.matches
                  ? 55
                  : state.y,

              rotation:
                mobileLayout.matches
                  ? 0
                  : state.rotation,

              scale:
                mobileLayout.matches
                  ? 0.96
                  : state.scale,

              opacity: 0
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,

              duration: 1.05,

              delay:
                index * 0.08,

              ease:
                "power4.out",

              scrollTrigger: {
                trigger:
                  ".concepts-grid",

                start:
                  "top 80%",

                once: true
              }
            }
          );

        }
      );

    }


    /* ==========================================================
       PACKAGE CARDS
       ========================================================== */

    const packageCards =
      gsap.utils.toArray(
        "[data-package-card]"
      );

    if (packageCards.length) {

      const states = [
        {
          x: -50,
          y: 90,
          rotation: -1.2,
          scale: 0.94
        },
        {
          x: 0,
          y: 125,
          rotation: 0,
          scale: 0.91
        },
        {
          x: 50,
          y: 90,
          rotation: 1.2,
          scale: 0.94
        }
      ];


      packageCards.forEach(
        (card, index) => {

          const state =
            states[index] ||
            states[1];

          gsap.fromTo(
            card,
            {
              x:
                mobileLayout.matches
                  ? 0
                  : state.x,

              y:
                mobileLayout.matches
                  ? 55
                  : state.y,

              rotation:
                mobileLayout.matches
                  ? 0
                  : state.rotation,

              scale:
                mobileLayout.matches
                  ? 0.97
                  : state.scale,

              opacity: 0
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              scale: 1,
              opacity: 1,

              duration: 1,

              delay:
                index * 0.08,

              ease:
                "power4.out",

              scrollTrigger: {
                trigger:
                  ".packages-grid",

                start:
                  "top 80%",

                once: true
              }
            }
          );

        }
      );

    }


    /* ==========================================================
       CONTACT
       ========================================================== */

    if (
      document.querySelector(
        ".contact-section"
      )
    ) {

      gsap.fromTo(
        ".contact-label",
        {
          y: 22,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",

          scrollTrigger: {
            trigger:
              ".contact-section",

            start:
              "top 80%",

            once: true
          }
        }
      );


      gsap.fromTo(
        ".contact-link",
        {
          y: 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.18,
          ease: "power3.out",

          scrollTrigger: {
            trigger:
              ".contact-section",

            start:
              "top 78%",

            once: true
          }
        }
      );

    }


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

      document.fonts.ready.then(
        () => {
          ScrollTrigger.refresh();
        }
      );

    }

  }


  /* ============================================================
     GSAP FALLBACK
     ============================================================ */

  else {

    document
      .querySelectorAll(`
        [data-motion-title],
        [data-motion-copy],
        [data-concept-card],
        [data-package-card]
      `)
      .forEach(element => {

        element.style.opacity = "1";
        element.style.transform =
          "none";

      });


    document
      .querySelectorAll(`
        .intro-portrait__reveal,
        .work-gallery__reveal
      `)
      .forEach(element => {

        element.style.display =
          "none";

      });

  }


  /* ============================================================
     GENERIC DATA-REVEAL
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

            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -5% 0px"
        }
      );


    revealItems.forEach(item => {

      revealObserver.observe(
        item
      );

    });

  }

});