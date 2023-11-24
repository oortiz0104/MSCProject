import { FC, Fragment, useContext, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useFormik } from 'formik'
import { CustomInput, CustomSelect } from '../../../ui'
import * as Yup from 'yup'
import { Activity, User } from '../../../../interfaces'
import toast from 'react-hot-toast'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { FirebaseContext } from '../../../../firebase/firebase.context'
import { delay } from '../../../../utils/misc'
import { TrashIcon } from '@heroicons/react/24/outline'
import moment from 'moment'

interface ActivityFormProps {
  open: boolean
  setOpen: (value: boolean) => void
  selectedActivity: Activity | null
  setSelectedActivity: (value: Activity | null) => void
}

export const ActivityForm: FC<ActivityFormProps> = ({
  open,
  setOpen,
  selectedActivity,
  setSelectedActivity,
}) => {
  const firebase = useContext(FirebaseContext)

  const [loading, setLoading] = useState(false)
  const [employees, setEmployees] = useState<Record<string, string>>({})

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      employee: '',
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required('El título es obligatorio')
        .min(10, 'El título debe tener al menos 10 caracteres')
        .max(100, 'El título debe tener como máximo 100 caracteres'),
      description: Yup.string()
        .required('La descripción es obligatoria')
        .min(10, 'La descripción debe tener al menos 10 caracteres')
        .max(100, 'La descripción debe tener como máximo 100 caracteres'),
      employee: Yup.string().required('El empleado es obligatorio'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true)

        toast.loading(
          `${selectedActivity ? 'Editando' : 'Agregando'} actividad...`
        )

        let employeeRef = doc(firebase?.firestore, 'users', values.employee)

        if (selectedActivity) {
          await updateDoc(
            doc(firebase?.firestore, 'activities', selectedActivity.id),
            {
              title: values.title.trim(),
              description: values.description.trim(),
              employee: employeeRef,
            }
          )
        } else {
          await addDoc(collection(firebase.firestore, 'activities'), {
            title: values.title.trim(),
            description: values.description.trim(),
            creationDate: moment().toISOString(),
            finalizationDate: null,
            employee: employeeRef,
          })
        }

        await delay(1000)
        toast.dismiss()
        toast.success(
          `Actividad ${selectedActivity ? 'editada' : 'agregada'} con éxito`
        )

        setSelectedActivity(null)
        setLoading(false)
        setOpen(false)
        formik.resetForm()
      } catch (error) {
        console.log(
          '🚀 ~ file: ActivityForm.tsx:92 ~ onSubmit: ~ error:',
          error
        )

        toast.dismiss()
        toast.error(
          `Hubo un error al ${selectedActivity ? 'editar' : 'agregar'}`
        )

        setLoading(false)
      }
    },
  })

  useEffect(() => {
    formik.resetForm()

    if (selectedActivity) {
      formik.setValues({
        title: selectedActivity.title,
        description: selectedActivity.description,
        employee: selectedActivity.employee.id,
      })
    }

    if (!open) {
      setSelectedActivity(null)
    }
  }, [open])

  useEffect(() => {
    const getEmployees = async () => {
      let queryEmployees = query(
        collection(firebase.firestore, 'users'),
        where('role', '==', 2)
      )

      onSnapshot(queryEmployees, (snapshot) => {
        const employeeRecord: Record<string, string> = {}

        snapshot.forEach((doc) => {
          let employee = doc.data() as User

          const value = `${employee.name} ${employee.lastname}`

          employeeRecord[doc.id] = value
        })

        setEmployees(employeeRecord)
      })
    }
    getEmployees()
  }, [])

  const deleteActivity = async () => {
    try {
      setLoading(true)
      toast.loading(`Eliminando actividad ${selectedActivity?.title}...`)

      await deleteDoc(
        doc(firebase?.firestore, 'activities', selectedActivity?.id as string)
      )

      await delay(1000)
      toast.dismiss()
      toast.success(`Actividad ${selectedActivity?.title} eliminada con éxito`)

      setSelectedActivity(null)
      setLoading(false)
      setOpen(false)
      formik.resetForm()
    } catch (error) {
      console.log(
        '🚀 ~ file: ActivityForm.tsx:143 ~ deleteUser ~ error:',
        error
      )

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
                    {selectedActivity ? 'Editar' : 'Agregar'} actividad
                  </Dialog.Title>

                  {selectedActivity && (
                    <>
                      {loading ? (
                        <>
                          <div className='border-gray-300 h-8 w-8 animate-spin rounded-full border-4 border-t-stone-600' />
                        </>
                      ) : (
                        <TrashIcon
                          className='h-6 w-6 text-stone-600 cursor-pointer hover:text-red-400 hover:scale-125 transition ease-in-out duration-300'
                          onClick={deleteActivity}
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
                  {formik.touched.title && formik.errors.title ? (
                    <p className='text-red-500 font-Poppins text-sm italic'>
                      {formik.errors.title}
                    </p>
                  ) : null}
                  <CustomInput
                    id='title'
                    name='title'
                    label='Título'
                    placeholder='Título de la actividad'
                    type='text'
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.description && formik.errors.description ? (
                    <p className='text-red-500 font-Poppins text-sm italic'>
                      {formik.errors.description}
                    </p>
                  ) : null}
                  <CustomInput
                    id='description'
                    name='description'
                    label='Descripción'
                    placeholder='Descripción de la actividad'
                    type='text'
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />

                  {formik.touched.employee && formik.errors.employee ? (
                    <p className='text-red-500 font-Poppins text-sm italic'>
                      {formik.errors.employee}
                    </p>
                  ) : null}
                  <CustomSelect
                    id='employee'
                    name='employee'
                    label='Empleado'
                    placeholder='Selecciona un empleado'
                    value={formik.values.employee}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    data={employees}
                  />

                  <div className='sm:flex sm:flex-row-reverse'>
                    <button
                      type='submit'
                      className={`${
                        loading
                          ? 'bg-stone-400'
                          : 'bg-stone-600 hover:bg-stone-700'
                      } text-white font-Poppins py-4 px-6 transition ease-in-out duration-300 inline-flex justify-center items-center rounded-md w-full sm:w-1/2 mb-2 sm:mb-0 sm:ml-2`}
                    >
                      {selectedActivity ? 'Editar' : 'Agregar'} actividad
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
