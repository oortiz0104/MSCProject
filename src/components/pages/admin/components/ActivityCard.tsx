import { FC, useState } from 'react'
import { Activity } from '../../../../interfaces'
import { SessionStoreInstance } from '../../../../stores'
import moment from 'moment'
import { EndActivityAlert } from '../../employee/components/EndActivityAlert'

interface ActivityCardProps {
  info: Activity
  handleEdit: (activity: Activity) => void
}

export const ActivityCard: FC<ActivityCardProps> = ({ info, handleEdit }) => {
  const { id, title, description, creationDate, finalizationDate, employee } =
    info
  const { name, lastname, username } = employee

  let sessionRole = SessionStoreInstance.SessionStore.role

  const [showEndActivityAlert, setShowEndActivityAlert] = useState(false)

  const updateFinalization = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation()
    setShowEndActivityAlert(true)
  }

  return (
    <>
      <div
        className='bg-white rounded-md shadow-md p-4 flex flex-col justify-between hover:bg-opacity-5 transition ease-in-out duration-300'
        onClick={() => handleEdit(info)}
      >
        <h2 className='text-2xl font-Khand font-medium text-slate-900 pointer-events-none break-words'>
          {title}
        </h2>

        <h3 className='text-xl font-Khand font-medium text-slate-500 pointer-events-none mb-3 break-words'>
          ID: {id}
        </h3>

        <hr className='mb-3 border-black opacity-20' />

        <h3 className='text-xl font-Khand font-medium text-slate-500 pointer-events-none break-words'>
          {description}
        </h3>

        <p className='text-slate-500 text-sm font-Poppins pointer-events-none'>
          Fecha de creación:{' '}
          {moment(creationDate).format('DD/MM/YYYY - HH:mm:ss')}
        </p>

        <p className='text-slate-500 text-sm font-Poppins pointer-events-none mb-3'>
          Fecha de finalización:{' '}
          {finalizationDate
            ? moment(finalizationDate).format('DD/MM/YYYY - HH:mm:ss')
            : 'No finalizada'}
        </p>

        <hr className='mb-3 border-black opacity-20' />

        <p className='text-slate-500 text-sm font-Poppins pointer-events-none'>
          Empleado asignado: {name} {lastname}
        </p>

        <p
          className={`text-slate-500 text-sm font-Poppins pointer-events-none ${
            sessionRole === 1 ? 'mb-0' : 'mb-3'
          }`}
        >
          Usuario: {username}
        </p>

        {sessionRole === 2 && (
          <>
            <hr className='mb-3 border-black opacity-20' />

            <button
              className={`${
                finalizationDate === null
                  ? 'bg-stone-600 hover:bg-stone-700'
                  : 'bg-stone-400 hover:bg-stone-500'
              } text-white font-Poppins p-3 transition ease-in-out duration-300 rounded-md flex flex-row justify-center items-center w-full`}
              onClick={(event) => updateFinalization(event)}
            >
              {finalizationDate
                ? 'Actualizar finalización'
                : 'Finalizar actividad'}
            </button>
          </>
        )}
      </div>

      <EndActivityAlert
        show={showEndActivityAlert}
        setShow={setShowEndActivityAlert}
        activity={info}
      />
    </>
  )
}
