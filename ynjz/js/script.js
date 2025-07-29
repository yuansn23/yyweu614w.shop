// Facebook Pixel Conversion Tracking
function trackConversion(eventName) {
    // Track Facebook Pixel events
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: eventName,
            content_category: 'landing_page_interaction'
        });
    }
    
    // Google Analytics tracking (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'event_category': 'engagement',
            'event_label': eventName
        });
    }
    
    // Handle different CTA actions
    switch(eventName) {
        case 'hero_cta':
        case 'services_cta':
        case 'final_cta':
            scrollToContact();
            break;
        case 'whatsapp_contact':
            openWhatsApp();
            break;
    }
}

// Smooth scroll to contact section
function scrollToContact() {
    document.getElementById('contact').scrollIntoView({
        behavior: 'smooth'
    });
}

// Open WhatsApp
function openWhatsApp() {
    const message = encodeURIComponent('你好！我对TIMETRADE的在线赚钱机会很感兴趣，请提供更多详细信息。');
    const whatsappUrl = `https://wa.me/8617705921585?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

// Countdown Timer
function initCountdownTimer() {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    // Set countdown to 24 hours from now
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    function updateTimer() {
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerElement.textContent = '00:00:00';
        }
    }
    
    updateTimer();
    setInterval(updateTimer, 1000);
}

// Animate remaining spots counter
function animateRemainingSpots() {
    const spotsElement = document.getElementById('remaining-spots');
    if (!spotsElement) return;
    
    let currentSpots = 73;
    const targetSpots = Math.floor(Math.random() * 20) + 50; // Random between 50-70
    
    const interval = setInterval(() => {
        if (currentSpots > targetSpots) {
            currentSpots--;
            spotsElement.textContent = currentSpots;
        } else {
            clearInterval(interval);
        }
    }, 30000); // Decrease every 30 seconds
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .service-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Form validation and submission
function initFormHandling() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Track form submission
            trackConversion('form_submit');
            
            // Show success message
            showNotification('感谢您的提交！我们会尽快与您联系。', 'success');
            
            // Reset form
            form.reset();
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Mobile menu handling
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        
        if (typeof fbq !== 'undefined') {
            fbq('track', 'PageView', {
                load_time: Math.round(loadTime)
            });
        }
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    
    window.addEventListener('scroll', () => {
        const scrollDepth = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // Track milestone scroll depths
            if ([25, 50, 75, 100].includes(scrollDepth)) {
                if (typeof fbq !== 'undefined') {
                    fbq('track', 'ViewContent', {
                        content_name: `scroll_${scrollDepth}`,
                        content_category: 'engagement'
                    });
                }
            }
        }
    });
}

// Exit intent detection
function initExitIntent() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            showExitIntentPopup();
        }
    });
}

function showExitIntentPopup() {
    const popup = document.createElement('div');
    popup.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 500px; margin: 20px;">
                <h2 style="color: #333; margin-bottom: 20px;">等等！不要错过这个机会</h2>
                <p style="color: #666; margin-bottom: 30px;">立即联系我们，获得专属优惠和详细指导</p>
                <button onclick="trackConversion('exit_intent'); this.parentElement.parentElement.remove();" style="background: #4285F4; color: white; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer; margin-right: 10px;">立即联系</button>
                <button onclick="this.parentElement.parentElement.remove();" style="background: #ccc; color: #333; border: none; padding: 15px 30px; border-radius: 25px; font-size: 1.1rem; cursor: pointer;">稍后再说</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Track exit intent
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: 'exit_intent_popup',
            content_category: 'retention'
        });
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCountdownTimer();
    animateRemainingSpots();
    initScrollAnimations();
    initLazyLoading();
    initFormHandling();
    initMobileMenu();
    initSmoothScrolling();
    initPerformanceMonitoring();
    
    // Delay exit intent to avoid immediate trigger
    setTimeout(initExitIntent, 5000);
    
    // Track page ready
    if (typeof fbq !== 'undefined') {
        fbq('track', 'ViewContent', {
            content_name: 'landing_page_ready',
            content_category: 'page_interaction'
        });
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Track when user leaves page
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'page_hidden',
                content_category: 'engagement'
            });
        }
    } else {
        // Track when user returns to page
        if (typeof fbq !== 'undefined') {
            fbq('track', 'ViewContent', {
                content_name: 'page_visible',
                content_category: 'engagement'
            });
        }
    }
});

