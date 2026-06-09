import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled } from '@angular/forms/signals';
import { ForgeChipSetFormFieldDirective } from './chip-set-form-field';
import { ForgeChipSetModule, ForgeChipModule, ChipSetComponent } from '@tylertech/forge-angular';

@Component({
  imports: [FormField, ForgeChipSetFormFieldDirective, ForgeChipSetModule, ForgeChipModule],
  template: `
    <forge-chip-set [formField]="testForm.selections">
      <forge-chip value="a">A</forge-chip>
      <forge-chip value="b">B</forge-chip>
      <forge-chip value="c">C</forge-chip>
    </forge-chip-set>
  `,
})
class TestHostComponent {
  formModel = signal<{ selections: string[] | null }>({
    selections: null,
  });

  testForm = form(this.formModel, schema => {
    required(schema.selections, { message: 'Please select at least one chip' });
  });
}

@Component({
  imports: [FormField, ForgeChipSetFormFieldDirective, ForgeChipSetModule, ForgeChipModule],
  template: `
    <forge-chip-set [formField]="testForm.selections">
      <forge-chip value="a">A</forge-chip>
      <forge-chip value="b">B</forge-chip>
    </forge-chip-set>
  `,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ selections: string[] | null }>({
    selections: null,
  });

  testForm = form(this.formModel, schema => {
    disabled(schema.selections, () => this.isDisabled());
  });
}

describe('ForgeChipSetFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeChipSetFormFieldDirective<string>;
    let chipSetComponent: ChipSetComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeChipSetFormFieldDirective);
      chipSetComponent = directiveEl.injector.get(ChipSetComponent);
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

      it('should not show invalid initially', () => {
        expect(chipSetComponent.invalid).toBe(false);
      });
    });

    describe('selectionChange', () => {
      it('should add a chip value when selected', () => {
        const event = new CustomEvent('forge-chip-select', {
          detail: { value: 'a', selected: true },
          bubbles: true,
        });
        directive.selectionChange(event);
        expect(directive.value()).toEqual(['a']);
      });

      it('should add multiple chip values', () => {
        directive.selectionChange(
          new CustomEvent('forge-chip-select', { detail: { value: 'a', selected: true } }),
        );
        directive.selectionChange(
          new CustomEvent('forge-chip-select', { detail: { value: 'b', selected: true } }),
        );
        expect(directive.value()).toEqual(['a', 'b']);
      });

      it('should remove a chip value when deselected', () => {
        directive.value.set(['a', 'b']);
        directive.selectionChange(
          new CustomEvent('forge-chip-select', { detail: { value: 'a', selected: false } }),
        );
        expect(directive.value()).toEqual(['b']);
      });

      it('should set value to null when last chip is deselected and required', () => {
        directive.value.set(['a']);
        directive.selectionChange(
          new CustomEvent('forge-chip-select', { detail: { value: 'a', selected: false } }),
        );
        expect(directive.value()).toBeNull();
      });

      it('should not duplicate values if already selected', () => {
        directive.value.set(['a']);
        directive.selectionChange(
          new CustomEvent('forge-chip-select', { detail: { value: 'a', selected: true } }),
        );
        expect(directive.value()).toEqual(['a']);
      });

      it('should set dirty to true', () => {
        directive.selectionChange(
          new CustomEvent('forge-chip-select', { detail: { value: 'a', selected: true } }),
        );
        expect(directive.dirty()).toBe(true);
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

    describe('effects', () => {
      it('should show invalid on chip set only when touched and invalid', () => {
        expect(chipSetComponent.invalid).toBe(false);

        directive.blur();
        TestBed.tick();
        expect(chipSetComponent.invalid).toBe(true);
      });

      it('should not show invalid when not touched', () => {
        TestBed.tick();
        expect(chipSetComponent.invalid).toBe(false);
      });

      it('should clear invalid when value is selected after touch', () => {
        directive.blur();
        TestBed.tick();
        expect(chipSetComponent.invalid).toBe(true);

        directive.selectionChange(
          new CustomEvent('forge-chip-select', { detail: { value: 'a', selected: true } }),
        );
        TestBed.tick();
        expect(chipSetComponent.invalid).toBe(false);
      });
    });

    describe('host bindings', () => {
      it('should respond to forge-chip-select event dispatched on chip-set', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(
          new CustomEvent('forge-chip-select', {
            detail: { value: 'b', selected: true },
            bubbles: true,
          }),
        );
        expect(directive.value()).toEqual(['b']);
        expect(directive.dirty()).toBe(true);
      });

      it('should respond to forge-chip-select event bubbling from child chip', () => {
        const chipSetEl = fixture.debugElement.children[0].nativeElement as HTMLElement;
        const chipEl = chipSetEl.querySelector('forge-chip[value="a"]')!;
        chipEl.dispatchEvent(
          new CustomEvent('forge-chip-select', {
            detail: { value: 'a', selected: true },
            bubbles: true,
          }),
        );
        expect(directive.value()).toEqual(['a']);
        expect(directive.dirty()).toBe(true);
      });

      it('should respond to focusout event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new Event('focusout', { bubbles: true }));
        expect(directive.touched()).toBe(true);
      });
    });
  });

  describe('with disabled state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<DisabledTestHostComponent>>;
    let host: DisabledTestHostComponent;
    let chipSetComponent: ChipSetComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      chipSetComponent = directiveEl.injector.get(ChipSetComponent);
    });

    it('should not be disabled initially', () => {
      expect(chipSetComponent.disabled).toBe(false);
    });

    it('should sync disabled state to chip set when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(chipSetComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(chipSetComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(chipSetComponent.disabled).toBe(false);
    });
  });
});
