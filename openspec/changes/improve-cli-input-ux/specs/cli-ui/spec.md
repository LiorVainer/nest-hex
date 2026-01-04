# Spec: CLI UI Input Component

## MODIFIED Requirements

### Requirement: NameInput supports tab-completion for placeholder text

**Priority**: Medium
**Category**: User Experience

The `NameInput` component SHALL support tab-completion, allowing users to quickly fill the input field with the placeholder suggestion by pressing the Tab key. The placeholder remains visible as a suggestion until the user presses Tab.

#### Scenario: Placeholder shown as suggestion, not auto-filled
**Given** the NameInput component is displayed with placeholder text
**When** the component renders
**Then** the placeholder should be visible but not filled in the input
**And** the input should be empty
**And** the placeholder should remain as a visual suggestion

#### Scenario: User presses Tab on empty input
**Given** the NameInput component is displayed with placeholder "ObjectStorage"
**And** the input field is empty
**When** the user presses the Tab key
**Then** the input field should be filled with "ObjectStorage"
**And** the cursor should be positioned at the end of the text
**And** the placeholder should no longer be visible

#### Scenario: User presses Tab on partial input
**Given** the NameInput component shows placeholder "ObjectStorage"
**And** the user has typed "Obj"
**When** the user presses the Tab key
**Then** the input field should be filled with "ObjectStorage"
**And** the cursor should be positioned at the end of the text

#### Scenario: User can still submit with Enter after tab-fill
**Given** the user has pressed Tab to fill "ObjectStorage"
**When** the user presses Enter
**Then** the value "ObjectStorage" should be submitted via onSubmit callback
**And** the normal submission flow should proceed

#### Scenario: User can edit after tab-fill
**Given** the user has pressed Tab to fill "ObjectStorage"
**When** the user types additional characters or uses backspace
**Then** the input should behave as normal editable text
**And** subsequent Tab presses should not re-fill the placeholder

---

### Requirement: NameInput clears value between port and adapter steps

**Priority**: Medium
**Category**: User Experience

When using "full" generation mode, the `NameInput` component SHALL clear its input value when transitioning from the port name step to the adapter name step, preventing confusion and accidental duplicate names.

#### Scenario: Input clears when transitioning from port to adapter name
**Given** the user is in "full" generation mode
**And** the user has entered "ObjectStorage" as the port name
**And** the user submits the port name
**When** the UI transitions to the adapter name input
**Then** the input field should be empty
**And** the placeholder should show adapter examples (e.g., "S3, HttpRates")

#### Scenario: Input clears even if user goes back and forth
**Given** the user enters "ObjectStorage" as port name and submits
**And** transitions to adapter name input (which is now empty)
**And** the user presses ← to go back to port name
**When** the user moves forward again to adapter name
**Then** the adapter name input should be empty again

---

### Requirement: Display selected port name when prompting for adapter name

**Priority**: Medium
**Category**: User Experience

When using "full" generation mode and transitioning from port name to adapter name input, the CLI SHALL display the previously selected port name using a Badge component to provide context, and SHALL suggest `{portName}Implementation` as the placeholder.

#### Scenario: Adapter placeholder suggests portName + Implementation
**Given** the user is in "full" generation mode
**And** the user has entered and submitted "ObjectStorage" as the port name
**When** the UI transitions to the adapter name input step
**Then** the placeholder should show "ObjectStorageImplementation"
**And** the input field should be empty (not auto-filled)
**And** pressing Tab should fill the input with "ObjectStorageImplementation"

#### Scenario: Port name shown as badge during adapter name input
**Given** the user is in "full" generation mode
**And** the user has entered and submitted "ObjectStorage" as the port name
**When** the UI transitions to the adapter name input step
**Then** a badge displaying "Port: ObjectStorage" should be visible above the input field
**And** the badge should use blue color to maintain consistency with port identification

#### Scenario: Badge provides visual context
**Given** the adapter name input is displayed
**And** the port name badge shows "Port: ObjectStorage" in blue
**When** the user views the input prompt
**Then** they should clearly see what port they're creating an adapter for
**And** the visual hierarchy should make the badge secondary to the input prompt
**And** the blue color should help users recognize this as a port component

---

### Requirement: Summary displays badges for created components

**Priority**: Medium
**Category**: User Experience

