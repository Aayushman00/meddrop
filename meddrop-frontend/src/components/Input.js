import React from 'react';
import PropTypes from 'prop-types';

const Input = ({
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  required = false,
  multiline = false,
  rows = 4,
  ...rest
}) => {
  if (multiline) {
    return (
      <div className="mb-4">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
          required={required}
          rows={rows}
          className={`${error ? 'border-red-500' : 'border-gray-300'}
                   rounded-md
                   shadow-sm
                   focus:border-blue-500
                   focus:ring-indigo-200
                   w-full
                   px-3
                   py-2
                   text-base
                   resize-y
                   transition-all
                   duration-200
                   ${error ? 'border-red-500' : ''}`}
          {...rest}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value || ''}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`${error ? 'border-red-500' : 'border-gray-300'}
                   rounded-md
                   shadow-sm
                   focus:border-blue-500
                   focus:ring-indigo-200
                   w-full
                   px-3
                   py-2
                   text-base
                   transition-all
                   duration-200
                   ${error ? 'border-red-500' : ''}`}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number
};

export default Input;