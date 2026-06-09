import { Component, resource, signal, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  form,
  FormField,
  required,
  disabled,
  readonly,
  validateAsync,
} from '@angular/forms/signals';
import {
  ForgeAutocompleteFormFieldDirective,
  ForgeAutocompleteMultipleFormFieldDirective,
} from './autocomplete-form-field';
import {
  ForgeAutocompleteModule,
  ForgeTextFieldModule,
  AutocompleteComponent,
  TextFieldComponent,
} from '@tylertech/forge-angular';

@Component({
  imports: [
    FormField,
    ForgeAutocompleteFormFieldDirective,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
  ],
  template: `
    <forge-autocomplete [formField]="testForm.selectedOption">
      <forge-text-field>
        <input type="text" id="test-input" />
        <label for="test-input">Test</label>
      </forge-text-field>
    </forge-autocomplete>
  `,
})
class TestHostComponent {
  formModel = signal<{ selectedOption: string | null }>({
    selectedOption: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedOption, { message: 'Selection is required' });
  });
}

@Component({
  imports: [
    FormField,
    ForgeAutocompleteFormFieldDirective,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
  ],
  template: `
    <forge-autocomplete [formField]="testForm.selectedOption">
      <forge-text-field>
        <input type="text" id="test-input" />
        <label for="test-input">Test</label>
      </forge-text-field>
    </forge-autocomplete>
  `,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ selectedOption: string | null }>({
    selectedOption: null,
  });

  testForm = form(this.formModel, (schema) => {
    disabled(schema.selectedOption, () => this.isDisabled());
  });
}

@Component({
  imports: [
    FormField,
    ForgeAutocompleteFormFieldDirective,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
  ],
  template: `
    <forge-autocomplete [formField]="testForm.selectedOption">
      <forge-text-field>
        <input type="text" id="test-input" />
        <label for="test-input">Test</label>
      </forge-text-field>
    </forge-autocomplete>
  `,
})
class ReadonlyTestHostComponent {
  isReadonly = signal(false);
  formModel = signal<{ selectedOption: string | null }>({
    selectedOption: null,
  });

  testForm = form(this.formModel, (schema) => {
    readonly(schema.selectedOption, () => this.isReadonly());
  });
}

@Component({
  imports: [
    FormField,
    ForgeAutocompleteFormFieldDirective,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
  ],
  template: `
    <forge-autocomplete [formField]="testForm.selectedOption">
      <forge-text-field>
        <input type="text" id="test-input" />
        <label for="test-input">Test</label>
      </forge-text-field>
    </forge-autocomplete>
  `,
})
class MultipleErrorsTestHostComponent {
  formModel = signal<{ selectedOption: string | null }>({
    selectedOption: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedOption, { message: 'Selection is required' });
    required(schema.selectedOption, { message: 'Must pick a valid option' });
  });
}

@Component({
  imports: [
    FormField,
    ForgeAutocompleteFormFieldDirective,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
  ],
  template: `
    <forge-autocomplete [formField]="testForm.selectedOption">
      <forge-text-field>
        <input type="text" id="test-input" />
        <label for="test-input">Test</label>
      </forge-text-field>
    </forge-autocomplete>
  `,
})
class PendingTestHostComponent {
  formModel = signal<{ selectedOption: string | null }>({
    selectedOption: null,
  });

  resolveValidation!: (value: boolean) => void;

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedOption);
    validateAsync(schema.selectedOption, {
      params: (ctx) => ctx.value(),
      factory: (params: Signal<string | null | undefined>) =>
        resource({
          params: () => params(),
          loader: () =>
            new Promise<boolean>((resolve) => {
              this.resolveValidation = resolve;
            }),
        }),
      onError: () => [],
      onSuccess: () => [],
    });
  });
}

