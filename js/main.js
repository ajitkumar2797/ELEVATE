document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log("Initializing script...");

        // --- 0. UI LOGIC (MENU) ---

        // Mobile Menu Logic
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuBtn && navLinks) {
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const isOpen = navLinks.classList.contains('active');
                mobileMenuBtn.innerHTML = isOpen ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
                lucide.createIcons();
            });

            // Close mobile menu when a link is clicked
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
                    lucide.createIcons();
                });
            });
        }

        // --- SCROLL ANIMATION (GLOBAL & COACH IMAGE) ---
        const observerOptions = {
            threshold: 0.15, // Trigger when 15% of element is visible
            rootMargin: "0px 0px -50px 0px" // Offset slightly so it triggers before bottom
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    entry.target.classList.add('in-view'); // For coach image compatibility
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        }, observerOptions);

        // Observe Coach Image
        const coachImg = document.querySelector('.coach-image img');
        if (coachImg) observer.observe(coachImg);

        // Observe All Reveal Elements
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // --- INFINITE CAROUSEL ---
        const track = document.querySelector('.carousel-track');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (track && prevBtn && nextBtn) {
            const cardWidth = 320; // 300px width + 20px gap
            let isAnimating = false;

            nextBtn.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                // 1. Slide the track to the left
                track.style.transition = 'transform 0.5s ease-in-out';
                track.style.transform = `translateX(-${cardWidth}px)`;

                // 2. After animation, move first card to end and reset
                setTimeout(() => {
                    track.style.transition = 'none'; // Disable transition for instant snap
                    track.appendChild(track.firstElementChild); // Move first item to end
                    track.style.transform = 'translateX(0)'; // Reset position
                    isAnimating = false;
                }, 500); // Match transition duration
            });

            prevBtn.addEventListener('click', () => {
                if (isAnimating) return;
                isAnimating = true;

                // 1. Move last card to start INSTANTLY
                track.style.transition = 'none';
                track.prepend(track.lastElementChild);
                track.style.transform = `translateX(-${cardWidth}px)`; // Offset it

                // 2. Slide it into view
                setTimeout(() => {
                    track.style.transition = 'transform 0.5s ease-in-out';
                    track.style.transform = 'translateX(0)';
                    setTimeout(() => { isAnimating = false; }, 500);
                }, 10); // Small delay to allow browser to register the offset
            });
        }

        // --- FORM SUBMISSION ---
        const form = document.getElementById('coaching-form');

        if (!form) {
            console.error("Form not found!");
        } else {
            console.log("Form found, attaching listener...");

            // GOOGLE APPS SCRIPT URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzkM4if2aBVT_yg6RTqXoMZf_yPbJ-Hnjm7CcB2t7NhCQi8aeydnm04i9Va_ROhdKnUZA/exec';

            // Modal Logic
            const modal = document.getElementById('success-modal');
            const closeModal = document.getElementById('close-modal');

            if (closeModal && modal) {
                closeModal.addEventListener('click', () => {
                    modal.classList.remove('active');
                });
            }

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log("Form submit triggered");

                const btn = form.querySelector('button');
                const originalText = btn.innerText;

                btn.innerText = 'Sending...';
                btn.disabled = true;

                // Use 'no-cors' to bypass browser security blocks
                console.log("Attempting to fetch:", scriptURL);

                fetch(scriptURL, { method: 'POST', body: new FormData(form), mode: 'no-cors' })
                    .then(response => {
                        console.log('Fetch response received (opaque in no-cors mode)');
                        // Show Custom Modal
                        if (modal) {
                            modal.classList.add('active');
                            if (window.lucide) lucide.createIcons();
                        } else {
                            alert("Application submitted successfully!");
                        }

                        btn.innerText = 'Application Sent!';
                        btn.style.backgroundColor = '#4ade80'; // Success green
                        btn.style.color = '#000';
                        form.reset();

                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.disabled = false;
                            btn.style.backgroundColor = '';
                            btn.style.color = '';
                        }, 3000);
                    })
                    .catch(error => {
                        console.error('Fetch Error!', error);
                        alert("Error submitting form: " + error.message + ". Please check your internet connection.");

                        btn.innerText = 'Error! Try Again';
                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.disabled = false;
                        }, 3000);
                    });
            });
        }

    } catch (err) {
        console.error("CRITICAL JS ERROR:", err);
        alert("System Error: " + err.message);
    }
});
