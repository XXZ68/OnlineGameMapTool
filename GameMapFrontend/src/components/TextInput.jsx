/**
 * A simple, accessible, and style-free text input component.
 */
const TextInput = ({ label, value, className = '', onChange, placeholder = '', error = '', type = 'text', ...props }) => {
  const combinedClassName = `bg-highlight-bg ${className}`.trim();

  return (
    <div>
      <label>
        {label && <span>{label}</span>}
        <input
          type={type}
          value={value}
          className={combinedClassName}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          {...props}
        />
      </label>
      {error && <span role="alert">{error}</span>}
    </div>
  );
};

export default TextInput;
