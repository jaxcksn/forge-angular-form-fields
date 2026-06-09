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
import { FormTimePickerComponent } from '../../components/time-picker/form-time-picker.component';

function timeStringToDate(time: string | null | undefined): Date | null {
  if (!time) return null;
  const parts = time.split(':');
  if (parts.length < 2) return null;
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parts.length > 2 ? parseInt(parts[2], 10) : 0;
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return null;
  const date = new Date(1970, 0, 1, hours, minutes, seconds);
  return date;
}

function dateToTimeString(date: Date | null): string | null {
  if (!date) return null;
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return seconds !== '00' ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
}

@Directive({
  selector: 'forge-time-picker[formField]',
  host: {
    '(forge-time-picker-change)': 'timeChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeTimePickerFormFieldDirective implements FormValueControl<Date | null> {
  private readonly _timePicker = inject(FormTimePickerComponent, { host: true });
  private readonly _textField = contentChild.required(TextFieldComponent);
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<Date | null>(timeStringToDate(this._timePicker.value));
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
      this._timePicker.value = dateToTimeString(this.value());
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
      this._timePicker.disabled = this._effectiveDisabled();
    });

    effect(this._renderSupportText.bind(this));
  }

  public timeChange(event: CustomEvent<string | null>): void {
    this.value.set(timeStringToDate(event.detail));
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
