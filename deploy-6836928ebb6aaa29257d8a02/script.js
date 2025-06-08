// script.js

// Event listener for DOMContentLoaded to ensure the DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {
  // Mobile Menu Toggle Functionality
  const menuButton = document.querySelector('.menu-toggle-button'); // Select the menu toggle button
  const mobileMenu = document.getElementById('mobileMenu'); // Select the mobile menu element
  const closeButton = mobileMenu ? mobileMenu.querySelector('.close-menu-button') : null; // Select the close button within the mobile menu

  // Event listener for the menu button to toggle the mobile menu
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('open'); // Toggle the 'open' class on the mobile menu
      menuButton.setAttribute('aria-expanded', mobileMenu.classList.contains('open')); // Update aria-expanded attribute
      // Optional: Toggle body scroll to prevent scrolling when menu is open
      // document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
  }

  // Event listener for the close button to hide the mobile menu
  if (closeButton && mobileMenu) {
    closeButton.addEventListener('click', function() {
      mobileMenu.classList.remove('open'); // Remove the 'open' class
      if (menuButton) {
        menuButton.setAttribute('aria-expanded', 'false'); // Update aria-expanded attribute
      }
      // document.body.style.overflow = ''; // Restore body scroll
    });
  }

  // Close mobile menu when a link inside it is clicked
  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll('nav a'); // Select all navigation links within the mobile menu
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('open'); // Remove the 'open' class
        if (menuButton) {
          menuButton.setAttribute('aria-expanded', 'false'); // Update aria-expanded attribute
        }
        // document.body.style.overflow = ''; // Restore body scroll
      });
    });
  }

  // Smooth scrolling for on-page anchor links and active link highlighting
  const navLinks = document.querySelectorAll('header nav a:not(.no-scroll)'); // Desktop navigation links
  const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('nav a:not(.no-scroll)') : []; // Mobile navigation links

  // Function to highlight the active navigation link based on the current page URL
  function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Get the current page filename

    // Highlight desktop nav links
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Highlight mobile nav links
    mobileNavLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  highlightActiveLink(); // Call on page load to set the initial active link

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Ensure it's a valid on-page anchor and not just "#" or an external link
      if (href.length > 1 && href.startsWith('#')) {
        const targetId = href.substring(1); // Remove #
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          e.preventDefault(); // Prevent default anchor behavior only if target exists on the page
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for sticky header (adjust as needed)
            behavior: 'smooth' // Enable smooth scrolling
          });
        }
      }
    });
  });
});

// Service Worker Registration
// Checks if the browser supports service workers and registers one if available
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js') // Path to your service worker file
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}

// Cookie Consent Management Class
class CookieConsent {
  constructor() {
    this.cookieName = 'cookie-consent'; // Name of the cookie
    this.cookieValue = 'accepted'; // Value when consent is given
    this.cookieDuration = 365; // Duration of the cookie in days
    this.banner = null; // Placeholder for the consent banner element
  }

  // Initializes the cookie consent functionality
  init() {
    if (!this.getCookie(this.cookieName)) { // If consent cookie is not found
      this.showBanner(); // Display the consent banner
    } else {
      if (this.getCookie(this.cookieName) === this.cookieValue) {
        this.initAnalytics(); // If consent already given and accepted, initialize analytics
      }
    }
  }

  // Creates and displays the cookie consent banner
  showBanner() {
    this.banner = document.createElement('div');
    // Tailwind CSS classes for styling the banner (fixed at the bottom)
    this.banner.className = 'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50 border-t dark:border-gray-700';
    this.banner.innerHTML = `
      <div class="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 md:mb-0">
          We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
          <a href="#" class="text-primary-600 dark:text-primary-400 hover:underline" onclick="cookieConsent.showPreferences()">Customize preferences</a>
        </p>
        <div class="flex space-x-2 sm:space-x-4">
          <button class="btn btn-secondary text-sm py-2 px-3" onclick="cookieConsent.decline()">Decline</button>
          <button class="btn btn-primary text-sm py-2 px-3" onclick="cookieConsent.accept()">Accept All</button>
        </div>
      </div>
      <div id="cookie-preferences" class="hidden mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 class="text-lg font-semibold mb-3">Cookie Preferences</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">Essential Cookies</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Required for the website to function properly</p>
            </div>
            <input type="checkbox" checked disabled class="form-checkbox">
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">Analytics Cookies</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Help us understand how visitors interact with our website</p>
            </div>
            <input type="checkbox" id="analytics-cookies" class="form-checkbox">
          </div>
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-medium">Marketing Cookies</h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">Used to track visitors across websites for marketing purposes</p>
            </div>
            <input type="checkbox" id="marketing-cookies" class="form-checkbox">
          </div>
        </div>
        <div class="mt-4 flex justify-end space-x-2">
          <button class="btn btn-secondary text-sm py-2 px-3" onclick="cookieConsent.savePreferences()">Save Preferences</button>
        </div>
      </div>
    `;
    document.body.appendChild(this.banner);

    // Ensure buttons are accessible via global scope
    window.cookieConsent = this;
  }

