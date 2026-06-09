import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, disabled, readonly } from '@angular/forms/signals';
import {
  ForgeButtonToggleGroupFormFieldDirective,
  ForgeButtonToggleGroupMultipleFormFieldDirective,
} from './button-toggle-group-form-field';
import { ForgeButtonToggleGroupModule, ButtonToggleGroupComponent } from '@tylertech/forge-angular';

@Component({
  imports: [FormField, ForgeButtonToggleGroupFormFieldDirective, ForgeButtonToggleGroupModule],
  template: `
    <forge-button-toggle-group [formField]="testForm.selection">
      <forge-button-toggle value="a">A</forge-button-toggle>
      <forge-button-toggle value="b">B</forge-button-toggle>
      <forge-button-toggle value="c">C</forge-button-toggle>
    </forge-button-toggle-group>
  `,
})
class TestHostComponent {
  formModel = signal<{ selection: string | null }>({
    selection: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selection, { message: 'Selection is required' });
  });
}

@Component({
  imports: [FormField, ForgeButtonToggleGroupFormFieldDirective, ForgeButtonToggleGroupModule],
  template: `
    <forge-button-toggle-group [formField]="testForm.selection">
      <forge-button-toggle value="a">A</forge-button-toggle>
      <forge-button-toggle value="b">B</forge-button-toggle>
    </forge-button-toggle-group>
  `,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal<{ selection: string | null }>({
    selection: null,
  });

  testForm = form(this.formModel, (schema) => {
    disabled(schema.selection, () => this.isDisabled());
  });
}

@Component({
  imports: [FormField, ForgeButtonToggleGroupFormFieldDirective, ForgeButtonToggleGroupModule],
  template: `
    <forge-button-toggle-group [formField]="testForm.selection">
      <forge-button-toggle value="a">A</forge-button-toggle>
      <forge-button-toggle value="b">B</forge-button-toggle>
    </forge-button-toggle-group>
  `,
})
class ReadonlyTestHostComponent {
  isReadonly = signal(false);
  formModel = signal<{ selection: string | null }>({
    selection: null,
  });

  testForm = form(this.formModel, (schema) => {
    readonly(schema.selection, () => this.isReadonly());
  });
}

@Component({
  imports: [
    FormField,
    ForgeButtonToggleGroupMultipleFormFieldDirective,
    ForgeButtonToggleGroupModule,
  ],
  template: `
    <forge-button-toggle-group multiple [formField]="testForm.selection">
      <forge-button-toggle value="a">A</forge-button-toggle>
      <forge-button-toggle value="b">B</forge-button-toggle>
      <forge-button-toggle value="c">C</forge-button-toggle>
    </forge-button-toggle-group>
  `,
})
class MultipleTestHostComponent {
  formModel = signal<{ selection: string[] | null }>({
    selection: null,
  });

  testForm = form(this.formModel, (schema) => {
    required(schema.selection, { message: 'Selection is required' });
  });
}

describe('ForgeButtonToggleGroupFormFieldDirective', () => {
  describe('with required validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeButtonToggleGroupFormFieldDirective<string>;
    let toggleGroupComponent: ButtonToggleGroupComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeButtonToggleGroupFormFieldDirective);
      toggleGroupComponent = directiveEl.injector.get(ButtonToggleGroupComponent);
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

      it('should sync required to the toggle group', () => {
        expect(toggleGroupComponent.required).toBe(true);
      });

      it('should not set custom validity before touch', () => {
        expect(toggleGroupComponent.validationMessage).toBe('');
      });
    });

    describe('selectionChange', () => {
      it('should update value on selection', () => {
        const event = new CustomEvent('forge-button-toggle-group-change', { detail: 'a' });
        directive.selectionChange(event);
        expect(directive.value()).toBe('a');
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('forge-button-toggle-group-change', { detail: 'a' });
        directive.selectionChange(event);
        expect(directive.dirty()).toBe(true);
      });

      it('should handle null selection', () => {
        directive.value.set('a');
        const event = new CustomEvent('forge-button-toggle-group-change', { detail: null });
        directive.selectionChange(event);
        expect(directive.value()).toBeNull();
      });

      it('should sync value to the toggle group component', () => {
        directive.value.set('b');
        TestBed.tick();
        expect(toggleGroupComponent.value).toBe('b');
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

    describe('host bindings', () => {
      it('should respond to forge-button-toggle-group-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(
          new CustomEvent('forge-button-toggle-group-change', { detail: 'b', bubbles: true }),
        );
        expect(directive.value()).toBe('b');
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
    let toggleGroupComponent: ButtonToggleGroupComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      toggleGroupComponent = directiveEl.injector.get(ButtonToggleGroupComponent);
    });

    it('should not be disabled initially', () => {
      expect(toggleGroupComponent.disabled).toBe(false);
    });

    it('should sync disabled state to toggle group when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(toggleGroupComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(toggleGroupComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(toggleGroupComponent.disabled).toBe(false);
    });
  });

  describe('with readonly state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<ReadonlyTestHostComponent>>;
    let host: ReadonlyTestHostComponent;
    let toggleGroupComponent: ButtonToggleGroupComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ReadonlyTestHostComponent],
      });

      fixture = TestBed.createComponent(ReadonlyTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      toggleGroupComponent = directiveEl.injector.get(ButtonToggleGroupComponent);
    });

    it('should not be disabled initially', () => {
      expect(toggleGroupComponent.disabled).toBe(false);
    });

    it('should set toggle group disabled when readonly', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(toggleGroupComponent.disabled).toBe(true);
    });

    it('should clear disabled when readonly is removed', () => {
      host.isReadonly.set(true);
      TestBed.tick();
      expect(toggleGroupComponent.disabled).toBe(true);

      host.isReadonly.set(false);
      TestBed.tick();
      expect(toggleGroupComponent.disabled).toBe(false);
    });
  });
});

