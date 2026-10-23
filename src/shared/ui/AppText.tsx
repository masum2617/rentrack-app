import { Text, type TextProps } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { colors } from '../../theme/colors';
import { fontFamilies, typography } from '../../theme/typography';

type Props = TextProps & { variant?: keyof typeof typography; color?: string };
export function AppText({
  variant = 'body',
  color = colors.ink,
  style,
  ...props
}: Props) {
  const { locale } = useLocale();
  const { fontSize, lineHeight, weight } = typography[variant];
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: fontFamilies[locale][weight],
          fontSize,
          lineHeight,
          color,
        },
        style,
      ]}
    />
  );
}
