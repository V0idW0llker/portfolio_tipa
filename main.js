// Слайдер проектов
const carouselTrack = document.querySelector('.carousel-track');
const carouselContainer = document.querySelector('.carousel-container');
const prevBtn = document.querySelector('.carousel-btn--prev');
const nextBtn = document.querySelector('.carousel-btn--next');

if (carouselTrack && carouselContainer) {
    const originalCards = [...carouselTrack.querySelectorAll('.project-card')];
    const totalOriginal = originalCards.length;

    originalCards.forEach((card) => {
        carouselTrack.appendChild(card.cloneNode(true));
    });

    const cards = carouselTrack.querySelectorAll('.project-card');
    let currentIndex = 0;
    let autoScrollInterval;
    let isPaused = false;
    let isDragging = false;
    let wasDragged = false;
    let blockCardClick = false;
    let dragStartX = 0;
    let dragOffset = 0;
    let transitionEnabled = true;

    const autoScrollDelay = 3000;
    const dragThreshold = 8;

    function getCardWidth() {
        return cards[0].offsetWidth + 24;
    }

    function setTransition(enabled) {
        transitionEnabled = enabled;
        carouselTrack.style.transition = enabled ? 'transform 0.5s ease-in-out' : 'none';
    }

    function applyTransform(index, offset = 0) {
        const translateX = -(index * getCardWidth()) + offset;
        carouselTrack.style.transform = `translateX(${translateX}px)`;
    }

    function goToSlide(index, animate = true) {
        setTransition(animate);
        currentIndex = index;
        applyTransform(currentIndex);
    }

    function normalizeIndex() {
        if (currentIndex >= totalOriginal) {
            currentIndex = 0;
            goToSlide(0, false);
        } else if (currentIndex < 0) {
            currentIndex = totalOriginal - 1;
            goToSlide(currentIndex, false);
        }
    }

    function nextSlide() {
        currentIndex++;
        goToSlide(currentIndex, true);
    }

    function prevSlide() {
        if (currentIndex <= 0) {
            currentIndex = totalOriginal;
            goToSlide(currentIndex, false);
            requestAnimationFrame(() => {
                currentIndex--;
                goToSlide(currentIndex, true);
            });
            return;
        }

        currentIndex--;
        goToSlide(currentIndex, true);
    }

    carouselTrack.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;

        if (currentIndex >= totalOriginal) {
            currentIndex = 0;
            goToSlide(0, false);
        }
    });

    function startAutoScroll() {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            if (!isPaused && !isDragging) {
                nextSlide();
            }
        }, autoScrollDelay);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
    }

    function pauseAutoScroll() {
        isPaused = true;
    }

    function resumeAutoScroll() {
        isPaused = false;
    }

    function snapAfterDrag() {
        const cardWidth = getCardWidth();
        const threshold = cardWidth * 0.2;
        const offset = dragOffset;
        
        if (Math.abs(offset) > threshold) {
            dragOffset = 0;
            if (offset < -threshold) {
                prevSlide();
            } else if (offset > threshold) {
                nextSlide();
            }
        } else {
            dragOffset = 0;
            setTransition(true);
            applyTransform(currentIndex, 0);
        }
    }

    function onDragStart(clientX) {
        isDragging = true;
        wasDragged = false;
        dragStartX = clientX;
        dragOffset = 0;
        setTransition(false);
        stopAutoScroll();
        carouselContainer.classList.add('is-dragging');
    }

    function onDragMove(clientX) {
        if (!isDragging) return;

        dragOffset = clientX - dragStartX;

        if (Math.abs(dragOffset) > dragThreshold) {
            wasDragged = true;
        }

        applyTransform(currentIndex, dragOffset);
    }

    function onDragEnd() {
        if (!isDragging) return;

        isDragging = false;
        carouselContainer.classList.remove('is-dragging');
        setTransition(true);
        snapAfterDrag();
        startAutoScroll();
    }

    carouselContainer.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        // Don't start drag when clicking on cards (links) to allow link clicks
        if (e.target.closest('.project-card')) return;
        e.preventDefault();
        onDragStart(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        onDragMove(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        onDragEnd();
    });

    carouselContainer.addEventListener('touchstart', (e) => {
        onDragStart(e.touches[0].clientX);
    }, { passive: true });

    carouselContainer.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        onDragMove(e.touches[0].clientX);
    }, { passive: true });

    carouselContainer.addEventListener('touchend', () => {
        onDragEnd();
    }, { passive: true });

    carouselContainer.addEventListener('mouseenter', pauseAutoScroll);
    carouselContainer.addEventListener('mouseleave', () => {
        if (!isDragging) {
            resumeAutoScroll();
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoScroll();
            startAutoScroll();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoScroll();
            startAutoScroll();
        });
    }

    // Cards are now real <a> tags, so no need for JavaScript click handler

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            normalizeIndex();
            goToSlide(currentIndex, false);
        }, 100);
    });

    startAutoScroll();
    setTimeout(() => goToSlide(0, false), 100);
}

