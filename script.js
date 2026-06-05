document.addEventListener("DOMContentLoaded", () => {
    // Selects your exact classes from your updated navbar layout
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    // Safety Gate: Only runs if the navbar elements exist on the current page
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', () => {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
    }
});


// =========================================================
// 2. 3D RESPONSIVE FLIPDOWN TIMELINE ENGINE
// =========================================================
window.addEventListener("load", () => {

    // Target date configuration (September 13, 2026 at midnight)
    const targetDate = new Date("September 13, 2026 00:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        // If the countdown milestone is crossed, lock values at zero
        if (difference < 0) {
            const title = document.querySelector(".countdown-title");
            if (title) title.innerText = "The Convention Has Begun!";
            return;
        }

        // Time breakdown arithmetic calculations
        const timeUnits = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };

        // Cycle through each card element to verify if values shifted
        for (const unit in timeUnits) {
            // Adds a leading zero if the calculated digit is below 10
            const formattedValue = timeUnits[unit] < 10 ? "0" + timeUnits[unit] : String(timeUnits[unit]);
            const cardContainer = document.getElementById(`card-${unit}`);

            // Safety Check: Skip if the matching HTML container card isn't built yet
            if (!cardContainer) continue;

            const topNode = cardContainer.querySelector(".card-top .num");
            if (!topNode) continue;

            const currentDisplayedValue = topNode.innerText;

            // Trigger the 3D flip mechanical effect only when the number actually changes
            if (formattedValue !== currentDisplayedValue) {
                animateCardFlip(cardContainer, formattedValue);
            }
        }
    }

    // 3D DOM Flip Injection Engine
    function animateCardFlip(card, newValue) {
        const topNode = card.querySelector(".card-top .num");
        const bottomNode = card.querySelector(".card-bottom .num");
        const topFlipNode = card.querySelector(".top-flip .num");
        const bottomFlipNode = card.querySelector(".bottom-flip .num");

        // Validate that all internal card face nodes are present before changing values
        if (!topNode || !bottomNode || !topFlipNode || !bottomFlipNode) return;

        // Synchronize text values across backing layout plates
        topFlipNode.innerText = topNode.innerText;
        bottomNode.innerText = topNode.innerText;

        // Target new values onto primary flipping leaves
        topNode.innerText = newValue;
        bottomFlipNode.innerText = newValue;

        // Reset the animation class and trigger a DOM reflow to allow the animation to repeat
        card.classList.remove("flip-animate");
        void card.offsetWidth; // Forces the browser to process the visual updates immediately
        card.classList.add("flip-animate");

        // Lock the lower static plate update precisely as the transition animation finishes swinging down
        setTimeout(() => {
            bottomNode.innerText = newValue;
        }, 350);
    }

    // Run immediately on window load to prevent standard "00" flashing gaps
    updateCountdown();

    // Continuously cycle loop updates every 1 second
    setInterval(updateCountdown, 1000);
});


// 3. LIVE DATA API SYNC & SCROLL ODOMETER ENGINE (FIXED)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {

    // A. ENDPOINT LINK REGISTRATION LAYER
    const googleSheetApiUrl = "https://script.google.com/macros/s/AKfycbwlED7-3zrbr3vaRcl7Nuic134ecjzGpngE-Zu1g4Wnwn9rNQNkgHSLTjTodyvJnqOS/exec";
    const liveCounterElement = document.getElementById('live-registered-counter');
    const animationDuration = 2000; // Duration of scroll count-up loop (2 seconds)

    // B. ASYNC NETWORK CALL PIPELINE
    if (googleSheetApiUrl && liveCounterElement) {
        fetch(googleSheetApiUrl)
            .then(response => {
                if (!response.ok) throw new Error("API Pipeline infrastructure dropped.");
                return response.json();
            })
            .then(data => {
                // Double check data validity before modifying targets
                if (data && typeof data.registered !== 'undefined') {
                    // Update the target with the EXACT live total from your sheet rows
                    liveCounterElement.setAttribute('data-target', data.registered);
                } else {
                    // Fallback to a baseline number if data structure returns empty
                    liveCounterElement.setAttribute('data-target', "247");
                }
                // Initialize animation ONLY after the real number has been confirmed and injected
                initializeOdometerEngine();
            })
            .catch(error => {
                console.error("API Error. Using standard layout fallbacks:", error);
                // Safety net: hardcode your baseline registration total here as an automatic network fallback
                if (liveCounterElement && liveCounterElement.getAttribute('data-target') === "0") {
                    liveCounterElement.setAttribute('data-target', "247");
                }
                initializeOdometerEngine();
            });
    } else {
        // Run standard configurations if browser is running offline or locally
        if (liveCounterElement && liveCounterElement.getAttribute('data-target') === "0") {
            liveCounterElement.setAttribute('data-target', "247");
        }
        initializeOdometerEngine();
    }

    // C. CONTROLLED VIEWPORT INTERSECTION ODOMETER TRACKER
    function initializeOdometerEngine() {
        const counters = document.querySelectorAll('.counter-number');

        const startCountUp = (entries, observer) => {
            entries.forEach(entry => {
                // Fire the calculation loop ONLY when the stats pass into view on scroll
                if (entry.isIntersecting) {
                    const targetCounter = entry.target;
                    const finalTargetValue = parseInt(targetCounter.getAttribute('data-target'), 10);
                    const startTime = performance.now();

                    const runUpdate = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progressionProgress = Math.min(elapsed / animationDuration, 1);

                        // Easing curve formula: forces number roll to slow down beautifully at the end
                        const easeOutQuad = progressionProgress * (2 - progressionProgress);

                        const runningCurrentValue = Math.floor(easeOutQuad * finalTargetValue);
                        targetCounter.innerText = runningCurrentValue;

                        if (progressionProgress < 1) {
                            requestAnimationFrame(runUpdate);
                        } else {
                            targetCounter.innerText = finalTargetValue; // Hard-locks exact final response metric
                        }
                    };

                    requestAnimationFrame(runUpdate);
                    observer.unobserve(targetCounter); // Kills tracking so it doesn't loop infinitely on scroll shifts
                }
            });
        };

        const counterObserver = new IntersectionObserver(startCountUp, {
            threshold: 0.15 // Fires animation when 15% of the counter badge card is visible
        });

        counters.forEach(counter => counterObserver.observe(counter));
    }
});

