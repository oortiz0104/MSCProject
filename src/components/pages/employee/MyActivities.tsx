import { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../../../firebase/firebase.context'
import { Activity, User } from '../../../interfaces'
import {
  DocumentReference,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore'
import moment from 'moment'
import { SessionStoreInstance } from '../../../stores'
import { ActivityCard } from '../admin/components/ActivityCard'
import { CustomInput } from '../../ui'

export const MyActivities = () => {
  const firebase = useContext(FirebaseContext)

  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)

  const [activitiesCopy, setActivitiesCopy] = useState<Activity[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getActivities = async () => {
      setLoading(true)

      let userID = SessionStoreInstance.getSessionStore().id
      let userDocRef = doc(firebase.firestore, 'users', userID)

      let queryActivities = query(
        collection(firebase.firestore, 'activities'),
        where('employee', '==', userDocRef)
      )

      onSnapshot(queryActivities, async (snapshot) => {
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
        setActivitiesCopy(activities)
        setLoading(false)
      })
    }
    getActivities()
  }, [])

  const getUnfinishedActivities = (): Activity[] => {
    return activities.filter((activity) => activity.finalizationDate === null)
  }

  const getFinishedActivities = (): Activity[] => {
    return activities.filter((activity) => activity.finalizationDate !== null)
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
        </div>

        <hr className='mb-8 border-black opacity-20' />

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4'>
          <CustomInput
            id='search'
            name='search'
            label='Buscar actividad'
            placeholder='Buscar por título o descripción'
            type='text'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)

              if (e.target.value === '') {
                setActivities(activitiesCopy)
                return
              }

              const filteredActivities = activitiesCopy.filter((activity) => {
                const { title, description } = activity

                const searchValue = e.target.value.toLowerCase()

                return (
                  title.toLowerCase().includes(searchValue) ||
                  description.toLowerCase().includes(searchValue)
                )
              })

              setActivities(filteredActivities)
            }}
          />
        </div>

        {activities.length === 0 && loading ? (
          <div className='flex flex-col justify-center items-center'>
            <div className='border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-stone-600' />
          </div>
        ) : (
          <>
            <h2 className='text-4xl font-Khand font-medium text-slate-900 mb-5'>
              Actividades pendientes
            </h2>

            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
              {getUnfinishedActivities().length === 0 ? (
                <p className='text-2xl font-Khand font-medium text-slate-900'>
                  No hay actividades pendientes
                </p>
              ) : (
                getUnfinishedActivities().map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    info={activity}
                    handleEdit={() => {}}
                  />
                ))
              )}
            </div>

            <h2 className='text-4xl font-Khand font-medium text-slate-900 mb-5'>
              Actividades finalizadas
            </h2>

            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
              {getFinishedActivities().length === 0 ? (
                <p className='text-2xl font-Khand font-medium text-slate-900'>
                  No hay actividades finalizadas
                </p>
              ) : (
                getFinishedActivities().map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    info={activity}
                    handleEdit={() => {}}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  )
}
