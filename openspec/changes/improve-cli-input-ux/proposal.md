# Proposal: Improve CLI Input UX

## Problem Statement

The CLI name input component currently has two UX issues that reduce usability:

1. **No tab-completion for placeholders**: The input shows helpful placeholder examples (e.g., "ObjectStorage, CurrencyRates"), but users cannot quickly use these as starting points by pressing Tab
2. **Input persistence between steps**: When generating a full port+adapter, the input field retains the previous value when moving from port name to adapter name, which can cause confusion or accidental duplicate names

## Proposed Solution

Enhance the CLI input and feedback experience with four improvements:

1. **Tab-to-fill placeholder**: When the user presses the Tab key on an empty or partially-filled input, automatically fill the input with the placeholder text suggestion
2. **Input reset on step change**: When transitioning from port name input to adapter name input (in "full" mode), clear the input field to prevent confusion
3. **Display selected port name**: When prompting for adapter name, show the previously selected port name using a Badge component for context, and suggest `{portName}Implementation` as the placeholder
4. **Summary badges with distinct colors**: Display badges for all created components (port/adapter/service) with consistent, memorable colors (blue for ports, green for adapters, cyan for services)

## Benefits

- **Faster workflow**: Users can quickly adopt suggested naming patterns with a single Tab press
- **Better discoverability**: New users learn naming conventions by seeing and using examples
- **Fewer errors**: Clearing input between steps prevents accidental duplicate names
- **Better context**: Displaying the port name while prompting for adapter name helps users understand the relationship
- **Improved visual feedback**: Distinct badge colors make it easy to identify component types at a glance
- **Memorable color scheme**: Consistent color coding helps users build mental models (blue=port, green=adapter, cyan=service)
- **Improved UX consistency**: Aligns with common CLI patterns (bash/zsh tab-completion)

## Scope

### In Scope
- Modify `NameInput` component to handle Tab key press
- Add state management for input value in `NameInput`
- Reset input when transitioning between port/adapter name steps in "full" mode
- Add dynamic placeholder generation (`{portName}Implementation` pattern)
- Add Badge component to display selected port name during adapter name input
- Modify `Summary` component to display badges for created components
- Implement consistent color scheme: blue for ports, green for adapters, cyan for services
- Maintain existing placeholder display behavior

### Out of Scope
- Multi-suggestion tab-completion (cycling through multiple options)
- Autocomplete from existing ports/adapters
- Changes to validation logic
- Custom color configuration (colors are fixed for consistency)

## Trade-offs

### Considered Approaches

**1. Tab-to-fill (Selected)**
- ✅ Simple, predictable behavior
- ✅ Aligns with user expectations from shell tab-completion
- ⚠️ Single suggestion only (no cycling)

**2. Multiple suggestions with cycling**
- ✅ More flexible for advanced users
- ❌ More complex implementation
- ❌ Requires designing suggestion priority/ordering
- ❌ Out of scope for this change

**3. Autocomplete from existing code**
- ✅ Would provide real, existing names
- ❌ Requires parsing all ports/adapters
- ❌ Performance concerns
- ❌ Out of scope for this change

## Dependencies

- No new dependencies required
- Uses existing `@inkjs/ui` TextInput component
- Uses existing `ink` useInput hook for keyboard handling

## Risks

- **Minor**: Tab key might conflict with other terminal behaviors in some environments
  - Mitigation: This is standard CLI behavior and well-supported by Ink

## Success Criteria

- [ ] User can press Tab to fill input with placeholder text
- [ ] Input field clears when moving from port name to adapter name in "full" mode
- [ ] Existing functionality remains unchanged (backward compatible)
- [ ] No TypeScript errors
- [ ] All existing tests pass
