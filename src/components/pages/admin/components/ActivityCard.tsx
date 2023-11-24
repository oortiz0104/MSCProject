import { FC } from 'react'
import { Activity } from '../../../../interfaces'
import moment from 'moment'

interface ActivityCardProps {
  info: Activity
  handleEdit: (activity: Activity) => void
}

export const ActivityCard: FC<ActivityCardProps> = ({ info, handleEdit }) => {
  const { id, title, description, creationDate, finalizationDate, employee } =
    info

  const { name, lastname, username } = employee

  return (
    <div
      className='bg-white rounded-md shadow-md p-4 flex flex-col justify-between hover:bg-opacity-5 transition ease-in-out duration-300'
      onClick={() => handleEdit(info)}
    >
      <h2 className='text-2xl font-Khand font-medium text-slate-900 pointer-events-none'>
        {title}
      </h2>

      <h3 className='text-xl font-Khand font-medium text-slate-500 pointer-events-none mb-3'>
        ID: {id}
      </h3>

      <hr className='mb-3 border-black opacity-20' />

      <h3 className='text-xl font-Khand font-medium text-slate-500 pointer-events-none'>
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

      <p className='text-slate-500 text-sm font-Poppins pointer-events-none'>
        Usuario: {username}
      </p>
    </div>
  )
}
