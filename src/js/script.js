/*
     Developer: Lukas Arsenovic
     Copyright: 08.06.2026
*/

document.addEventListener('DOMContentLoaded', () => {

     console.info('Website completely loaded!');

     initSlideshow();
     initNavigation();
     initJobsCarousel();
     initScrollToTop();
});

/* SLIDESHOW */
class Slideshow {

     constructor(root, { interval = 5000 } = {}) {

          this.root = root;
          this.layers = Array.from(root.querySelectorAll('.slide-image'));
          this.caption = root.querySelector('.slide-caption');

          this.slides = [];
          this.activeIndex = 0;
          this.activeLayer = 0;
          this.interval = interval;
          this.timer = null;
     }

     addSlide(path, caption) {

          const preload = new Image();

          preload.onload = () => {
               const isFirstSlide = this.slides.length === 0;
               this.slides.push({ path, caption: caption || '' });

               if (isFirstSlide) {
                    this.showSlide(0, { animate: false });
                    this.play();
               }
          };

          preload.onerror = () => console.warn(`Bild konnte nicht geladen werden: ${path}`);
          preload.src = path;
     }

     showSlide(index, { animate = true } = {}) {

          if (this.slides.length === 0) {
               return;
          }

          const slide = this.slides[index];
          const targetLayer = animate ? (this.activeLayer + 1) % 2 : this.activeLayer;
          const layerElement = this.layers[targetLayer];

          layerElement.src = slide.path;
          layerElement.alt = slide.caption;

          this.layers.forEach((layer, layerIndex) => {
               layer.classList.toggle('is-active', layerIndex === targetLayer);
          });

          if (this.caption) {
               this.caption.textContent = slide.caption;
          }

          this.activeLayer = targetLayer;
          this.activeIndex = index;
     }

     goTo(index, { userTriggered = false } = {}) {

          const total = this.slides.length;
          const nextIndex = (index + total) % total;

          this.showSlide(nextIndex);

          if (userTriggered) {
               this.restart();
          }
     }

     next(userTriggered = false) {
          this.goTo(this.activeIndex + 1, { userTriggered });
     }

     prev(userTriggered = false) {
          this.goTo(this.activeIndex - 1, { userTriggered });
     }

     play() {
          this.stop();
          this.timer = setInterval(() => this.next(false), this.interval);
     }

     stop() {
          clearInterval(this.timer);
          this.timer = null;
     }

     restart() {
          this.stop();
          this.play();
     }
}

function initSlideshow() {

     const root = document.querySelector('.slideshow');

     if (!root) {
          return;
     }

     const slideshow = new Slideshow(root);
     slideshow.addSlide('src/images/slides/1.jpg', 'Baustelle');
     slideshow.addSlide('src/images/slides/2.jpg', 'Baum');
     slideshow.addSlide('src/images/slides/3.jpg', 'Betonmischer');

     root.querySelector('.btn-left-arrow').addEventListener('click', () => slideshow.prev(true));
     root.querySelector('.btn-right-arrow').addEventListener('click', () => slideshow.next(true));
}

/* NAVIGATION */

function initNavigation() {

     initActiveNavLinks();
     initMobileNavDrawer();
}

function initActiveNavLinks() {

     const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"], .nav-drawer a[href^="#"]'));
     const sections = Array.from(document.querySelectorAll('main section[id]'));

     if (navLinks.length === 0 || sections.length === 0) {
          return;
     }

     const setActiveLink = () => {

          const scrollPosition = window.scrollY + 130;
          let activeSection = sections[0];

          sections.forEach((section) => {

               const sectionTop = section.offsetTop;
               const sectionBottom = sectionTop + section.offsetHeight;

               if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    activeSection = section;
               }
          });

          navLinks.forEach((link) => {
               const isActive = link.getAttribute('href') === `#${activeSection.id}`;
               link.classList.toggle('active', isActive);
          });
     };

     setActiveLink();
     window.addEventListener('scroll', setActiveLink);
}

