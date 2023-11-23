import { Routes, Route, Navigate } from 'react-router'

import { Orders, Menu, NewDish } from './components/pages'
import { Sidebar } from './components/ui'
import { Toaster } from 'react-hot-toast'
import { FirebaseProvider } from './firebase/firebase.context'
import { useEffect, useState } from 'react'
import { SessionStoreInstance } from './stores'
import { Login } from './components/pages/Login'

const App = () => {
  const [isLogged, setIsLogged] = useState(false)

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
              <Route
                path='/'
                element={<Orders />}
              />
              <Route
                path='/orders'
                element={<Orders />}
              />
              <Route
                path='/menu'
                element={<Menu />}
              />
              <Route
                path='/new-dish'
                element={<NewDish />}
              />

              <Route
                path='*'
                element={
                  <Navigate
                    to='/orders'
                    replace
                  />
                }
              />
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
