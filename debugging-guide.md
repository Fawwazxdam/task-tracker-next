# Debugging Guide: API Connection Issues

## Current Error: "GET method is not supported for route api/login. Supported methods: POST"

This error indicates that a GET request is being made to `/api/login` instead of a POST request.

## Debugging Steps

### 1. Check Browser Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try to login
4. Look for the login request
5. Check:
   - **Method**: Should be POST
   - **URL**: Should be `http://task-tracker.test/api/login`
   - **Status**: Should be 200 (success) or 422 (validation error)

### 2. Check Console Logs
Look for any JavaScript errors in the browser console.

### 3. Verify API Endpoint
Test the API directly:
```bash
# Test if Laravel API is responding
curl -X POST http://task-tracker.test/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

### 4. Check Environment Variables
Verify `.env.local` contains:
```bash
NEXT_PUBLIC_API_BASE_URL=http://task-tracker.test/api
```

### 5. Check Laravel Routes
In your Laravel app, verify the route exists:
```bash
php artisan route:list | grep login
```

Should show:
```
POST | api/login | ... | login
```

### 6. Check Laravel Sanctum Configuration
Ensure Sanctum is properly configured in `config/sanctum.php`:
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
```

## Common Issues & Solutions

### Issue 1: Wrong HTTP Method
**Symptom**: GET request to POST-only endpoint
**Solution**: Check axios configuration and ensure POST method is used

### Issue 2: CORS Not Configured
**Symptom**: CORS error in browser
**Solution**: Follow the Laravel CORS configuration guide

### Issue 3: Wrong API URL
**Symptom**: 404 or connection refused
**Solution**: Verify API URL in `.env.local` and Laravel server is running

### Issue 4: Laravel Server Not Running
**Symptom**: Connection refused
**Solution**: Start Laravel server with `php artisan serve`

### Issue 5: Sanctum CSRF Issues
**Symptom**: 419 CSRF token mismatch
**Solution**: Ensure SPA URL is configured in Sanctum config

## Quick Test Commands

```bash
# Test Laravel server
curl http://task-tracker.test/api

# Test login endpoint
curl -X POST http://task-tracker.test/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'

# Check if Next.js is proxying correctly
curl http://localhost:3000/api/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password"}'
```

## Alternative: Use Mock Data for Testing

If API issues persist, temporarily switch back to mock data:

1. Comment out API calls in services
2. Return mock data instead
3. Test frontend functionality
4. Fix API issues separately

## Emergency Fallback

If nothing works, use this temporary solution in `authService.js`:

```javascript
async login(credentials) {
  // Temporary mock for testing
  return {
    user: {
      id: 1,
      name: "Test User",
      email: credentials.email
    },
    token: "mock_token_" + Date.now()
  };
}
```

This allows you to test the frontend while fixing the API connection issues.