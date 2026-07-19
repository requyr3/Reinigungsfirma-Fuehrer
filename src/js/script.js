/*
     Developer: Lukas Arsenovic
     Copyright: 08.06.2026
*/

let showtime;

document.addEventListener('DOMContentLoaded', () => {

     console.info("Website completely loaded!")

     /* Slideshow */
     class Slideshow {

          constructor(container) {

               this.container = container;
               this.images = [];
               this.index = 0;
               this.timer = null;

               this.start();
          }

          prev(isManual = true) {
               if (this.images.length === 0) {
                    return;
               }

               this.index = (this.index - 1 + this.images.length) % this.images.length;
               this.render();

               if (isManual) {
                    this.reset();
               }
          }

          next(isManual = false) {
               if (this.images.length === 0) {
                    return;
               }

               this.index = (this.index + 1) % this.images.length;
               this.render();

               if (isManual) {
                    this.reset();
               }
          }

          start() {
               this.timer = setInterval(() => this.next(false), 5000);
          }

          stop() {
               clearInterval(this.timer);
               this.timer = null;
          }

          reset() {
               this.stop();
               this.start();
          }

          addImage(path, text) {

               const image = new Image();

               if (!text || text.length === 0) {
                    text = "undefined text";
               }

               image.onload = () => {
                    const wasEmpty = this.images.length === 0;
                    this.images.push({ path, text });

                    if (wasEmpty) {
                         this.render();
                    }
               };

               image.onerror = () => {
                    console.warn(`Bild konnte nicht geladen werden: ${path}`);
               };

               image.src = path;

               console.log(this.images)
          }

          render() {

               const imageElement = this.container.querySelector('.slide .image');
               if (!imageElement) {
                    return;
               }

               const textElement = this.container.querySelector('.slide a')
               const current = this.images[this.index]

               let done = false;
               
               const swap = () => {
                    
                    if (done) {
                         return;
                    }
                    done = true;
                    
                    if (textElement) {
                         textElement.textContent = current?.text || '';
                    }
                    imageElement.src = current?.path || '';
                    imageElement.classList.remove('fade-out');
               };

               imageElement.classList.add('fade-out');
               imageElement.addEventListener('transitionend', swap, { once: true });
               setTimeout(swap, 2000);
          }
     }
     
     /* Init */ 
      
     const showtime = new Slideshow(document.querySelector('.slideshow'));
     showtime.addImage("src/images/slides/1.jpg", "Baustelle");
     showtime.addImage("src/images/slides/2.jpg", "Baum");
     showtime.addImage("src/images/slides/3.jpg", "Betonmischer");
     showtime.render();

     /* Btn */

     const leftBtn  = document.querySelector('.btn-left-arrow');
     const rightBtn = document.querySelector('.btn-right-arrow');
     leftBtn.addEventListener('click', () => showtime.prev(true));
     rightBtn.addEventListener('click', () => showtime.next(true));
     
     /* Navigation */
     
     const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
     const sections = Array.from(document.querySelectorAll('main section[id]'));

     function setActiveNav() {

          const scrollPosition = window.scrollY + 130;
          let activeSection    = sections[0];

          sections.forEach((section) => {

               const sectionTop    = section.offsetTop;
               const sectionHeight = section.offsetHeight;

               if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    activeSection = section;
               }
          });

          navLinks.forEach((link) => {
               const isActive = link.getAttribute('href') === `#${activeSection.id}`;
               link.classList.toggle('active', isActive);
          });
     }

     setActiveNav();
     window.addEventListener('scroll', setActiveNav);

     function openMobileNavigation() {

          const btn = document.getElementById('navMobile');
          const drawer = document.getElementById('navDrawer');
          const drawerLinks = drawer.querySelectorAll('a');

          function openMenu() {
               btn.classList.add('open');
               drawer.classList.add('open');
               btn.setAttribute('aria-expanded', 'true');
               drawer.setAttribute('aria-hidden', 'false');
               document.body.style.overflow = 'hidden';
          }

          function closeMenu() {
               btn.classList.remove('open');
               drawer.classList.remove('open');
               btn.setAttribute('aria-expanded', 'false');
               drawer.setAttribute('aria-hidden', 'true');
               document.body.style.overflow = '';
          }

          btn.addEventListener('click', function () {
               btn.classList.contains('open') ? closeMenu() : openMenu();
          });

          drawerLinks.forEach(function (link) {
               link.addEventListener('click', closeMenu);
          });

          document.addEventListener('click', function (e) {
               if (!drawer.contains(e.target) && !btn.contains(e.target)) {
                    closeMenu();
               }
          });

          document.addEventListener('keydown', function (e) {
               if (e.key === 'Escape') closeMenu();
          });
     };
     openMobileNavigation();

     /* Scroll-To-Top */ 
     const scrollBtn = document.getElementById("scrollBtn");

     window.addEventListener("scroll", function () {
          if (window.pageYOffset > 20) {
               scrollBtn.style.display = "block";
          } else {
               scrollBtn.style.display = "none";
          }
     });

     scrollBtn.addEventListener("click", function () {
          window.scrollTo({
               top: 0,
               behavior: "smooth"
          });
     });
});