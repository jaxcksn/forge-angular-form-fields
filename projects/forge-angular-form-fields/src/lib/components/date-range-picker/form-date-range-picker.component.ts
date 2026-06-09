import { booleanAttribute, Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, Input, inject } from '@angular/core';
import { DateRangePickerComponent as DateRangePickerComponentCustomElement, defineDateRangePickerComponent } from '@tylertech/forge';

@Component({
  selector: 'forge-date-range-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
})
export class FormDateRangePickerComponent {
  protected elementRef = inject<ElementRef<DateRangePickerComponentCustomElement>>(ElementRef);
  protected zone = inject(NgZone);

  public readonly nativeElement = this.elementRef.nativeElement;

  @Input()
  public set from(value: DateRangePickerComponentCustomElement['from']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.from = value;
    });
  }
  public get from(): DateRangePickerComponentCustomElement['from'] {
    return this.nativeElement.from;
  }

  @Input()
  public set to(value: DateRangePickerComponentCustomElement['to']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.to = value;
    });
  }
  public get to(): DateRangePickerComponentCustomElement['to'] {
    return this.nativeElement.to;
  }

  @Input()
  public set value(value: DateRangePickerComponentCustomElement['value']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.value = value;
    });
  }
  public get value(): DateRangePickerComponentCustomElement['value'] {
    return this.nativeElement.value;
  }

  @Input()
  public set disabledDates(value: DateRangePickerComponentCustomElement['disabledDates']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabledDates = value;
    });
  }
  public get disabledDates(): DateRangePickerComponentCustomElement['disabledDates'] {
    return this.nativeElement.disabledDates;
  }

  @Input({ transform: booleanAttribute })
  public set open(value: DateRangePickerComponentCustomElement['open']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.open = value;
    });
  }
  public get open(): DateRangePickerComponentCustomElement['open'] {
    return this.nativeElement.open;
  }

  @Input()
  public set parseCallback(value: DateRangePickerComponentCustomElement['parseCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.parseCallback = value;
    });
  }
  public get parseCallback(): DateRangePickerComponentCustomElement['parseCallback'] {
    return this.nativeElement.parseCallback;
  }

  @Input()
  public set formatCallback(value: DateRangePickerComponentCustomElement['formatCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.formatCallback = value;
    });
  }
  public get formatCallback(): DateRangePickerComponentCustomElement['formatCallback'] {
    return this.nativeElement.formatCallback;
  }

  @Input()
  public set prepareMaskCallback(value: DateRangePickerComponentCustomElement['prepareMaskCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.prepareMaskCallback = value;
    });
  }
  public get prepareMaskCallback(): DateRangePickerComponentCustomElement['prepareMaskCallback'] {
    return this.nativeElement.prepareMaskCallback;
  }

  @Input()
  public set disableDayCallback(value: DateRangePickerComponentCustomElement['disableDayCallback']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disableDayCallback = value;
    });
  }
  public get disableDayCallback(): DateRangePickerComponentCustomElement['disableDayCallback'] {
    return this.nativeElement.disableDayCallback;
  }

  @Input()
  public set popupClasses(value: DateRangePickerComponentCustomElement['popupClasses']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.popupClasses = value;
    });
  }
  public get popupClasses(): DateRangePickerComponentCustomElement['popupClasses'] {
    return this.nativeElement.popupClasses;
  }

  @Input({ transform: booleanAttribute })
  public set disabled(value: DateRangePickerComponentCustomElement['disabled']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabled = value;
    });
  }
  public get disabled(): DateRangePickerComponentCustomElement['disabled'] {
    return this.nativeElement.disabled;
  }

  @Input({ transform: booleanAttribute })
  public set masked(value: DateRangePickerComponentCustomElement['masked']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.masked = value;
    });
  }
  public get masked(): DateRangePickerComponentCustomElement['masked'] {
    return this.nativeElement.masked;
  }

  @Input()
  public set maskFormat(value: DateRangePickerComponentCustomElement['maskFormat']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.maskFormat = value;
    });
  }
  public get maskFormat(): DateRangePickerComponentCustomElement['maskFormat'] {
    return this.nativeElement.maskFormat;
  }

  @Input({ transform: booleanAttribute })
  public set showMaskFormat(value: DateRangePickerComponentCustomElement['showMaskFormat']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.showMaskFormat = value;
    });
  }
  public get showMaskFormat(): DateRangePickerComponentCustomElement['showMaskFormat'] {
    return this.nativeElement.showMaskFormat;
  }

  @Input()
  public set valueMode(value: DateRangePickerComponentCustomElement['valueMode']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.valueMode = value;
    });
  }
  public get valueMode(): DateRangePickerComponentCustomElement['valueMode'] {
    return this.nativeElement.valueMode;
  }

  @Input({ transform: booleanAttribute })
  public set notifyInputValueChanges(value: DateRangePickerComponentCustomElement['notifyInputValueChanges']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.notifyInputValueChanges = value;
    });
  }
  public get notifyInputValueChanges(): DateRangePickerComponentCustomElement['notifyInputValueChanges'] {
    return this.nativeElement.notifyInputValueChanges;
  }

  @Input({ transform: booleanAttribute })
  public set allowInvalidDate(value: DateRangePickerComponentCustomElement['allowInvalidDate']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.allowInvalidDate = value;
    });
  }
  public get allowInvalidDate(): DateRangePickerComponentCustomElement['allowInvalidDate'] {
    return this.nativeElement.allowInvalidDate;
  }

  @Input({ transform: booleanAttribute })
  public set showToday(value: DateRangePickerComponentCustomElement['showToday']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.showToday = value;
    });
  }
  public get showToday(): DateRangePickerComponentCustomElement['showToday'] {
    return this.nativeElement.showToday;
  }

  @Input({ transform: booleanAttribute })
  public set showClear(value: DateRangePickerComponentCustomElement['showClear']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.showClear = value;
    });
  }
  public get showClear(): DateRangePickerComponentCustomElement['showClear'] {
    return this.nativeElement.showClear;
  }

  @Input()
  public set disabledDaysOfWeek(value: DateRangePickerComponentCustomElement['disabledDaysOfWeek']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabledDaysOfWeek = value;
    });
  }
  public get disabledDaysOfWeek(): DateRangePickerComponentCustomElement['disabledDaysOfWeek'] {
    return this.nativeElement.disabledDaysOfWeek;
  }

  @Input()
  public set yearRange(value: DateRangePickerComponentCustomElement['yearRange']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.yearRange = value;
    });
  }
  public get yearRange(): DateRangePickerComponentCustomElement['yearRange'] {
    return this.nativeElement.yearRange;
  }

  @Input()
  public set locale(value: DateRangePickerComponentCustomElement['locale']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.locale = value;
    });
  }
  public get locale(): DateRangePickerComponentCustomElement['locale'] {
    return this.nativeElement.locale;
  }

  @Input()
  public set dateFormat(value: DateRangePickerComponentCustomElement['dateFormat']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.dateFormat = value;
    });
  }
  public get dateFormat(): DateRangePickerComponentCustomElement['dateFormat'] {
    return this.nativeElement.dateFormat;
  }

  @Input()
  public set shortcuts(value: DateRangePickerComponentCustomElement['shortcuts']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.shortcuts = value;
    });
  }
  public get shortcuts(): DateRangePickerComponentCustomElement['shortcuts'] {
    return this.nativeElement.shortcuts;
  }

  @Input()
  public set calendarText(value: DateRangePickerComponentCustomElement['calendarText']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.calendarText = value;
    });
  }
  public get calendarText(): DateRangePickerComponentCustomElement['calendarText'] {
    return this.nativeElement.calendarText;
  }

  constructor() {
    defineDateRangePickerComponent();
    const changeDetectorRef = inject(ChangeDetectorRef);
    changeDetectorRef.detach();
  }
}
