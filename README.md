# Forge Angular Form Fields

Signal Forms integration for Tyler Forge Angular components. Drop-in directives that make Forge web components work natively with Angular's `@angular/forms/signals` API — handling validation display, error rendering, constraint propagation, and state management automatically.

## Why?

Angular Signal Forms introduce a declarative, signal-based approach to forms. But Forge components are web components — they don't implement `FormValueControl` or `FormCheckboxControl` out of the box. This library bridges that gap:

- Wraps each Forge component with a directive that implements the Signal Forms control interface
- Automatically renders validation errors in the component's `support-text` slot
- Syncs `invalid`, `disabled`, `readonly`, `required`, and `pending` states
- Propagates constraints (`min`, `max`, `minLength`, `maxLength`) from schema to component
- Zero boilerplate — just add `[formField]` and bind your schema field

## Installation

```bash
npm install forge-angular-form-fields
```

### Peer Dependencies

| Package | Version |
|---------|---------|
| `@angular/common` | >= 21.0.0 |
| `@angular/core` | >= 21.0.0 |
| `@tylertech/forge` | ^3.13.1 |
| `@tylertech/forge-core` | ^3.3.1 |
| `@tylertech/forge-angular` | ^7.1.0 |

## Quick Start

```typescript
import { form, FormField, required, minLength } from '@angular/forms/signals';
import {
  ForgeTextFieldFormFieldDirective,
  ForgeCheckboxFormDirective,
  ForgeSelectFormFieldDirective,
  FormSelectComponent,
} from 'forge-angular-form-fields';

@Component({
  imports: [
    FormField,
    ForgeTextFieldFormFieldDirective,
    ForgeCheckboxFormDirective,
    ForgeSelectFormFieldDirective,
    FormSelectComponent,
    ForgeTextFieldModule,
    ForgeCheckboxModule,
  ],
  template: `
    <forge-text-field [formField]="demoForm.username">
      <input type="text" id="username" />
      <label for="username">Username</label>
    </forge-text-field>

    <forge-checkbox [formField]="demoForm.acceptTerms">
      I accept the terms
    </forge-checkbox>

    <forge-select [formField]="demoForm.country" label="Country">
      <forge-option value="us">United States</forge-option>
      <forge-option value="ca">Canada</forge-option>
    </forge-select>
  `,
})
export class MyFormComponent {
  protected readonly formModel = signal({
    username: '',
    acceptTerms: false,
    country: null as string | null,
  });

  protected readonly demoForm = form(this.formModel, (schema) => {
    required(schema.username, { message: 'Username is required' });
    minLength(schema.username, 3, { message: 'At least 3 characters' });
    required(schema.acceptTerms, { message: 'You must accept the terms' });
    required(schema.country, { message: 'Please select a country' });
  });
}
```

That's it. Validation errors automatically render below each field when it's touched and invalid.

## Available Directives

### FormValueControl Directives

These directives handle value-based form fields where the user selects or enters a value.

| Directive | Selector | Value Type |
|-----------|----------|------------|
| `ForgeTextFieldFormFieldDirective` | `forge-text-field[formField]:not([number])` | `string` |
| `ForgeTextFieldNumberFormFieldDirective` | `forge-text-field[formField][number]` | `number \| null` |
| `ForgeSelectFormFieldDirective` | `forge-select[formField]:not([multiple])` | `T \| null` |
| `ForgeSelectMultipleFormFieldDirective` | `forge-select[formField][multiple]` | `T[] \| null` |
| `ForgeAutocompleteFormFieldDirective` | `forge-autocomplete[formField]:not([multiple])` | `T \| null` |
| `ForgeAutocompleteMultipleFormFieldDirective` | `forge-autocomplete[formField][multiple]` | `T[] \| null` |
| `ForgeSliderFormFieldDirective` | `forge-slider[formField]:not([range])` | `number` |
| `ForgeSliderRangeFormFieldDirective` | `forge-slider[formField][range]` | `SliderRange` |
| `ForgeButtonToggleGroupFormFieldDirective` | `forge-button-toggle-group[formField]:not([multiple])` | `T \| null` |
| `ForgeButtonToggleGroupMultipleFormFieldDirective` | `forge-button-toggle-group[formField][multiple]` | `T[] \| null` |
| `ForgeDatePickerFormFieldDirective` | `forge-date-picker[formField]` | `Date \| null` |
| `ForgeDateRangePickerFormFieldDirective` | `forge-date-range-picker[formField]` | `DateRange \| null` |
| `ForgeTimePickerFormFieldDirective` | `forge-time-picker[formField]` | `Date \| null` |
| `ForgeChipSetFormFieldDirective` | `forge-chip-set[formField]` | `T[] \| null` |

### FormCheckboxControl Directives

These directives handle boolean toggle states.

| Directive | Selector |
|-----------|----------|
| `ForgeCheckboxFormDirective` | `forge-checkbox[formField]` |
| `ForgeSwitchFormFieldDirective` | `forge-switch[formField]` |
| `ForgeChipFormFieldDirective` | `forge-chip[formField]` |

### Wrapper Components

Some Forge components define `min`/`max` inputs with types that conflict with Signal Forms constraint propagation. These wrapper components remove those inputs so the form schema controls them instead.

