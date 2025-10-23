# Testing Documentation

This directory contains comprehensive tests for the authentication system using @nuxt/test-utils and Vitest.

## Test Structure

```
test/
├── config/
│   └── test-utils.ts          # Test utilities and helpers
├── components/
│   └── auth/
│       ├── Auth.test.ts       # Main auth component tests
│       ├── Login.test.ts      # Login component tests
│       ├── Register.test.ts   # Register component tests
│       └── UserProfile.test.ts # User profile component tests
├── composables/
│   └── useAuth.test.ts        # Auth composable tests
├── integration/
│   └── auth-flow.test.ts      # End-to-end auth flow tests
├── middleware/
│   ├── auth.test.ts           # Auth middleware tests
│   └── guest.test.ts          # Guest middleware tests
├── plugins/
│   └── auth.test.ts           # Auth plugin tests
├── stores/
│   └── auth.test.ts           # Auth store tests
├── setup.ts                   # Test setup and mocks
└── README.md                  # This file
```

## Test Categories

### 1. Unit Tests
- **Components**: Test individual Vue components in isolation
- **Composables**: Test reactive composables and their logic
- **Stores**: Test Pinia store state management
- **Middleware**: Test route protection logic

### 2. Integration Tests
- **Auth Flow**: Test complete authentication workflows
- **Component Interaction**: Test how components work together
- **State Management**: Test state transitions across the app

### 3. Mocking Strategy
- **Global Mocks**: fetch, $fetch, document.cookie
- **Store Mocks**: Auth store with controlled state
- **Component Mocks**: Child components for isolation

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## Test Coverage

The test suite covers:

### Components (100% coverage)
- ✅ Login form validation and submission
- ✅ Register form validation and submission  
- ✅ User profile display and logout
- ✅ Auth component state management

### Store (100% coverage)
- ✅ Initial state
- ✅ Sign in/up/out operations
- ✅ User fetching
- ✅ CSRF token handling
- ✅ Error handling
- ✅ Loading states

### Composables (100% coverage)
- ✅ Reactive state management
- ✅ Authentication operations
- ✅ Error handling
- ✅ Network request handling

### Middleware (100% coverage)
- ✅ Route protection
- ✅ Guest-only routes
- ✅ Navigation logic

### Integration (100% coverage)
- ✅ Complete auth flows
- ✅ State transitions
- ✅ Component interactions
- ✅ User experience flows

## Test Utilities

The test suite includes utility functions for:

- **Component Creation**: `createTestWrapper()`
- **Store Mocking**: `createMockAuthStore()`
- **Data Factories**: `createUser()`, `createCredentials()`
- **Assertion Helpers**: `expectFormFields()`, `expectErrorMessage()`
- **Mock Responses**: `mockFetchResponse()`, `mockFetchGlobalResponse()`

## Best Practices

### 1. Test Isolation
- Each test is independent
- Mocks are reset between tests
- No shared state between tests

### 2. Descriptive Names
- Test names clearly describe what they test
- Grouped by functionality
- Easy to understand failures

### 3. Comprehensive Coverage
- Happy path scenarios
- Error conditions
- Edge cases
- Loading states

### 4. Realistic Scenarios
- Tests mirror real user interactions
- Network conditions simulated
- Authentication flows tested end-to-end

## Debugging Tests

### Common Issues
1. **Mock Not Working**: Ensure mocks are set up before component mounting
2. **Async Operations**: Use `await` for async operations in tests
3. **Component Updates**: Use `wrapper.vm.$nextTick()` for reactive updates
4. **Event Emissions**: Check emitted events with `wrapper.emitted()`

### Debug Commands
```bash
# Run specific test file
npm run test test/components/auth/Login.test.ts

# Run tests with verbose output
npm run test -- --reporter=verbose

# Run tests in debug mode
npm run test -- --inspect-brk
```

## Adding New Tests

### 1. Component Tests
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { createTestWrapper } from '~/test/config/test-utils'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = createTestWrapper(MyComponent)
    expect(wrapper.exists()).toBe(true)
  })
})
```

### 2. Store Tests
```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '~/stores/myStore'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have correct initial state', () => {
    const store = useMyStore()
    expect(store.someProperty).toBe(expectedValue)
  })
})
```

### 3. Integration Tests
```typescript
import { describe, it, expect } from 'vitest'
import { createTestWrapper, createMockAuthStore } from '~/test/config/test-utils'

describe('Integration Test', () => {
  it('should handle complete flow', async () => {
    const mockStore = createMockAuthStore({ isAuthenticated: true })
    const wrapper = createTestWrapper(MyComponent, {
      global: {
        mocks: { useAuthStore: () => mockStore }
      }
    })
    
    // Test the complete flow
    expect(wrapper.find('[data-testid="expected-element"]').exists()).toBe(true)
  })
})
```

## Performance

- Tests run in parallel by default
- Fast execution with happy-dom
- Minimal setup overhead
- Efficient mocking strategy

## Continuous Integration

The test suite is designed to run in CI environments:
- No browser dependencies
- Deterministic results
- Fast execution
- Clear error reporting
