import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Alert } from 'react-native';
import { getDatabase } from '../platform/database/database';
import {
  readLanguage,
  writeLanguage,
} from '../platform/database/languagePreference';
import { LocaleStartup } from './LocaleStartup';
import { bangla, english, type MessageKey } from './messages';
import { formatNumber, type Locale } from './formatNumber';

export type { Locale } from './formatNumber';
type LocaleValue = {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  saving: boolean;
  t: (key: MessageKey, values?: Record<string, string>) => string;
  number: (value: number) => string;
  money: (value: number) => string;
};
const LocaleContext = createContext<LocaleValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, updateLocale] = useState<Locale>('bn');
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const writeInProgress = useRef(false);

  useEffect(() => {
    let active = true;
    async function restoreLanguage() {
      try {
        const db = await getDatabase();
        const saved = await readLanguage(db);
        if (active) {
          updateLocale(saved);
          setStatus('ready');
        }
      } catch {
        if (active) setStatus('error');
      }
    }
    void restoreLanguage();
    return () => {
      active = false;
    };
  }, [attempt]);

  async function setLocale(next: Locale) {
    if (next === locale || writeInProgress.current) return;
    writeInProgress.current = true;
    setSaving(true);
    try {
      const db = await getDatabase();
      await writeLanguage(db, next);
      updateLocale(next);
    } catch {
      Alert.alert(t('preferenceSaveError'), t('preferenceSaveErrorBody'), [
        { text: t('okay') },
      ]);
    } finally {
      writeInProgress.current = false;
      setSaving(false);
    }
  }
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
  if (status !== 'ready') {
    return (
      <LocaleStartup
        failed={status === 'error'}
        onRetry={() => {
          setStatus('loading');
          setAttempt((value) => value + 1);
        }}
      />
    );
  }
  return (
    <LocaleContext.Provider
      value={{ locale, setLocale, saving, t, number, money }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be inside LocaleProvider');
  return context;
}
