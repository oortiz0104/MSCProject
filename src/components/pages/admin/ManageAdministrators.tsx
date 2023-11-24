import { useContext, useEffect, useState } from 'react'
import { FirebaseContext } from '../../../firebase/firebase.context'
import { User } from '../../../interfaces'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { UserForm } from './components/UserForm'
import { UserCard } from './components/UserCard'
import { CustomInput } from '../../ui'

export const ManageAdministrators = () => {
  const firebase = useContext(FirebaseContext)

  const [administrators, setAdministrators] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserForm, setShowUserForm] = useState(false)

  const [administratorsCopy, setAdministratorsCopy] = useState<User[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const getEmployees = () => {
      setLoading(true)

      let queryEmployees = query(
        collection(firebase.firestore, 'users'),
        where('role', '==', 1)
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

        setAdministrators(employees)
        setAdministratorsCopy(employees)
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
            Administrar administradores
          </h1>

          <button
            onClick={() => setShowUserForm(true)}
            className='bg-stone-600 hover:bg-stone-700 text-white font-Poppins py-3 px-6 transition ease-in-out duration-300 rounded-md'
          >
            Agregar nuevo administrador
          </button>
        </div>

        <hr className='mb-8 border-black opacity-20' />

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-4'>
          <CustomInput
            id='search'
            name='search'
            label='Buscar administrador'
            placeholder='Buscar por nombre, apellido o usuario'
            type='text'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)

              if (e.target.value === '') {
                setAdministrators(administratorsCopy)
                return
              }

              let filteredAdministrators = administratorsCopy.filter(
                (admin) =>
                  admin.name.includes(e.target.value.toUpperCase()) ||
                  admin.lastname.includes(e.target.value.toUpperCase()) ||
                  admin.username.includes(e.target.value.toUpperCase())
              )

              setAdministrators(filteredAdministrators)
            }}
          />
        </div>

        {administrators.length === 0 && loading ? (
          <div className='flex flex-col justify-center items-center'>
            <div className='border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-stone-600' />
          </div>
        ) : administrators.length === 0 && !loading ? (
          <div className='flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-Khand font-medium text-slate-900'>
              No hay administradores registrados
            </h1>
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
            {administrators.map((employee) => (
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
        defaultRole={1}
      />
    </>
  )
}