console.log('Сайт-визитка Никишина Владислава');

// Бургер-меню
const burgerBtn = document.querySelector('.burger-btn');
const navMenu = document.querySelector('.nav-menu');

if (burgerBtn && navMenu) {
    burgerBtn.addEventListener('click', () => {
        const isOpen = burgerBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
        burgerBtn.setAttribute('aria-expanded', isOpen);
    });

    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burgerBtn.classList.remove('open');
            navMenu.classList.remove('open');
            burgerBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

// Копирование Discord-тега при клике
const discordBtn = document.getElementById('discord-btn');
const discordTag = '___Vladislav___';

if (discordBtn) {
    discordBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(discordTag).then(() => {
            showNotification('<b>Discord-тег скопирован:</b> ' + discordTag + '\n');

            setTimeout(() => {
                window.open('https://discord.com/app', '_blank');
            }, 1000);
        }).catch(err => {
            console.error('Не удалось скопировать:', err);
            alert('Тег: ' + discordTag);
            window.open('https://discord.com/app', '_blank');
        });
    });
}

function showNotification(message) {
    const oldNotification = document.querySelector('.custom-notification');
    if (oldNotification) oldNotification.remove();

    const oldBackdrop = document.querySelector('.backdrop-overlay');
    if (oldBackdrop) oldBackdrop.remove();

    const backdrop = document.createElement('div');
    backdrop.className = 'backdrop-overlay';
    document.body.appendChild(backdrop);

    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
        backdrop.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        backdrop.classList.remove('show');
        setTimeout(() => {
            notification.remove();
            backdrop.remove();
        }, 300);
    }, 1000);
}

// Динамический расчёт возраста и статуса
function updatePersonalInfo() {
    const birthDate = new Date(2004, 8, 11); // 11 сентября 2004 (месяцы 0-11)
    const now = new Date();
    
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    const dayDiff = now.getDate() - birthDate.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    
    const ageDisplay = document.getElementById('age-display');
    if (ageDisplay) {
        ageDisplay.textContent = age + ' ' + getAgeWord(age);
    }
    
    const statusDisplay = document.getElementById('status-display');
    if (statusDisplay) {
        statusDisplay.textContent = 'Студент, безработный — ищу работу';
    }
}

function getAgeWord(age) {
    const lastTwoDigits = age % 100;
    const lastDigit = lastTwoDigits % 10;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'лет';
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
}

updatePersonalInfo();

// Переключатель светлой/тёмной темы
const themeBtn = document.querySelector('.theme-btn');

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-theme');
        if (themeBtn) themeBtn.textContent = '☀️';
    } else {
        document.body.classList.remove('light-theme');
        if (themeBtn) themeBtn.textContent = '🌙';
    }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);

        themeBtn.classList.add('animate');
        setTimeout(() => themeBtn.classList.remove('animate'), 500);
    });
}

// Кнопка "наверх"
const scrollTopBtn = document.querySelector('.scroll-top');

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Плавное появление блоков при прокрутке
const revealItems = document.querySelectorAll('.info-card, .skills-card, .profile-card, .contact-link, .projects-text');

if (revealItems.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealItems.forEach(item => {
        item.classList.add('reveal');
        revealObserver.observe(item);
    });
}
