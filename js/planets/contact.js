// Contact Planet - Form Validation and Animation
// Handles contact form interactions and visual feedback

class ContactPlanet {
    constructor() {
        this.form = document.querySelector('.contact-form');
        this.submitButton = document.querySelector('.submit-button');
        this.init();
    }

    init() {
        console.log('📮 Contact planet initialized');
        
        if (!this.form) {
            console.error('❌ Contact form not found');
            return;
        }
        
        this.setupFormHandlers();
        this.setupInputAnimations();
    }

    // Setup form submission handler
    setupFormHandlers() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });
    }

    // Add input focus animations
    setupInputAnimations() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add basic styling
            input.style.transition = 'all 0.3s ease';
            
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
                input.style.borderColor = 'var(--color-primary)';
                input.style.boxShadow = '0 0 0 2px rgba(76, 201, 240, 0.2)';
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
                input.style.borderColor = '';
                input.style.boxShadow = '';
                
                // Validate on blur
                this.validateField(input);
            });
        });
    }

    // Validate individual field
    validateField(input) {
        const value = input.value.trim();
        let isValid = true;
        let message = '';
        
        switch(input.type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    isValid = false;
                    message = 'Please enter a valid email';
                }
                break;
            case 'text':
                if (input.id === 'name' && !value) {
                    isValid = false;
                    message = 'Name is required';
                }
                break;
            case 'textarea':
                if (value && value.length < 10) {
                    isValid = false;
                    message = 'Message must be at least 10 characters';
                }
                break;
        }
        
        if (!isValid) {
            this.showError(input, message);
        } else {
            this.clearError(input);
        }
        
        return isValid;
    }

    // Handle form submission with validation
    async handleFormSubmit() {
        if (!this.validateForm()) {
            return;
        }

        this.setLoadingState(true);

        try {
            // Simulate API call delay
            await this.simulateSubmission();
            
            this.showSuccessMessage();
            this.form.reset();
            this.clearAllErrors();
            
        } catch (error) {
            this.showErrorMessage();
        } finally {
            this.setLoadingState(false);
        }
    }

    // Basic form validation
    validateForm() {
        const name = this.form.querySelector('#name');
        const email = this.form.querySelector('#email');
        const message = this.form.querySelector('#message');

        let isValid = true;

        // Reset previous errors
        this.clearAllErrors();

        // Name validation
        if (!name.value.trim()) {
            this.showError(name, 'Name is required');
            isValid = false;
        }

        // Email validation
        if (!email.value.trim()) {
            this.showError(email, 'Email is required');
            isValid = false;
        } else if (!this.isValidEmail(email.value)) {
            this.showError(email, 'Please enter a valid email');
            isValid = false;
        }

        // Message validation
        if (!message.value.trim()) {
            this.showError(message, 'Message is required');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            this.showError(message, 'Message must be at least 10 characters');
            isValid = false;
        }

        return isValid;
    }

    // Email validation helper
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show error message for specific field
    showError(input, message) {
        this.clearError(input);
        
        const formGroup = input.parentElement;
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-accent);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            padding: 0.25rem;
        `;
        
        formGroup.appendChild(errorElement);
        input.style.borderColor = 'var(--color-accent)';
    }

    // Clear error for specific field
    clearError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        input.style.borderColor = '';
    }

    // Clear all error messages
    clearAllErrors() {
        const errors = this.form.querySelectorAll('.error-message');
        const inputs = this.form.querySelectorAll('input, textarea');
        
        errors.forEach(error => error.remove());
        inputs.forEach(input => input.style.borderColor = '');
    }

    // Set loading state for submit button
    setLoadingState(loading) {
        if (loading) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add('loading');
            this.submitButton.querySelector('.button-text').style.display = 'none';
            this.submitButton.querySelector('.button-loading').style.display = 'inline';
        } else {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('loading');
            this.submitButton.querySelector('.button-text').style.display = 'inline';
            this.submitButton.querySelector('.button-loading').style.display = 'none';
        }
    }

    // Simulate form submission
    async simulateSubmission() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 90% success rate for demo
                if (Math.random() > 0.1) {
                    resolve();
                } else {
                    reject(new Error('Network error'));
                }
            }, 1500);
        });
    }

    // Show success message
    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message fade-in';
        successMessage.innerHTML = `
            <h3>🚀 Message Sent!</h3>
            <p>Your message has been transmitted across the cosmos. I'll get back to you soon!</p>
        `;
        successMessage.style.cssText = `
            background: var(--color-stardust);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            margin-top: 1rem;
            border: 1px solid var(--color-primary);
        `;
        
        this.form.appendChild(successMessage);
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.add('fade-out');
            setTimeout(() => successMessage.remove(), 400);
        }, 5000);
    }

    // Show error message
    showErrorMessage() {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message fade-in';
        errorMessage.textContent = 'Failed to send message. Please try again later.';
        errorMessage.style.cssText = `
            background: var(--color-stardust);
            color: var(--color-accent);
            padding: 1rem;
            border-radius: 8px;
            text-align: center;
            margin-top: 1rem;
            border: 1px solid var(--color-accent);
        `;
        
        this.form.appendChild(errorMessage);
        
        // Remove error message after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPlanet();
});