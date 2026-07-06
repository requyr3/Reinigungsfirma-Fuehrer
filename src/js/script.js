/*
     Developer: Lukas Arsenovic
     Copyright: 08.06.2026
*/

document.addEventListener('DOMContentLoaded', () => {

     console.info("Website completely loaded!")

     /* Slideshow */

     
     
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
});