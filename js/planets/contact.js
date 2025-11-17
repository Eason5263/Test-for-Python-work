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

    // Submit form using EmailJS service
    // IMPORTANT: You need to set up EmailJS first (see SETUP_CONTACT_FORM.md)
    // Get your credentials from https://www.emailjs.com/
    async submitToFormSubmit() {
        this.setLoadingState(true);
        this.clearAllErrors();

        try {
            // ============================================
            // CONFIGURATION - UPDATE THESE VALUES
            // ============================================
            // Get these from your EmailJS account:
            // 1. Service ID - from Email Services
            // 2. Template ID - from Email Templates  
            // 3. Public Key - from Account → General
            const EMAILJS_SERVICE_ID = 'service_0op4j48';
            const EMAILJS_TEMPLATE_ID = 'template_h8lamvg';
            const EMAILJS_PUBLIC_KEY = 'kVAn-eVzwx3vDBEuG';
            // ============================================

            // Check if EmailJS is configured (check for placeholder values)
            console.log('Checking EmailJS configuration...', {
                serviceId: EMAILJS_SERVICE_ID,
                templateId: EMAILJS_TEMPLATE_ID,
                publicKey: EMAILJS_PUBLIC_KEY ? EMAILJS_PUBLIC_KEY.substring(0, 10) + '...' : 'missing'
            });
            
            if (EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID_HERE' || 
                EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID_HERE' || 
                EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE' ||
                !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
                // EmailJS not configured - use mailto fallback (works immediately)
                console.warn('EmailJS not configured properly. Using mailto fallback.');
                console.warn('Values:', {
                    serviceId: EMAILJS_SERVICE_ID,
                    templateId: EMAILJS_TEMPLATE_ID,
                    publicKey: EMAILJS_PUBLIC_KEY
                });
                this.useMailtoFallback();
                return;
            }
            
            console.log('✅ EmailJS is configured correctly!');

            // Check if EmailJS SDK is loaded
            if (typeof emailjs === 'undefined') {
                console.error('EmailJS SDK not loaded');
                throw new Error('EmailJS SDK not loaded. Please add the script tag to contact.html');
            }

            console.log('EmailJS SDK loaded, preparing to send email...');

            // Get form field values
            const name = this.form.querySelector('#name').value.trim();
            const email = this.form.querySelector('#email').value.trim();
            const subject = this.form.querySelector('#subject').value.trim() || 'New Contact Form Submission';
            const message = this.form.querySelector('#message').value.trim();

            console.log('Sending email with EmailJS...', {
                serviceId: EMAILJS_SERVICE_ID,
                templateId: EMAILJS_TEMPLATE_ID,
                publicKey: EMAILJS_PUBLIC_KEY.substring(0, 5) + '...', // Only show first 5 chars for security
                name: name,
                email: email,
                subject: subject
            });

            // Prepare template parameters
            // NOTE: These parameter names must match your EmailJS template variables
            // Make sure your EmailJS template uses: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                reply_to: email  // This allows you to reply directly to the sender
            };

            // Send email using EmailJS v3 API
            // In v3, the public key is passed as the 4th parameter
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY  // Public key as 4th parameter (EmailJS v3)
            );

            console.log('Email sent successfully:', response);

            // Success!
            this.showSuccessMessage();
            this.form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            
            // Provide helpful error messages
            if (error.message.includes('not configured')) {
                this.showErrorMessage(
                    'Email service not configured. Please check SETUP_CONTACT_FORM.md for setup instructions. ' +
                    'For now, you can email directly at easonjenichia@gmail.com'
                );
            } else if (error.message.includes('SDK not loaded')) {
                this.showErrorMessage(
                    'EmailJS SDK not loaded. Please add the script tag to contact.html. ' +
                    'See SETUP_CONTACT_FORM.md for details.'
                );
            } else {
                // Fallback to mailto if EmailJS fails
                const name = this.form.querySelector('#name').value.trim();
                const email = this.form.querySelector('#email').value.trim();
                const subject = this.form.querySelector('#subject').value.trim() || 'New Contact Form Submission';
                const message = this.form.querySelector('#message').value.trim();
                
                const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
                const mailtoLink = `mailto:easonjenichia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
                
                this.showErrorMessage(
                    `Email service error: ${error.message}. ` +
                    `Click <a href="${mailtoLink}" style="color: var(--color-primary); text-decoration: underline;">here</a> to email directly.`
                );
            }
        } finally {
            this.setLoadingState(false);
        }
    }

    // Mailto fallback - opens user's email client with pre-filled message
    // This works immediately without any setup required
    useMailtoFallback() {
        const name = this.form.querySelector('#name').value.trim();
        const email = this.form.querySelector('#email').value.trim();
        const subject = this.form.querySelector('#subject').value.trim() || 'New Contact Form Submission';
        const message = this.form.querySelector('#message').value.trim();
        
        // Format email body
        const emailBody = `Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your DevVerse contact form.`;
        
        // Create mailto link
        const mailtoLink = `mailto:easonjenichia@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Show info message
        const infoDiv = document.createElement('div');
        infoDiv.className = 'info-message fade-in';
        infoDiv.innerHTML = `
            <h3 style="margin: 0 0 0.5rem 0; color: var(--color-primary);">📧 Opening Email Client</h3>
            <p style="margin: 0 0 1rem 0; color: var(--color-text-secondary);">
                Your email client will open with a pre-filled message. 
                Just click "Send" to deliver your message!
            </p>
            <p style="margin: 0; font-size: 0.9rem; color: var(--color-text-muted);">
                💡 <strong>Tip:</strong> For automatic email sending (no email client needed), 
                set up EmailJS. See <code>SETUP_CONTACT_FORM.md</code> for instructions.
            </p>
        `;
        infoDiv.style.cssText = `
            background: linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(123, 47, 255, 0.15));
            padding: 1.5rem;
            border-radius: var(--radius-lg);
            text-align: center;
            margin-top: 1.5rem;
            border: 2px solid var(--color-primary);
            box-shadow: 0 4px 20px rgba(0, 217, 255, 0.2);
        `;
        
        // Insert before submit button
        const submitButton = this.form.querySelector('.submit-button');
        this.form.insertBefore(infoDiv, submitButton.nextSibling);
        
        // Open mailto link
        window.location.href = mailtoLink;
        
        // Reset form after a short delay
        setTimeout(() => {
            this.form.reset();
            this.setLoadingState(false);
        }, 500);
        
        // Remove info message after 10 seconds
        setTimeout(() => {
            infoDiv.style.transition = 'opacity 0.5s ease-out';
            infoDiv.style.opacity = '0';
            setTimeout(() => infoDiv.remove(), 500);
        }, 10000);
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

// Initialize when DOM is fully loaded and EmailJS is available
function initializeContactForm() {
    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not loaded yet, waiting...');
        setTimeout(initializeContactForm, 100);
        return;
    }
    
    console.log('EmailJS is loaded, initializing contact form...');
    new ContactPlanet();
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeContactForm);
} else {
    // DOM is already ready
    initializeContactForm();
}