  // Shows the cookie preferences panel
  showPreferences() {
    const preferencesPanel = document.getElementById('cookie-preferences');
    if (preferencesPanel) {
      preferencesPanel.classList.remove('hidden');
    }
  }

  // Saves the user's cookie preferences
  savePreferences() {
    const analyticsEnabled = document.getElementById('analytics-cookies').checked;
    const marketingEnabled = document.getElementById('marketing-cookies').checked;
    
    // Set preferences in cookie
    const preferences = {
      analytics: analyticsEnabled,
      marketing: marketingEnabled,
      timestamp: new Date().toISOString()
    };
    
    this.setCookie('cookie-preferences', JSON.stringify(preferences), this.cookieDuration);
    
    if (analyticsEnabled) {
      this.initAnalytics();
    }
    
    if (this.banner) {
      this.banner.remove();
    }
  }

  // Handles acceptance of cookies
  accept() {
    this.setCookie(this.cookieName, this.cookieValue, this.cookieDuration); // Set the consent cookie
    if (this.banner) {
        this.banner.remove(); // Remove the banner
    }
    this.initAnalytics(); // Initialize analytics
  }

  // Handles declining of cookies
  decline() {
    if (this.banner) {
        this.banner.remove(); // Remove the banner
    }
    // Optionally, you could set a cookie to remember the decline choice
    this.setCookie(this.cookieName, 'declined', this.cookieDuration);
    console.log('Cookie consent declined.');
  }

