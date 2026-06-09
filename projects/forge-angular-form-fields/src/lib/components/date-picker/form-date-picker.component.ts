import { booleanAttribute, Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, Input, inject } from '@angular/core';
import { DatePickerComponent as DatePickerComponentCustomElement, defineDatePickerComponent } from '@tylertech/forge';

@Component({
  selector: 'forge-date-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
})
export class FormDatePickerComponent {
  protected elementRef = inject<ElementRef<DatePickerComponentCustomElement>>(ElementRef);
  protected zone = inject(NgZone);

  public readonly nativeElement = this.elementRef.nativeElement;

  @Input()
  public set value(value: DatePickerComponentCustomElement['value']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.value = value;
    });
  }
  public get value(): DatePickerComponentCustomElement['value'] {
    return this.nativeElement.value;
  }

  @Input()
  public set disabledDates(value: DatePickerComponentCustomElement['disabledDates']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabledDates = value;
    });
  }
  public get disabledDates(): DatePickerComponentCustomElement['disabledDates'] {
    return this.nativeElement.disabledDates;
  }

  @Input({ transform: booleanAttribute })
  public set open(value: DatePickerComponentCustomElement['open']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.open = value;
    });
  }
  public get open(): DatePickerComponentCustomElement['open'] {
    return this.nativeElement.open;
  }

  @Input()
  public set popupClasses(value: DatePickerComponentCustomElement['popupClasses']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popupClasses = value;
    });
  }
  public get popupClasses(): DatePickerComponentCustomElement['popupClasses'] {
    return this.nativeElement.popupClasses;
  }

  @Input({ transform: booleanAttribute })
  public set disabled(value: DatePickerComponentCustomElement['disabled']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabled = value;
    });
  }
  public get disabled(): DatePickerComponentCustomElement['disabled'] {
    return this.nativeElement.disabled;
  }

  @Input({ transform: booleanAttribute })
  public set masked(value: DatePickerComponentCustomElement['masked']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.masked = value;
    });
  }
  public get masked(): DatePickerComponentCustomElement['masked'] {
    return this.nativeElement.masked;
  }

  @Input()
  public set maskFormat(value: DatePickerComponentCustomElement['maskFormat']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.maskFormat = value;
    });
  }
  public get maskFormat(): DatePickerComponentCustomElement['maskFormat'] {
    return this.nativeElement.maskFormat;
  }

  @Input({ transform: booleanAttribute })
  public set showMaskFormat(value: DatePickerComponentCustomElement['showMaskFormat']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.showMaskFormat = value;
    });
  }
  public get showMaskFormat(): DatePickerComponentCustomElement['showMaskFormat'] {
    return this.nativeElement.showMaskFormat;
  }

  @Input()
  public set dateFormat(value: DatePickerComponentCustomElement['dateFormat']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.dateFormat = value;
    });
  }
  public get dateFormat(): DatePickerComponentCustomElement['dateFormat'] {
    return this.nativeElement.dateFormat;
  }

  @Input()
  public set valueMode(value: DatePickerComponentCustomElement['valueMode']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.valueMode = value;
    });
  }
  public get valueMode(): DatePickerComponentCustomElement['valueMode'] {
    return this.nativeElement.valueMode;
  }

  @Input()
  public set shortcuts(value: DatePickerComponentCustomElement['shortcuts']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.shortcuts = value;
    });
  }
  public get shortcuts(): DatePickerComponentCustomElement['shortcuts'] {
    return this.nativeElement.shortcuts;
  }

  @Input({ transform: booleanAttribute })
  public set notifyInputValueChanges(value: DatePickerComponentCustomElement['notifyInputValueChanges']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.notifyInputValueChanges = value;
    });
  }
  public get notifyInputValueChanges(): DatePickerComponentCustomElement['notifyInputValueChanges'] {
    return this.nativeElement.notifyInputValueChanges;
  }

  @Input({ transform: booleanAttribute })
  public set allowInvalidDate(value: DatePickerComponentCustomElement['allowInvalidDate']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.allowInvalidDate = value;
    });
  }
  public get allowInvalidDate(): DatePickerComponentCustomElement['allowInvalidDate'] {
    return this.nativeElement.allowInvalidDate;
  }

  @Input({ transform: booleanAttribute })
  public set showToday(value: DatePickerComponentCustomElement['showToday']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.showToday = value;
    });
  }
  public get showToday(): DatePickerComponentCustomElement['showToday'] {
    return this.nativeElement.showToday;
  }

  @Input({ transform: booleanAttribute })
  public set showClear(value: DatePickerComponentCustomElement['showClear']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.showClear = value;
    });
  }
  public get showClear(): DatePickerComponentCustomElement['showClear'] {
    return this.nativeElement.showClear;
  }

  @Input()
  public set parseCallback(value: DatePickerComponentCustomElement['parseCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.parseCallback = value;
    });
  }
  public get parseCallback(): DatePickerComponentCustomElement['parseCallback'] {
    return this.nativeElement.parseCallback;
  }

  @Input()
  public set formatCallback(value: DatePickerComponentCustomElement['formatCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.formatCallback = value;
    });
  }
  public get formatCallback(): DatePickerComponentCustomElement['formatCallback'] {
    return this.nativeElement.formatCallback;
  }

  @Input()
  public set prepareMaskCallback(value: DatePickerComponentCustomElement['prepareMaskCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.prepareMaskCallback = value;
    });
  }
  public get prepareMaskCallback(): DatePickerComponentCustomElement['prepareMaskCallback'] {
    return this.nativeElement.prepareMaskCallback;
  }

  @Input()
  public set disabledDaysOfWeek(value: DatePickerComponentCustomElement['disabledDaysOfWeek']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabledDaysOfWeek = value;
    });
  }
  public get disabledDaysOfWeek(): DatePickerComponentCustomElement['disabledDaysOfWeek'] {
    return this.nativeElement.disabledDaysOfWeek;
  }

  @Input()
  public set disableDayCallback(value: DatePickerComponentCustomElement['disableDayCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disableDayCallback = value;
    });
  }
  public get disableDayCallback(): DatePickerComponentCustomElement['disableDayCallback'] {
    return this.nativeElement.disableDayCallback;
  }

  @Input()
  public set yearRange(value: DatePickerComponentCustomElement['yearRange']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.yearRange = value;
    });
  }
  public get yearRange(): DatePickerComponentCustomElement['yearRange'] {
    return this.nativeElement.yearRange;
  }

  @Input()
  public set locale(value: DatePickerComponentCustomElement['locale']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.locale = value;
    });
  }
  public get locale(): DatePickerComponentCustomElement['locale'] {
    return this.nativeElement.locale;
  }

  @Input()
  public set calendarText(value: DatePickerComponentCustomElement['calendarText']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.calendarText = value;
    });
  }
  public get calendarText(): DatePickerComponentCustomElement['calendarText'] {
    return this.nativeElement.calendarText;
  }

  constructor() {
    defineDatePickerComponent();
    const changeDetectorRef = inject(ChangeDetectorRef);
    changeDetectorRef.detach();
  }
}
