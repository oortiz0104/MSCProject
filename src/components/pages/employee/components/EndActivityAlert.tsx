import { FC, Fragment, useContext, useRef } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Activity } from '../../../../interfaces'
import toast from 'react-hot-toast'
import { doc, updateDoc } from 'firebase/firestore'
import { FirebaseContext } from '../../../../firebase/firebase.context'
import moment from 'moment'
import { delay } from '../../../../utils/misc'

interface ActivityFormProps {
  show: boolean
  setShow: (value: boolean) => void
  activity: Activity | null
}

export const EndActivityAlert: FC<ActivityFormProps> = ({
  show,
  setShow,
  activity,
}) => {
  const { id, title } = activity || {}

  const cancelButtonRef = useRef(null)

  const firebase = useContext(FirebaseContext)

  const confirmEndActivity = async () => {
    try {
      toast.loading(`Actualizando finalización de ${title}...`)

      await updateDoc(doc(firebase?.firestore, 'activities', id as string), {
        finalizationDate: moment().toISOString(),
      })

      await delay(1000)
      toast.dismiss()
      toast.success(`Finalización de ${title} actualizada`)
      setShow(false)
    } catch (error) {
      console.log(
        '🚀 ~ file: EndActivityAlert.tsx:41 ~ confirmEndActivity ~ error:',
        error
      )
    }
  }

  return (
    <Transition.Root
      show={show}
      as={Fragment}
    >
      <Dialog
        as='div'
        className='relative z-10'
        initialFocus={cancelButtonRef}
        onClose={setShow}
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
              <Dialog.Panel className='rounded-md bg-white shadow-md relative transform overflow-hidden text-left transition-all sm:my-8 sm:w-full sm:max-w-lg'>
                <div className='bg-white px-8 py-8'>
                  <div className='sm:flex sm:items-start'>
                    <div className='mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10'>
                      <ExclamationTriangleIcon
                        className='h-6 w-6 text-yellow-500'
                        aria-hidden='true'
                      />
                    </div>
                    <div className='mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left'>
                      <Dialog.Title
                        as='h3'
                        className='text-2xl leading-6 font-Khand font-medium text-slate-900'
                      >
                        Actualizar fecha de finalización
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm text-gray-500 font-Poppins'>
                          ¿Estás seguro que deseas actualizar la fecha de
                          finalización de esta actividad?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='bg-gray-50 px-8 py-8 sm:flex sm:flex-row-reverse'>
                  <button
                    type='button'
                    className='bg-stone-600 hover:bg-stone-700 text-white font-Poppins py-4 px-6 transition ease-in-out duration-300 inline-flex justify-center items-center rounded-md w-full sm:w-1/2 mb-2 sm:mb-0 sm:ml-2'
                    onClick={confirmEndActivity}
                  >
                    Confirmar
                  </button>
                  <button
                    type='button'
                    className='bg-stone-200 hover:bg-stone-300 text-stone-600 font-Poppins py-4 px-6 transition ease-in-out duration-300 inline-flex justify-center items-center rounded-md w-full sm:w-1/2'
                    onClick={() => setShow(false)}
                    ref={cancelButtonRef}
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
