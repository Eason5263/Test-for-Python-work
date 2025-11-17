# Contact Form Setup Instructions

## Option 1: EmailJS (Recommended - Free & Reliable)

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up for a free account (free tier: 200 emails/month)
3. Verify your email address

### Step 2: Set Up Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose "Gmail" (or your email provider)
4. Connect your Gmail account (easonjenichia@gmail.com)
5. Note your **Service ID** (e.g., `service_xxxxx`)
service_0op4j48

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:
   - **Template Name**: Contact Form
   - **Subject**: New Contact: {{subject}}
   - **Content**:
     ```
     Name: {{name}}
     Email: {{email}}
     Subject: {{subject}}
     
     Message:
     {{message}}
     ```
4. Note your **Template ID** (e.g.`template_h8lamvg`)

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key** (e.g., `kVAn-eVzwx3vDBEuG`)
private aWo5Hxy5RMGCNUC6ngr_n


### Step 5: Update the Contact Form
1. Open `planets/contact.html`
2. Add EmailJS SDK before the closing `</body>` tag:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
   ```
3. Open `js/planets/contact.js`
4. Update the configuration at the top of `submitToFormSubmit()` method with your credentials:
   ```javascript
   const EMAILJS_SERVICE_ID = 'your_service_id';
   const EMAILJS_TEMPLATE_ID = 'your_template_id';
   const EMAILJS_PUBLIC_KEY = 'your_public_key';
   ```

## Option 2: FormSpree (Alternative - Also Free)

### Step 1: Create FormSpree Account
1. Go to https://formspree.io/
2. Sign up for a free account (free tier: 50 submissions/month)
3. Verify your email address

### Step 2: Create a Form
1. Click "New Form"
2. Enter form name: "Contact Form"
3. Copy the form endpoint (e.g., `https://formspree.io/f/xxxxxxxxxx`)

### Step 3: Update the Code
1. Open `js/planets/contact.js`
2. Replace the FormSubmit URL with your FormSpree endpoint in the `submitToFormSubmit()` method

## Option 3: Web3Forms (Alternative - No Signup Required)

### Step 1: Get Access Key
1. Go to https://web3forms.com/
2. Enter your email: easonjenichia@gmail.com
3. Click "Get Your Access Key"
4. Copy the access key (you'll receive it via email)

### Step 2: Update the Code
1. Open `js/planets/contact.js`
2. Update the `access_key` in the `submitToFormSubmit()` method with your key

## Testing
After setup, test the form by:
1. Filling out all fields
2. Clicking "Send Message"
3. Checking your email (easonjenichia@gmail.com) for the message

## Troubleshooting
- Check browser console (F12) for error messages
- Verify all IDs and keys are correct
- Make sure you've verified your email with the service
- Check spam folder for verification emails

