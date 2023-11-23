import { FC } from "react"

interface CustomSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  placeholder: string
  data: Record<string, string>
}

export const CustomSelect: FC<CustomSelectProps> = ({
  label,
  placeholder,
  data,
  ...props
}) => {
  return (
    <div className='flex flex-col mb-5 w-full'>
      <label
        htmlFor={label}
        className='block text-base font-medium mb-1 text-gray-900 font-Poppins'
      >
        {label}
      </label>

      <select
        className='w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 font-Poppins transition ease-in-out duration-300'
        {...props}
      >
        <option
          value=''
          disabled
        >
          {placeholder}
        </option>

        {Object.entries(data).map(([key, value]) => (
          <option
            key={key}
            value={key}
          >
            {value}
          </option>
        ))}
      </select>
    </div>
  )
}
