import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled } from '@angular/forms/signals';
import { ForgeSwitchFormFieldDirective } from './switch-form-field';
import { ForgeSwitchModule, SwitchComponent } from '@tylertech/forge-angular';

@Component({
  imports: [FormField, ForgeSwitchFormFieldDirective, ForgeSwitchModule],
  template: `<forge-switch [formField]="testForm.enabled">Enable notifications</forge-switch>`,
})
class TestHostComponent {
  formModel = signal({ enabled: false });

  testForm = form(this.formModel, schema => {
    required(schema.enabled, { message: 'You must enable this' });
  });
}

@Component({
  imports: [FormField, ForgeSwitchFormFieldDirective, ForgeSwitchModule],
  template: `<forge-switch [formField]="testForm.enabled">Enable notifications</forge-switch>`,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal({ enabled: false });

  testForm = form(this.formModel, schema => {
    disabled(schema.enabled, () => this.isDisabled());
  });
}

describe('ForgeSwitchFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeSwitchFormFieldDirective;
    let switchComponent: SwitchComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeSwitchFormFieldDirective);
      switchComponent = directiveEl.injector.get(SwitchComponent);
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

      it('should sync required to the switch', () => {
        expect(switchComponent.required).toBe(true);
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
      it('should sync checked state to the switch', () => {
        directive.checked.set(true);
        TestBed.tick();
        expect(switchComponent.checked).toBe(true);
      });

      it('should sync checked false to the switch', () => {
        directive.checked.set(true);
        TestBed.tick();
        directive.checked.set(false);
        TestBed.tick();
        expect(switchComponent.checked).toBe(false);
      });
    });

    describe('host bindings', () => {
      it('should call switchChange on forge-switch-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new CustomEvent('forge-switch-change', { detail: true }));
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
    let switchComponent: SwitchComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      switchComponent = directiveEl.injector.get(SwitchComponent);
    });

    it('should not be disabled initially', () => {
      expect(switchComponent.disabled).toBe(false);
    });

    it('should sync disabled state to switch when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(switchComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(switchComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(switchComponent.disabled).toBe(false);
    });
  });
});
