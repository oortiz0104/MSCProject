import React, { FC, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { SessionStoreInstance } from '../../stores'
import { UserForm } from '../pages/admin/components/UserForm'

interface CustomLinkProps {
  children: React.ReactNode
  to: string
  onClick?: () => void
}

const CustomLink: FC<CustomLinkProps> = ({
  children,
  to,
  onClick,
  ...props
}) => {
  return (
    <div>
      <NavLink
        onClick={onClick}
        to={to}
        className={({ isActive }) =>
          [
            isActive
              ? 'text-white bg-gradient-to-r from-stone-600'
              : 'text-white opacity-50 hover:opacity-100 hover:bg-gradient-to-r hover:from-stone-600 hover:translate-x-2 hover:scale-105',
          ].join(' ') +
          ' p-1 block text-left font-Poppins transition ease-in-out duration-300 text-lg px-5 py-3 mb-2 rounded-md'
        }
        {...props}
      >
        {children}
      </NavLink>
    </div>
  )
}

export const Sidebar: FC = () => {
  let role = SessionStoreInstance.SessionStore.role

  const [showModalProfileForm, setShowModalProfileForm] = useState(false)

  return (
    <>
      <div
        className='md:w-2/6 xl:w-2/12'
        style={{
          backgroundColor: '#1B1B1B',
        }}
      >
        <div className='pt-14 pb-4'>
          <p className='uppercase text-white text-4xl tracking-wide text-center font-Khand font-medium mb-8 cursor-default'>
            ACCIONES
          </p>

          <hr className='mb-8 border-white opacity-5' />

          {role === 1 ? (
            <nav>
              <CustomLink to='/staff'>Empleados</CustomLink>
              <CustomLink to='/administrators'>Administradores</CustomLink>
              <CustomLink to='/activities'>Actividades</CustomLink>
            </nav>
          ) : (
            <nav>
              <CustomLink to='/myActivities'>Mis actividades</CustomLink>
              <CustomLink
                to='/'
                onClick={() => setShowModalProfileForm(true)}
              >
                Mi perfil
              </CustomLink>
            </nav>
          )}

          <hr className='mt-6 mb-8 border-white opacity-5' />

          <nav
            className='
          mt-auto
        '
          >
            <CustomLink
              to='/'
              onClick={() => {
                SessionStoreInstance.signOut()
                window.location.href = '/'
              }}
            >
              Cerrar sesión
            </CustomLink>
          </nav>
        </div>
      </div>

      <UserForm
        open={showModalProfileForm}
        setOpen={setShowModalProfileForm}
        selectedUser={SessionStoreInstance.SessionStore}
        setSelectedUser={() => null}
        defaultRole={0}
      />
    </>
  )
}
