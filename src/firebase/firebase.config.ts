import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export const firebaseConfig = {
  apiKey: "AIzaSyD9Vv_wZmlsT-mXfZX4uUoI5WyIioyhqcg",
  authDomain: "mscproject-3da91.firebaseapp.com",
  projectId: "mscproject-3da91",
  storageBucket: "mscproject-3da91.appspot.com",
  messagingSenderId: "460334458965",
  appId: "1:460334458965:web:ec5d65b76ce393092fccdc",
  measurementId: "G-DSB588QGWD"
}

const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export { app, firestore }