@Component({
  imports: [
    FormField,
    ForgeAutocompleteFormFieldDirective,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
  ],
  template: `
    <forge-autocomplete [formField]="testForm.selectedOption">
      <forge-text-field>
        <span slot="start" id="existing-icon">icon</span>
        <input type="text" id="test-input" />
        <label for="test-input">Test</label>
      </forge-text-field>
    </forge-autocomplete>
  `,
})
class PendingWithExistingSlotTestHostComponent {
  formModel = signal<{ selectedOption: string | null }>({
    selectedOption: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedOption);
    validateAsync(schema.selectedOption, {
      params: (ctx) => ctx.value(),
      factory: (params: Signal<string | null | undefined>) =>
        resource({
          params: () => params(),
          loader: () => new Promise<boolean>(() => {}),
        }),
      onError: () => [],
      onSuccess: () => [],
    });
  });
}

@Component({
  imports: [
    FormField,
    ForgeAutocompleteMultipleFormFieldDirective,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
  ],
  template: `
    <forge-autocomplete multiple [formField]="testForm.selectedOptions">
      <forge-text-field>
        <input type="text" id="test-input" />
        <label for="test-input">Test</label>
      </forge-text-field>
    </forge-autocomplete>
  `,
})
class MultipleTestHostComponent {
  formModel = signal<{ selectedOptions: string[] | null }>({
    selectedOptions: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedOptions, { message: 'At least one option is required' });
  });
}

