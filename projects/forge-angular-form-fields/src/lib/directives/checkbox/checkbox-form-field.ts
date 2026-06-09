import { Directive, effect, inject, input, model } from '@angular/core';
import { FormCheckboxControl, ValidationError } from '@angular/forms/signals';
import { CheckboxComponent } from '@tylertech/forge-angular';

@Directive({
  selector: 'forge-checkbox[formField]',
  host: {
    '(change)': 'switchChange()',
    '(blur)': 'blur()',
  },
})
export class ForgeCheckboxFormDirective implements FormCheckboxControl {
  private readonly _checkbox = inject(CheckboxComponent);
  private _initialValue = this._checkbox.checked || this._checkbox.defaultChecked || false;

  public readonly checked = model(this._initialValue);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);

  constructor() {
    // Sync initial state from the checkbox to the form control
    effect(() => {
      this._checkbox.checked = this.checked();
    });

    // Sync validation state to the checkbox
    effect(() => {
      this._checkbox.required = this.required();
    });

    // Sync disabled state to the checkbox
    effect(() => {
      this._checkbox.disabled = this.disabled();
    });
  }

  public switchChange(): void {
    const nextValue = !this.checked();
    this.checked.set(nextValue);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }
}
