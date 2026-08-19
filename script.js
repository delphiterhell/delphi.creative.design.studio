document.addEventListener("DOMContentLoaded", () => {

  /* ----------------------------------------------------------
     HERO LOAD
     ---------------------------------------------------------- */

  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });


  /* ----------------------------------------------------------
     PALETTE CARDS
     ---------------------------------------------------------- */

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


  /* ----------------------------------------------------------
     VERY SUBTLE MOUSE PARALLAX
     ---------------------------------------------------------- */

  const hero =
    document.querySelector(".hero");

  const video =
    document.querySelector(".hero-video");

  if (
    hero &&
    video &&
    window.matchMedia("(pointer: fine)").matches
  ) {

    hero.addEventListener("mousemove", event => {

      const rect =
        hero.getBoundingClientRect();

      const mouseX =
        (event.clientX - rect.left)
        / rect.width
        - 0.5;

      const mouseY =
        (event.clientY - rect.top)
        / rect.height
        - 0.5;

      const moveX =
        mouseX * 7;

      const moveY =
        mouseY * 5;

      video.style.transform =
        `
        scale(1.025)
        translate(
          ${moveX}px,
          ${moveY}px
        )
        `;

    });


    hero.addEventListener("mouseleave", () => {

      video.style.transform =
        `
        scale(1.02)
        translate(0, 0)
        `;

    });

  }

});