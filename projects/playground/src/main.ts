import { bootstrapApplication } from '@angular/platform-browser';
import { defineComponents } from '@tylertech/forge';
import { appConfig } from './app/app.config';
import { App } from './app/app';

defineComponents();

bootstrapApplication(App, appConfig).catch((err) => console.error(err));

// Forge seems to be using setCustomValidity in a way that is incompatible with Chromium
if (!('setCustomValidity' in ElementInternals.prototype)) {
  (ElementInternals.prototype as any).setCustomValidity = function (
    flags: ValidityStateFlags,
    message?: string,
  ) {
    this.setValidity(flags, message);
  };
}
