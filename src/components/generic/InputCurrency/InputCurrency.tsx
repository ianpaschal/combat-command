import {
  forwardRef,
  InputHTMLAttributes,
  KeyboardEvent,
  useEffect,
  useState,
} from 'react';
import { getCurrencyOptions } from '@ianpaschal/combat-command-game-systems/common';
import clsx from 'clsx';

import { InputSelect } from '~/components/generic/InputSelect';

import styles from './InputCurrency.module.scss';

export type CurrencyValue = {
  amount: number;
  currency: string;
};

export interface InputCurrencyProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  hasError?: boolean;
  value?: CurrencyValue;
  onChange?: (value: CurrencyValue) => void;
}

export const InputCurrency = forwardRef<HTMLInputElement, InputCurrencyProps>(({
  className,
  // hasError = false,
  // disabled = false,
  value,
  onChange,
  // ...props
}, ref) => {
  const useSeparator = true; // Disable for yen
  const [digits, setDigits] = useState<number[]>([]);
  const [currency, setCurrency] = useState<string>('eur');

  const handleAmountChange = ({ key }: KeyboardEvent<HTMLInputElement>) => {
    let updated;
    if (key === 'Backspace') {
      updated = [...digits.slice(0, digits.length - 1)];
    }
    if (!isNaN(+key) && !(+key === 0 && digits.length === 0)) {
      updated = [...digits, +key];
    }

    if (updated) {
      setDigits(updated);
      if (onChange) {
        onChange({
          amount: +updated.join(''),
          currency,
        });
      }
    }
  };

  const handleCurrencyChange = (updated: string | number | undefined) => {
    if (updated && typeof updated === 'string') {
      setCurrency(updated);
      if (onChange) {
        onChange({
          amount: +digits.join(''),
          currency: updated,
        });
      }
    }
  };

  useEffect(() => {
    if (value && (value.amount !== +digits.join(''))) {
      setDigits([...String(value.amount)].map(Number));
    }
  }, [value, digits, setDigits]);

  useEffect(() => {
    if (value && (value.currency !== currency)) {
      setCurrency(value.currency);
    }
  }, [value, currency, setCurrency]);

  let renderDigits: (number | null | '.' | ',')[] = [...digits];
  const paddingCount = Math.max(0, 3 - digits.length);
  if (useSeparator) {
    const paddedDigits = [
      ...[...Array(paddingCount)].map(() => null),
      ...digits,
    ];
    const separatorPosition = paddedDigits.length - 2;
    renderDigits = [...paddedDigits.slice(0, separatorPosition), '.', ...paddedDigits.slice(separatorPosition)];
  }
  return (
    <div className={clsx(styles.InputCurrency, className)} ref={ref}>
      <div className={styles.InputCurrency_Mask}>
        {renderDigits.map((digit, i) => digit === null ? (
          <span key={i} className={styles.InputCurrency_PadDigit}>
            0
          </span>
        ) : (
          <span key={i}>
            {digit}
          </span>
        ))}
      </div>
      <div className={styles.InputCurrency_Inputs}>
        <InputSelect
          value={value?.currency}
          defaultValue={currency}
          options={getCurrencyOptions()}
          onChange={handleCurrencyChange}
        />
        <input name="amount" value="" onKeyDown={handleAmountChange} onChange={() => null} />
      </div>
    </div>
  );
});
InputCurrency.displayName = 'InputCurrency';