// 4. PRICING AUTOMATION ENGINE (Currency Formatter)
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    // Targets the last data cell column inside your pricing table grids
    const pricingCells = document.querySelectorAll('.pricing-table tbody td:last-child');

    pricingCells.forEach(cell => {
        const rawContentText = cell.innerText.trim();

        // Safety check: if the cell already has a currency symbol formatted, skip processing it
        if (!rawContentText.includes('₦')) {
            // Checks for shorthand syntax like '18k' or numbers, updates them smoothly
            if (rawContentText.toLowerCase().endsWith('k')) {
                const numericStringValue = rawContentText.slice(0, -1);
                cell.innerHTML = `₦${numericStringValue},000`;
            } else if (!isNaN(rawContentText)) {
                cell.innerHTML = `₦${parseInt(rawContentText, 10).toLocaleString()}`;
            }
        }
    });
});


// 5. TOUCH-RESPONSIVE HARDWARE BALANCED GALLERY SLIDER
// =========================================================
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById('gallery-track');
    const slides = Array.from(track.children);
    const paginationContainer = document.getElementById('gallery-pagination');
    const leftArrow = document.querySelector('.slider-arrow.arrow-left');
    const rightArrow = document.querySelector('.slider-arrow.arrow-right');

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;

    // A. Render 5 Premium Pagination Indicators Dynamically
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => moveToSlide(index));
        paginationContainer.appendChild(dot);
    });

    const dots = Array.from(paginationContainer.children);

    // B. Main Positional Slide Transit Operator Matrix Routine
    function moveToSlide(targetIndex) {
        currentIndex = targetIndex;
        // Boundaries safety locking clamping caps
        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > slides.length - 1) currentIndex = slides.length - 1;

        currentTranslate = currentIndex * -track.parentElement.clientWidth;
        prevTranslate = currentTranslate;

        track.style.transition = "transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)";
        track.style.transform = `translateX(${currentTranslate}px)`;

        // Update Indicator Styles Track
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    // C. Desktop Interactive Arrow Trigger Listeners
    rightArrow.addEventListener('click', () => moveToSlide(currentIndex + 1));
    leftArrow.addEventListener('click', () => moveToSlide(currentIndex - 1));

    // D. Universal Unified Event Binding Hook Interceptors (Mobile Swipes + Mouse Drags)
    track.addEventListener('touchstart', touchStart);
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('touchmove', touchMove);

    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', touchEnd);
    track.addEventListener('mousemove', touchMove);

    function touchStart(event) {
        isDragging = true;
        startX = getPositionX(event);
        track.style.transition = 'none'; // Temporarily bypass transition delay timing curves on holds
        animationID = requestAnimationFrame(animationLoop);
    }

    function touchMove(event) {
        if (!isDragging) return;
        const currentX = getPositionX(event);
        const currentDeltaMoveX = currentX - startX;
        currentTranslate = prevTranslate + currentDeltaMoveX;
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationID);

        const movedByDelta = currentTranslate - prevTranslate;

        // Swipe Distance Delta Sensitivity Break Trigger point (approx 60px)
        if (movedByDelta < -60 && currentIndex < slides.length - 1) {
            currentIndex += 1;
        } else if (movedByDelta > 60 && currentIndex > 0) {
            currentIndex -= 1;
        }

        moveToSlide(currentIndex);
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    function animationLoop() {
        if (isDragging) {
            track.style.transform = `translateX(${currentTranslate}px)`;
            requestAnimationFrame(animationLoop);
        }
    }

    // E. Dynamic Resizing Re-calibration Hooks Vector Matrix
    window.addEventListener('resize', () => {
        track.style.transition = 'none';
        moveToSlide(currentIndex);
    });
});
