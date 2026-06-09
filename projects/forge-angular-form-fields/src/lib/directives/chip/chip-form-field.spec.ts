import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled } from '@angular/forms/signals';
import { ForgeChipFormFieldDirective } from './chip-form-field';
import { ForgeChipModule, ChipComponent } from '@tylertech/forge-angular';

@Component({
  imports: [FormField, ForgeChipFormFieldDirective, ForgeChipModule],
  template: `<forge-chip [formField]="testForm.accepted">Accept</forge-chip>`,
})
class TestHostComponent {
  formModel = signal({ accepted: false });

  testForm = form(this.formModel, schema => {
    required(schema.accepted, { message: 'You must accept' });
  });
}

@Component({
  imports: [FormField, ForgeChipFormFieldDirective, ForgeChipModule],
  template: `<forge-chip [formField]="testForm.accepted">Accept</forge-chip>`,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal({ accepted: false });

  testForm = form(this.formModel, schema => {
    disabled(schema.accepted, () => this.isDisabled());
  });
}

describe('ForgeChipFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeChipFormFieldDirective;
    let chipComponent: ChipComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeChipFormFieldDirective);
      chipComponent = directiveEl.injector.get(ChipComponent);
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

      it('should sync selected to the chip', () => {
        expect(chipComponent.selected).toBe(false);
      });

      it('should not show invalid initially', () => {
        expect(chipComponent.invalid).toBe(false);
      });
    });

    describe('selectChange', () => {
      it('should set checked to true on select', () => {
        directive.selectChange(new CustomEvent('forge-chip-select', { detail: { selected: true, value: undefined } }));
        expect(directive.checked()).toBe(true);
      });

      it('should set checked to false on deselect', () => {
        directive.checked.set(true);
        directive.selectChange(new CustomEvent('forge-chip-select', { detail: { selected: false, value: undefined } }));
        expect(directive.checked()).toBe(false);
      });

      it('should set dirty to true', () => {
        directive.selectChange(new CustomEvent('forge-chip-select', { detail: { selected: true, value: undefined } }));
        expect(directive.dirty()).toBe(true);
      });

      it('should remain dirty after multiple selections', () => {
        directive.selectChange(new CustomEvent('forge-chip-select', { detail: { selected: true, value: undefined } }));
        directive.selectChange(new CustomEvent('forge-chip-select', { detail: { selected: false, value: undefined } }));
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
      it('should sync checked state to chip selected', () => {
        directive.checked.set(true);
        TestBed.tick();
        expect(chipComponent.selected).toBe(true);
      });

      it('should sync checked false to chip selected', () => {
        directive.checked.set(true);
        TestBed.tick();
        directive.checked.set(false);
        TestBed.tick();
        expect(chipComponent.selected).toBe(false);
      });

      it('should show invalid on chip only when touched and invalid', () => {
        expect(chipComponent.invalid).toBe(false);

        directive.blur();
        TestBed.tick();
        expect(chipComponent.invalid).toBe(true);
      });

      it('should not show invalid when not touched', () => {
        TestBed.tick();
        expect(chipComponent.invalid).toBe(false);
      });
    });

    describe('host bindings', () => {
      it('should call selectChange on forge-chip-select event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new CustomEvent('forge-chip-select', { detail: { selected: true, value: undefined } }));
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
    let chipComponent: ChipComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      chipComponent = directiveEl.injector.get(ChipComponent);
    });

    it('should not be disabled initially', () => {
      expect(chipComponent.disabled).toBe(false);
    });

    it('should sync disabled state to chip when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(chipComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(chipComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(chipComponent.disabled).toBe(false);
    });
  });
});
