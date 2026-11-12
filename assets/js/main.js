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

    var lightboxVideo = document.createElement("video");
    lightboxVideo.controls = true;
    lightboxVideo.autoplay = true;
    lightboxVideo.loop = true;
    lightboxVideo.playsInline = true;
    lightboxVideo.style.display = "none";
    lightboxVideo.style.maxWidth = "92vw";
    lightboxVideo.style.maxHeight = "88vh";
    lightboxVideo.style.borderRadius = "10px";
    lightboxVideo.style.boxShadow = "0 20px 60px rgba(0, 0, 0, 0.45)";
    lightbox.appendChild(lightboxVideo);

    function openLightbox(el) {
      var isVideo = el.tagName.toLowerCase() === "video";
      if (isVideo) {
        lightboxImg.style.display = "none";
        lightboxImg.src = "";
        lightboxVideo.src = el.currentSrc || el.src;
        lightboxVideo.style.display = "block";
        lightboxVideo.play().catch(function () {});
      } else {
        lightboxVideo.pause();
        lightboxVideo.style.display = "none";
        lightboxVideo.src = "";
        lightboxImg.src = el.src;
        lightboxImg.alt = el.alt || "";
        lightboxImg.style.display = "block";
      }
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
      lightboxVideo.pause();
      lightboxVideo.src = "";
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-zoomable]").forEach(function (el) {
      el.addEventListener("click", function () {
        openLightbox(el);
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

  function initScrollSpy() {
    var navLinks = document.querySelectorAll(".sidebar-nav-link[data-section]");
    var sections = document.querySelectorAll(".content-section[id]");
    if (!navLinks.length || !sections.length || !("IntersectionObserver" in window)) return;

    function setActive(id) {
      navLinks.forEach(function (link) {
        link.classList.toggle("is-active", link.dataset.section === id);
      });
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: 0,
      }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function parseFrontmatter(text) {
    var match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
    var meta = {};
    var body = text;
    if (match) {
      var raw = match[1];
      body = match[2];
      raw.split(/\r?\n/).forEach(function (line) {
        var idx = line.indexOf(":");
        if (idx === -1) return;
        var k = line.slice(0, idx).trim();
        var v = line.slice(idx + 1).trim();
        if (v.startsWith("[") && v.endsWith("]")) {
          meta[k] = v
            .slice(1, -1)
            .split(",")
            .map(function (s) {
              return s.trim().replace(/^['"]|['"]$/g, "");
            })
            .filter(Boolean);
        } else {
          meta[k] = v.replace(/^['"]|['"]$/g, "");
        }
      });
    }
    return { meta: meta, body: body };
  }

  function initBlogList() {
    var listEl = document.getElementById("blogPostList");
    var filtersEl = document.getElementById("blogTagFilters");
    if (!listEl) return;

    fetch("posts/posts.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load posts.json");
        return res.json();
      })
      .then(function (posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
          listEl.innerHTML = '<p class="blog-empty">No posts published yet.</p>';
          return;
        }

        var activeTag = "all";
        var allTags = [];
        posts.forEach(function (p) {
          (p.tags || []).forEach(function (t) {
            if (allTags.indexOf(t) === -1) allTags.push(t);
          });
        });

        function renderFilters() {
          if (!filtersEl || allTags.length === 0) return;
          var btns = ['<button type="button" class="blog-filter-btn' + (activeTag === "all" ? " is-active" : "") + '" data-tag="all">All</button>'];
          allTags.forEach(function (tag) {
            btns.push(
              '<button type="button" class="blog-filter-btn' +
                (activeTag === tag ? " is-active" : "") +
                '" data-tag="' +
                escapeHtml(tag) +
                '">#' +
                escapeHtml(tag) +
                "</button>"
            );
          });
          filtersEl.innerHTML = btns.join("");
          filtersEl.querySelectorAll(".blog-filter-btn").forEach(function (btn) {
            btn.addEventListener("click", function () {
              activeTag = btn.dataset.tag;
              renderFilters();
              renderPosts();
            });
          });
        }

        function renderPosts() {
          var filtered =
            activeTag === "all"
              ? posts
              : posts.filter(function (p) {
                  return (p.tags || []).indexOf(activeTag) !== -1;
                });

          if (filtered.length === 0) {
            listEl.innerHTML = '<p class="blog-empty">No posts match this tag.</p>';
            return;
          }

          listEl.innerHTML = filtered
            .map(function (post) {
              var metaParts = [];
              if (post.date) metaParts.push(escapeHtml(post.date));
              if (post.readTime) metaParts.push(escapeHtml(post.readTime));
              var tagsHtml = (post.tags || [])
                .map(function (t) {
                  return '<span class="blog-tag">#' + escapeHtml(t) + "</span>";
                })
                .join("");

              return (
                '<a class="blog-post-card" href="post.html?slug=' +
                encodeURIComponent(post.slug) +
                '">' +
                '<div class="blog-post-main">' +
                '<h3 class="blog-post-title">' +
                escapeHtml(post.title) +
                "</h3>" +
                '<div class="blog-post-meta">' +
                metaParts.join(" · ") +
                "</div>" +
                (post.summary ? '<p class="blog-post-summary">' + escapeHtml(post.summary) + "</p>" : "") +
                "</div>" +
                (tagsHtml ? '<div class="blog-post-tags">' + tagsHtml + "</div>" : "") +
                "</a>"
              );
            })
            .join("");
        }

        renderFilters();
        renderPosts();
      })
      .catch(function () {
        listEl.innerHTML = '<p class="blog-empty">Unable to load blog posts.</p>';
      });
  }

  function initPostReader() {
    var contentEl = document.getElementById("postContent");
    var titleEl = document.getElementById("postTitle");
    var metaEl = document.getElementById("postMeta");
    var tagsEl = document.getElementById("postTags");
    var pagerEl = document.getElementById("postPager");
    if (!contentEl || !titleEl) return;

    var params = new URLSearchParams(window.location.search);
    var slug = params.get("slug");

    fetch("posts/posts.json")
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load posts index");
        return res.json();
      })
      .then(function (posts) {
        if (!Array.isArray(posts) || posts.length === 0) {
          throw new Error("No posts found");
        }
        var idx = slug
          ? posts.findIndex(function (p) {
              return p.slug === slug;
            })
          : 0;
        if (idx === -1) idx = 0;
        var post = posts[idx];

        return fetch(post.file)
          .then(function (r) {
            if (!r.ok) throw new Error("Post markdown not found");
            return r.text();
          })
          .then(function (mdRaw) {
            var parsed = parseFrontmatter(mdRaw);
            var title = parsed.meta.title || post.title;
            var date = parsed.meta.date || post.date;
            var tags = parsed.meta.tags || post.tags || [];

            document.title = title + " | Changyu Lee";
            titleEl.textContent = title;
            if (metaEl) {
              var parts = [];
              if (date) parts.push(date);
              if (post.readTime) parts.push(post.readTime);
              metaEl.textContent = parts.join(" · ");
            }
            if (tagsEl) {
              tagsEl.innerHTML = tags
                .map(function (t) {
                  return '<span class="blog-tag">#' + escapeHtml(t) + "</span>";
                })
                .join("");
            }

            if (window.marked && typeof window.marked.parse === "function") {
              contentEl.innerHTML = window.marked.parse(parsed.body);
            } else {
              contentEl.innerHTML = "<pre>" + escapeHtml(parsed.body) + "</pre>";
            }

            if (pagerEl) {
              var links = [];
              if (idx > 0) {
                var newer = posts[idx - 1];
                links.push(
                  '<a class="post-pager-link" href="post.html?slug=' +
                    encodeURIComponent(newer.slug) +
                    '"><span>← Newer Post</span><strong>' +
                    escapeHtml(newer.title) +
                    "</strong></a>"
                );
              }
              if (idx < posts.length - 1) {
                var older = posts[idx + 1];
                links.push(
                  '<a class="post-pager-link" href="post.html?slug=' +
                    encodeURIComponent(older.slug) +
                    '"><span>Older Post →</span><strong>' +
                    escapeHtml(older.title) +
                    "</strong></a>"
                );
              }
              pagerEl.innerHTML = links.join("");
            }
          });
      })
      .catch(function () {
        titleEl.textContent = "Post not found";
        if (metaEl) metaEl.textContent = "";
        contentEl.innerHTML = '<p>Could not load this post. <a href="index.html#blog">Return to Blog</a></p>';
      });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initChatbot();
    initCarousel();
    initLightbox();
    initScrollSpy();
    initBlogList();
    initPostReader();
  });
})();
