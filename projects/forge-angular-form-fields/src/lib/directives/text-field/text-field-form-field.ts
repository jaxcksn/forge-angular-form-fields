import {
  computed,
  Directive,
  effect,
  ElementRef,
  inject,
  input,
  model,
  Renderer2,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { TextFieldComponent } from '@tylertech/forge-angular';

@Directive({
  selector: 'forge-text-field[formField]:not([number])',
  host: {
    '(input)': 'onInput($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeTextFieldFormFieldDirective implements FormValueControl<string> {
  private readonly _textField = inject(TextFieldComponent, { host: true });
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _renderer = inject(Renderer2);

  public readonly value = model('');
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);
  public readonly pending = input(false);
  public readonly minLength = input<number | undefined>(undefined);
  public readonly maxLength = input<number | undefined>(undefined);

  private readonly _showErrors = computed(() => this.invalid() && this.touched());
  private readonly _effectiveDisabled = computed(() => this.disabled() || this.readonly());

  private get _inputEl(): HTMLInputElement | HTMLTextAreaElement | null {
    return this._elementRef.nativeElement.querySelector('input, textarea');
  }

  constructor() {
    effect(() => {
      const input = this._inputEl;
      if (input) {
        input.value = this.value();
      }
    });

    effect(() => {
      this._textField.invalid = this._showErrors();
    });

    effect(() => {
      this._textField.required = this.required();
    });

    effect(() => {
      this._textField.disabled = this._effectiveDisabled();
    });

    effect(() => {
      const input = this._inputEl;
      if (input) {
        input.readOnly = this.readonly();
      }
    });

    effect(() => {
      const input = this._inputEl;
      if (!input) return;
      const maxLen = this.maxLength();
      if (maxLen !== undefined) {
        input.maxLength = maxLen;
      } else {
        input.removeAttribute('maxlength');
      }
    });

    effect(() => {
      const input = this._inputEl;
      if (!input) return;
      const minLen = this.minLength();
      if (minLen !== undefined) {
        input.minLength = minLen;
      } else {
        input.removeAttribute('minlength');
      }
    });

    effect(this._renderSupportText.bind(this));
    effect(this._renderPendingSpinner.bind(this));
  }

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value.set(target.value);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }

  private _renderSupportText(): void {
    const showErrors = this._showErrors();
    const errors = this.errors();
    const nativeTextField = this._textField.nativeElement;

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

  private _renderPendingSpinner(): void {
    const pending = this.pending();
    const nativeTextField = this._textField.nativeElement;

    const existing = nativeTextField.querySelector('forge-circular-progress[slot="end"]');
    if (existing) {
      existing.remove();
    }

    if (!pending) return;

    const spinner = this._renderer.createElement('forge-circular-progress');
    this._renderer.setAttribute(spinner, 'slot', 'end');
    this._renderer.setAttribute(spinner, 'size', 'xsmall');
    this._renderer.appendChild(nativeTextField, spinner);
  }
}

@Directive({
  selector: 'forge-text-field[formField][number]',
  host: {
    '(input)': 'onInput($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeTextFieldNumberFormFieldDirective implements FormValueControl<number | null> {
  private readonly _textField = inject(TextFieldComponent, { host: true });
  private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<number | null>(null);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);
  public readonly pending = input(false);
  public readonly min = input<number | undefined>(undefined);
  public readonly max = input<number | undefined>(undefined);

  private readonly _showErrors = computed(() => this.invalid() && this.touched());
  private readonly _effectiveDisabled = computed(() => this.disabled() || this.readonly());

  private get _inputEl(): HTMLInputElement | null {
    return this._elementRef.nativeElement.querySelector('input');
  }

  constructor() {
    effect(() => {
      const input = this._inputEl;
      if (input) {
        const val = this.value();
        input.value = val !== null ? String(val) : '';
      }
    });

    effect(() => {
      this._textField.invalid = this._showErrors();
    });

    effect(() => {
      this._textField.required = this.required();
    });

    effect(() => {
      this._textField.disabled = this._effectiveDisabled();
    });

    effect(() => {
      const input = this._inputEl;
      if (input) {
        input.readOnly = this.readonly();
      }
    });

    effect(() => {
      const input = this._inputEl;
      if (!input) return;
      const minVal = this.min();
      if (minVal !== undefined) {
        input.min = String(minVal);
      } else {
        input.removeAttribute('min');
      }
    });

    effect(() => {
      const input = this._inputEl;
      if (!input) return;
      const maxVal = this.max();
      if (maxVal !== undefined) {
        input.max = String(maxVal);
      } else {
        input.removeAttribute('max');
      }
    });

    effect(this._renderSupportText.bind(this));
    effect(this._renderPendingSpinner.bind(this));
  }

  public onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const raw = target.value;
    if (raw === '') {
      this.value.set(null);
    } else {
      const parsed = Number(raw);
      this.value.set(isNaN(parsed) ? null : parsed);
    }
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }

  private _renderSupportText(): void {
    const showErrors = this._showErrors();
    const errors = this.errors();
    const nativeTextField = this._textField.nativeElement;

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

  private _renderPendingSpinner(): void {
    const pending = this.pending();
    const nativeTextField = this._textField.nativeElement;

    const existing = nativeTextField.querySelector('forge-circular-progress[slot="end"]');
    if (existing) {
      existing.remove();
    }

    if (!pending) return;

    const spinner = this._renderer.createElement('forge-circular-progress');
    this._renderer.setAttribute(spinner, 'slot', 'end');
    this._renderer.setAttribute(spinner, 'size', 'xsmall');
    this._renderer.appendChild(nativeTextField, spinner);
  }
}
