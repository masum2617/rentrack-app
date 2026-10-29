import type { MessageKey } from '../../i18n/messages';
import {
  PaymentError,
  type PaymentMethod,
  type PaymentProblem,
} from './paymentValidation';
export function methodLabel(method: PaymentMethod) {
  return method === 'cash'
    ? 'paymentCash'
    : method === 'bank'
      ? 'paymentBank'
      : 'paymentWallet';
}
const errors: Record<PaymentProblem, MessageKey> = {
  amount: 'paymentAmountError',
  date: 'paymentDateError',
  method: 'paymentMethodError',
  allocation: 'paymentAllocationError',
  excess: 'paymentExcessError',
  stale: 'paymentStaleError',
  missing: 'paymentMissing',
  operation: 'paymentOperationError',
  reason: 'paymentReasonError',
  save: 'paymentSaveError',
};
export function paymentError(error: unknown): MessageKey {
  return error instanceof PaymentError
    ? errors[error.code]
    : 'paymentSaveError';
}
