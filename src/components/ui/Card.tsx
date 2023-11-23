import { FC, useContext, useState } from 'react'
import { Dish } from '../../models/dishes'
import { FirebaseContext } from '../../firebase/firebase.context'
import { doc, updateDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'
import { delay } from '../../utils/misc'

interface CardProps {
  info: Dish
}

export const Card: FC<CardProps> = ({ info }) => {
  const { name, price, image, description, stock, id } = info

  const firebase = useContext(FirebaseContext)
  const [loading, setLoading] = useState(false)

  const bucket = 'restaurant-app-9894f.appspot.com/o/images%2Fdishes%2F'
  const imageURL = 'https://firebasestorage.googleapis.com/v0/b/' + bucket

  const updateStock = async (value: boolean) => {
    try {
      setLoading(true)
      toast.loading(`Actualizando disponibilidad de ${name}...`)

      let docRef = doc(firebase?.firestore, 'dishes', id)
      await updateDoc(docRef, {
        stock: value,
      })

      await delay(1000)
      toast.dismiss()
      toast.success(`Disponibilidad de ${name} actualizada`)
      setLoading(false)
    } catch (error) {
      console.log('🚀 ~ file: Card.tsx:22 ~ updateStock ~ error:', error)
    }
  }

  return (
    <div className='bg-white rounded-md shadow-md p-4 flex flex-col justify-between hover:bg-opacity-5 transition ease-in-out duration-300'>
      <img
        src={`${imageURL}${image}?alt=media`}
        alt={name}
        className='object-cover rounded-md mb-3'
        style={{
          aspectRatio: '1/1',
        }}
      />

      <div className='flex flex-row justify-between items-center mb-3 flex-wrap'>
        <h2 className='text-2xl font-Khand font-medium text-slate-900 pointer-events-none'>
          {name}
        </h2>

        <h3 className='text-xl font-Khand font-medium text-slate-500 self-end pointer-events-none'>
          Q{price}
        </h3>
      </div>

      <hr className='mb-3 border-black opacity-20' />

      <p className='text-slate-500 text-sm font-Poppins mb-3 pointer-events-none'>
        {description}
      </p>

      <hr className='mb-3 border-black opacity-20' />

      <div className='flex flex-col justify-between items-center gap-2'>
        <button
          className={`${
            stock
              ? 'bg-stone-600 hover:bg-stone-700 cursor-not-allowed'
              : 'bg-stone-400 hover:bg-stone-500'
          }
          text-white font-Poppins p-3 transition ease-in-out duration-300 rounded-md flex flex-row justify-center items-center w-full`}
          onClick={() => updateStock(true)}
          disabled={stock === true || loading}
        >
          {loading ? (
            <div className='border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-stone-600' />
          ) : (
            'Disponible'
          )}
        </button>

        <button
          className={`${
            !stock
              ? 'bg-stone-600 hover:bg-stone-700 cursor-not-allowed'
              : 'bg-stone-400 hover:bg-stone-500'
          }
          text-white font-Poppins p-3 transition ease-in-out duration-300 rounded-md flex flex-row justify-center items-center w-full`}
          onClick={() => updateStock(false)}
          disabled={stock === false || loading}
        >
          {loading ? (
            <div className='border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-stone-600' />
          ) : (
            'No disponible'
          )}
        </button>
      </div>
    </div>
  )
}
