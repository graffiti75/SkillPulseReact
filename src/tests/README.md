# SkillPulse Testing Documentation

## Overview
Comprehensive test suite for SkillPulse task management application covering all user interactions: creating, editing, and deleting tasks.

## Test Setup

### Installing Dependencies

```bash
# Install testing dependencies
npm install --save-dev vitest @vitest/ui @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Or use the provided `package_with_tests.json`:

```bash
cp package_with_tests.json package.json
npm install
```

### Configuration Files

1. **vitest.config.js** - Vitest configuration
2. **src/tests/setup.js** - Test setup and global mocks
3. **src/tests/testUtils.js** - Shared test utilities and mock data

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test TaskForm.test

# Run tests matching pattern
npm test -- --grep="Creating"
```

## Test Structure

```
src/tests/
├── setup.js                          # Global test setup
├── testUtils.js                      # Mock data and utilities
├── components/
│   ├── TaskForm.test.jsx            # Task creation and editing tests
│   ├── TaskCard.test.jsx            # Task display and delete button tests
│   └── DeleteConfirmation.test.jsx  # Delete confirmation dialog tests
└── integration/
    └── TaskWorkflow.test.jsx        # Complete user workflow tests
```

## Test Coverage

### 1. TaskForm.test.jsx (Creating & Editing Tasks)

**Creating a New Task:**
- ✅ Renders empty form for new tasks
- ✅ Allows typing task description
- ✅ Shows autocomplete suggestions while typing
- ✅ Allows selecting from suggestions
- ✅ Opens date/time picker for start time
- ✅ Opens date/time picker for end time
- ✅ Disables save button when fields are empty
- ✅ Enables save button when all fields are filled
- ✅ Calls onSave with correct data
- ✅ Closes form after successful save
- ✅ Shows loading state while saving
- ✅ Can close form via back button
- ✅ Can close form via overlay click

**Editing an Existing Task:**
- ✅ Pre-populates form with task data
- ✅ Shows task ID field (disabled)
- ✅ Shows "Edit Task" title
- ✅ Allows modifying description
- ✅ Allows changing start time
- ✅ Allows changing end time
- ✅ Shows "Save Changes" button
- ✅ Calls onSave with updated data
- ✅ Shows loading state while saving

**Form Validation:**
- ✅ Validates required fields
- ✅ Prevents saving incomplete forms
- ✅ Shows appropriate error states

### 2. TaskCard.test.jsx (Task Display & Actions)

**Task Display:**
- ✅ Renders task ID
- ✅ Renders task description
- ✅ Renders formatted start time
- ✅ Renders formatted end time
- ✅ Applies animation delay based on index

**Edit Button:**
- ✅ Renders edit button
- ✅ Calls onEdit with task data when clicked
- ✅ Has correct styling

**Delete Button:**
- ✅ Renders delete button
- ✅ Calls onDelete with task data when clicked
- ✅ Has danger styling
- ✅ Is visually distinct from edit button

### 3. DeleteConfirmation.test.jsx (Delete Confirmation)

**Dialog Display:**
- ✅ Shows when isOpen is true
- ✅ Hides when isOpen is false
- ✅ Displays task description
- ✅ Shows warning message
- ✅ Renders cancel button
- ✅ Renders delete button

**User Interactions:**
- ✅ Calls onClose when clicking Cancel
- ✅ Calls onClose when clicking overlay
- ✅ Calls onConfirm when clicking Delete
- ✅ Doesn't close when clicking modal content
- ✅ Has correct button styling (secondary/danger)

### 4. TaskWorkflow.test.jsx (Integration Tests)

**Complete Task Creation Flow:**
- ✅ Opens form via FAB button
- ✅ Fills in all fields
- ✅ Saves task successfully
- ✅ Shows success alert
- ✅ Updates task list
- ✅ Handles save errors

**Complete Task Editing Flow:**
- ✅ Opens edit form from task card
- ✅ Shows pre-populated data
- ✅ Allows modifications
- ✅ Saves changes successfully
- ✅ Shows success alert
- ✅ Updates task in list
- ✅ Handles update errors

**Complete Task Deletion Flow:**
- ✅ Opens delete confirmation
- ✅ Allows canceling deletion
- ✅ Confirms and deletes task
- ✅ Shows success alert
- ✅ Removes task from list
- ✅ Handles delete errors

**Task List Display:**
- ✅ Loads and displays tasks
- ✅ Shows loading state
- ✅ Shows empty state
- ✅ Displays task count
- ✅ Shows user information

## Test Utilities

