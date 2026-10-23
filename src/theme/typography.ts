export const fontFamilies = {
  bn: {
    regular: 'BengaliRegular',
    medium: 'BengaliMedium',
    semibold: 'BengaliSemiBold',
  },
  en: {
    regular: 'EnglishRegular',
    medium: 'EnglishMedium',
    semibold: 'EnglishSemiBold',
  },
};

export const typography = {
  title: { fontSize: 28, lineHeight: 38, weight: 'semibold' },
  heading: { fontSize: 20, lineHeight: 30, weight: 'semibold' },
  body: { fontSize: 18, lineHeight: 28, weight: 'regular' },
  label: { fontSize: 16, lineHeight: 24, weight: 'medium' },
  meta: { fontSize: 14, lineHeight: 22, weight: 'regular' },
  nav: { fontSize: 14, lineHeight: 22, weight: 'medium' },
  amount: { fontSize: 32, lineHeight: 44, weight: 'semibold' },
  metric: { fontSize: 22, lineHeight: 32, weight: 'semibold' },
} as const;