  // Sets a cookie
  setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Calculate expiry date
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax;Secure`; // Added Secure flag
  }

  // Retrieves a cookie by name
  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Return null if cookie not found
  }

  // Initializes analytics (e.g., Google Analytics)
  initAnalytics() {
    // Google Analytics initialization
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-1TY61TJCKZ'); // Updated Google Analytics Measurement ID
    console.log('Analytics initialized with ID: G-1TY61TJCKZ');
  }
}

// Form Validation and Handling Class
class FormHandler {
  constructor() {
    this.initializeForms();
    this.popupBackdrop = null; // To store the backdrop element
  }

  // Creates and shows a backdrop
  _showBackdrop() {
    if (this.popupBackdrop) return; // Backdrop already exists

    this.popupBackdrop = document.createElement('div');
    this.popupBackdrop.className = 'fixed inset-0 bg-black bg-opacity-50 z-[90] transition-opacity duration-300 ease-in-out'; // Tailwind classes for backdrop
    this.popupBackdrop.style.opacity = '0';
    document.body.appendChild(this.popupBackdrop);
    document.body.style.overflow = 'hidden'; // Prevent background scroll

    requestAnimationFrame(() => {
        this.popupBackdrop.style.opacity = '1';
    });
  }

  // Hides and removes the backdrop
  _hideBackdrop() {
    if (!this.popupBackdrop) return;

    this.popupBackdrop.style.opacity = '0';
    setTimeout(() => {
        if (this.popupBackdrop) {
            this.popupBackdrop.remove();
            this.popupBackdrop = null;
        }
        document.body.style.overflow = ''; // Restore background scroll
    }, 300); // Match transition duration
  }


  initializeForms() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      if (form.id === 'contactForm') {
        this.initializeContactForm(form);
      } else {
        this.initializeGenericForm(form);
      }
    });
  }

  initializeContactForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!this.validateForm(form)) {
        return;
      }
      
      submitButton.disabled = true;
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
      
      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          this._showBackdrop();
          const successMessage = document.createElement('div');
          successMessage.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 dark:bg-green-700 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-100 px-6 py-4 rounded-lg shadow-lg z-[100] max-w-md w-[90%] sm:w-full mx-4 text-center';
          successMessage.innerHTML = `
            <div class="flex flex-col items-center">
              <div class="flex-shrink-0 mb-2">
                <svg class="w-8 h-8 text-green-500 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
              </div>
              <div>
                <strong class="font-bold text-lg block mb-1">Message Sent!</strong>
                <span class="block text-sm mb-3">Your message has been sent successfully. We will get back to you shortly.</span>
                <a href="https://www.linkedin.com/company/qima-co" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  Follow us on LinkedIn
                </a>
              </div>
            </div>
          `;
          document.body.appendChild(successMessage);

          if (window.toast) {
            window.toast.success('Message sent!', 3000);
          }

          successMessage.style.opacity = '0';
          successMessage.style.transform = 'translate(-50%, -40%) scale(0.95)';
          successMessage.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';

          requestAnimationFrame(() => {
            successMessage.style.opacity = '1';
            successMessage.style.transform = 'translate(-50%, -50%) scale(1)';
          });

          form.reset();

          setTimeout(() => {
            successMessage.style.opacity = '0';
            successMessage.style.transform = 'translate(-50%, -60%) scale(0.95)';
            setTimeout(() => {
              successMessage.remove();
              this._hideBackdrop();
            }, 300);
          }, 5000);
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        this._showBackdrop();
        const errorMessage = document.createElement('div');
        errorMessage.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-100 dark:bg-red-700 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-100 px-6 py-4 rounded-lg shadow-lg z-[100] max-w-md w-[90%] sm:w-full mx-4 text-center';
        errorMessage.innerHTML = `
          <div class="flex flex-col items-center">
            <div class="flex-shrink-0 mb-2">
              <svg class="w-8 h-8 text-red-500 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            </div>
            <div>
              <strong class="font-bold text-lg block mb-1">Error!</strong>
              <span class="block text-sm mb-3">There was a problem sending your message. Please try again later.</span>
              <a href="https://www.linkedin.com/company/qima-co" target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Follow us on LinkedIn
              </a>
            </div>
          </div>
        `;
        document.body.appendChild(errorMessage);

        if (window.toast) {
          window.toast.error('Failed to send message.');
        }

        errorMessage.style.opacity = '0';
        errorMessage.style.transform = 'translate(-50%, -40%) scale(0.95)';
        errorMessage.style.transition = 'all 0.3s ease-out';

        requestAnimationFrame(() => {
          errorMessage.style.opacity = '1';
          errorMessage.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        setTimeout(() => {
          errorMessage.style.opacity = '0';
          errorMessage.style.transform = 'translate(-50%, -60%) scale(0.95)';
          setTimeout(() => {
            errorMessage.remove();
            this._hideBackdrop();
          }, 300);
        }, 5000);
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message';
      }
    });
  }

  initializeGenericForm(form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!this.validateForm(form)) return;

      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton ? submitButton.textContent : 'Submit';

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<div class="loading-spinner-small"></div> Processing...';
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          form.reset();
          if (window.toast) {
            window.toast.success('Form submitted successfully!');
          } else {
            alert('Form submitted successfully!');
          }
        } else {
          throw new Error('Form submission failed');
        }
      } catch (error) {
        console.error('Generic form submission error:', error);
        if (window.toast) {
          window.toast.error(error.message || 'Error submitting form. Please try again.');
        } else {
          alert(error.message || 'Error submitting form. Please try again.');
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalText;
        }
      }
    });
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;

    inputs.forEach(input => {
      input.classList.remove('border-red-500', 'dark:border-red-400');
      const existingErrorMessage = input.parentNode.querySelector('.error-message');
      if (existingErrorMessage) {
        existingErrorMessage.remove();
      }

      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('border-red-500', 'dark:border-red-400');
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message text-red-500 dark:text-red-400 text-xs mt-1';
        if (input.type === 'email' && input.value.trim() && !input.checkValidity()) {
            errorMessage.textContent = 'Please enter a valid email address.';
        } else {
            errorMessage.textContent = input.dataset.errorMessage || 'This field is required.';
        }
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
      } else if (input.type === 'email' && !input.checkValidity()) {
        isValid = false;
        input.classList.add('border-red-500', 'dark:border-red-400');
        const errorMessage = document.createElement('p');
        errorMessage.className = 'error-message text-red-500 dark:text-red-400 text-xs mt-1';
        errorMessage.textContent = 'Please enter a valid email address.';
        input.parentNode.insertBefore(errorMessage, input.nextSibling);
      }
    });
    return isValid;
  }
}

// Utility Functions Object
const utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// Enhanced Toast Notification System Class
class ToastSystem {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'fixed bottom-4 right-4 z-[150] flex flex-col gap-3 w-auto max-w-sm'; // z-index higher than popup backdrop but lower than popup message
    document.body.appendChild(this.container);
    this.queue = [];
    this.isProcessing = false;
  }

  show(message, type = 'info', duration = 3000, options = {}) {
    const toast = document.createElement('div');
    let toastClasses = 'toast flex items-center p-3 rounded-lg shadow-xl text-sm transition-all duration-300 ease-in-out transform opacity-0 translate-y-2 relative overflow-hidden';
    const typeStyles = {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-black',
      info: 'bg-blue-500 text-white',
      default: 'bg-gray-700 text-white'
    };
    toast.className = `${toastClasses} ${typeStyles[type] || typeStyles.default}`;
    const icon = this.getIconForType(type);
    toast.innerHTML = `
      <span class="toast-icon mr-2 text-lg">${icon}</span>
      <span class="toast-message flex-grow">${message}</span>
      ${options.action ? `
        <button class="toast-action ml-3 py-1 px-2 rounded text-xs font-semibold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50" onclick="${options.action.onClick}">
          ${options.action.text}
        </button>
      ` : ''}
      <button class="toast-close-button absolute top-1 right-1 p-1 text-xs opacity-70 hover:opacity-100 focus:outline-none">
        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
      </button>
    `;
    const closeButton = toast.querySelector('.toast-close-button');
    if (closeButton) {
        closeButton.onclick = () => this.dismissToast(toast);
    }
    this.container.appendChild(toast);
    this.queue.push({ toast, duration });
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  getIconForType(type) {
    const icons = {
      success: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>',
      error: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>',
      warning: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.636-1.174 2.23-1.174 2.866 0l6.876 12.668c.636 1.174-.164 2.609-1.433 2.609H2.814c-1.269 0-2.069-1.435-1.433-2.609L8.257 3.099zM10 6a1 1 0 011 1v4a1 1 0 11-2 0V7a1 1 0 011-1zm0 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd"></path></svg>',
      info: '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>'
    };
    return icons[type] || icons.info;
  }

  async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }
    this.isProcessing = true;
    const { toast, duration } = this.queue.shift();
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    await new Promise(resolve => setTimeout(resolve, duration));
    this.dismissToast(toast, true);
    this.processQueue();
  }

  async dismissToast(toastElement, isAutoDismiss = false) {
    if (!toastElement || !toastElement.parentNode) return;
    toastElement.style.opacity = '0';
    toastElement.style.transform = 'translateY(10px)';
    await new Promise(resolve => setTimeout(resolve, 300));
    toastElement.remove();
  }

  success(message, duration = 3000, options = {}) { this.show(message, 'success', duration, options); }
  error(message, duration = 5000, options = {}) { this.show(message, 'error', duration, options); }
  warning(message, duration = 4000, options = {}) { this.show(message, 'warning', duration, options); }
  info(message, duration = 3000, options = {}) { this.show(message, 'info', duration, options); }
}

// Scroll Progress Bar Class
class ScrollProgress {
  constructor() {
    this.progressBar = document.createElement('div');
    this.progressBar.className = 'scroll-progress fixed top-0 left-0 h-1 bg-blue-500 dark:bg-blue-400 z-[200] transition-width duration-100 ease-linear';
    this.progressBar.style.width = '0%';
    document.body.appendChild(this.progressBar);
    this.init();
  }
  init() {
    window.addEventListener('scroll', utils.throttle(() => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (height > 0) ? (winScroll / height) * 100 : 0;
      this.progressBar.style.width = scrolled + '%';
    }, 50));
  }
}

// Image Lazy Loading with Intersection Observer Class
class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[data-src]');
    this.observerOptions = {
      root: null,
      rootMargin: '0px 0px 100px 0px',
      threshold: 0.01
    };
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), this.observerOptions);
    this.init();
  }
  init() {
    this.images.forEach(img => {
      if (!img.src) {
        img.classList.add('lazy-image-placeholder');
      }
      this.observer.observe(img);
    });
  }
  handleIntersection(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        img.src = src;
        img.onload = () => {
          img.classList.remove('lazy-image-placeholder');
          img.classList.add('lazy-image-loaded');
          img.removeAttribute('data-src');
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${src}`);
          img.classList.remove('lazy-image-placeholder');
          img.classList.add('lazy-image-error');
          img.removeAttribute('data-src');
        };
        observer.unobserve(img);
      }
    });
  }
}

