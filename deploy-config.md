# Secure Deployment Configuration

## 🔒 Security Checklist

### 1. Environment Variables (Render.com)
Set these environment variables in your Render.com dashboard:

```
GROQ_API_KEY=your_actual_groq_api_key_here
PORT=5002
NODE_ENV=production
```

### 2. GitHub Pages Configuration
Your frontend will be deployed to GitHub Pages with these settings:

- **Repository**: Make sure `.env` files are in `.gitignore`
- **Build Command**: `npm run predeploy && npm run build`
- **Deploy Command**: `npm run deploy`

### 3. API Security Features Implemented

#### Rate Limiting
- 100 requests per minute per IP
- 10 jokes per minute per user
- 20 transcriptions per hour per user
- 5 personality generations per minute per user

#### CORS Protection
- Only allows requests from approved domains
- Blocks unauthorized origins
- Logs blocked requests for monitoring

#### Security Headers
- X-Frame-Options: DENY (prevents clickjacking)
- X-Content-Type-Options: nosniff (prevents MIME sniffing)
- X-XSS-Protection: enabled
- Content Security Policy: basic protection

#### Request Validation
- JSON payload size limited to 10MB
- Input sanitization on all endpoints
- Error messages don't expose sensitive information

### 4. Frontend Security Features

#### API Configuration
- No hardcoded API keys in frontend code
- Environment-based API URL configuration
- Secure API call wrapper with error handling
- Client-side rate limiting

#### Build Security
- API URLs are set during build time
- No sensitive data in built JavaScript files
- Proper environment variable handling

## 🚀 Deployment Steps

### Step 1: Secure Your Repository
1. Remove any committed API keys:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
   ```

2. Add proper `.gitignore` (already done)

3. Commit security changes:
   ```bash
   git add .
   git commit -m "🔒 Implement security measures and remove sensitive data"
   git push origin main
   ```

### Step 2: Deploy Backend to Render.com
1. Go to [Render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new Web Service
4. Set environment variables:
   - `GROQ_API_KEY`: Your actual API key
   - `PORT`: 5002
   - `NODE_ENV`: production
5. Set build command: `npm install`
6. Set start command: `npm run server`

### Step 3: Deploy Frontend to GitHub Pages
1. Update your repository settings
2. Enable GitHub Pages from the `gh-pages` branch
3. Run deployment:
   ```bash
   npm run deploy
   ```

### Step 4: Verify Security
1. Check that no API keys are visible in browser dev tools
2. Verify CORS is working correctly
3. Test rate limiting by making multiple requests
4. Confirm all API calls use HTTPS in production

## 🔍 Security Monitoring

### What to Monitor
- Failed CORS requests (logged as warnings)
- Rate limit violations (429 status codes)
- Unusual request patterns
- API key usage (through Groq dashboard)

### Log Analysis
- Server logs show request patterns without sensitive data
- Error messages are generic to prevent information leakage
- All API calls are logged with timestamps and IPs

## 🚨 Security Incident Response

### If API Key is Compromised
1. Immediately revoke the key in Groq console
2. Generate a new API key
3. Update environment variable in Render.com
4. Monitor usage for any unauthorized activity

### If Unusual Traffic is Detected
1. Check server logs for patterns
2. Adjust rate limits if necessary
3. Block specific IPs if needed (through Render.com)
4. Monitor API usage costs

## 📋 Regular Security Maintenance

### Monthly Tasks
- Review API usage and costs
- Check for any new security vulnerabilities in dependencies
- Update rate limits based on usage patterns
- Review CORS allowed origins

### Quarterly Tasks
- Rotate API keys as a security best practice
- Review and update security headers
- Audit server logs for any security issues
- Update dependencies to latest secure versions

## 🛡️ Additional Security Recommendations

### For Production
1. Consider implementing API key rotation
2. Add request signing for additional security
3. Implement user authentication if needed
4. Add monitoring and alerting for unusual patterns
5. Consider using a CDN for additional DDoS protection

### For Scaling
1. Implement database-backed rate limiting
2. Add API versioning for backward compatibility
3. Implement proper logging and monitoring
4. Consider microservices architecture for better security isolation