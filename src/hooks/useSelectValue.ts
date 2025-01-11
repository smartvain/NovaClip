import { ChangeEvent, useCallback, useState } from 'react'

type SelectOption<T> = {
  value: T
  label: string
}

type SelectList<T> = Record<string, SelectOption<T>>

export function useSelectValue<T extends string | number>(
  initialValue: T,
  optionsList: SelectList<T>
) {
  const [selectedValue, setSelectedValue] = useState<T>(initialValue)

  const isValidValue = useCallback(
    (value: string | number): value is T => {
      return Object.values(optionsList).some((option) => option.value === value)
    },
    [optionsList]
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value
      // numberの場合は数値に変換
      const convertedValue = typeof initialValue === 'number' ? Number(value) : value
      if (isValidValue(convertedValue)) {
        setSelectedValue(convertedValue)
      }
    },
    [isValidValue, initialValue]
  )

  return {
    value: selectedValue,
    onChange: handleChange,
  }
}
