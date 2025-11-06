# Laravel CORS Configuration for Task Tracker API

## Problem
You're getting CORS errors when the Next.js frontend tries to communicate with the Laravel API, even though Postman works.

## Solution: Configure CORS in Laravel

### Step 1: Install Laravel CORS Package (if not already installed)
```bash
composer require fruitcake/laravel-cors
```

### Step 2: Publish CORS Configuration
```bash
php artisan vendor:publish --provider="Fruitcake\Cors\CorsServiceProvider"
```

### Step 3: Update CORS Configuration
Edit `config/cors.php`:

```php
<?php

return [
    'paths' => ['api/*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3000', 'http://127.0.0.1:3000'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
```

### Step 4: Register CORS Middleware
In `app/Http/Kernel.php`, add to the `$middleware` array:

```php
protected $middleware = [
    // ... other middleware
    \Fruitcake\Cors\HandleCors::class,
];
```

### Step 5: Alternative - Register in Route Middleware
If the above doesn't work, try registering in `app/Http/Kernel.php` in the `$middlewareGroups` array under 'api':

```php
'api' => [
    \Fruitcake\Cors\HandleCors::class,
    // ... other api middleware
],
```

### Step 6: Clear Configuration Cache
```bash
php artisan config:clear
php artisan cache:clear
php artisan config:cache
```

## Troubleshooting CORS Issues

### Issue 1: CORS Still Not Working
If CORS is still not working after configuration:

1. **Check if the package is installed**:
   ```bash
   composer show | grep cors
   ```

2. **Verify middleware registration** in `app/Http/Kernel.php`:
   ```php
   protected $middleware = [
       // ... other middleware
       \Fruitcake\Cors\HandleCors::class,
   ];
   ```

3. **Check if config file exists**:
   ```bash
   ls -la config/cors.php
   ```

4. **Test CORS headers manually**:
   ```bash
   curl -I -X OPTIONS http://task-tracker.test/api/login \
     -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST"
   ```

### Issue 2: Browser Still Shows CORS Error
Even after proper configuration:

1. **Clear browser cache** completely (Ctrl+Shift+R)
2. **Disable browser extensions** temporarily
3. **Try incognito/private mode**
4. **Check if Laravel server restarted** after config changes

### Issue 3: Sanctum CSRF Issues
Laravel Sanctum might interfere with CORS:

1. **Check Sanctum configuration** in `config/sanctum.php`:
   ```php
   'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
   ```

2. **Add to `.env`**:
   ```bash
   SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
   ```

### Issue 4: Manual CORS Headers (Fallback)
If the package doesn't work, add headers manually in `routes/api.php`:

```php
<?php

use Illuminate\Http\Request;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Add CORS headers to all API routes
Route::middleware(['api'])->group(function () {
    // Your API routes here
});

// Manual CORS for development
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
```

### Issue 5: Check Network Tab
1. Open browser DevTools → Network tab
2. Try login and look for:
   - **OPTIONS request** (preflight) - should return 200
   - **POST request** - should return 200 or 422
   - Check **Response Headers** for CORS headers

### Issue 6: Test with Different Origins
Try adding more origins to `config/cors.php`:
```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    '*', // Temporary for testing
],
```

## Quick Debug Commands

```bash
# Test CORS preflight
curl -X OPTIONS http://task-tracker.test/api/login \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v

# Test actual login
curl -X POST http://task-tracker.test/api/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"email":"test@test.com","password":"password"}' \
  -v

# Check Laravel routes
php artisan route:list --path=api

# Check if CORS middleware is loaded
php artisan middleware:list | grep cors
```

## Alternative: Manual CORS Headers

If you prefer not to use the package, add CORS headers manually in your API routes or middleware:

```php
// In routes/api.php or a middleware
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
```

## Testing

After configuration:
1. Restart your Laravel server: `php artisan serve`
2. Restart your Next.js dev server: `npm run dev`
3. Try logging in again

## Troubleshooting

If CORS issues persist:

1. **Check Laravel server is running** on the correct port
2. **Verify API URL** in `.env.local` matches your Laravel server
3. **Check browser network tab** for exact error details
4. **Try disabling browser CORS** temporarily for testing (not recommended for production)

## Development vs Production

- **Development**: Use `http://localhost:3000` in CORS config
- **Production**: Replace with your actual domain

## Security Note

Remember to configure CORS properly for production:
- Only allow your actual domain
- Don't use `allowed_origins: ['*']` in production
- Be specific about allowed methods and headers