// Create a responsive navigation menu with dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  const createResponsiveNav = () => {
    const navContainer = document.querySelector('.terms-navigation');
    if (!navContainer) return;

    const navList = navContainer.querySelector('ul');
    const navItems = navList.querySelectorAll('li');
    
    // Find the active page
    let activePage = {
      text: 'Página atual',
      href: '#'
    };
    
    // Get all pages
    const allPages = [];
    navItems.forEach(item => {
      const link = item.querySelector('a');
      const isActive = item.classList.contains('active');
      
      allPages.push({
        text: link.textContent,
        href: link.getAttribute('href'),
        active: isActive
      });
      
      if (isActive) {
        activePage = {
          text: link.textContent,
          href: link.getAttribute('href')
        };
      }
    });
    
    // Create the new mobile navigation
    if (window.innerWidth <= 768) {
      // Hide the original nav
      navList.style.display = 'none';
      
      // Create the dropdown button with the active page
      const dropdownNav = document.createElement('div');
      dropdownNav.className = 'mobile-nav-dropdown';
      dropdownNav.innerHTML = `
        <button class="active-page-btn">
          ${activePage.text} <i class="fas fa-chevron-down"></i>
        </button>
        <div class="dropdown-content">
          ${allPages.map(page => 
            `<a href="${page.href}" ${page.active ? 'class="active"' : ''}>${page.text}</a>`
          ).join('')}
        </div>
      `;
      
      navContainer.appendChild(dropdownNav);
      
      // Add event listener to toggle dropdown
      const dropdownBtn = dropdownNav.querySelector('.active-page-btn');
      const dropdownContent = dropdownNav.querySelector('.dropdown-content');
      
      dropdownBtn.addEventListener('click', function(e) {
        e.preventDefault();
        dropdownContent.classList.toggle('show');
        
        // Toggle arrow direction
        const arrow = this.querySelector('i');
        if (dropdownContent.classList.contains('show')) {
          arrow.classList.remove('fa-chevron-down');
          arrow.classList.add('fa-chevron-up');
        } else {
          arrow.classList.remove('fa-chevron-up');
          arrow.classList.add('fa-chevron-down');
        }
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', function(e) {
        if (!dropdownNav.contains(e.target)) {
          dropdownContent.classList.remove('show');
          const arrow = dropdownBtn.querySelector('i');
          arrow.classList.remove('fa-chevron-up');
          arrow.classList.add('fa-chevron-down');
        }
      });
    }
  };
  
  createResponsiveNav();
  
  // Reapply on resize
  window.addEventListener('resize', function() {
    const existingDropdown = document.querySelector('.mobile-nav-dropdown');
    if (existingDropdown) {
      existingDropdown.remove();
    }
    
    const navList = document.querySelector('.terms-navigation ul');
    if (navList) {
      navList.style.display = '';
    }
    
    createResponsiveNav();
  });
});