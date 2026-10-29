import { useState } from 'react';
import { Modal, Pressable } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { FormField } from '../../shared/ui/FormField';
import { formatPaisa } from '../../shared/money/paisa';
import { surfaces } from '../../theme/surfaces';
import { RentalLocation } from '../tenancies/RentalLocation';
import { PaymentForm } from '../ledger/PaymentForm';
import { PaymentFormFrame } from '../ledger/PaymentFormFrame';
import { PaymentReceiptScreen } from '../ledger/PaymentReceiptScreen';
import { filterPayableTenancies, type PayableTenancy } from './homeData';

export function HomePaymentFlow({
  candidates,
  revision,
  onClose,
  onChanged,
}: {
  candidates: PayableTenancy[];
  revision: number;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t, locale } = useLocale();
  const [stage, setStage] = useState<
    | { type: 'choose' }
    | { type: 'payment'; tenancyId: number }
    | { type: 'receipt'; paymentId: number }
  >({ type: 'choose' });
  const [search, setSearch] = useState('');
  if (stage.type === 'payment')
    return (
      <PaymentForm
        tenancyId={stage.tenancyId}
        onClose={() => setStage({ type: 'choose' })}
        onSaved={(paymentId) => {
          setStage({ type: 'receipt', paymentId });
          onChanged();
        }}
      />
    );
  if (stage.type === 'receipt')
    return (
      <Modal
        visible
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={onClose}
      >
        <PaymentReceiptScreen
          paymentId={stage.paymentId}
          revision={revision}
          onBack={onClose}
          onChanged={onChanged}
        />
      </Modal>
    );
  const visible = filterPayableTenancies(candidates, search);
  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <PaymentFormFrame
        title={t('homeChooseTenancy')}
        busy={false}
        onBack={onClose}
      >
        <AppText>{t('homePaymentScope')}</AppText>
        <FormField
          label={t('homeSearchRental')}
          value={search}
          placeholder={t('homeSearchExample')}
          editable
          onChangeText={setSearch}
        />
        {!visible.length && <AppText>{t('homeNoRentalMatch')}</AppText>}
        {visible.map((tenancy) => (
          <Pressable
            key={tenancy.tenancyId}
            accessibilityRole="button"
            onPress={() =>
              setStage({ type: 'payment', tenancyId: tenancy.tenancyId })
            }
            style={[surfaces.card, { padding: 20, gap: 12, minHeight: 52 }]}
          >
            <AppText variant="heading">{tenancy.tenantName}</AppText>
            <RentalLocation
              propertyName={tenancy.propertyName}
              floorName={tenancy.floorName}
              unitName={tenancy.unitName}
            />
            <AppText>
              {t('homeOutstanding')}:{' '}
              {formatPaisa(tenancy.outstandingPaisa, locale)}
            </AppText>
          </Pressable>
        ))}
      </PaymentFormFrame>
    </Modal>
  );
}
