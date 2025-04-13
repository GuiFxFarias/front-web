import { PatternFormat } from 'react-number-format';
import { forwardRef } from 'react';
import { Input } from '@/components/ui/input';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const FormattedInput = forwardRef<HTMLInputElement, any>(
  ({ format, ...props }, ref) => (
    <PatternFormat
      {...props}
      getInputRef={ref}
      format={format}
      allowEmptyFormatting
      mask='_'
      customInput={Input}
    />
  )
);

FormattedInput.displayName = 'FormattedInput';
