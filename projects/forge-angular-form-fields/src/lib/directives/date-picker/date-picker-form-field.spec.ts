import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled, readonly } from '@angular/forms/signals';
import { ForgeDatePickerFormFieldDirective } from './date-picker-form-field';
import { ForgeTextFieldModule, TextFieldComponent } from '@tylertech/forge-angular';
import { FormDatePickerComponent } from '../../components/date-picker/form-date-picker.component';

@Component({
  imports: [
    FormField,
    ForgeDatePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDatePickerComponent,
  ],
  template: `
    <forge-date-picker [formField]="testForm.selectedDate">
      <forge-text-field>
        <input type="text" id="date-input" />
        <label for="date-input">Date</label>
      </forge-text-field>
    </forge-date-picker>
  `,
})
class TestHostComponent {
  formModel = signal<{ selectedDate: Date | null }>({
    selectedDate: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedDate, { message: 'Date is required' });
  });
}

@Component({
  imports: [
    FormField,
    ForgeDatePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDatePickerComponent,
  ],
  template: `
    <forge-date-picker [formField]="testForm.selectedDate">
      <forge-text-field>
        <input type="text" id="date-input" />
        <label for="date-input">Date</label>
      </forge-text-field>
    </forge-date-picker>
  `,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ selectedDate: Date | null }>({
    selectedDate: null,
  });

  testForm = form(this.formModel, (schema) => {
    disabled(schema.selectedDate, () => this.isDisabled());
  });
}

@Component({
  imports: [
    FormField,
    ForgeDatePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDatePickerComponent,
  ],
  template: `
    <forge-date-picker [formField]="testForm.selectedDate">
      <forge-text-field>
        <input type="text" id="date-input" />
        <label for="date-input">Date</label>
      </forge-text-field>
    </forge-date-picker>
  `,
})
class ReadonlyTestHostComponent {
  isReadonly = signal(false);
  formModel = signal<{ selectedDate: Date | null }>({
    selectedDate: null,
  });

  testForm = form(this.formModel, (schema) => {
    readonly(schema.selectedDate, () => this.isReadonly());
  });
}

@Component({
  imports: [
    FormField,
    ForgeDatePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDatePickerComponent,
  ],
  template: `
    <forge-date-picker [formField]="testForm.selectedDate">
      <forge-text-field>
        <input type="text" id="date-input" />
        <label for="date-input">Date</label>
      </forge-text-field>
    </forge-date-picker>
  `,
})
class MultipleErrorsTestHostComponent {
  formModel = signal<{ selectedDate: Date | null }>({
    selectedDate: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedDate, { message: 'Date is required' });
    required(schema.selectedDate, { message: 'Must select a valid date' });
  });
}

describe('ForgeDatePickerFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeDatePickerFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeDatePickerFormFieldDirective);
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

    describe('dateChange', () => {
      it('should update value with a Date on selection', () => {
        const date = new Date(2024, 0, 15);
        const event = new CustomEvent('forge-date-picker-change', { detail: date });
        directive.dateChange(event);
        expect(directive.value()).toEqual(date);
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('forge-date-picker-change', {
          detail: new Date(2024, 0, 15),
        });
        directive.dateChange(event);
        expect(directive.dirty()).toBe(true);
      });

      it('should handle null value', () => {
        directive.value.set(new Date(2024, 0, 15));
        const event = new CustomEvent('forge-date-picker-change', { detail: null });
        directive.dateChange(event);
        expect(directive.value()).toBeNull();
      });

      it('should handle string date value', () => {
        const event = new CustomEvent('forge-date-picker-change', {
          detail: '2024-01-15',
        });
        directive.dateChange(event);
        expect(directive.value()).toBeInstanceOf(Date);
        expect(directive.value()!.getFullYear()).toBe(2024);
      });

      it('should sync value to the native date picker element', () => {
        const date = new Date(2024, 5, 20);
        directive.value.set(date);
        TestBed.tick();
        const el = fixture.debugElement.children[0].nativeElement;
        expect(el.value).toEqual(date);
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

        const event = new CustomEvent('forge-date-picker-change', {
          detail: new Date(2024, 0, 15),
        });
        directive.dateChange(event);
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
        expect(supportText!.textContent).toBe('Date is required');
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

        const event = new CustomEvent('forge-date-picker-change', {
          detail: new Date(2024, 0, 15),
        });
        directive.dateChange(event);
        TestBed.tick();

        expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
      });
    });

    describe('host bindings', () => {
      it('should respond to forge-date-picker-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        const date = new Date(2024, 2, 10);
        el.dispatchEvent(new CustomEvent('forge-date-picker-change', { detail: date }));
        expect(directive.value()).toEqual(date);
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

      host.isReadonly.set(false);
      TestBed.tick();
      expect(textFieldComponent.disabled).toBe(false);
    });
  });

  describe('with multiple errors', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<MultipleErrorsTestHostComponent>>;
    let directive: ForgeDatePickerFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MultipleErrorsTestHostComponent],
      });

      fixture = TestBed.createComponent(MultipleErrorsTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeDatePickerFormFieldDirective);
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should render multiple errors as a list', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      const items = supportText!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('Date is required');
      expect(items[1].textContent).toBe('Must select a valid date');
    });

    it('should use a ul element for multiple errors', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText!.querySelector('ul')).not.toBeNull();
    });
  });
});
