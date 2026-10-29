import { Image } from 'expo-image';
import { View } from 'react-native';

const icons = {
  edit: {
    source: require('../../../assets/icons/shared/edit.svg'),
    width: 24,
    height: 24,
  },
  search: {
    source: require('../../../assets/icons/properties/search.svg'),
    width: 24,
    height: 24,
  },
  back: {
    source: require('../../../assets/icons/properties/back.svg'),
    width: 24,
    height: 24,
  },
  meter: {
    source: require('../../../assets/icons/home/meter.svg'),
    width: 19.0,
    height: 20.8335,
  },
  home: {
    source: require('../../../assets/icons/home/home.svg'),
    width: 19.75,
    height: 21.6667,
  },
  down: {
    source: require('../../../assets/icons/home/down.svg'),
    width: 12.5,
    height: 7.5,
  },
  properties: {
    source: require('../../../assets/icons/home/properties.svg'),
    width: 19.75,
    height: 19.75,
  },
  tenants: {
    source: require('../../../assets/icons/home/tenants.svg'),
    width: 23.5833,
    height: 19.75,
  },
  radio: {
    source: require('../../../assets/icons/home/radio.svg'),
    width: 16.0,
    height: 16.0,
  },
  ledger: {
    source: require('../../../assets/icons/home/ledger.svg'),
    width: 21.6667,
    height: 19.75,
  },
  right: {
    source: require('../../../assets/icons/home/right.svg'),
    width: 7.5,
    height: 12.5,
  },
  bill: {
    source: require('../../../assets/icons/home/bill.svg'),
    width: 17.1667,
    height: 20.8333,
  },
  more: {
    source: require('../../../assets/icons/home/more.svg'),
    width: 17.8333,
    height: 4.41667,
  },
  emptyHome: {
    source: require('../../../assets/icons/home/emptyHome.svg'),
    width: 23.5,
    height: 25.8333,
  },
};

export type IconName = keyof typeof icons;

export function AssetIcon({ name, tint }: { name: IconName; tint?: string }) {
  const icon = icons[name];
  const slot = name === 'emptyHome' ? 28 : name === 'radio' ? 16 : 24;
  return (
    <View
      accessible={false}
      style={{
        width: slot,
        height: slot,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={icon.source}
        style={{ width: icon.width, height: icon.height }}
        contentFit="contain"
        tintColor={tint}
      />
    </View>
  );
}
