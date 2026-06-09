import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled, readonly } from '@angular/forms/signals';
import { ForgeTimePickerFormFieldDirective } from './time-picker-form-field';
import { ForgeTextFieldModule, TextFieldComponent } from '@tylertech/forge-angular';
import { FormTimePickerComponent } from '../../components/time-picker/form-time-picker.component';

@Component({
  imports: [
    FormField,
    ForgeTimePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormTimePickerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <forge-time-picker [formField]="testForm.selectedTime">
      <forge-text-field>
        <input type="text" id="time-input" />
        <label for="time-input">Time</label>
      </forge-text-field>
    </forge-time-picker>
  `,
})
class TestHostComponent {
  formModel = signal<{ selectedTime: Date | null }>({
    selectedTime: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedTime, { message: 'Time is required' });
  });
}

@Component({
  imports: [
    FormField,
    ForgeTimePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormTimePickerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <forge-time-picker [formField]="testForm.selectedTime">
      <forge-text-field>
        <input type="text" id="time-input" />
        <label for="time-input">Time</label>
      </forge-text-field>
    </forge-time-picker>
  `,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ selectedTime: Date | null }>({
    selectedTime: null,
  });

  testForm = form(this.formModel, (schema) => {
    disabled(schema.selectedTime, () => this.isDisabled());
  });
}

@Component({
  imports: [
    FormField,
    ForgeTimePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormTimePickerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <forge-time-picker [formField]="testForm.selectedTime">
      <forge-text-field>
        <input type="text" id="time-input" />
        <label for="time-input">Time</label>
      </forge-text-field>
    </forge-time-picker>
  `,
})
class ReadonlyTestHostComponent {
  isReadonly = signal(false);
  formModel = signal<{ selectedTime: Date | null }>({
    selectedTime: null,
  });

  testForm = form(this.formModel, (schema) => {
    readonly(schema.selectedTime, () => this.isReadonly());
  });
}

@Component({
  imports: [
    FormField,
    ForgeTimePickerFormFieldDirective,
    ForgeTextFieldModule,
    FormTimePickerComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <forge-time-picker [formField]="testForm.selectedTime">
      <forge-text-field>
        <input type="text" id="time-input" />
        <label for="time-input">Time</label>
      </forge-text-field>
    </forge-time-picker>
  `,
})
class MultipleErrorsTestHostComponent {
  formModel = signal<{ selectedTime: Date | null }>({
    selectedTime: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selectedTime, { message: 'Time is required' });
    required(schema.selectedTime, { message: 'Must select a valid time' });
  });
}

describe('ForgeTimePickerFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeTimePickerFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTimePickerFormFieldDirective);
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

    describe('timeChange', () => {
      it('should update value with a Date on time selection', () => {
        const event = new CustomEvent('forge-time-picker-change', {
          detail: '14:30',
        });
        directive.timeChange(event);
        expect(directive.value()).toBeInstanceOf(Date);
        expect(directive.value()!.getHours()).toBe(14);
        expect(directive.value()!.getMinutes()).toBe(30);
      });

      it('should handle time with seconds', () => {
        const event = new CustomEvent('forge-time-picker-change', {
          detail: '10:15:45',
        });
        directive.timeChange(event);
        expect(directive.value()!.getHours()).toBe(10);
        expect(directive.value()!.getMinutes()).toBe(15);
        expect(directive.value()!.getSeconds()).toBe(45);
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('forge-time-picker-change', {
          detail: '09:00',
        });
        directive.timeChange(event);
        expect(directive.dirty()).toBe(true);
      });

      it('should handle null value', () => {
        directive.value.set(new Date(1970, 0, 1, 14, 30));
        const event = new CustomEvent('forge-time-picker-change', { detail: null });
        directive.timeChange(event);
        expect(directive.value()).toBeNull();
      });

      it('should sync value to the native time picker element as a time string', () => {
        const date = new Date(1970, 0, 1, 16, 45);
        directive.value.set(date);
        TestBed.tick();
        const el = fixture.debugElement.children[0].nativeElement;
        expect(el.value).toBe('16:45');
      });

      it('should include seconds in the time string when seconds are non-zero', () => {
        const date = new Date(1970, 0, 1, 8, 30, 15);
        directive.value.set(date);
        TestBed.tick();
        const el = fixture.debugElement.children[0].nativeElement;
        expect(el.value).toContain('08:30');
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

        const event = new CustomEvent('forge-time-picker-change', {
          detail: '10:00',
        });
        directive.timeChange(event);
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
        expect(supportText!.textContent).toBe('Time is required');
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

        const event = new CustomEvent('forge-time-picker-change', {
          detail: '12:00',
        });
        directive.timeChange(event);
        TestBed.tick();

        expect(textFieldComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
      });
    });

    describe('host bindings', () => {
      it('should respond to forge-time-picker-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new CustomEvent('forge-time-picker-change', { detail: '15:30' }));
        expect(directive.value()!.getHours()).toBe(15);
        expect(directive.value()!.getMinutes()).toBe(30);
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
    let directive: ForgeTimePickerFormFieldDirective;
    let textFieldComponent: TextFieldComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MultipleErrorsTestHostComponent],
      });

      fixture = TestBed.createComponent(MultipleErrorsTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeTimePickerFormFieldDirective);
      textFieldComponent = directiveEl.children[0].injector.get(TextFieldComponent);
    });

    it('should render multiple errors as a list', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      const items = supportText!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('Time is required');
      expect(items[1].textContent).toBe('Must select a valid time');
    });

    it('should use a ul element for multiple errors', () => {
      directive.blur();
      TestBed.tick();

      const supportText = textFieldComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText!.querySelector('ul')).not.toBeNull();
    });
  });
});
