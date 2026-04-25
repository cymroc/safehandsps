// ── Nav: scroll class + burger ────────────────────────────────

const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ── Footer year ───────────────────────────────────────────────

document.getElementById('year').textContent = new Date().getFullYear();

// ── Scroll reveal (Intersection Observer) ─────────────────────

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Gallery: build grid from manifest ─────────────────────────
//
// To add photos: push objects into GALLERY_IMAGES with the path
// to the uploaded image and an optional caption string.
// Example: { src: 'gallery/kitchen-refit-2024.jpg', caption: 'Kitchen refit, Cardiff' }
//
// When Decap CMS is live, Marc can upload via /admin and you
// then reference the generated filename here.

const GALLERY_IMAGES = [
  { src: 'gallery/491348685_9599529516830601_1239906668173033184_n.jpg', caption: '' },
  { src: 'gallery/491553445_9599530656830487_519451091988682471_n.jpg', caption: '' },
  { src: 'gallery/491925942_9599530573497162_4140060001436688192_n.jpg', caption: '' },
  { src: 'gallery/492026015_9599530600163826_1805703187254226136_n.jpg', caption: '' },
  { src: 'gallery/492086966_9599530706830482_3535531527117746795_n.jpg', caption: '' },
  { src: 'gallery/492154702_9599530616830491_4495256876894844477_n.jpg', caption: '' },
  { src: 'gallery/515864430_23992751193748527_7596772384781594338_n.jpg', caption: '' },
  { src: 'gallery/515977583_23992735810416732_4429371010267542772_n.jpg', caption: '' },
  { src: 'gallery/552793884_10228840712015016_7609343185078158228_n.jpg', caption: '' },
];

const galleryGrid = document.getElementById('galleryGrid');
const galleryPlaceholder = document.getElementById('galleryPlaceholder');

if (GALLERY_IMAGES.length > 0) {
  galleryPlaceholder.style.display = 'none';

  GALLERY_IMAGES.forEach((item, index) => {
    const article = document.createElement('article');
    article.className = 'gallery__item reveal';

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.caption || 'Completed project';
    img.loading = 'lazy';
    img.decoding = 'async';

    const overlay = document.createElement('div');
    overlay.className = 'gallery__item__overlay';
    if (item.caption) {
      const caption = document.createElement('span');
      caption.textContent = item.caption;
      caption.style.cssText = 'color:white;font-size:0.85rem;font-weight:600;';
      overlay.appendChild(caption);
    }

    article.appendChild(img);
    article.appendChild(overlay);
    article.addEventListener('click', () => openLightbox(index));
    galleryGrid.appendChild(article);

    revealObserver.observe(article);
  });
}

// ── Lightbox ──────────────────────────────────────────────────

const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCaption');
const lbClose     = document.getElementById('lightboxClose');
const lbPrev      = document.getElementById('lightboxPrev');
const lbNext      = document.getElementById('lightboxNext');
let currentIndex  = 0;

function openLightbox(index) {
  currentIndex = index;
  showLightboxImage(currentIndex);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function showLightboxImage(index) {
  const item = GALLERY_IMAGES[index];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.caption || 'Project photo';
  lightboxCap.textContent = item.caption || '';
  lbPrev.style.visibility = index === 0 ? 'hidden' : 'visible';
  lbNext.style.visibility = index === GALLERY_IMAGES.length - 1 ? 'hidden' : 'visible';
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => { if (currentIndex > 0) showLightboxImage(--currentIndex); });
lbNext.addEventListener('click', () => { if (currentIndex < GALLERY_IMAGES.length - 1) showLightboxImage(++currentIndex); });
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft'  && currentIndex > 0) showLightboxImage(--currentIndex);
  if (e.key === 'ArrowRight' && currentIndex < GALLERY_IMAGES.length - 1) showLightboxImage(++currentIndex);
});
