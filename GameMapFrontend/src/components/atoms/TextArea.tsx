import { useState, type ChangeEvent, type CSSProperties } from 'react'

type TextAreaProps = {
  label?: string
  placeholder?: string
  rows?: number
  onChange?: (value: string) => void
  value?: string
} & Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value' | 'onChange' | 'rows' | 'placeholder'
>

const TextArea = ({
  label,
  placeholder = 'Type your message here...',
  rows = 4,
  onChange,
  value,
  ...props
}: TextAreaProps) => {
  const [localValue, setLocalValue] = useState('')

  const isControlled = value !== undefined
  const currentValue = isControlled ? value : localValue

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value

    if (!isControlled) {
      setLocalValue(newValue)
    }

    onChange?.(newValue)
  }

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    marginBottom: '1rem',
    width: '100%',
    maxWidth: '500px',
  }

  const labelStyle: CSSProperties = {
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#374151',
  }

  const textareaStyle: CSSProperties = {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    lineHeight: '1.5',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}

      <textarea
        style={textareaStyle}
        rows={rows}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onFocus={(event) => {
          event.target.style.borderColor = '#3b82f6'
          event.target.style.boxShadow =
            '0 0 0 3px rgba(59, 130, 246, 0.15)'
        }}
        onBlur={(event) => {
          event.target.style.borderColor = '#d1d5db'
          event.target.style.boxShadow = 'none'
        }}
        {...props}
      />
    </div>
  )
}

export default TextArea