# Tasks: Improve CLI Input UX

## Implementation Tasks

### 1. Add controlled input state to NameInput component
- [x] Add useState for managing input value
- [x] Connect input value to TextInput component
- [x] Ensure input is controlled (value prop set)

### 2. Implement Tab-to-fill functionality
- [x] Add useInput hook to NameInput component
- [x] Handle Tab key press event
- [x] Fill input with placeholder text when Tab is pressed
- [x] Only fill if input is empty or partial
- [x] Preserve cursor position after fill

### 3. Add input reset on step transition
- [x] Add key prop to TextInput to force remount on step change
- [x] Or: Add useEffect to reset internal state when step changes
- [x] Verify input clears when moving from port to adapter name

### 4. Implement dynamic placeholder for adapter name
- [x] Add logic to generate `{portName}Implementation` placeholder in 'full' mode
- [x] Pass portName to NameInput component for dynamic placeholder generation
- [x] Ensure placeholder updates correctly based on selected port name
- [x] Verify placeholder only shows as suggestion, not auto-filled

### 5. Add Badge display for selected port name
- [x] Import Badge component from @inkjs/ui
- [x] Add portName prop to NameInput (for 'full' type with step='adapter')
- [x] Display Badge with port name when showing adapter input
- [x] Use blue color for port badge to maintain consistency
- [x] Position badge above input field

### 6. Add Summary component badges for created components
- [x] Import Badge component from @inkjs/ui in Summary component
- [x] Add props to Summary: portName, adapterName, serviceName (optional)
- [x] Display "Port: {name}" badge when port was created (blue color)
- [x] Display "Adapter: {name}" badge when adapter was created (green color)
- [x] Display "Service: {name}" badge when service was created (cyan color)
- [x] Ensure color consistency: blue=port, green=adapter, cyan=service
- [x] Ensure proper spacing between multiple badges

### 7. Update parent component state management
- [x] Pass portName prop to NameInput when on adapter step
- [x] Ensure generate.command.tsx handles name changes correctly
- [x] Verify state flow between NameInput and GenerateUI
- [x] Pass component names to Summary component for badge display

## Testing Tasks

### 8. Manual testing - Tab-to-fill functionality
- [ ] Test Tab key fills placeholder in port name input (empty input)
- [ ] Test Tab key fills placeholder in adapter name input (empty input)
- [ ] Test Tab key fills placeholder on partial input (e.g., "Obj" → "ObjectStorage")
- [ ] Test placeholder shown as suggestion, not auto-filled on render
- [ ] Test cursor positioned at end after tab-fill
- [ ] Test normal Enter key submission still works after tab-fill
- [ ] Test backspace and editing after tab-fill works correctly

### 9. Manual testing - Input reset and dynamic placeholder
- [ ] Test input clears when moving from port to adapter in "full" mode
- [ ] Test input clears even when going back and forth between steps
- [ ] Test adapter placeholder shows `{portName}Implementation` format
- [ ] Test "ObjectStorage" port → "ObjectStorageImplementation" placeholder
- [ ] Test placeholder remains suggestion only (not auto-filled)

### 10. Manual testing - Badge displays
- [ ] Test port name badge displays during adapter name input
- [ ] Test port badge uses blue color and positioned above input
- [ ] Test badge shows "Port: {name}" format
- [ ] Test Summary shows port badge after port creation (blue color)
- [ ] Test Summary shows adapter badge after adapter creation (green color)
- [ ] Test Summary shows service badge after service creation (cyan color)
- [ ] Test Summary shows both port and adapter badges for "full" generation
- [ ] Test badge color consistency: blue=port, green=adapter, cyan=service
- [ ] Test badge colors are distinct and easily identifiable
- [ ] Test badge spacing looks good with multiple badges
- [ ] Test color scheme is memorable across multiple uses

### 11. Manual testing - Backward compatibility
- [ ] Test Enter key still submits input normally
- [ ] Test empty input submission is still blocked
- [ ] Test backspace and arrow keys work normally
- [ ] Test existing CLI args (--name, --port-name, etc.) still work
- [ ] Test all generation modes (port, adapter, service, full) still work

### 12. Type checking
- [x] Run `bun run type-check` to verify no TypeScript errors
- [x] Verify all props and types are correct
- [x] Verify new props (portName, adapterName, serviceName) are properly typed

## Validation Tasks

### 13. OpenSpec validation
- [x] Run `openspec validate improve-cli-input-ux --strict`
- [x] Resolve any validation issues

### 14. Pre-commit checks
- [x] Run `bun run lint` to verify code style
- [x] Run `bun run type-check` to verify compilation
- [x] Run `npx vibechck .` to detect any issues

## Dependencies

- Task 2 depends on Task 1 (need controlled state before handling Tab)
- Task 3 depends on Task 1 (need state management for reset)
- Task 4 depends on Task 7 (need portName from parent state)
- Task 5 depends on Task 4 (need portName to show in badge)
- Task 6 is independent (can be done in parallel with Tasks 1-5)
- Task 7 coordinates state across all components
- Tasks 8-11 depend on Tasks 1-7 (need implementation before testing)
- Tasks 12-14 are validation tasks (run after implementation and testing)

## Estimated Complexity

- **Medium change**: Implementation across multiple components
- **Files modified**: 3 files (NameInput.tsx, Summary.tsx, generate.command.tsx)
- **Lines of code**: ~50-80 lines added/modified
- **New imports**: Badge component from @inkjs/ui
- **State changes**: Additional props passed between components
