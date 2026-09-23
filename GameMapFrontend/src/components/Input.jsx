import { useId } from 'react';

/**
 * A reusable, accessible text input component.
 * 
 * @param {string} label - The label text displayed above the input.
 * @param {string} value - The current value of the input.
 * @param {function} onChange - Callback function triggered on input change.
 * @param {string} [placeholder] - Optional placeholder text.
 * @param {string} [error] - Optional error message to display below the input.
 * @param {string} [type='text'] - The type of input (e.g., 'text', 'email', 'password').
 */
const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  error = '',
  type = 'text',
  ...props
}) => {
  const inputId = useId();
  const errorId = useId();

  return (
    <div>
      {label && (
        <label htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}

        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <span id={errorId} role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextInput;
