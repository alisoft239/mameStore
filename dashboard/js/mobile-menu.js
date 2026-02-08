/**
 * Mobile Menu JavaScript
 * Handles mobile sidebar toggle functionality
 */

class MobileMenu {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.overlay = document.querySelector('.mobile-menu-overlay');
    this.toggleBtn = document.getElementById('mobileMenuToggle');
    this.closeBtns = document.querySelectorAll('[data-close="true"]');
    
    this.isOpen = false;
    this.init();
  }

  init() {
    // Menu toggle
    this.toggleBtn?.addEventListener('click', () => this.toggle());
    
    // Close on overlay click
    this.overlay?.addEventListener('click', () => this.close());
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on nav link click (mobile)
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          this.close();
        }
      });
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.close();
      }
    });
  }

  open() {
    this.isOpen = true;
    this.sidebar?.classList.add('is-open');
    this.overlay?.classList.add('is-open');
    this.toggleBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    
    // Focus first menu item
    const firstLink = this.sidebar?.querySelector('.nav__link');
    firstLink?.focus();
  }

  close() {
    this.isOpen = false;
    this.sidebar?.classList.remove('is-open');
    this.overlay?.classList.remove('is-open');
    this.toggleBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    
    // Return focus to toggle button
    this.toggleBtn?.focus();
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new MobileMenu();
});

// Export for module usage
export default MobileMenu;
