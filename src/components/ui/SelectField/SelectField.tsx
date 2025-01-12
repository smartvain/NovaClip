import { SelectFieldProps } from './types'

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  className = '',
}: SelectFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block mb-2">
        {label}
      </label>
      <select id={id} value={value} onChange={onChange} className="w-full p-2 border rounded">
        {Object.entries(options).map(([key, option]) => (
          <option key={key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
