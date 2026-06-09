import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { form, FormField, required, min, max, disabled } from '@angular/forms/signals';
import { ForgeSliderFormFieldDirective, ForgeSliderRangeFormFieldDirective, SliderRange } from './slider-form-field';
import { FormSliderComponent } from '../../components/slider/form-slider.component';

@Component({
  imports: [FormField, ForgeSliderFormFieldDirective, FormSliderComponent],
  template: `<forge-slider [formField]="testForm.volume"></forge-slider>`,
})
class TestHostComponent {
  formModel = signal({ volume: 50 });

  testForm = form(this.formModel, schema => {
    required(schema.volume, { message: 'Volume is required' });
    min(schema.volume, 0, { message: 'Volume must be at least 0' });
    max(schema.volume, 100, { message: 'Volume must be at most 100' });
  });
}

@Component({
  imports: [FormField, ForgeSliderFormFieldDirective, FormSliderComponent],
  template: `<forge-slider [formField]="testForm.volume"></forge-slider>`,
})
class DisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal({ volume: 25 });

  testForm = form(this.formModel, schema => {
    disabled(schema.volume, () => this.isDisabled());
  });
}

@Component({
  imports: [FormField, ForgeSliderRangeFormFieldDirective, FormSliderComponent],
  template: `<forge-slider range [formField]="testForm.priceRange"></forge-slider>`,
})
class RangeTestHostComponent {
  formModel = signal({ priceRange: { start: 20, end: 80 } as SliderRange });

  testForm = form(this.formModel, schema => {
    required(schema.priceRange, { message: 'Price range is required' });
  });
}

@Component({
  imports: [FormField, ForgeSliderRangeFormFieldDirective, FormSliderComponent],
  template: `<forge-slider range [formField]="testForm.priceRange"></forge-slider>`,
})
class RangeDisabledTestHostComponent {
  isDisabled = signal(false);
  formModel = signal({ priceRange: { start: 33, end: 67 } as SliderRange });

  testForm = form(this.formModel, schema => {
    disabled(schema.priceRange, () => this.isDisabled());
  });
}

describe('ForgeSliderFormFieldDirective', () => {
  describe('with validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<TestHostComponent>>;
    let directive: ForgeSliderFormFieldDirective;
    let sliderComponent: FormSliderComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestHostComponent],
      });

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeSliderFormFieldDirective);
      sliderComponent = directiveEl.injector.get(FormSliderComponent);
    });

    describe('initial state', () => {
      it('should initialize value to 50', () => {
        expect(directive.value()).toBe(50);
      });

      it('should initialize touched to false', () => {
        expect(directive.touched()).toBe(false);
      });

      it('should initialize dirty to false', () => {
        expect(directive.dirty()).toBe(false);
      });

      it('should sync min constraint to the slider', () => {
        expect(sliderComponent.nativeElement.min).toBe(0);
      });

      it('should sync max constraint to the slider', () => {
        expect(sliderComponent.nativeElement.max).toBe(100);
      });
    });

    describe('sliderChange', () => {
      it('should update value from event', () => {
        const event = new CustomEvent('forge-slider-change', { detail: { value: 75 } });
        directive.sliderChange(event);
        expect(directive.value()).toBe(75);
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('forge-slider-change', { detail: { value: 30 } });
        directive.sliderChange(event);
        expect(directive.dirty()).toBe(true);
      });

      it('should remain dirty after multiple changes', () => {
        directive.sliderChange(new CustomEvent('forge-slider-change', { detail: { value: 30 } }));
        directive.sliderChange(new CustomEvent('forge-slider-change', { detail: { value: 60 } }));
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
      it('should sync value to the slider native element', () => {
        directive.value.set(80);
        TestBed.tick();
        expect(sliderComponent.nativeElement.value).toBe(80);
      });

      it('should sync value changes back to slider', () => {
        directive.value.set(10);
        TestBed.tick();
        expect(sliderComponent.nativeElement.value).toBe(10);

        directive.value.set(90);
        TestBed.tick();
        expect(sliderComponent.nativeElement.value).toBe(90);
      });
    });

    describe('host bindings', () => {
      it('should call sliderChange on forge-slider-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new CustomEvent('forge-slider-change', { detail: { value: 42 } }));
        expect(directive.value()).toBe(42);
      });

      it('should call blur on focusout event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new Event('focusout'));
        expect(directive.touched()).toBe(true);
      });
    });
  });

  describe('with disabled state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<DisabledTestHostComponent>>;
    let host: DisabledTestHostComponent;
    let sliderComponent: FormSliderComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [DisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(DisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      sliderComponent = directiveEl.injector.get(FormSliderComponent);
    });

    it('should not be disabled initially', () => {
      expect(sliderComponent.disabled).toBe(false);
    });

    it('should sync disabled state to slider when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(sliderComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(sliderComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(sliderComponent.disabled).toBe(false);
    });
  });
});