The Summary component SHALL display Badge components showing which components were created (port, adapter, and/or service) to provide clear visual feedback about what was generated. Each component type SHALL use a distinct color to make them easily identifiable and memorable: blue for ports, green for adapters, and cyan for services.

#### Scenario: Port creation shows port badge in summary
**Given** the user has generated a port named "ObjectStorage"
**When** the Summary screen is displayed
**Then** a badge displaying "Port: ObjectStorage" should be visible
**And** the badge should use blue color to identify it as a port

#### Scenario: Adapter creation shows adapter badge in summary
**Given** the user has generated an adapter named "S3"
**When** the Summary screen is displayed
**Then** a badge displaying "Adapter: S3" should be visible
**And** the badge should use green color to identify it as an adapter

#### Scenario: Service creation shows service badge in summary
**Given** the user has generated a service named "FileUpload"
**When** the Summary screen is displayed
**Then** a badge displaying "Service: FileUpload" should be visible
**And** the badge should use cyan color to identify it as a service

#### Scenario: Full generation shows both port and adapter badges
**Given** the user has generated a full port+adapter
**And** the port name is "ObjectStorage"
**And** the adapter name is "S3"
**When** the Summary screen is displayed
**Then** a badge displaying "Port: ObjectStorage" should be visible with blue color
**And** a badge displaying "Adapter: S3" should be visible with green color
**And** both badges should be displayed together with proper spacing
**And** the distinct colors should make it easy to identify each component type

#### Scenario: Badge colors are consistent and memorable
**Given** the user has created multiple components across different sessions
**When** viewing summary screens
**Then** ports should always be displayed with blue badges
**And** adapters should always be displayed with green badges
**And** services should always be displayed with cyan badges
**And** the color scheme should help users quickly identify component types

---

### Requirement: NameInput maintains backward compatibility

**Priority**: High
**Category**: Stability

The modified `NameInput` component SHALL maintain all existing functionality and not break any current workflows.

#### Scenario: Enter key still submits input
**Given** the NameInput component is displayed
**When** the user types a name and presses Enter
**Then** the onSubmit callback should be called with the typed name
**And** the submission flow should proceed as before

#### Scenario: Empty input submission is still blocked
**Given** the NameInput component is displayed
**When** the user presses Enter without typing anything
**Then** the onSubmit callback should not be called
**And** no submission should occur

#### Scenario: Backspace and other keys work normally
**Given** the NameInput component is displayed
**And** the user has typed some text
**When** the user uses backspace, arrow keys, or other editing keys
**Then** the input should behave as a standard text input
**And** all standard editing operations should work

## Implementation Notes

### Technical Approach

1. **Controlled Input State**:
   - Add `useState` to manage input value internally in NameInput
   - Pass value to TextInput component's `value` prop
   - Handle onChange to update state

2. **Tab Key Handling**:
   - Use Ink's `useInput` hook to capture keyboard events
   - Check for Tab key press (`key.tab === true`)
   - Fill input with placeholder text when Tab is pressed
   - Update controlled state to reflect new value

3. **Step Transition Reset**:
   - Option A: Use `key` prop on TextInput that changes between steps
   - Option B: Use `useEffect` to detect step prop changes and reset state
   - Recommended: Option A (simpler, forces remount)

### Code Structure

```typescript
// Pseudo-code showing the approach
function NameInput({ type, step, onSubmit }) {
  const [value, setValue] = useState('')
  const placeholder = getPlaceholder(type, step)

  // Handle Tab key
  useInput((input, key) => {
    if (key.tab && !input) {
      setValue(placeholder)
    }
  })

  // Reset on step change (for 'full' type)
  const stepKey = type === 'full' ? step : 'single'

  return (
    <TextInput
      key={stepKey} // Forces remount on step change
      value={value}
      onChange={setValue}
      onSubmit={onSubmit}
      placeholder={placeholder}
    />
  )
}
```

### Files to Modify

- `src/cli/ui/components/NameInput.tsx` - Main changes
- Possibly `src/cli/commands/generate.command.tsx` - If state management needs adjustment

### Dependencies

- `@inkjs/ui` - TextInput and Badge components (already a dependency)
- `ink` - useInput hook and Box/Text components (already used in generate.command.tsx)
