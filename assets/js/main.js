(function () {
  function initChatbot() {
    var btn = document.getElementById("cyChatBtn");
    var overlay = document.getElementById("cyChatOverlay");
    var closeBtn = document.getElementById("cyChatClose");
    var iframe = overlay ? overlay.querySelector("iframe") : null;

    if (!btn || !overlay || !closeBtn) return;

    function openModal() {
      if (iframe && !iframe.getAttribute("src") && iframe.dataset.src) {
        iframe.setAttribute("src", iframe.dataset.src);
      }
      overlay.classList.add("cy-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      overlay.classList.remove("cy-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    btn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && overlay.classList.contains("cy-open")) {
        closeModal();
      }
    });
  }

  function initCarousel() {
    var carousel = document.getElementById("honorsCarousel");
    if (!carousel) return;

    var track = carousel.querySelector(".cy-carousel-track");
    var slides = carousel.querySelectorAll(".cy-carousel-slide");
    var prevBtn = carousel.querySelector(".cy-carousel-prev");
    var nextBtn = carousel.querySelector(".cy-carousel-next");
    var dots = carousel.querySelectorAll(".cy-carousel-dot");
    var counter = carousel.querySelector(".cy-carousel-counter");

    var total = slides.length;
    var index = 0;

    function goTo(nextIndex) {
      index = (nextIndex + total) % total;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      if (counter) {
        counter.textContent = index + 1 + " / " + total;
      }
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
        dot.setAttribute("aria-pressed", i === index ? "true" : "false");
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        goTo(index - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        goTo(index + 1);
      });
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        goTo(i);
      });
    });

    // Touch swipe support
    var startX = 0;
    var isSwiping = false;
    track.addEventListener(
      "touchstart",
      function (e) {
        if (e.touches.length === 1) {
          startX = e.touches[0].clientX;
          isSwiping = true;
        }
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      function (e) {
        if (!isSwiping) return;
        isSwiping = false;
        var diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) {
          goTo(diff < 0 ? index + 1 : index - 1);
        }
      },
      { passive: true }
    );

    goTo(0);
  }

  function initLightbox() {
    var lightbox = document.getElementById("cyLightbox");
    var lightboxImg = document.getElementById("cyLightboxImg");
    var closeBtn = document.getElementById("cyLightboxClose");
    if (!lightbox || !lightboxImg || !closeBtn) return;

    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || "";
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-zoomable]").forEach(function (img) {
      img.addEventListener("click", function () {
        openLightbox(img.src, img.alt);
      });
    });

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initChatbot();
    initCarousel();
    initLightbox();
  });
})();
