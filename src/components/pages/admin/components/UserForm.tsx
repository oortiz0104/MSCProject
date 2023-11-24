import { FC, Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useFormik } from 'formik'
import { CustomInput } from '../../../ui'
import * as Yup from 'yup'
import { User } from '../../../../interfaces'
import toast from 'react-hot-toast'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { FirebaseContext } from '../../../../firebase/firebase.context'
import { delay } from '../../../../utils/misc'
import { TrashIcon } from '@heroicons/react/24/outline'
import { SessionStoreInstance } from '../../../../stores'

interface UserFormProps {
  open: boolean
  setOpen: (value: boolean) => void
  selectedUser: User | null
  setSelectedUser: (value: User | null) => void
  defaultRole: number
}

export const UserForm: FC<UserFormProps> = ({
  open,
  setOpen,
  selectedUser,
  setSelectedUser,
  defaultRole,
}) => {
  const firebase = useContext(FirebaseContext)

  const [loading, setLoading] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      name: '',
      lastname: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('El nombre es obligatorio')
        .matches(/^[a-zA-Z\s]+$/, 'El nombre solo puede contener letras')
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(50, 'El nombre debe tener menos de 50 caracteres'),
      lastname: Yup.string()
        .required('El apellido es obligatorio')
        .matches(/^[a-zA-Z\s]+$/, 'El apellido solo puede contener letras')
        .min(3, 'El apellido debe tener al menos 3 caracteres')
        .max(50, 'El apellido debe tener menos de 50 caracteres'),
      username: Yup.string()
        .required('El nombre de usuario es obligatorio')
        .matches(
          /^[a-zA-Z0-9]+$/,
          'El nombre de usuario solo puede contener letras y números'
        )
        .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
        .max(50, 'El nombre de usuario debe tener menos de 50 caracteres'),
      password: Yup.string()
        .required('La contraseña es obligatoria')
        .matches(
          /^[a-zA-Z0-9]+$/,
          'La contraseña solo puede contener letras y números'
        )
        .min(3, 'La contraseña debe tener al menos 3 caracteres')
        .max(50, 'La contraseña debe tener menos de 50 caracteres'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)

        if (defaultRole === 0) {
          toast.loading(`Editando perfil...`)
        }

        if (defaultRole === 1) {
          toast.loading(
            `${selectedUser ? 'Editando' : 'Agregando'} administrador...`
          )
        }

        if (defaultRole === 2) {
          toast.loading(
            `${selectedUser ? 'Editando' : 'Agregando'} empleado...`
          )
        }

        let queryFindUser = query(
          collection(firebase.firestore, 'users'),
          where('username', '==', values.username.toUpperCase().trim())
        )

        let docs = await getDocs(queryFindUser)

        if (
          docs.size > 0 &&
          selectedUser?.username !== values.username.toUpperCase().trim()
        ) {
          toast.dismiss()
          toast.error('El nombre de usuario ya existe, intenta con otro')

          setLoading(false)
          return
        }

        if (selectedUser) {
          await updateDoc(doc(firebase?.firestore, 'users', selectedUser.id), {
            name: values.name.toUpperCase().trim(),
            lastname: values.lastname.toUpperCase().trim(),
            username: values.username.toUpperCase().trim(),
          })
        } else {
          await addDoc(collection(firebase.firestore, 'users'), {
            name: values.name.toUpperCase().trim(),
            lastname: values.lastname.toUpperCase().trim(),
            username: values.username.toUpperCase().trim(),
            password: values.password.trim(),
            suspended: false,
            role: defaultRole === 1 ? 1 : 2,
          })
        }

        if (defaultRole === 0) {
          SessionStoreInstance.SessionStore = {
            ...SessionStoreInstance.SessionStore,
            name: values.name.toUpperCase().trim(),
            lastname: values.lastname.toUpperCase().trim(),
          }
        }

        await delay(1000)
        toast.dismiss()

        if (defaultRole === 0) {
          toast.success(`Perfil editado con éxito`)
        }

        if (defaultRole === 1) {
          toast.success(
            `Administrador ${selectedUser ? 'editado' : 'agregado'} con éxito`
          )
        }

        if (defaultRole === 2) {
          toast.success(
            `Empleado ${selectedUser ? 'editado' : 'agregado'} con éxito`
          )
        }

        setSelectedUser(null)
        setLoading(false)
        setOpen(false)
        formik.resetForm()

        if (defaultRole === 0) {
          window.location.href = '/'
        }
      } catch (error) {
        console.log(
          '🚀 ~ file: EmployeeForm.tsx:70 ~ onSubmit: ~ error:',
          error
        )

        toast.dismiss()
        toast.error(`Hubo un error al ${selectedUser ? 'editar' : 'agregar'}`)

        setLoading(false)
      }
    },
  })

  useEffect(() => {
    formik.resetForm()

    if (selectedUser) {
      formik.setValues({
        name: selectedUser.name,
        lastname: selectedUser.lastname,
        username: selectedUser.username,
        password: selectedUser.password,
      })
    }

    if (!open) {
      setSelectedUser(null)
    }
  }, [open])

  const deleteUser = async () => {
    try {
      setLoading(true)
      toast.loading(`Eliminando ${selectedUser?.name}...`)

      await deleteDoc(
        doc(firebase?.firestore, 'users', selectedUser?.id as string)
      )

      await delay(1000)
      toast.dismiss()
      toast.success(`${selectedUser?.name} eliminado con éxito`)

      setSelectedUser(null)
      setLoading(false)
      setOpen(false)
      formik.resetForm()
    } catch (error) {
      console.log('🚀 ~ file: EmployeeForm.tsx:70 ~ onSubmit: ~ error:', error)

      toast.dismiss()
      toast.error(`Hubo un error al eliminar`)

      setLoading(false)
    }
  }

  return (
    <Transition.Root
      show={open}
      as={Fragment}
    >
      <Dialog
        as='div'
        className='relative z-10'
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-stone-600 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='rounded-md bg-white shadow-md relative p-8 transform overflow-hidden text-left transition-all sm:w-full sm:max-w-lg'>
                <div className='w-screen' />

                <div className='flex flex-row justify-between items-center mb-8 flex-wrap'>
                  <Dialog.Title
                    as='h3'
                    className='text-3xl leading-6 font-Khand font-medium text-slate-900'
                  >
                    {defaultRole === 0 && 'Editar perfil'}

                    {defaultRole === 1 &&
                      `${selectedUser ? 'Editar' : 'Agregar'} administrador`}

                    {defaultRole === 2 &&
                      `${selectedUser ? 'Editar' : 'Agregar'} empleado`}
                  </Dialog.Title>

                  {selectedUser && defaultRole !== 0 && (
                    <>
                      {loading ? (
                        <>
                          <div className='border-gray-300 h-8 w-8 animate-spin rounded-full border-4 border-t-stone-600' />
                        </>
                      ) : (
                        <TrashIcon
                          className='h-6 w-6 text-stone-600 cursor-pointer hover:text-red-400 hover:scale-125 transition ease-in-out duration-300'
                          onClick={deleteUser}
                        />
                      )}
                    </>
                  )}
                </div>

                <hr className='mb-8 border-black opacity-20' />

                <form
                  className='w-full flex flex-col'
                  onSubmit={formik.handleSubmit}
                >
                  {formik.touched.name && formik.errors.name ? (
                    <p className='text-red-500 font-Poppins text-sm italic'>
                      {formik.errors.name}
                    </p>
                  ) : null}
                  <CustomInput
                    id='name'
                    name='name'
                    label='Nombre'
                    placeholder='Nombre del empleado'
                    type='text'
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.lastname && formik.errors.lastname ? (
                    <p className='text-red-500 font-Poppins text-sm italic'>
                      {formik.errors.lastname}
                    </p>
                  ) : null}
                  <CustomInput
                    id='lastname'
                    name='lastname'
                    label='Apellido'
                    placeholder='Apellido del empleado'
                    type='text'
                    value={formik.values.lastname}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {defaultRole !== 0 && (
                    <>
                      {formik.touched.username && formik.errors.username ? (
                        <p className='text-red-500 font-Poppins text-sm italic'>
                          {formik.errors.username}
                        </p>
                      ) : null}
                      <CustomInput
                        id='username'
                        name='username'
                        autoComplete={undefined}
                        label='Nombre de usuario'
                        placeholder='Nombre de usuario'
                        type='text'
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </>
                  )}

                  {!selectedUser && (
                    <>
                      {formik.touched.password && formik.errors.password ? (
                        <p className='text-red-500 font-Poppins text-sm italic'>
                          {formik.errors.password}
                        </p>
                      ) : null}
                      <CustomInput
                        id='npassword'
                        name='password'
                        autoComplete={undefined}
                        label='Contraseña'
                        placeholder='Contraseña'
                        type='password'
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </>
                  )}

                  <div className='sm:flex sm:flex-row-reverse'>
                    <button
                      type='submit'
                      className={`${
                        loading
                          ? 'bg-stone-400'
                          : 'bg-stone-600 hover:bg-stone-700'
                      } text-white font-Poppins py-4 px-6 transition ease-in-out duration-300 inline-flex justify-center items-center rounded-md w-full sm:w-1/2 mb-2 sm:mb-0 sm:ml-2`}
                    >
                      {defaultRole === 0 && 'Editar perfil'}

                      {defaultRole === 1 &&
                        `${selectedUser ? 'Editar' : 'Agregar'} administrador`}

                      {defaultRole === 2 &&
                        `${selectedUser ? 'Editar' : 'Agregar'} empleado`}
                    </button>

                    <button
                      type='button'
                      className={`${
                        loading
                          ? 'bg-stone-400'
                          : 'bg-stone-200 hover:bg-stone-300'
                      } text-stone-600 font-Poppins py-4 px-6 transition ease-in-out duration-300 inline-flex justify-center items-center rounded-md w-full sm:w-1/2`}
                      onClick={() => setOpen(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
