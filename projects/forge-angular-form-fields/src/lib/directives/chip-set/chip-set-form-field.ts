import { computed, contentChildren, Directive, effect, inject, input, model } from '@angular/core';
import { FormValueControl, ValidationError } from '@angular/forms/signals';
import { ChipComponent, ChipSetComponent } from '@tylertech/forge-angular';
import { IChipSelectEventData } from '@tylertech/forge';

@Directive({
  selector: 'forge-chip-set[formField]',
  host: {
    '(forge-chip-select)': 'selectionChange($event)',
    '(focusout)': 'blur()',
    '[attr.type]': '"choice"',
  },
})
export class ForgeChipSetFormFieldDirective<T = unknown> implements FormValueControl<T[] | null> {
  private readonly _chipSet = inject(ChipSetComponent);

  private readonly _childChips = contentChildren(ChipComponent, { descendants: true });

  public readonly value = model<T[] | null>(null);
  public readonly touched = model(false);
  public readonly dirty = model(false);

  public readonly disabled = input(false);
  public readonly invalid = input(false);
  public readonly errors = input<readonly ValidationError.WithOptionalFieldTree[]>([]);
  public readonly required = input(false);

  private readonly _showInvalid = computed(() => this.errors().length > 0 && this.touched());

  constructor() {
    effect(() => {
      if (this.value() === null || this.value()?.length === 0) {
        for (const chip of this._childChips()) {
          chip.selected = false;
        }
      }
    });

    effect(() => {
      this._chipSet.disabled = this.disabled();
    });

    effect(() => {
      this._chipSet.invalid = this._showInvalid();
    });
  }

  public selectionChange(event: CustomEvent<IChipSelectEventData<T>>): void {
    const { value: chipValue, selected } = event.detail;
    const current = this.value() ?? [];

    let next: T[];
    if (selected) {
      next = current.includes(chipValue) ? current : [...current, chipValue];
    } else {
      next = current.filter((v) => v !== chipValue);
    }

    this.value.set(next.length > 0 ? next : this.required() ? null : []);
    this.touched.set(true);
    this.dirty.set(true);
  }

  public blur(): void {
    this.touched.set(true);
  }
}
