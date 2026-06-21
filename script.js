document.addEventListener('DOMContentLoaded', () => {

    // --- Page Loader ---
    const loader = document.getElementById('loader');
    const loaderBar = document.querySelector('.loader-bar');
    
    // Simulate loading
    setTimeout(() => { loaderBar.style.width = '30%'; }, 200);
    setTimeout(() => { loaderBar.style.width = '70%'; }, 500);
    setTimeout(() => { loaderBar.style.width = '100%'; }, 800);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 1000); // Wait a bit after full load
    });

    // Fallback if load event doesn't fire or takes too long
    setTimeout(() => {
        loader.classList.add('hidden');
    }, 3000);

    // --- Falling Petals (Sakura) Background ---
    const canvas = document.getElementById('sakura-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        // Resize canvas to full window
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const petals = [];
        const numPetals = 40; // Number of petals falling simultaneously

        // Petal Object
        class Petal {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 8 + 4;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.angle = Math.random() * 360;
                this.spin = Math.random() * 2 - 1;
                this.opacity = Math.random() * 0.5 + 0.3; // Slight transparency
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y / 50) * 0.5; // Flutter effect
                this.angle += this.spin;

                // Reset when out of bounds
                if (this.y > canvas.height) {
                    this.y = -20;
                    this.x = Math.random() * canvas.width;
                }
                if (this.x > canvas.width) {
                    this.x = 0;
                } else if (this.x < 0) {
                    this.x = canvas.width;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle * Math.PI / 180);
                
                ctx.font = `${this.size * 2}px Arial`;
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`; 
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('🍁', 0, 0);
                
                ctx.restore();
            }
        }

        // Initialize petals
        for (let i = 0; i < numPetals; i++) {
            petals.push(new Petal());
        }

        // Animation loop
        const animatePetals = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            petals.forEach(petal => {
                petal.update();
                petal.draw();
            });
            requestAnimationFrame(animatePetals);
        };
        animatePetals();
    }

    // --- Custom Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorRing = document.getElementById('cursor-ring');
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .filter-btn, .facility-card, th');
    
    // Check if mobile (don't run custom cursor logic on touch devices to save performance)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice && cursorDot && cursorRing) {
        let mouseX = 0;
        let mouseY = 0;
        let ringX = 0;
        let ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Dot follows instantly
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Ring follows with a slight delay using requestAnimationFrame
        const animateCursor = () => {
            const dx = mouseX - ringX;
            const dy = mouseY - ringY;
            
            ringX += dx * 0.2;
            ringY += dy * 0.2;
            
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover effects
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        if(progressBar) progressBar.style.width = scrollPercentage + '%';
    });

    // --- Typing Text Effect in Hero ---
    const typingTextElement = document.getElementById('typing-text');
    const phrases = ["Empowering Innovators", "Shaping the Future", "Cultivating Excellence"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeEffect = () => {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Delete faster
        } else {
            typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Type normally
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at the end of phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing new phrase
        }

        setTimeout(typeEffect, typingSpeed);
    };

    if (typingTextElement) {
        setTimeout(typeEffect, 1500); // Start after loader disappears
    }

    // --- Scroll Animations ---
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if(navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // --- Stats Animated Counters ---
    const counters = document.querySelectorAll('.stat-number');
    const statsSection = document.getElementById('stats');
    let hasAnimated = false;

    if (statsSection) {
        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps

                let current = 0;
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        if (target === 98) {
                            counter.innerText = target;
                        } else {
                            counter.innerText = target + '+';
                        }
                    }
                };
                updateCounter();
            });
        };

        const statsObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        }, { threshold: 0.5 });

        statsObserver.observe(statsSection);
    }

    // --- Courses Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            courseCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 300);
                }
            });
        });
    });

    // --- Table Sorting ---
    const table = document.getElementById('fee-table');
    if(table) {
        const headers = table.querySelectorAll('th');
        const tbody = table.querySelector('tbody');

        headers.forEach(header => {
            header.addEventListener('click', () => {
                const columnIdx = header.getAttribute('data-column');
                const type = header.getAttribute('data-type');
                const isAscending = header.classList.contains('asc');
                
                headers.forEach(h => {
                    h.classList.remove('asc', 'desc');
                    h.querySelector('.sort-icon').innerText = '↕';
                });

                if (isAscending) {
                    header.classList.add('desc');
                    header.querySelector('.sort-icon').innerText = '↓';
                } else {
                    header.classList.add('asc');
                    header.querySelector('.sort-icon').innerText = '↑';
                }

                const rows = Array.from(tbody.querySelectorAll('tr'));
                
                rows.sort((a, b) => {
                    const cellA = a.querySelectorAll('td')[columnIdx].innerText;
                    const cellB = b.querySelectorAll('td')[columnIdx].innerText;

                    if (type === 'number') {
                        return isAscending ? parseInt(cellB) - parseInt(cellA) : parseInt(cellA) - parseInt(cellB);
                    } else {
                        return isAscending ? cellB.localeCompare(cellA) : cellA.localeCompare(cellB);
                    }
                });

                rows.forEach(row => tbody.appendChild(row));
            });
        });
    }

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-img');

    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightbox.classList.add('active');
            let imgUrl = new URL(img.src);
            if(imgUrl.hostname === 'images.unsplash.com') {
                imgUrl.searchParams.set('w', '1200');
                imgUrl.searchParams.set('h', '800');
                lightboxImg.src = imgUrl.toString();
            } else {
                lightboxImg.src = img.src.replace('600/400', '1200/800');
            }
        });
    });

    const closeLightbox = () => {
        if(lightbox) lightbox.classList.remove('active');
    };

    if(lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if(lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg) {
                closeLightbox();
            }
        });
    }

    // --- Apply Modal ---
    const applyModal = document.getElementById('apply-modal');
    const applyBtns = document.querySelectorAll('.btn-apply');
    const applyClose = document.querySelector('.modal-close');

    applyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(applyModal) applyModal.classList.add('active');
        });
    });

    const closeApplyModal = () => {
        if(applyModal) applyModal.classList.remove('active');
    };

    if(applyClose) applyClose.addEventListener('click', closeApplyModal);
    if(applyModal) {
        applyModal.addEventListener('click', (e) => {
            if (e.target === applyModal) {
                closeApplyModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox && lightbox.classList.contains('active')) closeLightbox();
            if (applyModal && applyModal.classList.contains('active')) closeApplyModal();
        }
    });

    // Modal Form Submit
    const applyForm = document.getElementById('apply-form');
    const appStatus = document.getElementById('app-status');
    if(applyForm) {
        applyForm.addEventListener('submit', (e) => {
            e.preventDefault();
            appStatus.innerHTML = '<span class="success-msg">Application submitted successfully! We will contact you soon.</span>';
            setTimeout(() => {
                closeApplyModal();
                applyForm.reset();
                appStatus.innerHTML = '';
            }, 3000);
        });
    }

    // --- Contact Form Validation ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if(contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                formStatus.innerHTML = '<span class="error-msg">Please fill out all required fields.</span>';
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formStatus.innerHTML = '<span class="error-msg">Please enter a valid email address.</span>';
                return;
            }

            formStatus.innerHTML = '<span class="success-msg">Thank you for your message! We will get back to you shortly.</span>';
            contactForm.reset();
            
            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 5000);
        });
    }

    // --- Image Fallback System ---
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.addEventListener('error', function() {
            if (this.src !== 'assets/images/fallbacks/placeholder.png') {
                this.src = 'assets/images/fallbacks/placeholder.png';
                this.alt = 'Image Not Found';
                // ensure it retains layout
                this.style.objectFit = 'cover';
                this.style.backgroundColor = '#f4f4f4';
            }
        });
    });

    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
            // Toggle hamburger icon (bars to times)
            const icon = hamburger.querySelector('i');
            if (icon) {
                if (navLinksContainer.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close mobile menu when a link is clicked
        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

});
