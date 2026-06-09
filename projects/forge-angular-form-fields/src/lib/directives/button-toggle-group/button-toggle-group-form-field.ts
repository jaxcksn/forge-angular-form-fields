import { Directive, effect, inject, input, model } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { ButtonToggleGroupComponent } from '@tylertech/forge-angular';

@Directive({
  selector: 'forge-button-toggle-group[formField]:not([multiple])',
  host: {
    '(forge-button-toggle-group-change)': 'selectionChange($event)',
    '(focusout)': 'blur()',
  },
})
export class ForgeButtonToggleGroupFormFieldDirective<
  T = unknown,
> implements FormValueControl<T | null> {
  private readonly _toggleGroup = inject(ButtonToggleGroupComponent);

  public readonly value = model<T | null>(this._toggleGroup.value ?? null);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);

  constructor() {
    effect(() => {
      this._toggleGroup.value = this.value();
    });

    effect(() => {
      this._toggleGroup.disabled = this.disabled() || this.readonly();
    });

    effect(() => {
      this._toggleGroup.required = this.required();
      this._toggleGroup.mandatory = this.required();
    });

    effect(() => {
      const errors = this.errors();
      const touched = this.touched();

      if (touched && errors.length > 0) {
        this._toggleGroup.setCustomValidity(errors.map((e) => e.message).join(', '));
      } else {
        this._toggleGroup.setCustomValidity('');
      }
    });
  }

  public selectionChange(event: CustomEvent<T | null>): void {
    this.value.set(event.detail);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }
}

@Directive({
  selector: 'forge-button-toggle-group[formField][multiple]',
  host: {
    '(forge-button-toggle-group-change)': 'selectionChange($event)',
    '(focusout)': 'blur()',
    '(blur)': 'blur()',
  },
})
export class ForgeButtonToggleGroupMultipleFormFieldDirective<
  T = unknown,
> implements FormValueControl<T[] | null> {
  private readonly _toggleGroup = inject(ButtonToggleGroupComponent);

  public readonly value = model<T[] | null>((this._toggleGroup.value as T[]) ?? null);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly readonly = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);

  constructor() {
    effect(() => {
      this._toggleGroup.value = this.value();
    });

    effect(() => {
      this._toggleGroup.disabled = this.disabled() || this.readonly();
    });

    effect(() => {
      this._toggleGroup.required = this.required();
      this._toggleGroup.mandatory = this.required();
    });

    effect(() => {
      const errors = this.errors();
      const touched = this.touched();

      if (touched && errors.length > 0) {
        this._toggleGroup.setCustomValidity(errors.map((e) => e.message).join(', '));
      } else {
        this._toggleGroup.setCustomValidity('');
      }
    });
  }

  public selectionChange(event: CustomEvent<T[]>): void {
    const detail = event.detail;
    this.value.set(detail.length > 0 ? detail : this.required() ? null : []);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }
}
