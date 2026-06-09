import { defineComponents } from '@tylertech/forge';

defineComponents();

// Forge seems to be using setCustomValidity in a way that is incompatible with Chromium
if (!('setCustomValidity' in ElementInternals.prototype)) {
  (ElementInternals.prototype as any).setCustomValidity = function (
    flags: ValidityStateFlags,
    message?: string,
  ) {
    this.setValidity(flags, message);
  };
}