describe('ForgeSliderRangeFormFieldDirective', () => {
  describe('with validation', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<RangeTestHostComponent>>;
    let directive: ForgeSliderRangeFormFieldDirective;
    let sliderComponent: FormSliderComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RangeTestHostComponent],
      });

      fixture = TestBed.createComponent(RangeTestHostComponent);
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      directive = directiveEl.injector.get(ForgeSliderRangeFormFieldDirective);
      sliderComponent = directiveEl.injector.get(FormSliderComponent);
    });

    describe('initial state', () => {
      it('should initialize value with start and end', () => {
        expect(directive.value()).toEqual({ start: 20, end: 80 });
      });

      it('should initialize touched to false', () => {
        expect(directive.touched()).toBe(false);
      });

      it('should initialize dirty to false', () => {
        expect(directive.dirty()).toBe(false);
      });

      it('should sync start value to the slider', () => {
        expect(sliderComponent.nativeElement.valueStart).toBe(20);
      });

      it('should sync end value to the slider', () => {
        expect(sliderComponent.nativeElement.valueEnd).toBe(80);
      });
    });

    describe('rangeChange', () => {
      it('should update value from range event', () => {
        const event = new CustomEvent('forge-slider-range-change', {
          detail: { valueStart: 10, valueEnd: 90 },
        });
        directive.rangeChange(event);
        expect(directive.value()).toEqual({ start: 10, end: 90 });
      });

      it('should set dirty to true', () => {
        const event = new CustomEvent('forge-slider-range-change', {
          detail: { valueStart: 25, valueEnd: 75 },
        });
        directive.rangeChange(event);
        expect(directive.dirty()).toBe(true);
      });
    });

    describe('blur', () => {
      it('should set touched to true', () => {
        directive.blur();
        expect(directive.touched()).toBe(true);
      });
    });

    describe('effects', () => {
      it('should sync range value to the slider native element', () => {
        directive.value.set({ start: 15, end: 85 });
        TestBed.tick();
        expect(sliderComponent.nativeElement.valueStart).toBe(15);
        expect(sliderComponent.nativeElement.valueEnd).toBe(85);
      });
    });

    describe('host bindings', () => {
      it('should call rangeChange on forge-slider-range-change event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(
          new CustomEvent('forge-slider-range-change', {
            detail: { valueStart: 5, valueEnd: 95 },
          }),
        );
        expect(directive.value()).toEqual({ start: 5, end: 95 });
      });

      it('should call blur on focusout event', () => {
        const el = fixture.debugElement.children[0].nativeElement;
        el.dispatchEvent(new Event('focusout'));
        expect(directive.touched()).toBe(true);
      });
    });
  });

  describe('with disabled state', () => {
    let fixture: ReturnType<typeof TestBed.createComponent<RangeDisabledTestHostComponent>>;
    let host: RangeDisabledTestHostComponent;
    let sliderComponent: FormSliderComponent;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [RangeDisabledTestHostComponent],
      });

      fixture = TestBed.createComponent(RangeDisabledTestHostComponent);
      host = fixture.componentInstance;
      fixture.detectChanges();

      const directiveEl = fixture.debugElement.children[0];
      sliderComponent = directiveEl.injector.get(FormSliderComponent);
    });

    it('should not be disabled initially', () => {
      expect(sliderComponent.disabled).toBe(false);
    });

    it('should sync disabled state to slider when form disables it', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(sliderComponent.disabled).toBe(true);
    });

    it('should sync enabled state back when re-enabled', () => {
      host.isDisabled.set(true);
      TestBed.tick();
      expect(sliderComponent.disabled).toBe(true);

      host.isDisabled.set(false);
      TestBed.tick();
      expect(sliderComponent.disabled).toBe(false);
    });
  });
});
