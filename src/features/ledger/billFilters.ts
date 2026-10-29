import type { Bill } from './billStore.ts';
import { billIsOverdue } from './billPresentation.ts';

export type BillScope = {
  propertyId?: number;
  month?: string;
  status?: 'all' | 'outstanding' | 'draft' | 'overdue';
};
export type BillListRequest = { id: number; scope: BillScope };
export function matchesBillScope(bill: Bill, scope: BillScope, today?: string) {
  if (scope.propertyId !== undefined && bill.propertyId !== scope.propertyId)
    return false;
  if (scope.month !== undefined && bill.month !== scope.month) return false;
  switch (scope.status) {
    case 'outstanding':
      return bill.status === 'finalized' && bill.outstandingPaisa > 0;
    case 'draft':
      return bill.status === 'draft';
    case 'overdue':
      return billIsOverdue(bill, today);
    default:
      return true;
  }
}
