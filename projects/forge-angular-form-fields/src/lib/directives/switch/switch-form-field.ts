import { Directive, effect, inject, input, model } from '@angular/core';
import { FormCheckboxControl, ValidationError } from '@angular/forms/signals';
import { SwitchComponent } from '@tylertech/forge-angular';

@Directive({
  selector: 'forge-switch[formField]',
  host: {
    '(forge-switch-change)': 'switchChange()',
    '(blur)': 'blur()',
  },
})
export class ForgeSwitchFormFieldDirective implements FormCheckboxControl {
  private readonly _switch = inject(SwitchComponent);
  private _initialValue = this._switch.checked || this._switch.defaultChecked || false;

  public readonly checked = model(this._initialValue);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);

  constructor() {
    effect(() => {
      this._switch.checked = this.checked();
    });

    effect(() => {
      this._switch.required = this.required();
    });

    effect(() => {
      this._switch.disabled = this.disabled();
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
