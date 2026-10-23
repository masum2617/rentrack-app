import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const surfaces = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 16,
    boxShadow: [
      { offsetX: 0, offsetY: 3, blurRadius: 14, color: colors.softShadow },
    ],
  },
  control: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    boxShadow: [
      { offsetX: 0, offsetY: 2, blurRadius: 7, color: 'rgba(52,81,58,0.06)' },
    ],
  },
});
