import { booleanAttribute, Component, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef, NgZone, numberAttribute, Input, inject } from '@angular/core';
import { SliderComponent as SliderComponentCustomElement, SliderLabelBuilder, defineSliderComponent } from '@tylertech/forge';

@Component({
  selector: 'forge-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
})
export class FormSliderComponent {
  protected elementRef = inject<ElementRef<SliderComponentCustomElement>>(ElementRef);
  protected zone = inject(NgZone);

  public readonly nativeElement = this.elementRef.nativeElement;

  @Input()
  public set name(value: SliderComponentCustomElement['name']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.name = value;
    });
  }
  public get name(): SliderComponentCustomElement['name'] {
    return this.nativeElement.name;
  }

  @Input()
  public set nameStart(value: SliderComponentCustomElement['nameStart']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.nameStart = value;
    });
  }
  public get nameStart(): SliderComponentCustomElement['nameStart'] {
    return this.nativeElement.nameStart;
  }

  @Input()
  public set nameEnd(value: SliderComponentCustomElement['nameEnd']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.nameEnd = value;
    });
  }
  public get nameEnd(): SliderComponentCustomElement['nameEnd'] {
    return this.nativeElement.nameEnd;
  }

  @Input({ transform: numberAttribute })
  public set value(value: SliderComponentCustomElement['value']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.value = value;
    });
  }
  public get value(): SliderComponentCustomElement['value'] {
    return this.nativeElement.value;
  }

  @Input({ transform: numberAttribute })
  public set valueStart(value: SliderComponentCustomElement['valueStart']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.valueStart = value;
    });
  }
  public get valueStart(): SliderComponentCustomElement['valueStart'] {
    return this.nativeElement.valueStart;
  }

  @Input({ transform: numberAttribute })
  public set valueEnd(value: SliderComponentCustomElement['valueEnd']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.valueEnd = value;
    });
  }
  public get valueEnd(): SliderComponentCustomElement['valueEnd'] {
    return this.nativeElement.valueEnd;
  }

  @Input()
  public set label(value: SliderComponentCustomElement['label']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.label = value;
    });
  }
  public get label(): SliderComponentCustomElement['label'] {
    return this.nativeElement.label;
  }

  @Input()
  public set labelStart(value: SliderComponentCustomElement['labelStart']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.labelStart = value;
    });
  }
  public get labelStart(): SliderComponentCustomElement['labelStart'] {
    return this.nativeElement.labelStart;
  }

  @Input()
  public set labelEnd(value: SliderComponentCustomElement['labelEnd']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.labelEnd = value;
    });
  }
  public get labelEnd(): SliderComponentCustomElement['labelEnd'] {
    return this.nativeElement.labelEnd;
  }

  @Input()
  public set labelBuilder(value: SliderLabelBuilder) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.labelBuilder = value;
    });
  }
  public get labelBuilder(): SliderLabelBuilder {
    return this.nativeElement.labelBuilder;
  }

  @Input({ transform: numberAttribute })
  public set step(value: SliderComponentCustomElement['step']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.step = value;
    });
  }
  public get step(): SliderComponentCustomElement['step'] {
    return this.nativeElement.step;
  }

  @Input({ transform: booleanAttribute })
  public set tickmarks(value: SliderComponentCustomElement['tickmarks']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.tickmarks = value;
    });
  }
  public get tickmarks(): SliderComponentCustomElement['tickmarks'] {
    return this.nativeElement.tickmarks;
  }

  @Input({ transform: booleanAttribute })
  public set labeled(value: SliderComponentCustomElement['labeled']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.labeled = value;
    });
  }
  public get labeled(): SliderComponentCustomElement['labeled'] {
    return this.nativeElement.labeled;
  }

  @Input({ transform: booleanAttribute })
  public set range(value: SliderComponentCustomElement['range']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.range = value;
    });
  }
  public get range(): SliderComponentCustomElement['range'] {
    return this.nativeElement.range;
  }

  @Input({ transform: booleanAttribute })
  public set disabled(value: SliderComponentCustomElement['disabled']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.disabled = value;
    });
  }
  public get disabled(): SliderComponentCustomElement['disabled'] {
    return this.nativeElement.disabled;
  }

  @Input({ transform: booleanAttribute })
  public set readonly(value: SliderComponentCustomElement['readonly']) {
    this.zone.runOutsideAngular(() => {
      this.nativeElement.readonly = value;
    });
  }
  public get readonly(): SliderComponentCustomElement['readonly'] {
    return this.nativeElement.readonly;
  }

  constructor() {
    defineSliderComponent();
    const changeDetectorRef = inject(ChangeDetectorRef);
    changeDetectorRef.detach();
  }
}
