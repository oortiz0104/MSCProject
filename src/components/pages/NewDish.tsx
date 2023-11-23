import React, { FC, useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { UilTextFields, UilDollarAlt, UilImage } from '@iconscout/react-unicons'
import toast from 'react-hot-toast'

import { FirebaseContext } from '../../firebase/firebase.context'
import { addDoc, collection } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import { delay, generateRandomString } from '../../utils/misc'
import { createDishTypeObject } from '../../models/dishes'

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

const CustomInput: FC<CustomInputProps> = (props) => {
  const { label, isTextArea, ...restProps } = props

  let icon: React.ReactNode = (
    <UilTextFields
      size='20'
      color='#9CA3AF'
    />
  )

  if ('type' in props) {
    switch (props.type) {
      case 'text':
        icon = (
          <UilTextFields
            size='20'
            color='#9CA3AF'
          />
        )
        break

      case 'number':
        icon = (
          <UilDollarAlt
            size='20'
            color='#9CA3AF'
          />
        )
        break

      case 'file':
        icon = (
          <UilImage
            size='20'
            color='#9CA3AF'
          />
        )
        break

      default:
        icon = (
          <UilTextFields
            size='20'
            color='#9CA3AF'
          />
        )
        break
    }
  }

  return (
    <div className='flex flex-col mb-5'>
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

interface CustomSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  placeholder: string
  data: Record<string, string>
}

const CustomSelect: FC<CustomSelectProps> = ({
  label,
  placeholder,
  data,
  ...props
}) => {
  return (
    <div className='flex flex-col mb-5'>
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

export const NewDish = () => {
  const firebase = useContext(FirebaseContext)

  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      price: 0,
      type: '',
      image: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('El nombre es obligatorio')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre debe tener menos de 50 caracteres'),
      price: Yup.number()
        .required('El precio es obligatorio')
        .min(1, 'El precio debe ser mayor a 0')
        .test(
          'dos-decimales',
          'El precio debe tener exactamente dos decimales',
          (value) => {
            if (value) {
              const decimalPart = value.toString().split('.')[1] || ''
              return decimalPart.length === 2 || decimalPart.length === 0
            }
            return true
          }
        ),
      image: Yup.string().required('La imagen es obligatoria'),
      type: Yup.string().required('El tipo es obligatorio'),
      description: Yup.string()
        .required('La descripción es obligatoria')
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(200, 'La descripción debe tener menos de 100 caracteres'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)

        toast.loading('Subiendo imagen...')

        let name = `${generateRandomString(10)}_${file?.name}`

        const storageRef = ref(firebase?.storage, `images/dishes/${name}`)

        let imageArrayBuffer = await file?.arrayBuffer()
        await uploadBytes(storageRef, imageArrayBuffer as ArrayBuffer)

        await delay(1000)
        toast.dismiss()
        toast.success('Imagen subida correctamente')

        toast.loading('Agregando platillo...')

        await addDoc(collection(firebase?.firestore, 'dishes'), {
          ...values,
          price: values.price,
          stock: true,
          image: name,
        })

        await delay(1000)
        toast.dismiss()
        toast.success('Platillo agregado correctamente')

        await delay(1000)
        setLoading(false)

        formik.resetForm()
        setFile(null)
      } catch (error) {
        console.log('🚀 ~ file: NewDish.tsx:189 ~ NewDish ~ error:', error)
        toast.error('Ocurrió un error al agregar el platillo')
      }
    },
  })

  return (
    <div
      className='p-8 min-h-screen'
      style={{
        backgroundColor: '#F3F3F3',
      }}
    >
      <div className='flex flex-row justify-between items-center mb-8'>
        <h1 className='text-5xl font-Khand font-medium text-slate-900'>
          Agregar platillo
        </h1>
      </div>

      <hr className='mb-8 border-black opacity-20' />

      <div className='flex justify-center items-center w-full'>
        <form
          className='p-8 bg-white sm:w-full xl:w-1/2 flex flex-col justify-center rounded-md'
          style={{
            boxShadow: '0px 4px 40px 0px #09163826',
          }}
          onSubmit={formik.handleSubmit}
        >
          <h2 className='text-3xl font-Khand font-medium text-slate-900 mb-5'>
            Platillo
          </h2>

          <hr className='mb-8 border-black opacity-5 border-2' />

          {formik.touched.name && formik.errors.name ? (
            <p className='text-red-500 font-Poppins text-sm italic'>
              {formik.errors.name}
            </p>
          ) : null}
          <CustomInput
            id='name'
            name='name'
            label='Nombre'
            placeholder='Nombre del platillo'
            type='text'
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.touched.price && formik.errors.price ? (
            <p className='text-red-500 font-Poppins text-sm italic'>
              {formik.errors.price}
            </p>
          ) : null}
          <CustomInput
            id='price'
            name='price'
            label='Precio'
            placeholder='Precio del platillo'
            type='number'
            min={1}
            step={0.01}
            value={formik.values.price}
            onChange={(e) => {
              const value = e.target.value
              const decimalPart = value.split('.')[1]

              if (decimalPart && decimalPart.length > 2) {
                e.target.value = parseFloat(value).toFixed(2)
              }

              formik.handleChange(e)
            }}
            onBlur={formik.handleBlur}
          />

          {formik.touched.type && formik.errors.type ? (
            <p className='text-red-500 font-Poppins text-sm italic'>
              {formik.errors.type}
            </p>
          ) : null}
          <CustomSelect
            id='type'
            name='type'
            label='Tipo'
            placeholder='Tipo de platillo'
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            data={createDishTypeObject()}
          />

          {formik.touched.image && formik.errors.image ? (
            <p className='text-red-500 font-Poppins text-sm italic'>
              {formik.errors.image}
            </p>
          ) : null}
          <CustomInput
            id='image'
            name='image'
            label='Imagen'
            placeholder='Imagen del platillo'
            type='file'
            accept='image/*'
            value={formik.values.image}
            onChange={(e) => {
              if (e.target.files === null) return

              setFile(e.target.files[0])
              formik.handleChange(e)
            }}
            onBlur={formik.handleBlur}
          />

          {formik.touched.description && formik.errors.description ? (
            <p className='text-red-500 font-Poppins text-sm italic'>
              {formik.errors.description}
            </p>
          ) : null}
          <CustomInput
            isTextArea={true}
            id='description'
            name='description'
            label='Descripción'
            placeholder='Descripción del platillo'
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          <button
            type='submit'
            className={`${
              loading ? 'bg-stone-400' : 'bg-stone-600 hover:bg-stone-700'
            } text-white font-Poppins py-4 px-6 transition ease-in-out duration-300 flex justify-center items-center rounded-md h-16`}
            disabled={loading}
          >
            {loading ? (
              <div className='border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-stone-600' />
            ) : (
              'Agregar platillo'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
