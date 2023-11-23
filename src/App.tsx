import { Routes, Route, Navigate } from 'react-router'

import { Sidebar } from './components/ui'
import { Toaster } from 'react-hot-toast'
import { FirebaseProvider } from './firebase/firebase.context'
import { useEffect, useState } from 'react'
import { SessionStoreInstance } from './stores'
import { Login } from './components/pages/Login'
import { ManageEmployees } from './components/pages/admin/ManageEmployees'
import { ManageAdministrators } from './components/pages/admin/ManageAdministrators'

const App = () => {
  const [isLogged, setIsLogged] = useState(false)
  let role = SessionStoreInstance.SessionStore.role

  useEffect(() => {
    setIsLogged(SessionStoreInstance.SessionStore.isLogged)
  }, [SessionStoreInstance.SessionStore])

  return (
    <FirebaseProvider>
      {isLogged ? (
        <div className='md:flex min-h-screen'>
          <Sidebar />

          <div className='md:w-4/6 xl:w-10/12'>
            <Routes>
              {role === 1 ? (
                <>
                  <Route
                    path='/'
                    element={<ManageEmployees />}
                  />
                  <Route
                    path='/staff'
                    element={<ManageEmployees />}
                  />
                  <Route
                    path='/administrators'
                    element={<ManageAdministrators />}
                  />
                  <Route
                    path='/activities'
                    element={<></>}
                  />
                  <Route
                    path='*'
                    element={
                      <Navigate
                        to='/staff'
                        replace
                      />
                    }
                  />
                </>
              ) : (
                <>
                  <Route
                    path='/'
                    element={<></>}
                  />
                  <Route
                    path='/myActivities'
                    element={<></>}
                  />
                  <Route
                    path='/myProfile'
                    element={<></>}
                  />
                  <Route
                    path='*'
                    element={
                      <Navigate
                        to='/myActivities'
                        replace
                      />
                    }
                  />
                </>
              )}
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route
            path='/login'
            element={<Login />}
          />
          <Route
            path='*'
            element={
              <Navigate
                to='/login'
                replace
              />
            }
          />
        </Routes>
      )}

      <Toaster />
    </FirebaseProvider>
  )
}

export default App
