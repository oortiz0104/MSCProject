import { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../../../firebase/firebase.context'
import { User } from '../../../interfaces'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { UserForm } from './components/UserForm'
import { UserCard } from './components/UserCard'

export const ManageEmployees = () => {
  const firebase = useContext(FirebaseContext)

  const [employees, setEmployees] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)

  useEffect(() => {
    const getEmployees = async () => {
      setLoading(true)

      let queryEmployees = query(
        collection(firebase.firestore, 'users'),
        where('role', '==', 2)
      )

      onSnapshot(queryEmployees, (snapshot) => {
        const employees: User[] = []

        snapshot.forEach((doc) => {
          let employee = doc.data() as User

          employees.push({
            ...employee,
            id: doc.id,
          })
        })

        setEmployees(employees)
        setLoading(false)
      })
    }
    
    getEmployees()
  }, [])

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setShowUserForm(true)
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
            Administrar empleados
          </h1>

          <button
            onClick={() => setShowUserForm(true)}
            className='bg-stone-600 hover:bg-stone-700 text-white font-Poppins py-3 px-6 transition ease-in-out duration-300 rounded-md'
          >
            Agregar nuevo empleado
          </button>
        </div>

        <hr className='mb-8 border-black opacity-20' />

        {employees.length === 0 && loading ? (
          <div className='flex flex-col justify-center items-center'>
            <div className='border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-stone-600' />
          </div>
        ) : employees.length === 0 && !loading ? (
          <div className='flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-Khand font-medium text-slate-900'>
              No hay empleados registrados
            </h1>
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
            {employees.map((employee) => (
              <UserCard
                key={employee.id}
                info={employee}
                handleEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      <UserForm
        open={showUserForm}
        setOpen={setShowUserForm}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        defaultRole={2}
      />
    </>
  )
}
