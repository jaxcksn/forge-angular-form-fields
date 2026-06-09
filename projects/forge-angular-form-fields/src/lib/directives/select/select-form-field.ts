import {
  computed,
  Directive,
  effect,
  inject,
  input,
  model,
  Renderer2,
} from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { FormSelectComponent } from '../../components/select/form-select.component';

@Directive({
  selector: 'forge-select[formField]:not([multiple])',
  host: {
    '(change)': 'selectionChange($event)',
    '(blur)': 'blur()',
  },
})
export class ForgeSelectFormFieldDirective<T = unknown>
  implements FormValueControl<T | null>
{
  private readonly _select = inject(FormSelectComponent, { host: true });
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<T | null>(this._select.value ?? null);
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
      this._select.value = this.value();
    });

    effect(() => {
      this._select.invalid = this._showErrors();
    });

    effect(() => {
      this._select.required = this.required();
    });

    effect(() => {
      this._select.disabled = this._effectiveDisabled();
    });

    effect(this._renderSupportText.bind(this));
  }

  public selectionChange(event: CustomEvent<T | null>): void {
    const target = event.target as HTMLElement & { value: T | null };
    this.value.set(target.value ?? null);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }

  private _renderSupportText(): void {
    const showErrors = this._showErrors();
    const errors = this.errors();
    const nativeElement = this._select.nativeElement;

    const existing = nativeElement.querySelector('[slot="support-text"]');
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

    this._renderer.appendChild(nativeElement, container);
  }
}

@Directive({
  selector: 'forge-select[formField][multiple]',
  host: {
    '(change)': 'selectionChange($event)',
    '(blur)': 'blur()',
  },
})
export class ForgeSelectMultipleFormFieldDirective<T = unknown>
  implements FormValueControl<T[] | null>
{
  private readonly _select = inject(FormSelectComponent, { host: true });
  private readonly _renderer = inject(Renderer2);

  public readonly value = model<T[] | null>((this._select.value as T[]) ?? null);
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
      this._select.multiple = true;
    });

    effect(() => {
      this._select.value = this.value();
    });

    effect(() => {
      this._select.invalid = this._showErrors();
    });

    effect(() => {
      this._select.required = this.required();
    });

    effect(() => {
      this._select.disabled = this._effectiveDisabled();
    });

    effect(this._renderSupportText.bind(this));
  }

  public selectionChange(event: CustomEvent<T[]>): void {
    const target = event.target as HTMLElement & { value: T[] };
    const val = target.value;
    this.value.set(Array.isArray(val) && val.length > 0 ? val : null);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }

  private _renderSupportText(): void {
    const showErrors = this._showErrors();
    const errors = this.errors();
    const nativeElement = this._select.nativeElement;

    const existing = nativeElement.querySelector('[slot="support-text"]');
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

    this._renderer.appendChild(nativeElement, container);
  }
}
