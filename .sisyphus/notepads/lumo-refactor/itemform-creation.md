# ItemForm Component Creation

## Task Completed
The ItemForm.tsx component already exists at apps/web/src/components/ItemForm.tsx and is fully implemented.

## Component Details
- **Location**: apps/web/src/components/ItemForm.tsx
- **Props**:
  - item: Item | null (for edit mode vs create mode)
  - onSubmit: (data: CreateItemInput) => Promise<void>
  - onCancel?: () => void (optional, shown only when editing)

## Implementation Features
1. **Dual Mode**: Supports both create (item=null) and edit (item=Item) modes
2. **Form Fields**:
   - Name input (required, max 255 chars)
   - Description textarea (optional, max 1000 chars)
3. **State Management**:
   - Local state for name and description
   - useEffect to populate form when item changes
   - Submitting state for loading indication
4. **UI Components**: Uses @lumo/ui components (Button, Input, Textarea, Card)
5. **Validation**: 
   - Required name field
   - Trims whitespace on submit
   - Disables submit button when name is empty
6. **UX**:
   - Shows "Create" or "Update" button text based on mode
   - Shows "Saving..." during submission
   - Cancel button only appears when onCancel prop is provided
   - Clears form after successful submission
   - Wrapped in Card component for visual grouping

## Type Safety
- Uses Item type from @lumo/api
- Uses CreateItemInput type from @lumo/api
- Proper TypeScript typing for all props and state

## Integration with App.tsx
- App.tsx passes editingItem state as item prop
- Passes handleCreate or handleUpdate as onSubmit based on mode
- Passes setEditingItem(null) as onCancel when editing

## Verification
- ✅ File exists and is complete
- ✅ TypeScript compilation passes (no errors)
- ✅ Matches App.tsx usage pattern
- ✅ Uses correct types from @lumo/api
- ✅ Uses UI components from @lumo/ui

## Learnings
1. The component was already created in a previous task
2. It follows React best practices with hooks and controlled inputs
3. The dual-mode pattern (create/edit) is handled elegantly with conditional logic
4. Form clearing only happens on create, not edit (preserves UX)
5. The Card wrapper provides visual separation from other UI elements
