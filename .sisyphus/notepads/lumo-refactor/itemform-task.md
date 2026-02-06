## Task: Create ItemForm Component

### Status: COMPLETE

### Findings:
- ItemForm.tsx already exists at apps/web/src/components/ItemForm.tsx
- Component properly implements required props: item, onSubmit, onCancel
- Uses Item type from @lumo/api package
- Implements minimal form with name and description fields
- Uses @lumo/ui components (Button, Input, Textarea, Card)
- Includes proper async handling with submitting state
- Includes validation (required name, max lengths)
- TypeScript compilation passes without errors

### Implementation Details:
- Props interface matches requirements:
  - item: Item | null (optional item for editing)
  - onSubmit: async function accepting {name, description}
  - onCancel: optional callback
- Form fields:
  - name: required, max 255 chars, trimmed on submit
  - description: optional, max 1000 chars, trimmed on submit
- UI features:
  - Loading state during submission
  - Disabled inputs while submitting
  - Clear form after successful submission
  - Dynamic button text (Create vs Update)
  - Cancel button (conditional on onCancel prop)

### Verification:
- TypeScript type checking: PASSED
- Component exists at correct path: CONFIRMED
- Uses correct imports from @lumo/api: CONFIRMED
- Follows minimal CRUD requirements: CONFIRMED

### Component Code Summary:
```typescript
interface ItemFormProps {
  item: Item | null
  onSubmit: (data: { name: string; description: string }) => Promise<void>
  onCancel?: () => void
}
```

The component uses React hooks (useState, useEffect) and properly handles:
- Form state management
- Async submission with loading state
- Form reset after submission
- Validation (required name field)
- Accessibility (labels, disabled states)
