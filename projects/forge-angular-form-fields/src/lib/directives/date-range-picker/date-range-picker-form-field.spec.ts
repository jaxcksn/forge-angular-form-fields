import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled, readonly } from '@angular/forms/signals';
import { DateRange, ForgeDateRangePickerFormFieldDirective } from './date-range-picker-form-field';
import { ForgeTextFieldModule, TextFieldComponent } from '@tylertech/forge-angular';
import { FormDateRangePickerComponent } from '../../components/date-range-picker/form-date-range-picker.component';

@Component({
  imports: [
    FormField,
    ForgeDateRangePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDateRangePickerComponent,
  ],
  template: `
    <forge-date-range-picker [formField]="testForm.dateRange">
      <forge-text-field>
        <label for="from-date">Date Range</label>
        <input id="from-date" type="text" placeholder="From" />
        <input id="to-date" type="text" placeholder="To" />
      </forge-text-field>
    </forge-date-range-picker>
  `,
})
class TestHostComponent {
  formModel = signal<{ dateRange: DateRange | null }>({
    dateRange: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.dateRange, { message: 'Date range is required' });
  });
}

@Component({
  imports: [
    FormField,
    ForgeDateRangePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDateRangePickerComponent,
  ],
  template: `
    <forge-date-range-picker [formField]="testForm.dateRange">
      <forge-text-field>
        <label for="from-date">Date Range</label>
        <input id="from-date" type="text" placeholder="From" />
        <input id="to-date" type="text" placeholder="To" />
      </forge-text-field>
    </forge-date-range-picker>
  `,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ dateRange: DateRange | null }>({
    dateRange: null,
  });

  testForm = form(this.formModel, (schema) => {
    disabled(schema.dateRange, () => this.isDisabled());
  });
}

@Component({
  imports: [
    FormField,
    ForgeDateRangePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDateRangePickerComponent,
  ],
  template: `
    <forge-date-range-picker [formField]="testForm.dateRange">
      <forge-text-field>
        <label for="from-date">Date Range</label>
        <input id="from-date" type="text" placeholder="From" />
        <input id="to-date" type="text" placeholder="To" />
      </forge-text-field>
    </forge-date-range-picker>
  `,
})
class ReadonlyTestHostComponent {
  isReadonly = signal(false);
  formModel = signal<{ dateRange: DateRange | null }>({
    dateRange: null,
  });

  testForm = form(this.formModel, (schema) => {
    readonly(schema.dateRange, () => this.isReadonly());
  });
}

@Component({
  imports: [
    FormField,
    ForgeDateRangePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormDateRangePickerComponent,
  ],
  template: `
    <forge-date-range-picker [formField]="testForm.dateRange">
      <forge-text-field>
        <label for="from-date">Date Range</label>
        <input id="from-date" type="text" placeholder="From" />
        <input id="to-date" type="text" placeholder="To" />
      </forge-text-field>
    </forge-date-range-picker>
  `,
})
class MultipleErrorsTestHostComponent {
  formModel = signal<{ dateRange: DateRange | null }>({
    dateRange: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.dateRange, { message: 'Date range is required' });
    required(schema.dateRange, { message: 'Both dates must be selected' });
  });
}

describe('ForgeDateRangePickerFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeDateRangePickerFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeDateRangePickerFormFieldDirective);
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

    describe('rangeChange', () => {
      it('should update value with DateRange on selection', () => {
        const from = new Date(2024, 0, 1);
        const to = new Date(2024, 0, 31);
        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from, to },
        });
        directive.rangeChange(event);
        expect(directive.value()).toEqual({ from, to });
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) },
        });
        directive.rangeChange(event);
        expect(directive.dirty()).toBe(true);
      });

      it('should handle partial range with only from date', () => {
        const from = new Date(2024, 0, 1);
        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from, to: null },
        });
        directive.rangeChange(event);
        expect(directive.value()).toEqual({ from, to: null });
      });

      it('should handle partial range with only to date', () => {
        const to = new Date(2024, 0, 31);
        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from: null, to },
        });
        directive.rangeChange(event);
        expect(directive.value()).toEqual({ from: null, to });
      });

      it('should set value to null when both from and to are null', () => {
        directive.value.set({ from: new Date(), to: new Date() });
        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from: null, to: null },
        });
        directive.rangeChange(event);
        expect(directive.value()).toBeNull();
      });

      it('should handle string date values in the event', () => {
        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from: '2024-01-01', to: '2024-01-31' },
        });
        directive.rangeChange(event);
        expect(directive.value()!.from).toBeInstanceOf(Date);
        expect(directive.value()!.to).toBeInstanceOf(Date);
      });

      it('should sync value to the native date range picker element', () => {
        const from = new Date(2024, 3, 1);
        const to = new Date(2024, 3, 30);
        directive.value.set({ from, to });
        TestBed.tick();
        const el = fixture.debugElement.children[0].nativeElement;
        expect(el.from).toEqual(from);
        expect(el.to).toEqual(to);
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

        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) },
        });
        directive.rangeChange(event);
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
        expect(supportText!.textContent).toBe('Date range is required');
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

        const event = new CustomEvent('forge-date-range-picker-change', {
          detail: { from: new Date(2024, 0, 1), to: new Date(2024, 0, 31) },
        });
        directive.rangeChange(event);
        TestBed.tick();

        expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
      });
    });

    describe('host bindings', () => {
      it('should respond to forge-date-range-picker-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        const from = new Date(2024, 5, 1);
        const to = new Date(2024, 5, 30);
        el.dispatchEvent(
          new CustomEvent('forge-date-range-picker-change', {
            detail: { from, to },
          }),
        );
        expect(directive.value()).toEqual({ from, to });
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
    let directive: ForgeDateRangePickerFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MultipleErrorsTestHostComponent],
      });

      fixture = TestBed.createComponent(MultipleErrorsTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeDateRangePickerFormFieldDirective);
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should render multiple errors as a list', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      const items = supportText!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('Date range is required');
      expect(items[1].textContent).toBe('Both dates must be selected');
    });

    it('should use a ul element for multiple errors', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText!.querySelector('ul')).not.toBeNull();
    });
  });
});