// Scroll to Top Button Class
class ScrollToTop {
  constructor() {
    this.button = document.createElement('button');
    this.button.className = 'scroll-to-top fixed bottom-5 right-5 p-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-full shadow-lg transition-opacity transform duration-300 ease-in-out opacity-0 translate-y-4 focus:outline-none focus:ring-2 focus:ring-blue-400 z-[100]';
    this.button.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>';
    this.button.setAttribute('aria-label', 'Scroll to top');
    this.button.setAttribute('type', 'button');
    document.body.appendChild(this.button);
    this.init();
  }
  init() {
    window.addEventListener('scroll', utils.throttle(() => {
      if (window.pageYOffset > 300) {
        this.button.classList.add('opacity-100', 'translate-y-0');
        this.button.classList.remove('opacity-0', 'translate-y-4');
      } else {
        this.button.classList.remove('opacity-100', 'translate-y-0');
        this.button.classList.add('opacity-0', 'translate-y-4');
      }
    }, 200));
    this.button.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Initialize all features once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.cookieConsent = new CookieConsent();
  window.cookieConsent.init();

  window.toast = new ToastSystem();
  new ScrollProgress();
  new LazyLoader();
  new ScrollToTop();
  new FormHandler();

  document.body.classList.add('page-transition');
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 50);
  });
});
