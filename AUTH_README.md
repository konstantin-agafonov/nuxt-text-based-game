# Authentication System

This Nuxt application uses a custom authentication system that integrates with Laravel Sanctum backend.

## Features

- **Login/Register Forms**: Custom components with validation and error handling
- **State Management**: Pinia store for global auth state
- **CSRF Protection**: Automatic CSRF token handling for Laravel Sanctum
- **User Profile**: Component to display user info and logout functionality
- **Route Protection**: Middleware for protected and guest-only routes

## Components

### Auth.vue
Main authentication component that shows login/register forms or user profile based on auth state.

### Login.vue
Login form with email/password fields, validation, and error handling.

### Register.vue
Registration form with name, email, password, and password confirmation fields.

### UserProfile.vue
Displays current user information and logout button.

## Store

### useAuthStore()
Pinia store with the following methods:
- `signIn(credentials)` - Login user
- `signUp(userData)` - Register user
- `signOut()` - Logout user
- `fetchUser()` - Get current user data
- `initAuth()` - Initialize auth state

## Middleware

### auth.ts
Protects routes that require authentication. Redirects to home if not authenticated.

### guest.ts
Protects routes that should only be accessible to non-authenticated users.

## Usage

### In Components
```vue
<script setup>
const authStore = useAuthStore()

// Check if user is authenticated
if (authStore.isAuthenticated) {
  console.log('User is logged in:', authStore.user)
}
</script>
```

### In Pages
```vue
<script setup>
// Protect this page
definePageMeta({
  middleware: 'auth'
})
</script>
```

### For Guest-only Pages
```vue
<script setup>
// Only allow non-authenticated users
definePageMeta({
  middleware: 'guest'
})
</script>
```

## Configuration

The backend URL is configured in `nuxt.config.ts`:
```typescript
runtimeConfig: {
  public: {
    apiBase: 'http://localhost:8100'
  }
}
```

## Backend Requirements

The Laravel backend should have:
- Sanctum configured
- CSRF protection enabled
- CORS configured for the frontend domain
- Routes: `/login`, `/register`, `/logout`, `/api/user`, `/sanctum/csrf-cookie`

## Installation

1. Install dependencies:
```bash
npm install @pinia/nuxt pinia
```

2. The auth system will automatically initialize when the app starts via the `auth.client.ts` plugin.