describe('ForgeAutocompleteFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeAutocompleteFormFieldDirective<string>;
    let autocompleteComponent: AutocompleteComponent;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeAutocompleteFormFieldDirective);
      autocompleteComponent = directiveEl.injector.get(AutocompleteComponent);
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    describe('initial state', () => {
      it('should initialize value to null', () => {
        expect(directive.value()).toBeNull();
      });

      it('should initialize touched to false', () => {
        expect(directive.touched()).toBe(false);
      });

      it('should initialize dirty to false', () => {
        expect(directive.dirty()).toBe(false);
      });

      it('should sync required to the text-field', () => {
        expect(textFieldComponent.required).toBe(true);
      });

      it('should not show invalid state before touch', () => {
        expect(textFieldComponent.invalid).toBe(false);
      });
    });

    describe('selectionChange', () => {
      it('should update value on selection', () => {
        const event = new CustomEvent('forge-autocomplete-change', { detail: 'Option A' });
        directive.selectionChange(event);
        expect(directive.value()).toBe('Option A');
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('forge-autocomplete-change', { detail: 'Option A' });
        directive.selectionChange(event);
        expect(directive.dirty()).toBe(true);
      });

      it('should handle null selection', () => {
        directive.value.set('initial');
        const event = new CustomEvent('forge-autocomplete-change', { detail: null });
        directive.selectionChange(event);
        expect(directive.value()).toBeNull();
      });

      it('should sync value to the autocomplete component', () => {
        directive.value.set('synced-value');
        TestBed.tick();
        expect(autocompleteComponent.value).toBe('synced-value');
      });
    });

    describe('blur', () => {
      it('should set touched to true on focusout', () => {
        directive.blur();
        expect(directive.touched()).toBe(true);
      });

      it('should remain touched after multiple blur calls', () => {
        directive.blur();
        directive.blur();
        expect(directive.touched()).toBe(true);
      });
    });

    describe('validation state', () => {
      it('should show invalid on text-field after touch when value is null', () => {
        directive.blur();
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(true);
      });

      it('should not show invalid before touch even with null value', () => {
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(false);
      });

      it('should clear invalid when a valid value is selected', () => {
        directive.blur();
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(true);

        const event = new CustomEvent('forge-autocomplete-change', { detail: 'Valid' });
        directive.selectionChange(event);
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(false);
      });
    });

    describe('support text', () => {
      it('should not render support text before touch', () => {
        TestBed.tick();
        const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(supportText).toBeNull();
      });

      it('should render error text after touch when invalid', () => {
        directive.blur();
        TestBed.tick();

        const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(supportText).not.toBeNull();
        expect(supportText!.textContent).toBe('Selection is required');
      });

      it('should render single error as plain text without list', () => {
        directive.blur();
        TestBed.tick();

        const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(supportText!.querySelector('ul')).toBeNull();
      });

      it('should remove support text when value becomes valid', () => {
        directive.blur();
        TestBed.tick();
        expect(
          textFieldComponent.nativeElement.querySelector('[slot="support-text"]'),
        ).not.toBeNull();

        const event = new CustomEvent('forge-autocomplete-change', { detail: 'Valid' });
        directive.selectionChange(event);
        TestBed.tick();

        expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
      });

      it('should replace support text when errors change', () => {
        directive.blur();
        TestBed.tick();

        const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(supportText!.textContent).toBe('Selection is required');

        const event = new CustomEvent('forge-autocomplete-change', { detail: 'Valid' });
        directive.selectionChange(event);
        TestBed.tick();
        expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();

        const clearEvent = new CustomEvent('forge-autocomplete-change', { detail: null });
        directive.selectionChange(clearEvent);
        TestBed.tick();

        const updatedSupportText =
          textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(updatedSupportText).not.toBeNull();
        expect(updatedSupportText!.textContent).toBe('Selection is required');
      });
    });

    describe('host bindings', () => {
      it('should respond to forge-autocomplete-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new CustomEvent('forge-autocomplete-change', { detail: 'selected' }));
        expect(directive.value()).toBe('selected');
        expect(directive.dirty()).toBe(true);
      });

      it('should respond to focusout event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new Event('focusout'));
        expect(directive.touched()).toBe(true);
      });
    });
  });

  describe('with disabled state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<DisabledTestHostComponent>>;
    let host: DisabledTestHostComponent;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should not be disabled initially', () => {
      expect(textFieldComponent.disabled).toBe(false);
    });

    it('should sync disabled state to text-field when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(false);
    });
  });

  describe('with readonly state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<ReadonlyTestHostComponent>>;
    let host: ReadonlyTestHostComponent;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ReadonlyTestHostComponent],
      });

      fixture = TestBed.createComponent(ReadonlyTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should not be disabled initially', () => {
      expect(textFieldComponent.disabled).toBe(false);
    });

    it('should set text-field disabled when readonly', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(true);
    });

    it('should clear disabled when readonly is removed', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(true);

      host.isReadonly.set(false);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(false);
    });
  });

  describe('with multiple errors', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<MultipleErrorsTestHostComponent>>;
    let directive: ForgeAutocompleteFormFieldDirective<string>;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MultipleErrorsTestHostComponent],
      });

      fixture = TestBed.createComponent(MultipleErrorsTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeAutocompleteFormFieldDirective);
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should render multiple errors as a list', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      const items = supportText!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('Selection is required');
      expect(items[1].textContent).toBe('Must pick a valid option');
    });

    it('should use a ul element for multiple errors', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText!.querySelector('ul')).not.toBeNull();
    });
  });

  describe('with pending state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<PendingTestHostComponent>>;
    let host: PendingTestHostComponent;
    let directive: ForgeAutocompleteFormFieldDirective<string>;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PendingTestHostComponent],
      });

      fixture = TestBed.createComponent(PendingTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeAutocompleteFormFieldDirective);
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should not render a spinner when not pending', () => {
      TestBed.tick();
      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner).toBeNull();
    });

    it('should render a spinner in the start slot when async validation is in progress', () => {
      directive.value.set('trigger-async');
      TestBed.tick();

      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner).not.toBeNull();
      expect(spinner!.getAttribute('slot')).toBe('start');
    });

    it('should set xsmall size on the spinner', () => {
      directive.value.set('trigger-async');
      TestBed.tick();

      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner!.getAttribute('size')).toBe('xsmall');
    });

    it('should not add duplicate spinners when pending triggers multiple times', () => {
      directive.value.set('first');
      TestBed.tick();
      directive.value.set('second');
      TestBed.tick();

      const spinners =
        textFieldComponent.nativeElement.querySelectorAll('forge-circular-progress');
      expect(spinners.length).toBe(1);
    });

    it('should remove the spinner when async validation completes', async () => {
      directive.value.set('trigger-async');
      TestBed.tick();
      expect(
        textFieldComponent.nativeElement.querySelector('forge-circular-progress'),
      ).not.toBeNull();

      host.resolveValidation(true);
      await new Promise((r) => setTimeout(r));
      TestBed.tick();

      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner).toBeNull();
    });
  });

  describe('with pending state and existing start slot', () => {
    let fixture: ReturnType<
      typeof TestBed.createComponent<PendingWithExistingSlotTestHostComponent>
    >;
    let directive: ForgeAutocompleteFormFieldDirective<string>;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PendingWithExistingSlotTestHostComponent],
      });

      fixture = TestBed.createComponent(PendingWithExistingSlotTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeAutocompleteFormFieldDirective);
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should remove existing start slot content when pending', () => {
      directive.value.set('trigger-async');
      TestBed.tick();

      const existingIcon = textFieldComponent.nativeElement.querySelector('#existing-icon');
      expect(existingIcon).toBeNull();
    });

    it('should replace existing start slot content with spinner', () => {
      directive.value.set('trigger-async');
      TestBed.tick();

      const spinner = textFieldComponent.nativeElement.querySelector(
        'forge-circular-progress[slot="start"]',
      );
      expect(spinner).not.toBeNull();
    });
  });
});

