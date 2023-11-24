import { FC, useContext, useState } from 'react'
import { User } from '../../../../interfaces'
import { FirebaseContext } from '../../../../firebase/firebase.context'
import toast from 'react-hot-toast'
import { doc, updateDoc } from 'firebase/firestore'
import { delay } from '../../../../utils/misc'
import { SessionStoreInstance } from '../../../../stores'

interface UserCardProps {
  info: User
  handleEdit: (user: User) => void
}

export const UserCard: FC<UserCardProps> = ({ info, handleEdit }) => {
  const { id, name, lastname, username, suspended, role } = info

  const firebase = useContext(FirebaseContext)
  const [loading, setLoading] = useState(false)

  const updateSuspension = async (
    value: boolean,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()

    try {
      setLoading(true)
      toast.loading(`Actualizando estado de ${name}...`)

      await updateDoc(doc(firebase?.firestore, 'users', id), {
        suspended: value,
      })

      await delay(1000)
      toast.dismiss()
      toast.success(
        `Estado de ${name} actualizado a ${value ? 'suspendido' : 'activo'}`
      )
      setLoading(false)
    } catch (error) {
      console.log(
        '🚀 ~ file: CardEmployee.tsx:34 ~ updateSuspension ~ error:',
        error
      )
    }
  }

  return (
    <div
      className='bg-white rounded-md shadow-md p-4 flex flex-col justify-between hover:bg-opacity-5 transition ease-in-out duration-300'
      onClick={() => {
        if (suspended) {
          toast.error('No se puede editar el perfil de un usuario suspendido')
          return
        }

        if (username === SessionStoreInstance.getSessionStore().username) {
          toast.error('No se puede editar el perfil del usuario en sesión')
          return
        }

        if (username === 'ADMIN') {
          toast.error('No se puede editar el perfil del administrador')
          return
        }

        handleEdit(info)
      }}
    >
      <h2 className='text-2xl font-Khand font-medium text-slate-900 pointer-events-none break-words'>
        {name} {lastname}
      </h2>

      <h3 className='text-xl font-Khand font-medium text-slate-500 pointer-events-none break-words'>
        ID: {id}
      </h3>

      <p className='text-slate-500 text-sm font-Poppins pointer-events-none break-words'>
        Usuario: {username}
      </p>

      <p
        className={`text-slate-500 text-sm font-Poppins pointer-events-none ${
          role === 1 ? 'mb-0' : 'mb-3'
        }`}
      >
        Estado: {suspended ? 'Suspendido' : 'Activo'}
      </p>

      {role === 2 && (
        <>
          <hr className='mb-3 border-black opacity-20' />

          <button
            className={`${
              !suspended
                ? 'bg-stone-600 hover:bg-stone-700'
                : 'bg-stone-400 hover:bg-stone-500'
            } text-white font-Poppins p-3 transition ease-in-out duration-300 rounded-md flex flex-row justify-center items-center w-full`}
            onClick={(event) => updateSuspension(!suspended, event)}
            disabled={loading}
          >
            {loading ? (
              <div className='border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-stone-600' />
            ) : suspended ? (
              'Levantar suspensión'
            ) : (
              'Suspender'
            )}
          </button>
        </>
      )}
    </div>
  )
}
