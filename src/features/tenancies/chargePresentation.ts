import type { ChargeKind } from './chargeSettings';
export function chargeLabel(kind: ChargeKind | 'rent' | 'other') {
  switch (kind) {
    case 'water':
      return 'chargeWater';
    case 'service':
      return 'chargeService';
    case 'gas':
      return 'chargeGas';
    case 'rent':
      return 'chargeRent';
    case 'other':
      return 'chargeOther';
  }
}
