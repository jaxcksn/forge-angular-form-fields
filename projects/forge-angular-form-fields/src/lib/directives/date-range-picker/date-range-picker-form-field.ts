import {
  computed,
  contentChild,
  Directive,
  effect,
  inject,
  input,
  model,
  Renderer2,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { TextFieldComponent } from '@tylertech/forge-angular';
import { FormDateRangePickerComponent } from '../../components/date-range-picker/form-date-range-picker.component';

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

function toDate(value: Date | string | null | undefined): Date | null {
  if (value instanceof Date) return value;
  if (typeof value === 'string' && value) {
    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

@Directive({
  selector: 'forge-date-range-picker[formField]',
  host: {
    '(forge-date-range-picker-change)': 'rangeChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeDateRangePickerFormFieldDirective implements FormValueControl<DateRange | null> {
  private readonly _rangePicker = inject(FormDateRangePickerComponent, { host: true });
  private readonly _textField = contentChild.required(TextFieldComponent);
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<DateRange | null>(
    this._rangePicker.from || this._rangePicker.to
      ? { from: toDate(this._rangePicker.from), to: toDate(this._rangePicker.to) }
      : null,
  );
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);

  private readonly _showErrors = computed(() => this.invalid() && this.touched());
  private readonly _effectiveDisabled = computed(() => this.disabled() || this.readonly());

  constructor() {
    effect(() => {
      const val = this.value();
      this._rangePicker.from = val?.from ?? null;
      this._rangePicker.to = val?.to ?? null;
    });

    effect(() => {
      this._textField().invalid = this._showErrors();
    });

    effect(() => {
      this._textField().required = this.required();
    });

    effect(() => {
      this._textField().disabled = this._effectiveDisabled();
    });

    effect(() => {
      this._rangePicker.disabled = this._effectiveDisabled();
    });

    effect(this._renderSupportText.bind(this));
  }

  public rangeChange(
    event: CustomEvent<{ from?: Date | string | null; to?: Date | string | null }>,
  ): void {
    const detail = event.detail;
    const from = toDate(detail?.from);
    const to = toDate(detail?.to);
    this.value.set(from || to ? { from, to } : null);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }

  private _renderSupportText(): void {
    const showErrors = this._showErrors();
    const errors = this.errors();
    const nativeTextField = this._textField().nativeElement;

    const existing = nativeTextField.querySelector('[slot="support-text"]');
    if (existing) {
      existing.remove();
    }

    if (!showErrors || errors.length === 0) return;

    const container = this._renderer.createElement('span');
    this._renderer.setAttribute(container, 'slot', 'support-text');

    if (errors.length === 1) {
      const text = this._renderer.createText(errors[0].message ?? '');
      this._renderer.appendChild(container, text);
    } else {
      const ul = this._renderer.createElement('ul');
      for (const error of errors) {
        const li = this._renderer.createElement('li');
        const text = this._renderer.createText(error.message ?? '');
        this._renderer.appendChild(li, text);
        this._renderer.appendChild(ul, li);
      }
      this._renderer.appendChild(container, ul);
    }

    this._renderer.appendChild(nativeTextField, container);
  }
}
