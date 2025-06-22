// This file contains utility functions for responsive design

/**
 * Detects if the current device is mobile
 * @returns {boolean} True if the device is mobile
 */
export function isMobileDevice() {
  return window.innerWidth <= 768;
}

/**
 * Adjusts font sizes based on screen width
 */
export function adjustFontSizes() {
  const baseFontSize = isMobileDevice() ? 
    (window.innerWidth <= 480 ? 14 : 15) : 16;
  
  document.documentElement.style.fontSize = baseFontSize + 'px';
}

/**
 * Optimizes images for mobile devices
 */
export function optimizeImagesForMobile() {
  if (isMobileDevice()) {
    const images = document.querySelectorAll('img:not(.assistant-avatar)');
    images.forEach(img => {
      // Add loading=lazy attribute for better performance
      img.setAttribute('loading', 'lazy');
      
      // Optimize image quality for mobile
      if (!img.classList.contains('optimized')) {
        img.classList.add('optimized');
      }
    });
  }
}

/**
 * Apply responsive fixes for elements that may break layout
 */
export function applyResponsiveFixes() {
  if (isMobileDevice()) {
    // Fix long words breaking layout
    const contentElements = document.querySelectorAll('.terms-content p, .terms-content li, .terms-content h2, .terms-content h3, .terms-content h4');
    contentElements.forEach(el => {
      el.style.wordBreak = 'break-word';
      el.style.overflowWrap = 'break-word';
    });
    
    // Fix tables being too wide
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      if (!table.parentNode.classList.contains('table-wrapper')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';
        wrapper.style.overflowX = 'auto';
        wrapper.style.width = '100%';
        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
    });
    
    // Make navigation tabs scrollable on mobile
    const termsNav = document.querySelector('.terms-navigation');
    if (termsNav) {
      termsNav.style.overflowX = 'auto';
      termsNav.style.webkitOverflowScrolling = 'touch';
    }
    
    // Convert super long words in links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.style.wordBreak = 'break-word';
    });
    
    // Ensure fixed-position elements don't overlap important content
    const fixedElements = document.querySelectorAll('.floating-help, .back-to-top, .assistant-bubble');
    const footerHeight = document.querySelector('.footer')?.offsetHeight || 0;
    fixedElements.forEach(el => {
      el.style.bottom = (footerHeight > 0 ? footerHeight + 10 : 15) + 'px';
    });
    
    // Create mobile-friendly layout for terms pages
    const termsContent = document.querySelector('.terms-content');
    if (termsContent) {
      termsContent.style.display = 'flex';
      termsContent.style.flexDirection = 'column';
      
      // Move sidebar to top of content
      const sidebar = document.querySelector('.terms-sidebar');
      const sections = document.querySelector('.terms-sections');
      
      if (sidebar && sections && termsContent.children[0] !== sidebar) {
        termsContent.insertBefore(sidebar, termsContent.children[0].nextSibling);
      }
      
      // Make index sections collapsible
      const indexSection = document.querySelector('.index-section');
      if (indexSection) {
        const indexTitle = indexSection.querySelector('h3');
        const indexList = indexSection.querySelector('ul');
        
        if (indexTitle && indexList) {
          // Create a toggle button
          const toggleButton = document.createElement('span');
          toggleButton.innerHTML = ' <i class="fas fa-chevron-down"></i>';
          toggleButton.style.float = 'right';
          toggleButton.style.cursor = 'pointer';
          indexTitle.appendChild(toggleButton);
          
          // Make list initially collapsed
          indexList.style.display = 'none';
          
          // Add toggle functionality
          indexTitle.addEventListener('click', () => {
            if (indexList.style.display === 'none') {
              indexList.style.display = 'block';
              toggleButton.innerHTML = ' <i class="fas fa-chevron-up"></i>';
            } else {
              indexList.style.display = 'none';
              toggleButton.innerHTML = ' <i class="fas fa-chevron-down"></i>';
            }
          });
        }
      }
    }
  }
}

/**
 * Makes mobile-specific touchable elements more accessible
 */
export function improveTouchTargets() {
  if (isMobileDevice()) {
    const touchTargets = document.querySelectorAll('button, a, .index-section li, .terms-navigation li');
    touchTargets.forEach(el => {
      // Ensure touch targets are at least 44x44px per accessibility guidelines
      const width = el.offsetWidth;
      const height = el.offsetHeight;
      
      if (width < 44 || height < 44) {
        // Add padding to make touch target larger without changing visual appearance
        const paddingHorizontal = Math.max(0, (44 - width) / 2);
        const paddingVertical = Math.max(0, (44 - height) / 2);
        
        el.style.paddingLeft = paddingHorizontal + 'px';
        el.style.paddingRight = paddingHorizontal + 'px';
        el.style.paddingTop = paddingVertical + 'px';
        el.style.paddingBottom = paddingVertical + 'px';
      }
    });
  }
}