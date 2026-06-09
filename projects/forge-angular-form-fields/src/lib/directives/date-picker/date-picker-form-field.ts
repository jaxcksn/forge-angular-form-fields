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
import { FormDatePickerComponent } from '../../components/date-picker/form-date-picker.component';

@Directive({
  selector: 'forge-date-picker[formField]',
  host: {
    '(forge-date-picker-change)': 'dateChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeDatePickerFormFieldDirective implements FormValueControl<Date | null> {
  private readonly _datePicker = inject(FormDatePickerComponent, { host: true });
  private readonly _textField = contentChild.required(TextFieldComponent);
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<Date | null>(
    this._datePicker.value instanceof Date ? (this._datePicker.value as Date) : null,
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
      this._datePicker.value = this.value();
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
      this._datePicker.disabled = this._effectiveDisabled();
    });

    effect(this._renderSupportText.bind(this));
  }

  public dateChange(event: CustomEvent<Date | string | null>): void {
    const detail = event.detail;
    if (detail instanceof Date) {
      this.value.set(detail);
    } else if (typeof detail === 'string' && detail) {
      const parsed = new Date(detail);
      this.value.set(isNaN(parsed.getTime()) ? null : parsed);
    } else {
      this.value.set(null);
    }
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
