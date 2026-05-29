document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Setup Current Year in Footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // 2. Custom Cursor Glow
    const cursorGlow = document.querySelector('.cursor-glow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Generate Particles in Hero Section
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random properties
            const size = Math.random() * 8 + 4; // 4px to 12px
            const posX = Math.random() * 100; // 0% to 100%
            const posY = Math.random() * 100;
            const duration = Math.random() * 20 + 10; // 10s to 30s
            const delay = Math.random() * 5;
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = posX + '%';
            particle.style.top = posY + '%';
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = '-' + delay + 's'; // start at random point in animation
            
            particlesContainer.appendChild(particle);
        }
    }

    // 5. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6. Count-up Statistics (Intersection Observer)
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasCounted) {
                hasCounted = true; // prevent re-running
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString();
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString();
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.getElementById('stats');
    if (statsSection) {
        statObserver.observe(statsSection);
    }

    // 7. Live Clinic Timings Indicator
    const checkClinicStatus = () => {
        const now = new Date();
        // Adjust for IST if necessary, assuming user's local browser time matches their expected timezone
        const day = now.getDay(); // 0 = Sunday, 1-6 = Mon-Sat
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours + (minutes / 60);

        let isOpen = false;

        if (day === 0) { // Sunday
            // 10:00 AM to 1:00 PM (10.0 to 13.0)
            if (currentTime >= 10 && currentTime < 13) isOpen = true;
        } else { // Monday-Saturday
            // 10:00 AM to 1:00 PM (10.0 to 13.0) OR 5:00 PM to 9:00 PM (17.0 to 21.0)
            if ((currentTime >= 10 && currentTime < 13) || (currentTime >= 17 && currentTime < 21)) {
                isOpen = true;
            }
        }

        const indicator = document.getElementById('statusIndicator');
        const text = document.getElementById('statusText');
        
        if (indicator && text) {
            if (isOpen) {
                indicator.className = 'status-indicator open';
                text.textContent = 'Open Now';
            } else {
                indicator.className = 'status-indicator closed';
                text.textContent = 'Closed Now';
            }
        }
    };

    checkClinicStatus();
    // Re-check every minute
    setInterval(checkClinicStatus, 60000);

    // 8. Custom Before/After Slider
    const sliderContainer = document.querySelector('.slider-container');
    const beforeWrapper = document.getElementById('beforeWrapper');
    const sliderHandle = document.getElementById('sliderHandle');

    if (sliderContainer && beforeWrapper && sliderHandle) {
        let isDragging = false;

        const updateSlider = (e) => {
            if (!isDragging) return;
            
            // Get container boundaries
            const rect = sliderContainer.getBoundingClientRect();
            
            // Calculate mouse position relative to container
            let x = e.clientX || e.touches?.[0]?.clientX;
            x = x - rect.left;
            
            // Constrain x between 0 and width
            x = Math.max(0, Math.min(x, rect.width));
            
            // Calculate percentage
            const percentage = (x / rect.width) * 100;
            
            // Apply widths and positions
            beforeWrapper.style.width = percentage + '%';
            sliderHandle.style.left = percentage + '%';
        };

        const startDrag = (e) => {
            isDragging = true;
            sliderContainer.style.cursor = 'ew-resize';
            // prevent default text selection while dragging
            e.preventDefault(); 
        };

        const stopDrag = () => {
            isDragging = false;
            sliderContainer.style.cursor = 'default';
        };

        // Mouse Events
        sliderHandle.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', updateSlider);
        window.addEventListener('mouseup', stopDrag);

        // Touch Events
        sliderHandle.addEventListener('touchstart', startDrag, {passive: false});
        window.addEventListener('touchmove', updateSlider, {passive: false});
        window.addEventListener('touchend', stopDrag);
    }

});
