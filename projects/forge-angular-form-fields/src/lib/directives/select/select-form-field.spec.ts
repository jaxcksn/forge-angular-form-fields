import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled, readonly } from '@angular/forms/signals';
import {
  ForgeSelectFormFieldDirective,
  ForgeSelectMultipleFormFieldDirective,
} from './select-form-field';
import { ForgeOptionModule } from '@tylertech/forge-angular';
import { FormSelectComponent } from '../../components/select/form-select.component';

@Component({
  imports: [
    FormField,
    ForgeSelectFormFieldDirective,
    FormSelectComponent,
    ForgeOptionModule,
  ],
  template: `
    <forge-select [formField]="testForm.selectedOption" label="Test Select">
      <forge-option value="a">Option A</forge-option>
      <forge-option value="b">Option B</forge-option>
      <forge-option value="c">Option C</forge-option>
    </forge-select>
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
    ForgeSelectFormFieldDirective,
    FormSelectComponent,
    ForgeOptionModule,
  ],
  template: `
    <forge-select [formField]="testForm.selectedOption" label="Test Select">
      <forge-option value="a">Option A</forge-option>
    </forge-select>
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
    ForgeSelectFormFieldDirective,
    FormSelectComponent,
    ForgeOptionModule,
  ],
  template: `
    <forge-select [formField]="testForm.selectedOption" label="Test Select">
      <forge-option value="a">Option A</forge-option>
    </forge-select>
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
    ForgeSelectFormFieldDirective,
    FormSelectComponent,
    ForgeOptionModule,
  ],
  template: `
    <forge-select [formField]="testForm.selectedOption" label="Test Select">
      <forge-option value="a">Option A</forge-option>
    </forge-select>
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
    ForgeSelectMultipleFormFieldDirective,
    FormSelectComponent,
    ForgeOptionModule,
  ],
  template: `
    <forge-select multiple [formField]="testForm.selectedOptions" label="Test Multi Select">
      <forge-option value="a">Option A</forge-option>
      <forge-option value="b">Option B</forge-option>
      <forge-option value="c">Option C</forge-option>
    </forge-select>
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

describe('ForgeSelectFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeSelectFormFieldDirective<string>;
    let selectComponent: FormSelectComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeSelectFormFieldDirective);
      selectComponent = directiveEl.injector.get(FormSelectComponent);
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

      it('should sync required to the select', () => {
        expect(selectComponent.required).toBe(true);
      });

      it('should not show invalid state before touch', () => {
        expect(selectComponent.invalid).toBe(false);
      });
    });

    describe('selectionChange', () => {
      it('should update value on selection', () => {
        const event = new CustomEvent('change', { detail: 'a' });
        Object.defineProperty(event, 'target', { value: { value: 'a' } });
        directive.selectionChange(event);
        expect(directive.value()).toBe('a');
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('change', { detail: 'a' });
        Object.defineProperty(event, 'target', { value: { value: 'a' } });
        directive.selectionChange(event);
        expect(directive.dirty()).toBe(true);
      });

      it('should handle null selection', () => {
        directive.value.set('a');
        const event = new CustomEvent('change', { detail: null });
        Object.defineProperty(event, 'target', { value: { value: null } });
        directive.selectionChange(event);
        expect(directive.value()).toBeNull();
      });

      it('should sync value to the select component', () => {
        directive.value.set('b');
        TestBed.tick();
        expect(selectComponent.value).toBe('b');
      });
    });

    describe('blur', () => {
      it('should set touched to true on blur', () => {
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
      it('should show invalid on select after touch when value is null', () => {
        directive.blur();
        TestBed.tick();
        expect(selectComponent.invalid).toBe(true);
      });

      it('should not show invalid before touch even with null value', () => {
        TestBed.tick();
        expect(selectComponent.invalid).toBe(false);
      });

      it('should clear invalid when a valid value is selected', () => {
        directive.blur();
        TestBed.tick();
        expect(selectComponent.invalid).toBe(true);

        const event = new CustomEvent('change', { detail: 'a' });
        Object.defineProperty(event, 'target', { value: { value: 'a' } });
        directive.selectionChange(event);
        TestBed.tick();
        expect(selectComponent.invalid).toBe(false);
      });
    });

    describe('support text', () => {
      it('should not render support text before touch', () => {
        TestBed.tick();
        const supportText = selectComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(supportText).toBeNull();
      });

      it('should render error text after touch when invalid', () => {
        directive.blur();
        TestBed.tick();

        const supportText = selectComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(supportText).not.toBeNull();
        expect(supportText!.textContent).toBe('Selection is required');
      });

      it('should render single error as plain text without list', () => {
        directive.blur();
        TestBed.tick();

        const supportText = selectComponent.nativeElement.querySelector('[slot="support-text"]');
        expect(supportText!.querySelector('ul')).toBeNull();
      });

      it('should remove support text when value becomes valid', () => {
        directive.blur();
        TestBed.tick();
        expect(
          selectComponent.nativeElement.querySelector('[slot="support-text"]'),
        ).not.toBeNull();

        const event = new CustomEvent('change', { detail: 'a' });
        Object.defineProperty(event, 'target', { value: { value: 'a' } });
        directive.selectionChange(event);
        TestBed.tick();

        expect(selectComponent.nativeElement.querySelector('[slot="support-text"]')).toBeNull();
      });
    });

    describe('host bindings', () => {
      it('should respond to change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        Object.defineProperty(el, 'value', { value: 'a', writable: true });
        el.dispatchEvent(new CustomEvent('change', { detail: 'a' }));
        expect(directive.value()).toBe('a');
        expect(directive.dirty()).toBe(true);
      });

      it('should respond to blur event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new Event('blur'));
        expect(directive.touched()).toBe(true);
      });
    });
  });

  describe('with disabled state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<DisabledTestHostComponent>>;
    let host: DisabledTestHostComponent;
    let selectComponent: FormSelectComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      selectComponent = directiveEl.injector.get(FormSelectComponent);
    });

    it('should not be disabled initially', () => {
      expect(selectComponent.disabled).toBe(false);
    });

    it('should sync disabled state to select when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(selectComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(selectComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(selectComponent.disabled).toBe(false);
    });
  });

  describe('with readonly state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<ReadonlyTestHostComponent>>;
    let host: ReadonlyTestHostComponent;
    let selectComponent: FormSelectComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ReadonlyTestHostComponent],
      });

      fixture = TestBed.createComponent(ReadonlyTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      selectComponent = directiveEl.injector.get(FormSelectComponent);
    });

    it('should not be disabled initially', () => {
      expect(selectComponent.disabled).toBe(false);
    });

    it('should set select disabled when readonly', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(selectComponent.disabled).toBe(true);
    });

    it('should clear disabled when readonly is removed', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(selectComponent.disabled).toBe(true);

      host.isReadonly.set(false);
      TestBed.tick();
      expect(selectComponent.disabled).toBe(false);
    });
  });

  describe('with multiple errors', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<MultipleErrorsTestHostComponent>>;
    let directive: ForgeSelectFormFieldDirective<string>;
    let selectComponent: FormSelectComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [MultipleErrorsTestHostComponent],
      });

      fixture = TestBed.createComponent(MultipleErrorsTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeSelectFormFieldDirective);
      selectComponent = directiveEl.injector.get(FormSelectComponent);
    });

    it('should render multiple errors as a list', () => {
      directive.blur();
      TestBed.tick();

      const supportText = selectComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      const items = supportText!.querySelectorAll('li');
      expect(items.length).toBe(2);
      expect(items[0].textContent).toBe('Selection is required');
      expect(items[1].textContent).toBe('Must pick a valid option');
    });

    it('should use a ul element for multiple errors', () => {
      directive.blur();
      TestBed.tick();

      const supportText = selectComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText!.querySelector('ul')).not.toBeNull();
    });
  });
});

describe('ForgeSelectMultipleFormFieldDirective', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<MultipleTestHostComponent>>;
  let directive: ForgeSelectMultipleFormFieldDirective<string>;
  let selectComponent: FormSelectComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MultipleTestHostComponent],
    });

    fixture = TestBed.createComponent(MultipleTestHostComponent);
    fixture.detectChanges();

    const directiveEl = fixture.debugElement.children[0];
    directive = directiveEl.injector.get(ForgeSelectMultipleFormFieldDirective);
    selectComponent = directiveEl.injector.get(FormSelectComponent);
  });

  describe('initial state', () => {
    it('should initialize value to null', () => {
      expect(directive.value()).toBeNull();
    });

    it('should set multiple on the select', () => {
      expect(selectComponent.multiple).toBe(true);
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
      const event = new CustomEvent('change', { detail: ['a', 'b'] });
      Object.defineProperty(event, 'target', { value: { value: ['a', 'b'] } });
      directive.selectionChange(event);
      expect(directive.value()).toEqual(['a', 'b']);
    });

    it('should set value to null when empty array is emitted', () => {
      directive.value.set(['a']);
      const event = new CustomEvent('change', { detail: [] });
      Object.defineProperty(event, 'target', { value: { value: [] } });
      directive.selectionChange(event);
      expect(directive.value()).toBeNull();
    });

    it('should set dirty to true', () => {
      const event = new CustomEvent('change', { detail: ['a'] });
      Object.defineProperty(event, 'target', { value: { value: ['a'] } });
      directive.selectionChange(event);
      expect(directive.dirty()).toBe(true);
    });

    it('should sync value to the select component', () => {
      directive.value.set(['a', 'c']);
      TestBed.tick();
      expect(selectComponent.value).toEqual(['a', 'c']);
    });
  });

  describe('blur', () => {
    it('should set touched to true on blur', () => {
      directive.blur();
      expect(directive.touched()).toBe(true);
    });
  });

  describe('validation state', () => {
    it('should show invalid on select after touch when value is null', () => {
      directive.blur();
      TestBed.tick();
      expect(selectComponent.invalid).toBe(true);
    });

    it('should render error text after touch when invalid', () => {
      directive.blur();
      TestBed.tick();

      const supportText = selectComponent.nativeElement.querySelector('[slot="support-text"]');
      expect(supportText).not.toBeNull();
      expect(supportText!.textContent).toBe('At least one option is required');
    });
  });

  describe('host bindings', () => {
    it('should respond to change event', () => {
      const el = fixture.debugElement.children[0].nativeElement;
      Object.defineProperty(el, 'value', { value: ['a', 'b'], writable: true });
      el.dispatchEvent(new CustomEvent('change', { detail: ['a', 'b'], bubbles: true }));
      expect(directive.value()).toEqual(['a', 'b']);
      expect(directive.dirty()).toBe(true);
    });

    it('should respond to blur event', () => {
      const el = fixture.debugElement.children[0].nativeElement;
      el.dispatchEvent(new Event('blur'));
      expect(directive.touched()).toBe(true);
    });
  });
});
