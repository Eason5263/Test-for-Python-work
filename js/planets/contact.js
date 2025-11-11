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
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Always prevent default to handle via AJAX
            
            if (!this.validateForm()) {
                return; // Validation failed, don't submit
            }
            
            // Submit via AJAX to FormSubmit
            await this.submitToFormSubmit();
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

    // Submit form to FormSubmit via AJAX
    // FormSubmit is a free service that sends form submissions via email
    // Note: On first use, FormSubmit will send a confirmation email to easonjenichia@gmail.com
    // You need to click the confirmation link to activate the form
    async submitToFormSubmit() {
        this.setLoadingState(true);
        this.clearAllErrors();

        try {
            // Get form data
            const formData = new FormData(this.form);
            
            // Submit to FormSubmit using AJAX endpoint
            // This sends the form data to FormSubmit, which then emails it to easonjenichia@gmail.com
            const response = await fetch('https://formsubmit.co/ajax/easonjenichia@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const data = await response.json();

            // FormSubmit returns { success: true } on success
            if (response.ok && (data.success === true || response.status === 200)) {
                // Success! Email has been sent
                this.showSuccessMessage();
                this.form.reset();
            } else {
                // Error from FormSubmit
                const errorMsg = data.message || 'Failed to send message';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('Form submission error:', error);
            // Show user-friendly error message
            this.showErrorMessage('Failed to send message. Please try again or email me directly at easonjenichia@gmail.com');
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


    // Show success message
    showSuccessMessage() {
        // Remove any existing messages
        const existingMessages = this.form.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message fade-in';
        successMessage.innerHTML = `
            <h3 style="margin: 0 0 0.5rem 0; color: var(--color-primary);">🚀 Message Sent!</h3>
            <p style="margin: 0; color: var(--color-text-secondary);">Your message has been transmitted across the cosmos. I'll get back to you soon!</p>
        `;
        successMessage.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(123, 47, 255, 0.1));
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            text-align: center;
            margin-top: 1.5rem;
            border: 2px solid var(--color-primary);
            box-shadow: 0 4px 20px rgba(0, 217, 255, 0.2);
        `;
        
        this.form.insertBefore(successMessage, this.form.querySelector('.submit-button').nextSibling);
        
        // Reset form
        this.form.reset();
        this.clearAllErrors();
        this.setLoadingState(false);
        
        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove success message after 8 seconds
        setTimeout(() => {
            successMessage.style.transition = 'opacity 0.5s ease-out';
            successMessage.style.opacity = '0';
            setTimeout(() => successMessage.remove(), 500);
        }, 8000);
    }

    // Show error message
    showErrorMessage(message = 'Failed to send message. Please try again later.') {
        // Remove any existing messages
        const existingMessages = this.form.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message fade-in';
        errorMessage.innerHTML = `
            <p style="margin: 0; color: var(--color-danger);">❌ ${message}</p>
        `;
        errorMessage.style.cssText = `
            background: linear-gradient(135deg, rgba(255, 51, 102, 0.1), rgba(255, 51, 102, 0.05));
            color: var(--color-danger);
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            text-align: center;
            margin-top: 1.5rem;
            border: 2px solid var(--color-danger);
            box-shadow: 0 4px 20px rgba(255, 51, 102, 0.2);
        `;
        
        this.form.insertBefore(errorMessage, this.form.querySelector('.submit-button').nextSibling);
        
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remove error message after 8 seconds
        setTimeout(() => {
            errorMessage.style.transition = 'opacity 0.5s ease-out';
            errorMessage.style.opacity = '0';
            setTimeout(() => errorMessage.remove(), 500);
        }, 8000);
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactPlanet();
});