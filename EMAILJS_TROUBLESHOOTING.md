# EmailJS Troubleshooting Guide

## Quick Checklist

### 1. Verify Your EmailJS Template Variables
Your EmailJS template MUST use these exact variable names:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Email subject
- `{{message}}` - Message content

### 2. Check Your EmailJS Service
1. Go to https://dashboard.emailjs.com/admin
2. Navigate to "Email Services"
3. Make sure your service (service_0op4j48) is:
   - ✅ Connected and active
   - ✅ Verified (if using Gmail, you may need to verify)
   - ✅ Has the correct email address (easonjenichia@gmail.com)

### 3. Verify Your Template
1. Go to "Email Templates"
2. Open template_h8lamvg
3. Make sure it uses these variables:
   ```
   Subject: New Contact: {{subject}}
   
   Name: {{from_name}}
   Email: {{from_email}}
   Subject: {{subject}}
   
   Message:
   {{message}}
   ```

### 4. Test Your Public Key
1. Go to "Account" → "General"
2. Verify your Public Key matches: `kVAn-eVzwx3vDBEuG`
3. If different, update it in `js/planets/contact.js`

### 5. Check Browser Console
1. Open your contact page
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for error messages
5. You should see:
   - ✅ "EmailJS is loaded, initializing contact form..."
   - ✅ "✅ EmailJS is configured correctly!"
   - ✅ "Sending email with EmailJS..."

### 6. Common Issues

#### Issue: "EmailJS not configured"
- **Solution**: Check that your credentials in `js/planets/contact.js` match your EmailJS dashboard
- Make sure you're not using placeholder values

#### Issue: "EmailJS SDK not loaded"
- **Solution**: Check that the script tag is in `planets/contact.html`
- Verify the CDN link is correct
- Check browser console for script loading errors

#### Issue: Emails not received
- **Solution**: 
  1. Check spam folder
  2. Verify your EmailJS service is connected
  3. Check EmailJS dashboard for error logs
  4. Make sure your Gmail account allows EmailJS to send emails

#### Issue: Template variables not working
- **Solution**: 
  1. Verify template variable names match exactly (case-sensitive)
  2. Check that your template uses `{{variable_name}}` syntax
  3. Test the template in EmailJS dashboard

### 7. Test Your Setup

1. Fill out the contact form
2. Submit it
3. Check browser console for:
   - "Email sent successfully"
   - Response status 200
4. Check your email (easonjenichia@gmail.com)
5. Check spam folder if not in inbox

### 8. Still Not Working?

1. **Check EmailJS Dashboard Logs**:
   - Go to https://dashboard.emailjs.com/admin
   - Check "Activity" or "Logs" for error messages

2. **Verify Gmail Connection**:
   - If using Gmail, make sure you've authorized EmailJS
   - You may need to use an "App Password" instead of your regular password

3. **Test with Simple Template**:
   - Create a simple test template with just: `{{message}}`
   - Test if that works first

4. **Check Rate Limits**:
   - Free tier: 200 emails/month
   - Check if you've exceeded the limit

### 9. Alternative: Use Mailto Fallback
If EmailJS continues to have issues, the form will automatically use the mailto fallback, which:
- Opens the user's email client
- Pre-fills the message
- Works without any setup
- User just needs to click "Send"

## Need More Help?

1. Check EmailJS documentation: https://www.emailjs.com/docs/
2. Check EmailJS status: https://status.emailjs.com/
3. Contact EmailJS support if the issue persists

