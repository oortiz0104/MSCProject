import React, { createContext, ReactNode } from 'react'
import { app, firestore } from './firebase.config'
import { Firestore } from 'firebase/firestore'
import { FirebaseApp } from 'firebase/app'

interface FirebaseContextProps {
  app: FirebaseApp
  firestore: Firestore
}

export const FirebaseContext = createContext<FirebaseContextProps>({ app, firestore })

interface FirebaseProviderProps {
  children: ReactNode
}

export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
}) => {
  return (
    <FirebaseContext.Provider value={{ app, firestore }}>
      {children}
    </FirebaseContext.Provider>
  )
}
