import { useState } from 'react';

/**
 * A reusable and customizable Textarea component.
 * 
 * @param {string} label - Optional label for the textarea.
 * @param {string} placeholder - Placeholder text.
 * @param {number} rows - Number of visible text rows (default: 4).
 * @param {function} onChange - Callback function triggered on text change.
 * @param {string} value - Controlled value of the textarea.
 */
const TextArea = ({ 
  label, 
  placeholder = "Type your message here...", 
  rows = 4, 
  onChange, 
  value,
  ...props 
}) => {
  const [localValue, setLocalValue] = useState('');

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : localValue;

  const handleChange = (event) => {
    if (!isControlled) {
      setLocalValue(event.target.value);
    }
    if (onChange) {
      onChange(event.target.value);
    }
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    marginBottom: '1rem',
    width: '100%',
    maxWidth: '500px'
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: '#374151'
  };

  const textareaStyle = {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
    lineHeight: '1.5',
    outline: 'none',
    resize: 'vertical',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      <textarea
        style={textareaStyle}
        rows={rows}
        placeholder={placeholder}
        value={currentValue}
        onChange={handleChange}
        onFocus={(e) => {
          e.target.style.borderColor = '#3b82f6';
          e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#d1d5db';
          e.target.style.boxShadow = 'none';
        }}
        {...props}
      />
    </div>
  );
};

export default TextArea;