### Mock Data (`testUtils.js`)

```javascript
import { mockTask, mockTasks } from './testUtils';

// Single task
const task = mockTask;

// Multiple tasks
const tasks = mockTasks;
```

### Mock Functions

```javascript
import { 
  mockFirebaseFunctions, 
  setupSuccessfulMocks, 
  setupFailedMocks 
} from './testUtils';

// Setup successful API responses
setupSuccessfulMocks();

// Setup failed API responses
setupFailedMocks();

// Reset mocks between tests
resetMocks();
```

## Writing New Tests

### Example Test Structure

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('ComponentName', () => {
  beforeEach(() => {
    // Setup before each test
  });

  describe('Feature Group', () => {
    it('should do something specific', async () => {
      const user = userEvent.setup();
      
      // Arrange
      render(<Component />);
      
      // Act
      await user.click(screen.getByText('Button'));
      
      // Assert
      expect(screen.getByText('Result')).toBeInTheDocument();
    });
  });
});
```

### Best Practices

1. **Use descriptive test names** - Clearly state what is being tested
2. **Follow AAA pattern** - Arrange, Act, Assert
3. **Test user behavior** - Not implementation details
4. **Use userEvent** - More realistic than fireEvent
5. **Wait for async operations** - Use waitFor for promises
6. **Clean up** - Tests should not affect each other
7. **Mock external dependencies** - Firebase, API calls, etc.
8. **Test edge cases** - Empty states, errors, loading states

## Common Testing Patterns

### Testing Async Operations

```javascript
it('should handle async save', async () => {
  const user = userEvent.setup();
  render(<TaskForm onSave={mockOnSave} />);
  
  await user.click(screen.getByText('Save'));
  
  await waitFor(() => {
    expect(mockOnSave).toHaveBeenCalled();
  });
});
```

### Testing User Input

```javascript
it('should update input value', async () => {
  const user = userEvent.setup();
  render(<TaskForm />);
  
  const input = screen.getByPlaceholderText('Enter description');
  await user.type(input, 'New task');
  
  expect(input).toHaveValue('New task');
});
```

### Testing Conditional Rendering

```javascript
it('should show form when open', () => {
  render(<TaskForm isOpen={true} />);
  expect(screen.getByText('Add Task')).toBeInTheDocument();
});

it('should hide form when closed', () => {
  const { container } = render(<TaskForm isOpen={false} />);
  expect(container.firstChild).toBeNull();
});
```

### Testing Error States

```javascript
it('should show error message on failure', async () => {
  mockOnSave.mockRejectedValue(new Error('Save failed'));
  
  render(<TaskForm onSave={mockOnSave} />);
  // ... trigger save ...
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });
});
```

## Debugging Tests

### View Rendered HTML

```javascript
import { render, screen } from '@testing-library/react';

const { debug } = render(<Component />);
debug(); // Prints current DOM
```

### Check What's Rendered

```javascript
screen.debug(); // Print current screen
console.log(screen.getAllByRole('button')); // List all buttons
```

### Run Single Test

```bash
npm test -- --grep="specific test name"
```

### Run with Verbose Output

```bash
npm test -- --reporter=verbose
```

## Coverage Reports

After running `npm run test:coverage`, view the coverage report:

```bash
# Open HTML coverage report
open coverage/index.html
```

**Coverage Goals:**
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
```

## Troubleshooting

### Tests Timing Out

Increase timeout in vitest.config.js:
```javascript
test: {
  testTimeout: 10000, // 10 seconds
}
```

### Firebase Mock Issues

Ensure Firebase is properly mocked in setup.js:
```javascript
vi.mock('../firebase/config', () => ({
  db: {},
  auth: {},
}));
```

### Async Issues

Always use `waitFor` for async operations:
```javascript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});
```

## Next Steps

1. **Add E2E Tests** - Use Playwright or Cypress
2. **Add Visual Regression Tests** - Use Chromatic or Percy
3. **Add Performance Tests** - Use Lighthouse CI
4. **Add Accessibility Tests** - Use axe-core
5. **Increase Coverage** - Aim for >90% coverage

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
- [User Event](https://testing-library.com/docs/user-event/intro)

## Summary

This test suite provides comprehensive coverage of all user interactions in the SkillPulse application:

✅ **70+ test cases** covering all user flows  
✅ **Unit tests** for individual components  
✅ **Integration tests** for complete workflows  
✅ **Mock utilities** for consistent testing  
✅ **Documentation** for maintenance and expansion  

Run `npm test` to verify everything works!