| Component | Replaces |
|-----------|----------|
| `FormSelectComponent` | `SelectComponent` |
| `FormDatePickerComponent` | `DatePickerComponent` |
| `FormDateRangePickerComponent` | `DateRangePickerComponent` |
| `FormTimePickerComponent` | `TimePickerComponent` |
| `FormSliderComponent` | `SliderComponent` |

Use the wrapper components in place of the `@tylertech/forge-angular` components when binding `[formField]`.

## Usage Examples

### Text Field (string)

```html
<forge-text-field [formField]="myForm.name">
  <input type="text" id="name" />
  <label for="name">Full Name</label>
</forge-text-field>
```

### Text Field (number)

Add the `number` attribute to opt into numeric parsing:

```html
<forge-text-field number [formField]="myForm.age">
  <input type="number" id="age" />
  <label for="age">Age</label>
</forge-text-field>
```

### Select (single and multiple)

```html
<!-- Single selection -->
<forge-select [formField]="myForm.country" label="Country">
  <forge-option value="us">United States</forge-option>
  <forge-option value="ca">Canada</forge-option>
</forge-select>

<!-- Multiple selection -->
<forge-select multiple [formField]="myForm.countries" label="Countries">
  <forge-option value="us">United States</forge-option>
  <forge-option value="ca">Canada</forge-option>
</forge-select>
```

### Autocomplete

```html
<forge-autocomplete [formField]="myForm.color" [filter]="filterColors">
  <forge-text-field>
    <input type="text" id="color" />
    <label for="color">Favorite Color</label>
  </forge-text-field>
</forge-autocomplete>
```

### Checkbox and Switch

```html
<forge-checkbox [formField]="myForm.acceptTerms">
  I accept the terms and conditions
</forge-checkbox>

<forge-switch [formField]="myForm.notifications">
  Enable notifications
</forge-switch>
```

### Slider

```html
<!-- Single value -->
<forge-slider [formField]="myForm.volume"></forge-slider>

<!-- Range -->
<forge-slider range [formField]="myForm.priceRange"></forge-slider>
```

```typescript
import { SliderRange } from 'forge-angular-form-fields';

// In your form model:
volume: 50,
priceRange: { start: 20, end: 80 } as SliderRange,
```

### Button Toggle Group

```html
<!-- Single selection -->
<forge-button-toggle-group [formField]="myForm.size">
  <forge-button-toggle value="sm">Small</forge-button-toggle>
  <forge-button-toggle value="md">Medium</forge-button-toggle>
  <forge-button-toggle value="lg">Large</forge-button-toggle>
</forge-button-toggle-group>

<!-- Multiple selection -->
<forge-button-toggle-group multiple [formField]="myForm.sizes">
  <forge-button-toggle value="sm">Small</forge-button-toggle>
  <forge-button-toggle value="md">Medium</forge-button-toggle>
  <forge-button-toggle value="lg">Large</forge-button-toggle>
</forge-button-toggle-group>
```

### Date Picker and Date Range Picker

```html
<forge-date-picker [formField]="myForm.startDate">
  <forge-text-field>
    <input type="text" id="start" />
    <label for="start">Start Date</label>
  </forge-text-field>
</forge-date-picker>

<forge-date-range-picker [formField]="myForm.dateRange">
</forge-date-range-picker>
```

```typescript
import { DateRange } from 'forge-angular-form-fields';

// In your form model:
dateRange: null as DateRange | null,
// DateRange is { from: Date | null; to: Date | null }
```

### Time Picker

```html
<forge-time-picker [formField]="myForm.meetingTime">
</forge-time-picker>
```

### Chip and Chip Set

```html
<!-- Single chip (boolean toggle) -->
<forge-chip [formField]="myForm.featured">Featured</forge-chip>

<!-- Chip set (multi-select) -->
<forge-chip-set [formField]="myForm.tags">
  <forge-chip value="angular">Angular</forge-chip>
  <forge-chip value="react">React</forge-chip>
  <forge-chip value="vue">Vue</forge-chip>
</forge-chip-set>
```

## How It Works

### Validation Display

All directives that wrap components with a `support-text` slot (text fields, selects, autocompletes, date pickers) automatically render validation errors when the field is **touched and invalid**:

- Single error: rendered as plain text
- Multiple errors: rendered as a `<ul>` list

Errors are cleared automatically when the field becomes valid or untouched.

### State Synchronization

Each directive uses Angular `effect()` to reactively sync form state:

```
Schema constraint (required, min, max, ...) --> Component attribute
Form state (invalid, disabled, pending)     --> Component property
User interaction (input, blur, change)      --> Form model (value, touched, dirty)
```

### Pending State

For directives on components that support it (text field, autocomplete), a `forge-circular-progress` spinner is rendered in the trailing slot while `pending()` is `true` — useful for async validators.

## Exported Types

```typescript
export interface SliderRange {
  start: number;
  end: number;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}
```

## Development

### Prerequisites

This project requires pnpm 11+. The easiest way to install it is via corepack (bundled with Node 24):

```bash
corepack enable
corepack install
```

### Setup

```bash
pnpm install
pnpm exec playwright install
```

### Building

```bash
pnpm build
```

### Testing

Tests use Angular's built-in Vitest runner:

```bash
pnpm test
```

### Playground

A demo app is included under `projects/playground` for interactive development and testing.
