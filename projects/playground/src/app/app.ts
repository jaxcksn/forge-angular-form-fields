import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { form, FormField, required, minLength, maxLength, min, max } from '@angular/forms/signals';
import {
  DateRange,
  FormDateRangePickerComponent,
  FormSelectComponent,
  FormSliderComponent,
  FormTimePickerComponent,
  ForgeAutocompleteFormFieldDirective,
  ForgeAutocompleteMultipleFormFieldDirective,
  ForgeButtonToggleGroupFormFieldDirective,
  ForgeButtonToggleGroupMultipleFormFieldDirective,
  ForgeCheckboxFormDirective,
  ForgeChipFormFieldDirective,
  ForgeChipSetFormFieldDirective,
  ForgeDateRangePickerFormFieldDirective,
  ForgeSelectFormFieldDirective,
  ForgeSelectMultipleFormFieldDirective,
  ForgeSliderFormFieldDirective,
  ForgeSliderRangeFormFieldDirective,
  ForgeSwitchFormFieldDirective,
  ForgeTextFieldFormFieldDirective,
  ForgeTextFieldNumberFormFieldDirective,
  ForgeTimePickerFormFieldDirective,
  SliderRange,
} from 'forge-angular-form-fields';
import {
  ForgeAutocompleteModule,
  ForgeTextFieldModule,
  ForgeButtonToggleGroupModule,
  ForgeCheckboxModule,
  ForgeChipModule,
  ForgeButtonModule,
  ForgeCardModule,
  ForgeToolbarModule,
  ForgeScaffoldModule,
  ForgeChipSetModule,
  ForgeOptionModule,
  ForgeSwitchModule,
} from '@tylertech/forge-angular';

interface DemoFormModel {
  favoriteColor: string | null;
  favoriteColors: string[] | null;
  selectedCountry: string | null;
  selectedCountries: string[] | null;
  size: string | null;
  sizes: string[] | null;
  acceptTerms: boolean;
  notifications: boolean;
  chipSelected: boolean;
  chipSelections: string[] | null;
  dateRange: DateRange | null;
  time: Date | null;
  username: string;
  bio: string;
  age: number | null;
  volume: number;
  priceRange: SliderRange;
}

@Component({
  selector: 'app-root',

  imports: [
    FormField,
    ForgeAutocompleteFormFieldDirective,
    ForgeAutocompleteMultipleFormFieldDirective,
    ForgeButtonToggleGroupFormFieldDirective,
    ForgeButtonToggleGroupMultipleFormFieldDirective,
    ForgeCheckboxFormDirective,
    ForgeChipFormFieldDirective,
    ForgeChipSetFormFieldDirective,
    ForgeDateRangePickerFormFieldDirective,
    ForgeSelectFormFieldDirective,
    ForgeSelectMultipleFormFieldDirective,
    ForgeSliderFormFieldDirective,
    ForgeSliderRangeFormFieldDirective,
    ForgeSwitchFormFieldDirective,
    ForgeTextFieldFormFieldDirective,
    ForgeTextFieldNumberFormFieldDirective,
    ForgeTimePickerFormFieldDirective,
    ForgeChipSetModule,
    ForgeAutocompleteModule,
    ForgeTextFieldModule,
    ForgeButtonToggleGroupModule,
    ForgeCheckboxModule,
    ForgeChipModule,
    ForgeButtonModule,
    ForgeCardModule,
    ForgeToolbarModule,
    ForgeScaffoldModule,
    ForgeSwitchModule,
    FormSelectComponent,
    FormSliderComponent,
    ForgeOptionModule,
    FormDateRangePickerComponent,
    FormTimePickerComponent,
    JsonPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly _colorOptions = [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Purple', value: 'purple' },
    { label: 'Orange', value: 'orange' },
  ];

  protected readonly formModel = signal<DemoFormModel>({
    favoriteColor: null,
    favoriteColors: null,
    selectedCountry: null,
    selectedCountries: null,
    size: null,
    sizes: null,
    acceptTerms: false,
    notifications: false,
    chipSelected: false,
    chipSelections: null,
    dateRange: null,
    time: null,
    username: '',
    bio: '',
    age: null,
    volume: 50,
    priceRange: { start: 20, end: 80 },
  });

  protected readonly demoForm = form(this.formModel, (schema) => {
    required(schema.favoriteColor, { message: 'Please select a color' });
    required(schema.favoriteColors, { message: 'Please select at least one color' });
    required(schema.selectedCountry, { message: 'Please select a country' });
    required(schema.selectedCountries, { message: 'Please select at least one country' });
    required(schema.size, { message: 'Please choose a size' });
    required(schema.sizes, { message: 'Please choose at least one size' });
    required(schema.acceptTerms, { message: 'You must accept the terms' });
    required(schema.notifications, { message: 'You must enable notifications' });
    required(schema.chipSelected, { message: 'You must select the chip' });
    required(schema.chipSelections, { message: 'Please select at least one option' });
    required(schema.dateRange, { message: 'Please select a date range' });
    required(schema.time, { message: 'Please select a time' });
    required(schema.username, { message: 'Username is required' });
    minLength(schema.username, 3, { message: 'Must be at least 3 characters' });
    maxLength(schema.username, 20, { message: 'Must be at most 20 characters' });
    required(schema.bio, { message: 'Bio is required' });
    maxLength(schema.bio, 200, { message: 'Bio must be at most 200 characters' });
    required(schema.age, { message: 'Age is required' });
    min(schema.age, 0, { message: 'Age must be at least 0' });
    max(schema.age, 120, { message: 'Age must be at most 120' });
    min(schema.volume, 0, { message: 'Volume must be at least 0' });
    max(schema.volume, 100, { message: 'Volume must be at most 100' });
    required(schema.priceRange, { message: 'Price range is required' });
  });

  protected filterColors = (filterText: string) => {
    const lower = filterText.toLowerCase();
    return this._colorOptions.filter((opt) => opt.label.toLowerCase().includes(lower));
  };

  protected submitForm(): void {
    console.log('Form submitted:', this.formModel());
  }

  protected resetForm(): void {
    this.demoForm().reset({
      sizes: null,
      size: null,
      favoriteColor: null,
      favoriteColors: null,
      selectedCountry: null,
      selectedCountries: null,
      acceptTerms: false,
      notifications: false,
      chipSelected: false,
      chipSelections: null,
      dateRange: null,
      time: null,
      username: '',
      bio: '',
      age: null,
      volume: 50,
      priceRange: { start: 20, end: 80 },
    });
  }
}