describe('ForgeAutocompleteMultipleFormFieldDirective', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<MultipleTestHostComponent>>;
  let directive: ForgeAutocompleteMultipleFormFieldDirective<string>;
  let autocompleteComponent: AutocompleteComponent;
  let textFieldComponent: TextFieldComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MultipleTestHostComponent],
    });

    fixture = TestBed.createComponent(MultipleTestHostComponent);
    fixture.detectChanges();

    const directiveEl = fixture.debugElement.children[0];
    directive = directiveEl.injector.get(ForgeAutocompleteMultipleFormFieldDirective);
    autocompleteComponent = directiveEl.injector.get(AutocompleteComponent);
    textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
  });

  describe('initial state', () => {
    it('should initialize value to null', () => {
      expect(directive.value()).toBeNull();
    });

    it('should set multiple on the autocomplete', () => {
      expect(autocompleteComponent.multiple).toBe(true);
    });

    it('should initialize touched to false', () => {
      expect(directive.touched()).toBe(false);
    });

    it('should initialize dirty to false', () => {
      expect(directive.dirty()).toBe(false);
    });
  });

  describe('selectionChange', () => {
    it('should update value with array on selection', () => {
      const event = new CustomEvent('forge-autocomplete-change', {
        detail: ['Option A', 'Option B'],
      });
      directive.selectionChange(event);
      expect(directive.value()).toEqual(['Option A', 'Option B']);
    });

    it('should set value to null when empty array is emitted', () => {
      directive.value.set(['Option A']);
      const event = new CustomEvent('forge-autocomplete-change', {
        detail: [],
      });
      directive.selectionChange(event);
      expect(directive.value()).toBeNull();
    });

    it('should set dirty to true', () => {
      const event = new CustomEvent('forge-autocomplete-change', {
        detail: ['Option A'],
      });
      directive.selectionChange(event);
      expect(directive.dirty()).toBe(true);
    });

    it('should sync value to the autocomplete component', () => {
      directive.value.set(['Option A', 'Option C']);
      TestBed.tick();
      expect(autocompleteComponent.value).toEqual(['Option A', 'Option C']);
    });
  });

  describe('blur', () => {
    it('should set touched to true on focusout', () => {
      directive.blur();
      expect(directive.touched()).toBe(true);
    });
  });

  describe('host bindings', () => {
    it('should respond to forge-autocomplete-change event', () => {
      const el = fixture.debugElement.children[0].nativeElement;
      el.dispatchEvent(
        new CustomEvent('forge-autocomplete-change', {
          detail: ['Option A', 'Option B'],
          bubbles: true,
        }),
      );
      expect(directive.value()).toEqual(['Option A', 'Option B']);
      expect(directive.dirty()).toBe(true);
    });

    it('should respond to focusout event', () => {
      const el = fixture.debugElement.children[0].nativeElement;
      el.dispatchEvent(new Event('focusout'));
      expect(directive.touched()).toBe(true);
    });
  });
});
