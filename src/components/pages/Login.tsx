import { FC, useContext, useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import { delay, generateRandomString } from '../../utils/misc'
import { FirebaseContext } from '../../firebase/firebase.context'
import { collection, query, where, limit, getDocs } from 'firebase/firestore'
import { User } from '../../interfaces'
import { SessionStoreInstance } from '../../stores'
import { LockClosedIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export const Login: FC = () => {
  const firebase = useContext(FirebaseContext)
  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required('El nombre de usuario es obligatorio')
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'El nombre de usuario debe tener menos de 50 caracteres'),
      password: Yup.string()
        .required('La contraseña es obligatoria')
        .min(3, 'La contraseña debe tener al menos 3 caracteres')
        .max(50, 'La contraseña debe tener menos de 50 caracteres'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)

        toast.loading('Iniciando sesión...')

        let queryUser = query(
          collection(firebase.firestore, 'users'),
          where('username', '==', values.username.toUpperCase()),
          limit(1)
        )

        let docs = await getDocs(queryUser)

        if (docs.size === 0) {
          toast.dismiss()
          toast.error('Usuario o contraseña incorrectos')

          setLoading(false)
          return
        }

        docs.forEach(async (doc) => {
          let user: User = {
            id: doc.id,
            username: doc.data().username,
            password: doc.data().password,
            name: doc.data().name,
            lastname: doc.data().lastname,
            role: doc.data().role,
            suspended: doc.data().suspended,
          }

          if (user.suspended) {
            toast.dismiss()
            toast.error('Tu cuenta ha sido suspendida, contacta al administrador')

            setLoading(false)
            return
          }

          if (user.password !== values.password) {
            toast.dismiss()
            toast.error('Usuario o contraseña incorrectos')

            setLoading(false)
            return
          }

          let sessionID = generateRandomString(10)

          SessionStoreInstance.setSessionStore({
            sessionID,
            isLogged: true,
            ...user,
          })

          await delay(1000)
          toast.dismiss()
          toast.success('Sesión iniciada')

          setLoading(false)

          formik.resetForm()
          window.location.href = '/'
        })
      } catch (error) {
        console.log('🚀 ~ file: Login.tsx:61 ~ onSubmit: ~ error:', error)

        toast.dismiss()
        toast.error('Ocurrió un error al iniciar sesión')

        setLoading(false)
      }
    },
  })

  return (
    <div
      className='p-8 min-h-screen flex flex-row justify-center items-center'
      style={{
        backgroundColor: '#F3F3F3',
      }}
    >
      <form
        className='p-8 bg-white rounded-md shadow-lg sm:w-full xl:w-1/3 flex flex-col justify-center'
        onSubmit={formik.handleSubmit}
      >
        <h1 className='text-5xl font-Khand font-medium text-slate-900 mb-8'>
          Inicia sesión
        </h1>

        <hr className='mb-8 border-black opacity-5 border-2' />

        <div className='flex flex-col mb-5'>
          <label
            htmlFor='username'
            className='block text-base font-medium mb-1 text-gray-900 font-Poppins'
          >
            Nombre de usuario{' '}
            {formik.touched.username && formik.errors.username ? (
              <span className='text-red-500 font-Poppins text-sm italic'>
                - {formik.errors.username}
              </span>
            ) : null}
          </label>

          <div className='relative rounded-md shadow-sm w-full'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
              <UserCircleIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
                color='#9CA3AF'
              />
            </div>

            <input
              id='username'
              name='username'
              placeholder='Nombre de usuario'
              type='text'
              className='w-full min-h pl-9 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 font-Poppins transition ease-in-out duration-300'
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
        </div>

        <div className='flex flex-col mb-10'>
          <label
            htmlFor='password'
            className='block text-base font-medium mb-1 text-gray-900 font-Poppins'
          >
            Contraseña{' '}
            {formik.touched.password && formik.errors.password ? (
              <span className='text-red-500 font-Poppins text-sm italic'>
                - {formik.errors.password}
              </span>
            ) : null}
          </label>

          <div className='relative rounded-md shadow-sm w-full'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2'>
              <LockClosedIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
                color='#9CA3AF'
              />
            </div>

            <input
              id='password'
              name='password'
              placeholder='Contraseña'
              type='password'
              className='w-full min-h pl-9 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 font-Poppins transition ease-in-out duration-300'
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              security='true'
            />
          </div>
        </div>

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
            'Iniciar sesión'
          )}
        </button>
      </form>
    </div>
  )
}
