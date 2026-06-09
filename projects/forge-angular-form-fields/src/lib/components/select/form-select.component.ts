import { booleanAttribute, Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, numberAttribute, Input, inject } from '@angular/core';
import { SelectComponent as SelectComponentCustomElement, defineSelectComponent } from '@tylertech/forge';

@Component({
  selector: 'forge-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
})
export class FormSelectComponent {
  protected elementRef = inject<ElementRef<SelectComponentCustomElement>>(ElementRef);
  protected zone = inject(NgZone);

  public readonly nativeElement = this.elementRef.nativeElement;

  @Input()
  public set label(value: SelectComponentCustomElement['label']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.label = value;
    });
  }
  public get label(): SelectComponentCustomElement['label'] {
    return this.nativeElement.label;
  }

  @Input()
  public set placeholder(value: SelectComponentCustomElement['placeholder']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.placeholder = value;
    });
  }
  public get placeholder(): SelectComponentCustomElement['placeholder'] {
    return this.nativeElement.placeholder;
  }

  @Input({ transform: booleanAttribute })
  public set showSelectAll(value: SelectComponentCustomElement['showSelectAll']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.showSelectAll = value;
    });
  }
  public get showSelectAll(): SelectComponentCustomElement['showSelectAll'] {
    return this.nativeElement.showSelectAll;
  }

  @Input()
  public set selectAllLabel(value: SelectComponentCustomElement['selectAllLabel']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.selectAllLabel = value;
    });
  }
  public get selectAllLabel(): SelectComponentCustomElement['selectAllLabel'] {
    return this.nativeElement.selectAllLabel;
  }

  @Input({ transform: booleanAttribute })
  public set floatLabel(value: SelectComponentCustomElement['floatLabel']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.floatLabel = value;
    });
  }
  public get floatLabel(): SelectComponentCustomElement['floatLabel'] {
    return this.nativeElement.floatLabel;
  }

  @Input()
  public set density(value: SelectComponentCustomElement['density']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.density = value;
    });
  }
  public get density(): SelectComponentCustomElement['density'] {
    return this.nativeElement.density;
  }

  @Input({ transform: booleanAttribute })
  public set dense(value: SelectComponentCustomElement['dense']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.dense = value;
    });
  }
  public get dense(): SelectComponentCustomElement['dense'] {
    return this.nativeElement.dense;
  }

  @Input({ transform: booleanAttribute })
  public set disabled(value: SelectComponentCustomElement['disabled']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabled = value;
    });
  }
  public get disabled(): SelectComponentCustomElement['disabled'] {
    return this.nativeElement.disabled;
  }

  @Input({ transform: booleanAttribute })
  public set required(value: SelectComponentCustomElement['required']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.required = value;
    });
  }
  public get required(): SelectComponentCustomElement['required'] {
    return this.nativeElement.required;
  }

  @Input()
  public set labelPosition(value: SelectComponentCustomElement['labelPosition']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.labelPosition = value;
    });
  }
  public get labelPosition(): SelectComponentCustomElement['labelPosition'] {
    return this.nativeElement.labelPosition;
  }

  @Input()
  public set value(value: SelectComponentCustomElement['value']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.value = value;
    });
  }
  public get value(): SelectComponentCustomElement['value'] {
    return this.nativeElement.value;
  }

  @Input()
  public set selectedIndex(value: SelectComponentCustomElement['selectedIndex']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.selectedIndex = value;
    });
  }
  public get selectedIndex(): SelectComponentCustomElement['selectedIndex'] {
    return this.nativeElement.selectedIndex;
  }

  @Input()
  public set options(value: SelectComponentCustomElement['options']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.options = value;
    });
  }
  public get options(): SelectComponentCustomElement['options'] {
    return this.nativeElement.options;
  }

  @Input({ transform: booleanAttribute })
  public set multiple(value: SelectComponentCustomElement['multiple']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.multiple = value;
    });
  }
  public get multiple(): SelectComponentCustomElement['multiple'] {
    return this.nativeElement.multiple;
  }

  @Input({ transform: booleanAttribute })
  public set open(value: SelectComponentCustomElement['open']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.open = value;
    });
  }
  public get open(): SelectComponentCustomElement['open'] {
    return this.nativeElement.open;
  }

  @Input()
  public set optionBuilder(value: SelectComponentCustomElement['optionBuilder']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.optionBuilder = value;
    });
  }
  public get optionBuilder(): SelectComponentCustomElement['optionBuilder'] {
    return this.nativeElement.optionBuilder;
  }

  @Input()
  public set selectedTextBuilder(value: SelectComponentCustomElement['selectedTextBuilder']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.selectedTextBuilder = value;
    });
  }
  public get selectedTextBuilder(): SelectComponentCustomElement['selectedTextBuilder'] {
    return this.nativeElement.selectedTextBuilder;
  }

  @Input()
  public set beforeValueChange(value: SelectComponentCustomElement['beforeValueChange']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.beforeValueChange = value;
    });
  }
  public get beforeValueChange(): SelectComponentCustomElement['beforeValueChange'] {
    return this.nativeElement.beforeValueChange;
  }

  @Input()
  public set popupClasses(value: SelectComponentCustomElement['popupClasses']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popupClasses = value;
    });
  }
  public get popupClasses(): SelectComponentCustomElement['popupClasses'] {
    return this.nativeElement.popupClasses;
  }

  @Input()
  public set popupHeaderBuilder(value: SelectComponentCustomElement['popupHeaderBuilder']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popupHeaderBuilder = value;
    });
  }
  public get popupHeaderBuilder(): SelectComponentCustomElement['popupHeaderBuilder'] {
    return this.nativeElement.popupHeaderBuilder;
  }

  @Input()
  public set popupFooterBuilder(value: SelectComponentCustomElement['popupFooterBuilder']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popupFooterBuilder = value;
    });
  }
  public get popupFooterBuilder(): SelectComponentCustomElement['popupFooterBuilder'] {
    return this.nativeElement.popupFooterBuilder;
  }

  @Input({ transform: booleanAttribute })
  public set syncPopupWidth(value: SelectComponentCustomElement['syncPopupWidth']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.syncPopupWidth = value;
    });
  }
  public get syncPopupWidth(): SelectComponentCustomElement['syncPopupWidth'] {
    return this.nativeElement.syncPopupWidth;
  }

  @Input({ transform: numberAttribute })
  public set optionLimit(value: SelectComponentCustomElement['optionLimit']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.optionLimit = value;
    });
  }
  public get optionLimit(): SelectComponentCustomElement['optionLimit'] {
    return this.nativeElement.optionLimit;
  }

  @Input({ transform: booleanAttribute })
  public set observeScroll(value: SelectComponentCustomElement['observeScroll']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.observeScroll = value;
    });
  }
  public get observeScroll(): SelectComponentCustomElement['observeScroll'] {
    return this.nativeElement.observeScroll;
  }

  @Input({ transform: numberAttribute })
  public set observeScrollThreshold(value: SelectComponentCustomElement['observeScrollThreshold']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.observeScrollThreshold = value;
    });
  }
  public get observeScrollThreshold(): SelectComponentCustomElement['observeScrollThreshold'] {
    return this.nativeElement.observeScrollThreshold;
  }

  @Input({ transform: booleanAttribute })
  public set constrainPopupWidth(value: SelectComponentCustomElement['constrainPopupWidth']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.constrainPopupWidth = value;
    });
  }
  public get constrainPopupWidth(): SelectComponentCustomElement['constrainPopupWidth'] {
    return this.nativeElement.constrainPopupWidth;
  }

  @Input({ transform: booleanAttribute })
  public set wrapOptionText(value: SelectComponentCustomElement['wrapOptionText']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.wrapOptionText = value;
    });
  }
  public get wrapOptionText(): SelectComponentCustomElement['wrapOptionText'] {
    return this.nativeElement.wrapOptionText;
  }

  @Input()
  public set popoverPlacement(value: SelectComponentCustomElement['popoverPlacement']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popoverPlacement = value;
    });
  }
  public get popoverPlacement(): SelectComponentCustomElement['popoverPlacement'] {
    return this.nativeElement.popoverPlacement;
  }

  @Input()
  public set popoverOffset(value: SelectComponentCustomElement['popoverOffset']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popoverOffset = value;
    });
  }
  public get popoverOffset(): SelectComponentCustomElement['popoverOffset'] {
    return this.nativeElement.popoverOffset;
  }

  @Input()
  public set popoverFlip(value: SelectComponentCustomElement['popoverFlip']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popoverFlip = value;
    });
  }
  public get popoverFlip(): SelectComponentCustomElement['popoverFlip'] {
    return this.nativeElement.popoverFlip;
  }

  @Input()
  public set popoverShift(value: SelectComponentCustomElement['popoverShift']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popoverShift = value;
    });
  }
  public get popoverShift(): SelectComponentCustomElement['popoverShift'] {
    return this.nativeElement.popoverShift;
  }

  @Input()
  public set popoverFallbackPlacements(value: SelectComponentCustomElement['popoverFallbackPlacements']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popoverFallbackPlacements = value;
    });
  }
  public get popoverFallbackPlacements(): SelectComponentCustomElement['popoverFallbackPlacements'] {
    return this.nativeElement.popoverFallbackPlacements;
  }

  @Input()
  public set labelAlignment(value: SelectComponentCustomElement['labelAlignment']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.labelAlignment = value;
    });
  }
  public get labelAlignment(): SelectComponentCustomElement['labelAlignment'] {
    return this.nativeElement.labelAlignment;
  }

  @Input({ transform: booleanAttribute })
  public set invalid(value: SelectComponentCustomElement['invalid']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.invalid = value;
    });
  }
  public get invalid(): SelectComponentCustomElement['invalid'] {
    return this.nativeElement.invalid;
  }

  @Input({ transform: booleanAttribute })
  public set optional(value: SelectComponentCustomElement['optional']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.optional = value;
    });
  }
  public get optional(): SelectComponentCustomElement['optional'] {
    return this.nativeElement.optional;
  }

  @Input()
  public set variant(value: SelectComponentCustomElement['variant']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.variant = value;
    });
  }
  public get variant(): SelectComponentCustomElement['variant'] {
    return this.nativeElement.variant;
  }

  @Input()
  public set theme(value: SelectComponentCustomElement['theme']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.theme = value;
    });
  }
  public get theme(): SelectComponentCustomElement['theme'] {
    return this.nativeElement.theme;
  }

  @Input()
  public set shape(value: SelectComponentCustomElement['shape']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.shape = value;
    });
  }
  public get shape(): SelectComponentCustomElement['shape'] {
    return this.nativeElement.shape;
  }

  @Input({ transform: booleanAttribute })
  public set popoverIcon(value: SelectComponentCustomElement['popoverIcon']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popoverIcon = value;
    });
  }
  public get popoverIcon(): SelectComponentCustomElement['popoverIcon'] {
    return this.nativeElement.popoverIcon;
  }

  @Input()
  public set supportTextInset(value: SelectComponentCustomElement['supportTextInset']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.supportTextInset = value;
    });
  }
  public get supportTextInset(): SelectComponentCustomElement['supportTextInset'] {
    return this.nativeElement.supportTextInset;
  }

  public floatLabelWithoutAnimation(...args: Parameters<SelectComponentCustomElement['floatLabelWithoutAnimation']>): ReturnType<SelectComponentCustomElement['floatLabelWithoutAnimation']> {
    return this.zone.runOutsideAngular(() => this.nativeElement.floatLabelWithoutAnimation(...args));
  }

  constructor() {
    defineSelectComponent();
    const changeDetectorRef = inject(ChangeDetectorRef);
    changeDetectorRef.detach();
  }
}
