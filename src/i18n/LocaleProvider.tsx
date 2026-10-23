import { createContext, useContext, useState, type ReactNode } from 'react';
import { bangla, english, type MessageKey } from './messages';
import { formatNumber, type Locale } from './formatNumber';

export type { Locale } from './formatNumber';
type LocaleValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, values?: Record<string, string>) => string;
  number: (value: number) => string;
  money: (value: number) => string;
};
const LocaleContext = createContext<LocaleValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('bn');
  function number(value: number) {
    return formatNumber(value, locale);
  }
  function t(key: MessageKey, values: Record<string, string> = {}) {
    const message: string = (locale === 'bn' ? bangla : english)[key];
    return message.replace(
      /\{(\w+)\}/g,
      (match, name: string) => values[name] ?? match,
    );
  }
  function money(value: number) {
    return `${locale === 'bn' ? '৳' : 'BDT'} ${number(value)}`;
  }
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, number, money }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be inside LocaleProvider');
  return context;
}
