import { useState } from 'react';
import { View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { PaymentForm } from './PaymentForm';

export function PaymentActions({
  tenancyId,
  billId,
  canRecord,
  onChanged,
  onHistory,
  onReceipt,
}: {
  tenancyId: number;
  billId?: number;
  canRecord: boolean;
  onChanged: () => void;
  onHistory: () => void;
  onReceipt: (id: number) => void;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 12 }}>
      {canRecord && (
        <PrimaryButton
          label={t('paymentRecord')}
          onPress={() => setOpen(true)}
        />
      )}
      <PrimaryButton label={t('paymentHistory')} onPress={onHistory} />
      {open && (
        <PaymentForm
          tenancyId={tenancyId}
          billId={billId}
          onClose={() => setOpen(false)}
          onSaved={(id) => {
            setOpen(false);
            onChanged();
            onReceipt(id);
          }}
        />
      )}
    </View>
  );
}
