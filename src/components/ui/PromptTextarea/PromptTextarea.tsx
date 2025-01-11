import { PromptTextareaProps } from './types'

export function PromptTextarea({ label, value, onChange, placeholder }: PromptTextareaProps) {
  return (
    <div>
      <label htmlFor={label} className="block mb-2">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[150px] p-2 mb-4 border rounded"
      />
    </div>
  )
}