function initMobileNavDrawer() {

     const toggleButton = document.getElementById('navMobile');
     const drawer = document.getElementById('navDrawer');

     if (!toggleButton || !drawer) {
          return;
     }

     const drawerLinks = drawer.querySelectorAll('a');

     const openDrawer = () => {
          toggleButton.classList.add('open');
          drawer.classList.add('open');
          toggleButton.setAttribute('aria-expanded', 'true');
          drawer.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
     };

     const closeDrawer = () => {
          toggleButton.classList.remove('open');
          drawer.classList.remove('open');
          toggleButton.setAttribute('aria-expanded', 'false');
          drawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
     };

     toggleButton.addEventListener('click', () => {
          toggleButton.classList.contains('open') ? closeDrawer() : openDrawer();
     });

     drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));

     document.addEventListener('click', (event) => {
          const clickedOutside = !drawer.contains(event.target) && !toggleButton.contains(event.target);

          if (clickedOutside) {
               closeDrawer();
          }
     });

     document.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
               closeDrawer();
          }
     });
}

/* JOBS CAROUSEL */

function initJobsCarousel() {

     const container = document.querySelector('.jobs-container');
     const nextButton = document.querySelector('.slider-btn.next');
     const prevButton = document.querySelector('.slider-btn.prev');
     const pagination = document.querySelector('.jobs-pagination');

     if (!container || !nextButton || !prevButton) {
          return;
     }

     const jobCards = Array.from(container.querySelectorAll('.job-card'));
     let currentPage = 0;

     const getVisibleCount = () => {
          if (window.innerWidth <= 700) return 1;
          if (window.innerWidth <= 980) return 2;
          return 3;
     };

     const getPageCount = () => Math.max(1, Math.ceil(jobCards.length / getVisibleCount()));

     const updatePagination = () => {

          if (!pagination) {
               return;
          }

          const pageCount = getPageCount();
          pagination.innerHTML = '';

          for (let page = 0; page < pageCount; page++) {

               const dot = document.createElement('button');
               dot.type = 'button';
               dot.className = page === currentPage ? 'active' : '';
               dot.setAttribute('aria-label', `Zu Seite ${page + 1} springen`);
               dot.addEventListener('click', () => scrollToPage(page));

               pagination.appendChild(dot);
          }
     };

     const updateButtons = () => {

          const pageCount = getPageCount();
          const isScrollable = pageCount > 1;

          nextButton.style.display = isScrollable ? 'flex' : 'none';
          prevButton.style.display = isScrollable ? 'flex' : 'none';

          prevButton.disabled = currentPage === 0;
          nextButton.disabled = currentPage === pageCount - 1;

          prevButton.style.opacity = prevButton.disabled ? '0.45' : '1';
          nextButton.style.opacity = nextButton.disabled ? '0.45' : '1';
     };

     const scrollToPage = (page) => {

          currentPage = page;
          container.scrollTo({ left: page * container.clientWidth, behavior: 'smooth' });

          updateButtons();
          updatePagination();
     };

     nextButton.addEventListener('click', () => {
          if (currentPage < getPageCount() - 1) {
               scrollToPage(currentPage + 1);
          }
     });

     prevButton.addEventListener('click', () => {
          if (currentPage > 0) {
               scrollToPage(currentPage - 1);
          }
     });

     window.addEventListener('resize', () => {

          const pageCount = getPageCount();

          if (currentPage >= pageCount) {
               currentPage = pageCount - 1;
          }

          scrollToPage(currentPage);
     });

     updatePagination();
     updateButtons();
}

/* SCROLL-TO-TOP BUTTON */

function initScrollToTop() {

     const scrollButton = document.getElementById('scrollBtn');

     if (!scrollButton) {
          return;
     }

     window.addEventListener('scroll', () => {
          scrollButton.style.display = window.pageYOffset > 20 ? 'block' : 'none';
     });

     scrollButton.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
     });
}