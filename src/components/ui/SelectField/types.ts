type Option = {
  value: string
  label: string
}

export type SelectFieldProps = {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: Record<string, Option>
  className?: string
}
