import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline'
import React, { FC } from 'react'

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isTextArea?: never
  label: string
}

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  isTextArea: true
  label: string
}

type CustomInputProps = TextInputProps | TextAreaProps

export const CustomInput: FC<CustomInputProps> = (props) => {
  const { label, isTextArea, ...restProps } = props

  let icon: React.ReactNode = (
    <Bars3BottomLeftIcon
      className='h-5 w-5 text-gray-400'
      aria-hidden='true'
      color='#9CA3AF'
    />
  )

  return (
    <div className='flex flex-col mb-5 w-full'>
      <label
        htmlFor={label}
        className='block text-base font-medium mb-1 text-gray-900 font-Poppins'
      >
        {label}
      </label>

      <div className='relative rounded-md shadow-sm w-full'>
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 flex ${
            isTextArea ? 'items-start pt-2' : 'items-center'
          } pl-2`}
        >
          {icon}
        </div>

        {isTextArea ? (
          <textarea
            className='w-full h-32 pl-9 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 font-Poppins transition ease-in-out duration-300'
            {...(restProps as TextAreaProps)}
          />
        ) : (
          <input
            className='w-full min-h pl-9 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 font-Poppins transition ease-in-out duration-300'
            {...(restProps as TextInputProps)}
          />
        )}
      </div>
    </div>
  )
}
