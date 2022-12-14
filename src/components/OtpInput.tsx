import React, { useEffect, useMemo } from 'react';
import { RE_DIGIT } from '../constants';
import { useGetOtpQuery } from '../features/api/apiSlice';
import './OtpInput.css';

export type Props = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
};

  const currentUser = 'user1';

export default function OtpInput({ value, valueLength, onChange }: Props) {
  const {
    data: otps,
    isLoading: isOtpsLoading,
    isSuccess: isOtpsSuccess,
    isError: isOtpsError,
    error: otpsError,
  } = useGetOtpQuery(currentUser);

  const [message, setMessage] = React.useState<string | null>('no message');

  console.log('🚀 ~ file: OtpInput.tsx ~ line 23 ~ OtpInput ~ data', otps);

  const valueItems = useMemo(() => {
    const valueArray = value.split('');
    const items: Array<string> = [];

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push('');
      }
    }

    return items;
  }, [value, valueLength]);

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };
  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== '') {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : ' ';

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1);

      onChange(newValue);

      if (!isTargetValueDigit) {
        return;
      }
      focusToNextInput(target);
    } else if (targetValueLength === valueLength) {
      onChange(targetValue);
      target.blur();
    }
  };
  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    const targetValue = target.value;

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length);

    if (e.key !== 'Backspace' || targetValue !== '') {
      return;
    }

    focusToPrevInput(target);
  };
  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    target.setSelectionRange(0, target.value.length);
  };

  const digits = valueItems.map((digit, idx) => digit).join('');


  // const onlyNumbers = (array: Array<string>) => {
  //   return array.every((element) => {
  //     return typeof element === 'number';
  //   });
  // };

  useEffect(() => {
    if (digits.length === 6 && RE_DIGIT.test(digits)) {
      digits === otps?.secret
        ? setMessage('success')
        : setMessage('fail');
      // console.log("the secret is: ", otps?.[currentUser].secret);
    } else {
      setMessage('');
    }
  }, [digits, otps]);

  return (
    <div>
      <p>{message}</p>
      <div className="otp-group">
        {valueItems.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={valueLength}
            className="otp-input"
            value={digit}
            onChange={(e) => inputOnChange(e, idx)}
            onKeyDown={inputOnKeyDown}
            onFocus={inputOnFocus}
          />
        ))}
      </div>
    </div>
  );
}
