import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled } from '@angular/forms/signals';
import { ForgeCheckboxFormDirective } from './checkbox-form-field';
import { ForgeCheckboxModule, CheckboxComponent } from '@tylertech/forge-angular';

@Component({
  imports: [FormField, ForgeCheckboxFormDirective, ForgeCheckboxModule],
  template: `<forge-checkbox [formField]="testForm.accepted"></forge-checkbox>`,
})
class TestHostComponent {
  formModel = signal({ accepted: false });

  testForm = form(this.formModel, schema => {
    required(schema.accepted, { message: 'You must accept' });
  });
}

@Component({
  imports: [FormField, ForgeCheckboxFormDirective, ForgeCheckboxModule],
  template: `<forge-checkbox [formField]="testForm.accepted"></forge-checkbox>`,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal({ accepted: false });

  testForm = form(this.formModel, schema => {
    disabled(schema.accepted, () => this.isDisabled());
  });
}

describe('ForgeCheckboxFormDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeCheckboxFormDirective;
    let checkboxComponent: CheckboxComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeCheckboxFormDirective);
      checkboxComponent = directiveEl.injector.get(CheckboxComponent);
    });

    describe('initial state', () => {
      it('should initialize checked to false by default', () => {
        expect(directive.checked()).toBe(false);
      });

      it('should initialize touched to false', () => {
        expect(directive.touched()).toBe(false);
      });

      it('should initialize dirty to false', () => {
        expect(directive.dirty()).toBe(false);
      });

      it('should sync required to the checkbox', () => {
        expect(checkboxComponent.required).toBe(true);
      });
    });

    describe('switchChange', () => {
      it('should toggle checked from false to true', () => {
        directive.switchChange();
        expect(directive.checked()).toBe(true);
      });

      it('should toggle checked from true to false', () => {
        directive.checked.set(true);
        directive.switchChange();
        expect(directive.checked()).toBe(false);
      });

      it('should set dirty to true', () => {
        directive.switchChange();
        expect(directive.dirty()).toBe(true);
      });

      it('should remain dirty after multiple toggles', () => {
        directive.switchChange();
        directive.switchChange();
        expect(directive.dirty()).toBe(true);
      });
    });

    describe('blur', () => {
      it('should set touched to true', () => {
        directive.blur();
        expect(directive.touched()).toBe(true);
      });

      it('should remain touched after multiple blur calls', () => {
        directive.blur();
        directive.blur();
        expect(directive.touched()).toBe(true);
      });
    });

    describe('effects', () => {
      it('should sync checked state to the checkbox', () => {
        directive.checked.set(true);
        TestBed.tick();
        expect(checkboxComponent.checked).toBe(true);
      });

      it('should sync checked false to the checkbox', () => {
        directive.checked.set(true);
        TestBed.tick();
        directive.checked.set(false);
        TestBed.tick();
        expect(checkboxComponent.checked).toBe(false);
      });
    });

    describe('host bindings', () => {
      it('should call switchChange on change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new Event('change'));
        expect(directive.checked()).toBe(true);
      });

      it('should call blur on blur event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new Event('blur'));
        expect(directive.touched()).toBe(true);
      });
    });
  });

  describe('with disabled state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<DisabledTestHostComponent>>;
    let host: DisabledTestHostComponent;
    let checkboxComponent: CheckboxComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      checkboxComponent = directiveEl.injector.get(CheckboxComponent);
    });

    it('should not be disabled initially', () => {
      expect(checkboxComponent.disabled).toBe(false);
    });

    it('should sync disabled state to checkbox when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(checkboxComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(checkboxComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(checkboxComponent.disabled).toBe(false);
    });
  });
});
