import { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../../../firebase/firebase.context'
import { Activity, User } from '../../../interfaces'
import {
  DocumentReference,
  collection,
  getDoc,
  onSnapshot,
} from 'firebase/firestore'
import { ActivityCard } from './components/ActivityCard'
import { ActivityForm } from './components/ActivityForm'
import moment from 'moment'

export const ManageActivities = () => {
  const firebase = useContext(FirebaseContext)

  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  )
  const [showActivityForm, setShowActivityForm] = useState(false)

  useEffect(() => {
    const getActivities = async () => {
      setLoading(true)

      onSnapshot(
        collection(firebase.firestore, 'activities'),
        async (snapshot) => {
          const activitiesPromises = snapshot.docs.map(async (doc) => {
            let activityData = doc.data()
            let employeeRef: DocumentReference = activityData.employee
            let employeeSnapshot = await getDoc(employeeRef)
            let employeeData = employeeSnapshot.data() as User

            return {
              ...(activityData as Activity),
              id: doc.id,
              employee: {
                ...employeeData,
                id: employeeSnapshot.id,
              },
            }
          })

          const activities = await Promise.all(activitiesPromises)

          activities.sort((a, b) =>
            moment(a.creationDate).diff(moment(b.creationDate))
          )

          setActivities(activities)
          setLoading(false)
        }
      )
    }
    getActivities()
  }, [])

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity)
    setShowActivityForm(true)
  }

  return (
    <>
      <div
        className='p-8 min-h-screen'
        style={{
          backgroundColor: '#F3F3F3',
        }}
      >
        <div className='flex flex-row justify-between items-center mb-8 flex-wrap'>
          <h1 className='text-5xl font-Khand font-medium text-slate-900'>
            Administrar actividades
          </h1>

          <button
            onClick={() => setShowActivityForm(true)}
            className='bg-stone-600 hover:bg-stone-700 text-white font-Poppins py-3 px-6 transition ease-in-out duration-300 rounded-md'
          >
            Agregar nueva actividad
          </button>
        </div>

        <hr className='mb-8 border-black opacity-20' />

        {activities.length === 0 && loading ? (
          <div className='flex flex-col justify-center items-center'>
            <div className='border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-stone-600' />
          </div>
        ) : activities.length === 0 && !loading ? (
          <div className='flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-Khand font-medium text-slate-900'>
              No hay actividades registradas
            </h1>
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
            {activities.map((employee) => (
              <ActivityCard
                key={employee.id}
                info={employee}
                handleEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <ActivityForm
        open={showActivityForm}
        setOpen={setShowActivityForm}
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
      />
    </>
  )
}
