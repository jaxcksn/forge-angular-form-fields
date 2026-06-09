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
import { AutocompleteComponent, TextFieldComponent } from '@tylertech/forge-angular';

@Directive({
  selector: 'forge-autocomplete[formField]:not([multiple])',
  host: {
    '(forge-autocomplete-change)': 'selectionChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeAutocompleteFormFieldDirective<T = unknown>
  implements FormValueControl<T | null>
{
  private readonly _autocomplete = inject(AutocompleteComponent, {
    host: true,
  });
  private readonly _textField = contentChild.required(TextFieldComponent);
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<T | null>(this._autocomplete.value ?? null);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);
  public readonly pending = input(false);

  private readonly _showErrors = computed(() => this.invalid() && this.touched());
  private readonly _effectiveDisabled = computed(() => this.disabled() || this.readonly());

  constructor() {
    effect(() => {
      this._autocomplete.value = this.value();
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

    effect(this._renderSupportText.bind(this));

    effect(this._renderPendingSpinner.bind(this));
  }

  public selectionChange(event: CustomEvent<T | null>): void {
    this.value.set(event.detail);
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

  private _renderPendingSpinner(): void {
    const pending = this.pending();
    const nativeTextField = this._textField().nativeElement;

    const existing = nativeTextField.querySelector('[slot="start"]');
    if (existing) {
      existing.remove();
    }

    if (!pending) return;

    const spinner = this._renderer.createElement('forge-circular-progress');
    this._renderer.setAttribute(spinner, 'slot', 'start');
    this._renderer.setAttribute(spinner, 'size', 'xsmall');
    this._renderer.appendChild(nativeTextField, spinner);
  }
}

@Directive({
  selector: 'forge-autocomplete[formField][multiple]',
  host: {
    '(forge-autocomplete-change)': 'selectionChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeAutocompleteMultipleFormFieldDirective<T = unknown>
  implements FormValueControl<T[] | null>
{
  private readonly _autocomplete = inject(AutocompleteComponent, {
    host: true,
  });
  private readonly _textField = contentChild.required(TextFieldComponent);
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<T[] | null>((this._autocomplete.value as T[]) ?? null);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);
  public readonly pending = input(false);

  private readonly _showErrors = computed(() => this.invalid() && this.touched());
  private readonly _effectiveDisabled = computed(() => this.disabled() || this.readonly());

  constructor() {
    effect(() => {
      this._autocomplete.multiple = true;
    });

    effect(() => {
      this._autocomplete.value = this.value();
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

    effect(this._renderSupportText.bind(this));

    effect(this._renderPendingSpinner.bind(this));
  }

  public selectionChange(event: CustomEvent<T[]>): void {
    const detail = event.detail;
    this.value.set(detail.length > 0 ? detail : this.required() ? null : []);
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

  private _renderPendingSpinner(): void {
    const pending = this.pending();
    const nativeTextField = this._textField().nativeElement;

    const existing = nativeTextField.querySelector('[slot="start"]');
    if (existing) {
      existing.remove();
    }

    if (!pending) return;

    const spinner = this._renderer.createElement('forge-circular-progress');
    this._renderer.setAttribute(spinner, 'slot', 'start');
    this._renderer.setAttribute(spinner, 'size', 'xsmall');
    this._renderer.appendChild(nativeTextField, spinner);
  }
}
