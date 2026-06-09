import {
  computed,
  Directive,
  effect,
  inject,
  input,
  model,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { ISliderChangeEventData, ISliderRangeChangeEventData } from '@tylertech/forge';
import { FormSliderComponent } from '../../components/slider/form-slider.component';

export interface SliderRange {
  start: number;
  end: number;
}

@Directive({
  selector: 'forge-slider[formField]:not([range])',
  host: {
    '(forge-slider-change)': 'sliderChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeSliderFormFieldDirective implements FormValueControl<number> {
  private readonly _slider = inject(FormSliderComponent, { host: true });

  public readonly value = model(this._slider.value ?? 50);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly min = input<number | undefined>(undefined);
  public readonly max = input<number | undefined>(undefined);
  public readonly step = input<number | undefined>(undefined);

  private readonly _effectiveDisabled = computed(() => this.disabled() || this.readonly());

  constructor() {
    effect(() => {
      this._slider.nativeElement.value = this.value();
    });

    effect(() => {
      this._slider.disabled = this._effectiveDisabled();
    });

    effect(() => {
      this._slider.nativeElement.readonly = this.readonly();
    });

    effect(() => {
      const minVal = this.min();
      if (minVal !== undefined) {
        this._slider.nativeElement.min = minVal;
      }
    });

    effect(() => {
      const maxVal = this.max();
      if (maxVal !== undefined) {
        this._slider.nativeElement.max = maxVal;
      }
    });

    effect(() => {
      const stepVal = this.step();
      if (stepVal !== undefined) {
        this._slider.nativeElement.step = stepVal;
      }
    });
  }

  public sliderChange(event: CustomEvent<ISliderChangeEventData>): void {
    this.value.set(event.detail.value);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }
}

@Directive({
  selector: 'forge-slider[formField][range]',
  host: {
    '(forge-slider-range-change)': 'rangeChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeSliderRangeFormFieldDirective implements FormValueControl<SliderRange> {
  private readonly _slider = inject(FormSliderComponent, { host: true });

  public readonly value = model<SliderRange>({
    start: this._slider.valueStart ?? 33,
    end: this._slider.valueEnd ?? 67,
  });
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly min = input<number | undefined>(undefined);
  public readonly max = input<number | undefined>(undefined);
  public readonly step = input<number | undefined>(undefined);

  private readonly _effectiveDisabled = computed(() => this.disabled() || this.readonly());

  constructor() {
    effect(() => {
      const val = this.value();
      this._slider.nativeElement.valueStart = val.start;
      this._slider.nativeElement.valueEnd = val.end;
    });

    effect(() => {
      this._slider.disabled = this._effectiveDisabled();
    });

    effect(() => {
      this._slider.nativeElement.readonly = this.readonly();
    });

    effect(() => {
      const minVal = this.min();
      if (minVal !== undefined) {
        this._slider.nativeElement.min = minVal;
      }
    });

    effect(() => {
      const maxVal = this.max();
      if (maxVal !== undefined) {
        this._slider.nativeElement.max = maxVal;
      }
    });

    effect(() => {
      const stepVal = this.step();
      if (stepVal !== undefined) {
        this._slider.nativeElement.step = stepVal;
      }
    });
  }

  public rangeChange(event: CustomEvent<ISliderRangeChangeEventData>): void {
    this.value.set({
      start: event.detail.valueStart,
      end: event.detail.valueEnd,
    });
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }
}
