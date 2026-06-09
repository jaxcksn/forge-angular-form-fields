import { computed, Directive, effect, inject, input, model } from '@angular/core';
import { FormCheckboxControl, ValidationError } from '@angular/forms/signals';
import { ChipComponent } from '@tylertech/forge-angular';

@Directive({
  selector: 'forge-chip[formField]',
  host: {
    '(forge-chip-select)': 'selectChange($event)',
    '(blur)': 'blur()',
    '[attr.type]': '"choice"',
  },
})
export class ForgeChipFormFieldDirective implements FormCheckboxControl {
  private readonly _chip = inject(ChipComponent);
  private _initialValue = this._chip.selected || false;

  public readonly checked = model(this._initialValue);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);

  private readonly _showInvalid = computed(() => this.errors().length > 0 && this.touched());

  constructor() {
    effect(() => {
      this._chip.selected = this.checked();
    });

    effect(() => {
      this._chip.disabled = this.disabled();
    });

    effect(() => {
      this._chip.invalid = this._showInvalid();
    });
  }

  public selectChange(event: CustomEvent<{ selected: boolean }>): void {
    this.checked.set(event.detail.selected);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }
}