describe('ForgeButtonToggleGroupMultipleFormFieldDirective', () => {
  let fixture: ReturnType<typeof TestBed.createComponent<MultipleTestHostComponent>>;
  let directive: ForgeButtonToggleGroupMultipleFormFieldDirective<string>;
  let toggleGroupComponent: ButtonToggleGroupComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MultipleTestHostComponent],
    });

    fixture = TestBed.createComponent(MultipleTestHostComponent);
    fixture.detectChanges();

    const directiveEl = fixture.debugElement.children[0];
    directive = directiveEl.injector.get(ForgeButtonToggleGroupMultipleFormFieldDirective);
    toggleGroupComponent = directiveEl.injector.get(ButtonToggleGroupComponent);
  });

  describe('initial state', () => {
    it('should initialize value to null', () => {
      expect(directive.value()).toBeNull();
    });

    it('should set multiple on the toggle group', () => {
      expect(toggleGroupComponent.multiple).toBe(true);
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
      const event = new CustomEvent('forge-button-toggle-group-change', {
        detail: ['a', 'b'],
      });
      directive.selectionChange(event);
      expect(directive.value()).toEqual(['a', 'b']);
    });

    it('should set value to null when empty array is emitted', () => {
      directive.value.set(['a']);
      const event = new CustomEvent('forge-button-toggle-group-change', {
        detail: [],
      });
      directive.selectionChange(event);
      expect(directive.value()).toBeNull();
    });

    it('should set dirty to true', () => {
      const event = new CustomEvent('forge-button-toggle-group-change', {
        detail: ['a'],
      });
      directive.selectionChange(event);
      expect(directive.dirty()).toBe(true);
    });

    it('should sync value to the toggle group component', () => {
      directive.value.set(['a', 'c']);
      TestBed.tick();
      expect(toggleGroupComponent.value).toEqual(['a', 'c']);
    });
  });

  describe('blur', () => {
    it('should set touched to true on focusout', () => {
      directive.blur();
      expect(directive.touched()).toBe(true);
    });
  });

  describe('host bindings', () => {
    it('should respond to forge-button-toggle-group-change event', () => {
      const el = fixture.debugElement.children[0].nativeElement;
      el.dispatchEvent(
        new CustomEvent('forge-button-toggle-group-change', {
          detail: ['a', 'b'],
          bubbles: true,
        }),
      );
      expect(directive.value()).toEqual(['a', 'b']);
      expect(directive.dirty()).toBe(true);
    });

    it('should respond to focusout event', () => {
      const el = fixture.debugElement.children[0].nativeElement;
      el.dispatchEvent(new Event('focusout', { bubbles: true }));
      expect(directive.touched()).toBe(true);
    });
  });
});
