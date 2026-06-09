import { Component, resource, signal, Signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  form,
  FormField,
  required,
  disabled,
  readonly,
  minLength,
  maxLength,
  min,
  max,
  validateAsync,
} from '@angular/forms/signals';
import {
  ForgeTextFieldFormFieldDirective,
  ForgeTextFieldNumberFormFieldDirective,
} from './text-field-form-field';
import { ForgeTextFieldModule, TextFieldComponent } from '@tylertech/forge-angular';

// --- String directive test hosts ---

@Component({
  imports: [FormField, ForgeTextFieldFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field [formField]="testForm.name">
      <input type="text" id="text-input" />
      <label for="text-input">Name</label>
    </forge-text-field>
  `,
})
class TestHostComponent {
  formModel = signal<{ name: string }>({ name: '' });

  testForm = form(this.formModel, (schema) => {
    required(schema.name, { message: 'Name is required' });
  });
}

@Component({
  imports: [FormField, ForgeTextFieldFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field [formField]="testForm.name">
      <input type="text" id="text-input" />
      <label for="text-input">Name</label>
    </forge-text-field>
  `,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ name: string }>({ name: '' });

  testForm = form(this.formModel, (schema) => {
    disabled(schema.name, () => this.isDisabled());
  });
}

@Component({
  imports: [FormField, ForgeTextFieldFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field [formField]="testForm.name">
      <input type="text" id="text-input" />
      <label for="text-input">Name</label>
    </forge-text-field>
  `,
})
class ReadonlyTestHostComponent {
  isReadonly = signal(false);
  formModel = signal<{ name: string }>({ name: '' });

  testForm = form(this.formModel, (schema) => {
    readonly(schema.name, () => this.isReadonly());
  });
}

@Component({
  imports: [FormField, ForgeTextFieldFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field [formField]="testForm.name">
      <input type="text" id="text-input" />
      <label for="text-input">Name</label>
    </forge-text-field>
  `,
})
class MultipleErrorsTestHostComponent {
  formModel = signal<{ name: string }>({ name: '' });

  testForm = form(this.formModel, (schema) => {
    required(schema.name, { message: 'Name is required' });
    required(schema.name, { message: 'Must provide a name' });
  });
}

@Component({
  imports: [FormField, ForgeTextFieldFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field [formField]="testForm.name">
      <input type="text" id="text-input" />
      <label for="text-input">Name</label>
    </forge-text-field>
  `,
})
class MinLengthTestHostComponent {
  formModel = signal<{ name: string }>({ name: '' });

  testForm = form(this.formModel, (schema) => {
    minLength(schema.name, 3, { message: 'Must be at least 3 characters' });
  });
}

@Component({
  imports: [FormField, ForgeTextFieldFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field [formField]="testForm.name">
      <input type="text" id="text-input" />
      <label for="text-input">Name</label>
    </forge-text-field>
  `,
})
class MaxLengthTestHostComponent {
  formModel = signal<{ name: string }>({ name: '' });

  testForm = form(this.formModel, (schema) => {
    maxLength(schema.name, 10, { message: 'Must be at most 10 characters' });
  });
}

@Component({
  imports: [FormField, ForgeTextFieldFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field [formField]="testForm.username">
      <input type="text" id="text-input" />
      <label for="text-input">Username</label>
    </forge-text-field>
  `,
})
class PendingTestHostComponent {
  formModel = signal<{ username: string }>({ username: '' });

  resolveValidation!: (value: boolean) => void;

  testForm = form(this.formModel, (schema) => {
    required(schema.username);
    validateAsync(schema.username, {
      params: (ctx) => ctx.value(),
      factory: (params: Signal<string | undefined>) =>
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

// --- Number directive test hosts ---

@Component({
  imports: [FormField, ForgeTextFieldNumberFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field number [formField]="testForm.age">
      <input type="number" id="number-input" />
      <label for="number-input">Age</label>
    </forge-text-field>
  `,
})
class NumberTestHostComponent {
  formModel = signal<{ age: number | null }>({ age: null });

  testForm = form(this.formModel, (schema) => {
    required(schema.age, { message: 'Age is required' });
  });
}

@Component({
  imports: [FormField, ForgeTextFieldNumberFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field number [formField]="testForm.age">
      <input type="number" id="number-input" />
      <label for="number-input">Age</label>
    </forge-text-field>
  `,
})
class NumberDisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ age: number | null }>({ age: null });

  testForm = form(this.formModel, (schema) => {
    disabled(schema.age, () => this.isDisabled());
  });
}

@Component({
  imports: [FormField, ForgeTextFieldNumberFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field number [formField]="testForm.age">
      <input type="number" id="number-input" />
      <label for="number-input">Age</label>
    </forge-text-field>
  `,
})
class NumberReadonlyTestHostComponent {
  isReadonly = signal(false);
  formModel = signal<{ age: number | null }>({ age: null });

  testForm = form(this.formModel, (schema) => {
    readonly(schema.age, () => this.isReadonly());
  });
}

@Component({
  imports: [FormField, ForgeTextFieldNumberFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field number [formField]="testForm.age">
      <input type="number" id="number-input" />
      <label for="number-input">Age</label>
    </forge-text-field>
  `,
})
class NumberMinMaxTestHostComponent {
  formModel = signal<{ age: number | null }>({ age: null });

  testForm = form(this.formModel, (schema) => {
    required(schema.age, { message: 'Age is required' });
    min(schema.age, 0, { message: 'Must be at least 0' });
    max(schema.age, 120, { message: 'Must be at most 120' });
  });
}

@Component({
  imports: [FormField, ForgeTextFieldNumberFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field number [formField]="testForm.age">
      <input type="number" id="number-input" />
      <label for="number-input">Age</label>
    </forge-text-field>
  `,
})
class NumberMultipleErrorsTestHostComponent {
  formModel = signal<{ age: number | null }>({ age: null });

  testForm = form(this.formModel, (schema) => {
    required(schema.age, { message: 'Age is required' });
    required(schema.age, { message: 'Must provide age' });
  });
}

@Component({
  imports: [FormField, ForgeTextFieldNumberFormFieldDirective, ForgeTextFieldModule],
  template: `
    <forge-text-field number [formField]="testForm.quantity">
      <input type="number" id="number-input" />
      <label for="number-input">Quantity</label>
    </forge-text-field>
  `,
})
class NumberPendingTestHostComponent {
  formModel = signal<{ quantity: number | null }>({ quantity: null });

  resolveValidation!: (value: boolean) => void;

  testForm = form(this.formModel, (schema) => {
    required(schema.quantity);
    validateAsync(schema.quantity, {
      params: (ctx) => ctx.value(),
      factory: (params: Signal<number | null | undefined>) =>
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

describe('ForgeTextFieldFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeTextFieldFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    describe('initial state', () => {
      it('should initialize value to empty string', () => {
        expect(directive.value()).toBe('');
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

    describe('onInput', () => {
      it('should update value on input', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = 'Hello';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBe('Hello');
      });

      it('should set dirty to true', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = 'Hello';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.dirty()).toBe(true);
      });

      it('should handle empty input', () => {
        directive.value.set('existing');
        const input = fixture.nativeElement.querySelector('input');
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBe('');
      });

      it('should sync value to the native input element', () => {
        directive.value.set('synced');
        TestBed.tick();
        const input = fixture.nativeElement.querySelector('input');
        expect(input.value).toBe('synced');
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
      it('should show invalid on text-field after touch when value is empty', () => {
        directive.blur();
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(true);
      });

      it('should not show invalid before touch even with empty value', () => {
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(false);
      });

      it('should clear invalid when a valid value is entered', () => {
        directive.blur();
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(true);

        const input = fixture.nativeElement.querySelector('input');
        input.value = 'Valid';
        input.dispatchEvent(new Event('input', { bubbles: true }));
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
        expect(supportText!.textContent).toBe('Name is required');
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

        const input = fixture.nativeElement.querySelector('input');
        input.value = 'Valid';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        TestBed.tick();

        expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
      });
    });

    describe('host bindings', () => {
      it('should respond to input event', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = 'typed';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBe('typed');
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
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
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
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should not be disabled initially', () => {
      expect(textFieldComponent.disabled).toBe(false);
    });

    it('should set text-field disabled when readonly', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(true);
    });

    it('should set the native input readonly attribute', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.readOnly).toBe(true);
    });

    it('should clear disabled when readonly is removed', () => {
      host.isReadonly.set(true);
      TestBed.tick();

      host.isReadonly.set(false);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(false);
    });
  });

  describe('with multiple errors', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<MultipleErrorsTestHostComponent>>;
    let directive: ForgeTextFieldFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MultipleErrorsTestHostComponent],
      });

      fixture = TestBed.createComponent(MultipleErrorsTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should render multiple errors as a list', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      const items = supportText!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('Name is required');
      expect(items[1].textContent).toBe('Must provide a name');
    });

    it('should use a ul element for multiple errors', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText!.querySelector('ul')).not.toBeNull();
    });
  });

  describe('with minLength validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<MinLengthTestHostComponent>>;
    let directive: ForgeTextFieldFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MinLengthTestHostComponent],
      });

      fixture = TestBed.createComponent(MinLengthTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should set minlength attribute on the native input', () => {
      TestBed.tick();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.minLength).toBe(3);
    });

    it('should show invalid when value is too short and touched', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'ab';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(textFieldComponent.invalid).toBe(true);
    });

    it('should not show invalid when value meets minLength', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'abc';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(textFieldComponent.invalid).toBe(false);
    });
  });

  describe('with minLength validation (error rendering)', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<MinLengthTestHostComponent>>;
    let directive: ForgeTextFieldFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MinLengthTestHostComponent],
      });

      fixture = TestBed.createComponent(MinLengthTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should render minLength error text when value is too short and touched', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'ab';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      expect(supportText!.textContent).toBe('Must be at least 3 characters');
    });

    it('should not render error text when value meets minLength', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'abc';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).toBeNull();
    });

    it('should clear error text when value grows to meet minLength', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'ab';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(
        textFieldComponent.nativeElement.querySelector('[slot="support-text"]'),
      ).not.toBeNull();

      input.value = 'abcd';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      TestBed.tick();

      expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
    });
  });

  describe('with maxLength validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<MaxLengthTestHostComponent>>;
    let directive: ForgeTextFieldFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MaxLengthTestHostComponent],
      });

      fixture = TestBed.createComponent(MaxLengthTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should set maxlength attribute on the native input', () => {
      TestBed.tick();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.maxLength).toBe(10);
    });

    it('should show invalid when value exceeds maxLength and touched', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'this string is too long';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(textFieldComponent.invalid).toBe(true);
    });

    it('should render maxLength error text when value exceeds limit and touched', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'this string is too long';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      expect(supportText!.textContent).toBe('Must be at most 10 characters');
    });

    it('should not show invalid when value is within maxLength', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'short';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(textFieldComponent.invalid).toBe(false);
    });

    it('should clear error text when value is shortened to within limit', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = 'this string is too long';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(
        textFieldComponent.nativeElement.querySelector('[slot="support-text"]'),
      ).not.toBeNull();

      input.value = 'short';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      TestBed.tick();

      expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
    });
  });

  describe('with pending state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<PendingTestHostComponent>>;
    let host: PendingTestHostComponent;
    let directive: ForgeTextFieldFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [PendingTestHostComponent],
      });

      fixture = TestBed.createComponent(PendingTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should not render a spinner when not pending', () => {
      TestBed.tick();
      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner).toBeNull();
    });

    it('should render a spinner in the end slot when async validation is in progress', () => {
      directive.value.set('trigger-async');
      TestBed.tick();

      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner).not.toBeNull();
      expect(spinner!.getAttribute('slot')).toBe('end');
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
});

describe('ForgeTextFieldNumberFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<NumberTestHostComponent>>;
    let directive: ForgeTextFieldNumberFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NumberTestHostComponent],
      });

      fixture = TestBed.createComponent(NumberTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldNumberFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
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

    describe('onInput', () => {
      it('should parse numeric input', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '42';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBe(42);
      });

      it('should handle decimal numbers', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '3.14';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBe(3.14);
      });

      it('should handle negative numbers', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '-5';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBe(-5);
      });

      it('should set null for empty input', () => {
        directive.value.set(42);
        const input = fixture.nativeElement.querySelector('input');
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBeNull();
      });

      it('should set null for non-numeric input', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = 'abc';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBeNull();
      });

      it('should set dirty to true', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '10';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.dirty()).toBe(true);
      });

      it('should sync value to the native input element', () => {
        directive.value.set(99);
        TestBed.tick();
        const input = fixture.nativeElement.querySelector('input');
        expect(input.value).toBe('99');
      });

      it('should sync null value to empty string in native input', () => {
        directive.value.set(null);
        TestBed.tick();
        const input = fixture.nativeElement.querySelector('input');
        expect(input.value).toBe('');
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

      it('should clear invalid when a valid value is entered', () => {
        directive.blur();
        TestBed.tick();
        expect(textFieldComponent.invalid).toBe(true);

        const input = fixture.nativeElement.querySelector('input');
        input.value = '25';
        input.dispatchEvent(new Event('input', { bubbles: true }));
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
        expect(supportText!.textContent).toBe('Age is required');
      });

      it('should remove support text when value becomes valid', () => {
        directive.blur();
        TestBed.tick();
        expect(
          textFieldComponent.nativeElement.querySelector('[slot="support-text"]'),
        ).not.toBeNull();

        const input = fixture.nativeElement.querySelector('input');
        input.value = '25';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        TestBed.tick();

        expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
      });
    });

    describe('host bindings', () => {
      it('should respond to input event', () => {
        const input = fixture.nativeElement.querySelector('input');
        input.value = '7';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        expect(directive.value()).toBe(7);
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
    let fixture: ReturnType<typeof TestBed.createComponent<NumberDisabledTestHostComponent>>;
    let host: NumberDisabledTestHostComponent;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NumberDisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(NumberDisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
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
    let fixture: ReturnType<typeof TestBed.createComponent<NumberReadonlyTestHostComponent>>;
    let host: NumberReadonlyTestHostComponent;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NumberReadonlyTestHostComponent],
      });

      fixture = TestBed.createComponent(NumberReadonlyTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should not be disabled initially', () => {
      expect(textFieldComponent.disabled).toBe(false);
    });

    it('should set text-field disabled when readonly', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(true);
    });

    it('should set the native input readonly attribute', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.readOnly).toBe(true);
    });

    it('should clear disabled when readonly is removed', () => {
      host.isReadonly.set(true);
      TestBed.tick();

      host.isReadonly.set(false);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(false);
    });
  });

  describe('with min/max validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<NumberMinMaxTestHostComponent>>;
    let directive: ForgeTextFieldNumberFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NumberMinMaxTestHostComponent],
      });

      fixture = TestBed.createComponent(NumberMinMaxTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldNumberFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should set min attribute on the native input', () => {
      TestBed.tick();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.min).toBe('0');
    });

    it('should set max attribute on the native input', () => {
      TestBed.tick();
      const input = fixture.nativeElement.querySelector('input');
      expect(input.max).toBe('120');
    });

    it('should show invalid when value is below min and touched', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = '-1';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(textFieldComponent.invalid).toBe(true);
    });

    it('should show invalid when value exceeds max and touched', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = '150';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(textFieldComponent.invalid).toBe(true);
    });

    it('should not show invalid when value is within range and touched', () => {
      const input = fixture.nativeElement.querySelector('input');
      input.value = '50';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      directive.blur();
      TestBed.tick();
      expect(textFieldComponent.invalid).toBe(false);
    });
  });

  describe('with multiple errors', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<NumberMultipleErrorsTestHostComponent>>;
    let directive: ForgeTextFieldNumberFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NumberMultipleErrorsTestHostComponent],
      });

      fixture = TestBed.createComponent(NumberMultipleErrorsTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldNumberFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should render multiple errors as a list', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      const items = supportText!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('Age is required');
      expect(items[1].textContent).toBe('Must provide age');
    });

    it('should use a ul element for multiple errors', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText!.querySelector('ul')).not.toBeNull();
    });
  });

  describe('with pending state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<NumberPendingTestHostComponent>>;
    let host: NumberPendingTestHostComponent;
    let directive: ForgeTextFieldNumberFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [NumberPendingTestHostComponent],
      });

      fixture = TestBed.createComponent(NumberPendingTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTextFieldNumberFormFieldDirective);
      textFieldComponent = directiveEl.injector.get(TextFieldComponent);
    });

    it('should not render a spinner when not pending', () => {
      TestBed.tick();
      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner).toBeNull();
    });

    it('should render a spinner in the end slot when async validation is in progress', () => {
      directive.value.set(42);
      TestBed.tick();

      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner).not.toBeNull();
      expect(spinner!.getAttribute('slot')).toBe('end');
    });

    it('should set xsmall size on the spinner', () => {
      directive.value.set(42);
      TestBed.tick();

      const spinner = textFieldComponent.nativeElement.querySelector('forge-circular-progress');
      expect(spinner!.getAttribute('size')).toBe('xsmall');
    });

    it('should not add duplicate spinners when pending triggers multiple times', () => {
      directive.value.set(1);
      TestBed.tick();
      directive.value.set(2);
      TestBed.tick();

      const spinners =
        textFieldComponent.nativeElement.querySelectorAll('forge-circular-progress');
      expect(spinners.length).toBe(1);
    });

    it('should remove the spinner when async validation completes', async () => {
      directive.value.set(42);
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
});
