/*
  Suraj Bhan Kumar Portfolio - Core Interactions & Animations
*/

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- 1. Theme Management (Dark/Light Mode) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    body.classList.add('light-mode');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('light-mode');
      const currentTheme = body.classList.contains('light-mode') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
      
      // Update toggle button accessibility labels
      themeToggleBtn.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
    });
  }


  // --- 2. Custom Cursor (Desktop Only) ---
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let isCursorActive = false;

  // Only run cursor code if device supports fine pointer (mouse)
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (hasFinePointer && cursorDot && cursorRing) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // On first mouse move, activate the custom cursor and hide the default one
      if (!isCursorActive) {
        document.body.classList.add('custom-cursor-active');
        isCursorActive = true;
      }
      
      // Instantly position the dot
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Lerp outer ring for smooth trailing effect
    const animateRing = () => {
      const lerpFactor = 0.15;
      ringX += (mouseX - ringX) * lerpFactor;
      ringY += (mouseY - ringY) * lerpFactor;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(animateRing);
    };
    animateRing();

    // Hover states for links and buttons
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .clickable');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hovered');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hovered');
      });
      el.addEventListener('mousedown', () => {
        cursorRing.classList.add('clicked');
      });
      el.addEventListener('mouseup', () => {
        cursorRing.classList.remove('clicked');
      });
    });
  }


  // --- 3. Typing Animation ---
  const typedTextSpan = document.querySelector('.typed-text');
  const roles = [
    'solve Real World Problems.', 
    'automate candidate screening.', 
    'predict exam cheating behavior.',
    'scale business workflows.',
    'empower client brands.'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typedTextSpan) return;

    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
      typedTextSpan.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Deleting faster
    } else {
      typedTextSpan.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Regular typing speed
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeEffect, typingSpeed);
  }
  
  if (typedTextSpan) {
    setTimeout(typeEffect, 1000);
  }


  // --- 4. Mouse Reactive Glow Grid Cards ---
  const glowCards = document.querySelectorAll('.tech-card, .project-card, .achievement-card, .highlight-card');
  glowCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });


  // --- 5. Project Filters and Search ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card-wrapper');
  const searchInput = document.getElementById('project-search');
  
  let activeFilter = 'all';
  let searchQuery = '';

  function filterProjects() {
    projectCards.forEach(wrapper => {
      const card = wrapper.querySelector('.project-card');
      const category = card.getAttribute('data-category');
      const title = card.querySelector('.project-title').textContent.toLowerCase();
      const desc = card.querySelector('.project-desc').textContent.toLowerCase();
      const tags = Array.from(card.querySelectorAll('.project-tag')).map(t => t.textContent.toLowerCase());
      
      const matchesCategory = activeFilter === 'all' || category === activeFilter;
      const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery) || tags.some(tag => tag.includes(searchQuery));

      if (matchesCategory && matchesSearch) {
        wrapper.style.display = 'block';
        // Add a micro-animation fade class
        setTimeout(() => {
          wrapper.style.opacity = '1';
          wrapper.style.transform = 'scale(1)';
        }, 50);
      } else {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'scale(0.95)';
        // Wait for transition before hiding display
        setTimeout(() => {
          if (wrapper.style.opacity === '0') {
            wrapper.style.display = 'none';
          }
        }, 300);
      }
    });
  }

  // Handle Tab Click
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.getAttribute('data-filter');
      filterProjects();
    });
  });

  // Handle Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterProjects();
    });
  }


  // --- 6. Analytics Counters (LocalStorage Mock) ---
  // Visitor counter
  let visitorCount = parseInt(localStorage.getItem('portfolio_visitor_count') || '1426');
  visitorCount += 1;
  localStorage.setItem('portfolio_visitor_count', visitorCount.toString());

  const visitorCountEl = document.getElementById('visitor-count');
  if (visitorCountEl) {
    // Add dynamic animation to the counting number
    animateValue(visitorCountEl, visitorCount - 15, visitorCount, 1500);
  }

  // Resume download counter
  const resumeDownloadBtns = document.querySelectorAll('.resume-download-btn');
  let resumeDownloads = parseInt(localStorage.getItem('portfolio_resume_downloads') || '384');

  const downloadCounterEl = document.getElementById('download-count');
  if (downloadCounterEl) {
    downloadCounterEl.textContent = resumeDownloads.toString();
  }

  resumeDownloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      resumeDownloads += 1;
      localStorage.setItem('portfolio_resume_downloads', resumeDownloads.toString());
      if (downloadCounterEl) {
        // Animate counter increment
        animateValue(downloadCounterEl, resumeDownloads - 1, resumeDownloads, 300);
      }
    });
  });

  // Number animation helper
  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      obj.innerHTML = Math.floor(progress * (end - start) + start);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }


  // --- 7. Email Copy Button ---
  const emailCopyBtn = document.getElementById('email-copy-btn');
  const emailCopyText = document.querySelector('.email-copy-text');
  
  if (emailCopyBtn && emailCopyText) {
    emailCopyBtn.addEventListener('click', () => {
      const email = emailCopyText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        // Change button icon or show indicator
        const originalHtml = emailCopyBtn.innerHTML;
        emailCopyBtn.innerHTML = '<i data-lucide="check" style="color: var(--success-color);"></i>';
        lucide.createIcons();
        
        // Custom tooltip alert
        const tooltip = document.createElement('span');
        tooltip.textContent = 'Email copied to clipboard!';
        tooltip.style.position = 'absolute';
        tooltip.style.bottom = '-40px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.backgroundColor = 'rgba(16, 185, 129, 0.9)';
        tooltip.style.color = '#ffffff';
        tooltip.style.padding = '6px 12px';
        tooltip.style.borderRadius = '8px';
        tooltip.style.fontSize = '0.8rem';
        tooltip.style.fontWeight = '600';
        tooltip.style.zIndex = '100';
        tooltip.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
        
        emailCopyBtn.parentElement.style.position = 'relative';
        emailCopyBtn.parentElement.appendChild(tooltip);
        
        setTimeout(() => {
          emailCopyBtn.innerHTML = originalHtml;
          lucide.createIcons();
          tooltip.remove();
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
      });
    });
  }


  // --- 8. Premium Contact Form Validation ---
  const contactForm = document.getElementById('portfolio-contact-form');
  const statusMsg = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      statusMsg.style.display = 'none';

      // 1. Validate Name
      const nameInput = document.getElementById('form-name');
      const nameGroup = nameInput.closest('.form-group');
      if (nameInput.value.trim().length < 2) {
        nameGroup.classList.add('has-error');
        isValid = false;
      } else {
        nameGroup.classList.remove('has-error');
      }

      // 2. Validate Email
      const emailInput = document.getElementById('form-email');
      const emailGroup = emailInput.closest('.form-group');
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailGroup.classList.add('has-error');
        isValid = false;
      } else {
        emailGroup.classList.remove('has-error');
      }

      // 3. Validate Message
      const messageInput = document.getElementById('form-message');
      const messageGroup = messageInput.closest('.form-group');
      if (messageInput.value.trim().length < 10) {
        messageGroup.classList.add('has-error');
        isValid = false;
      } else {
        messageGroup.classList.remove('has-error');
      }

      if (isValid) {
        // Submit UI simulation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader" class="spin"></i> Sending...';
        lucide.createIcons();

        // Simulate API post request
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          lucide.createIcons();

          statusMsg.className = 'form-status-msg success';
          statusMsg.textContent = 'Thank you! Your message has been sent successfully. I will get back to you shortly.';
          statusMsg.style.display = 'block';

          contactForm.reset();
        }, 1500);
      } else {
        statusMsg.className = 'form-status-msg error';
        statusMsg.textContent = 'Please correct the errors in the form fields before submitting.';
        statusMsg.style.display = 'block';
      }
    });

    // Clear errors on input
    const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        input.closest('.form-group').classList.remove('has-error');
      });
    });
  }


  // --- 9. Mobile Responsive Menu Toggle ---
  const hamburgerBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      hamburgerBtn.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
      lucide.createIcons();
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && e.target !== hamburgerBtn) {
        navMenu.classList.remove('open');
        hamburgerBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
      }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburgerBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
      });
    });
  }


  // --- 10. Scroll Progress Bar & Back to Top Toggle ---
  const progressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top');

  window.addEventListener('scroll', () => {
    // Reading Progress
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }

    // Back to Top visibility
    if (backToTopBtn) {
      if (winScroll > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }


  // --- 11. GSAP Scroll Animations Setup ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Initial page load reveals
    gsap.from('header', {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.hero-content > *', {
      x: -50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out'
    });

    gsap.from('.hero-image-wrapper', {
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: 'back.out(1.2)',
      delay: 0.4
    });

    // Scroll Trigger reveals for sections
    const fadeSections = document.querySelectorAll('section');
    fadeSections.forEach(sec => {
      // Find elements to reveal inside section
      const elementsToAnimate = sec.querySelectorAll('.overtitle, h2.section-title, p.section-subtitle, .about-grid, .tech-grid, .project-filters, .project-grid, .timeline, .achievements-grid, .certificates-grid, .education-timeline, .contact-grid');
      
      if (elementsToAnimate.length > 0) {
        gsap.from(elementsToAnimate, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sec,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        });
      }
    });

    // Skill Bar Trigger Animation
    const skillSection = document.getElementById('tech');
    if (skillSection) {
      gsap.from('.skill-bar-inner', {
        width: '0%',
        scrollTrigger: {
          trigger: '.tech-skills-meter',
          start: 'top 85%',
          onEnter: () => {
            document.querySelectorAll('.skill-bar-inner').forEach(bar => {
              const targetWidth = bar.getAttribute('data-width');
              bar.style.width = targetWidth;
            });
          }
        }
      });
    }
  } else {
    // Fallback: If GSAP is blocked, instantly load the skill bars
    setTimeout(() => {
      document.querySelectorAll('.skill-bar-inner').forEach(bar => {
        bar.style.width = bar.getAttribute('data-width');
      });
    }, 1000);
  }
});
