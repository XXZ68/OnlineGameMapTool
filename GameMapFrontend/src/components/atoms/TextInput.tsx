import type { InputHTMLAttributes } from 'react'

type TextInputProps = {
  label?: string
  value?: string
  className?: string
  error?: string
} & Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'value' | 'className'
>

const TextInput = ({
  label,
  value,
  className = '',
  onChange,
  placeholder = '',
  error = '',
  type = 'text',
  disabled = false,
  ...props
}: TextInputProps) => {
  const combinedClassName = `bg-highlight-bg ${className}`.trim()

  return (
    <div>
      <label>
        {label && <span>{label}</span>}

        <input
          type={type}
          value={value}
          disabled={disabled}
          className={combinedClassName}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          {...props}
        />
      </label>

      {error && <span role="alert">{error}</span>}
    </div>
  )
}

export default TextInput