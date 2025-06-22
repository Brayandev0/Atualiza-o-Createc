import VirtualAssistant from './virtual-assistant.js';
import { isMobileDevice, adjustFontSizes, optimizeImagesForMobile, applyResponsiveFixes, improveTouchTargets } from './responsive-utils.js';

document.addEventListener('DOMContentLoaded', function() {
    // Update footer year automatically
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2023', currentYear);
    }
    
    // Create progress bar for reading
    const progressBar = document.querySelector('.progress-bar');
    const sections = document.querySelectorAll('.terms-sections section');
    const indexItems = document.querySelectorAll('.index-section li');
    
    // Create a back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Check for mobile devices
    const isMobile = window.innerWidth <= 768;
    
    // Make sidebar collapsible on mobile for better usability
    if (isMobile) {
        const indexSection = document.querySelector('.index-section');
        const indexTitle = document.querySelector('.index-section h3');
        const indexList = document.querySelector('.index-section ul');
        
        if (indexTitle && indexList) {
            indexTitle.classList.add('collapsed');
            indexTitle.style.cursor = 'pointer';
            
            // Add toggle indicator
            if (!indexTitle.querySelector('.toggle-indicator')) {
                const toggleIndicator = document.createElement('span');
                toggleIndicator.className = 'toggle-indicator';
                toggleIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
                toggleIndicator.style.float = 'right';
                indexTitle.appendChild(toggleIndicator);
            }
            
            indexTitle.addEventListener('click', function() {
                indexList.classList.toggle('expanded');
                indexTitle.classList.toggle('collapsed');
                
                // Update toggle indicator
                const toggleIndicator = indexTitle.querySelector('.toggle-indicator');
                if (toggleIndicator) {
                    if (indexList.classList.contains('expanded')) {
                        toggleIndicator.innerHTML = '<i class="fas fa-chevron-up"></i>';
                    } else {
                        toggleIndicator.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    }
                }
            });
        }
        
        // Initially hide the sections list on small screens
        if (indexList && window.innerWidth <= 768) {
            indexList.style.display = 'none';
            indexList.classList.remove('expanded');
        }
        
        // Make terms navigation stack vertically on very small screens
        if (window.innerWidth <= 480) {
            const termsNav = document.querySelector('.terms-navigation ul');
            if (termsNav) {
                termsNav.style.display = 'flex';
                termsNav.style.flexDirection = 'column';
                
                const navItems = termsNav.querySelectorAll('li');
                navItems.forEach(item => {
                    item.style.margin = '5px 0';
                    item.style.width = '100%';
                    item.style.textAlign = 'center';
                });
            }
        }
        
        // Stack sidebar and content vertically
        const termsContent = document.querySelector('.terms-content');
        const termsSidebar = document.querySelector('.terms-sidebar');
        const termsSections = document.querySelector('.terms-sections');
        
        if (termsContent && termsSidebar && termsSections) {
            termsContent.style.display = 'flex';
            termsContent.style.flexDirection = 'column';
            termsSidebar.style.width = '100%';
            termsSections.style.width = '100%';
            termsSidebar.style.paddingRight = '0';
        }
    }
    
    // Update active section on scroll
    window.addEventListener('scroll', function() {
        // Update progress bar
        if (progressBar) {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
            progressBar.style.width = progress + '%';
        }
        
        // Show/hide back to top button
        if (backToTopBtn) {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        // Update active section in index
        if (sections.length && indexItems.length) {
            let currentSectionId = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 150;
                if (window.scrollY >= sectionTop) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            // Update active class in index
            indexItems.forEach(item => {
                item.classList.remove('active');
                const itemHref = item.querySelector('a').getAttribute('href').substring(1);
                if (itemHref === currentSectionId) {
                    item.classList.add('active');
                    
                    // Scroll the active item into view in the index list on mobile
                    if (isMobile) {
                        const indexList = document.querySelector('.index-section ul');
                        if (indexList) {
                            const itemLeft = item.offsetLeft;
                            const listScrollLeft = indexList.scrollLeft;
                            const listWidth = indexList.clientWidth;
                            
                            // Only scroll if the item is not fully visible
                            if (itemLeft < listScrollLeft || itemLeft > listScrollLeft + listWidth) {
                                indexList.scrollTo({
                                    left: itemLeft - 20,
                                    behavior: 'smooth'
                                });
                            }
                        }
                    }
                }
            });
        }
    });
    
    // Smooth scrolling for Terms of Service page
    const indexLinks = document.querySelectorAll('.index-section a');
    
    indexLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // On mobile, collapse the index after clicking
                if (isMobile) {
                    const indexList = document.querySelector('.index-section ul');
                    if (indexList) {
                        indexList.classList.remove('expanded');
                        const indexTitle = document.querySelector('.index-section h3');
                        if (indexTitle) {
                            indexTitle.classList.add('collapsed');
                        }
                    }
                }
            }
        });
    });
    
    // Back to top functionality
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Cookie banner functionality
    const cookieBanner = document.querySelector('.cookie-banner');
    const acceptCookiesBtn = document.querySelector('.accept-cookies');
    
    if (cookieBanner && acceptCookiesBtn) {
        // Check if user already accepted cookies
        const cookiesAccepted = localStorage.getItem('cookiesAccepted');
        
        if (!cookiesAccepted) {
            cookieBanner.style.display = 'flex';
        }
        
        acceptCookiesBtn.addEventListener('click', function() {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }
    
    // Load the responsive navigation
    const script = document.createElement('script');
    script.src = 'responsive-navigation.js';
    document.head.appendChild(script);
    
    // Better handling of window resize for responsiveness
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        
        // If device size changed between mobile and desktop
        if (newIsMobile !== isMobile) {
            location.reload();
        }
    });
    
    // Make navigation tabs scrollable with indicators
    const termsNav = document.querySelector('.terms-navigation');
    if (termsNav) {
        // Add scroll indicators if content is scrollable
        const scrollWidth = termsNav.scrollWidth;
        const clientWidth = termsNav.clientWidth;
        
        if (scrollWidth > clientWidth) {
            const scrollIndicator = document.createElement('div');
            scrollIndicator.className = 'nav-scroll-indicator';
            scrollIndicator.innerHTML = '<i class="fas fa-chevron-right"></i>';
            termsNav.parentNode.appendChild(scrollIndicator);
            
            scrollIndicator.addEventListener('click', function() {
                termsNav.scrollBy({left: 100, behavior: 'smooth'});
            });
            
            // Hide indicator when scrolled to end
            termsNav.addEventListener('scroll', function() {
                if (termsNav.scrollLeft + termsNav.clientWidth >= termsNav.scrollWidth - 10) {
                    scrollIndicator.style.opacity = '0';
                } else {
                    scrollIndicator.style.opacity = '1';
                }
            });
        }
    }
    
    // Apply responsive optimizations
    adjustFontSizes();
    optimizeImagesForMobile();
    applyResponsiveFixes();
    improveTouchTargets();
});