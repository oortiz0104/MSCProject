import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../../firebase/firebase.context'
import { collection, onSnapshot } from 'firebase/firestore'
import { Dish, DishTypeKey, createDishTypeObject } from '../../models/dishes'
import { Card } from '../ui'

export const Menu = () => {
  const firebase = useContext(FirebaseContext)

  const [dishes, setDishes] = useState<Dish[]>([])

  useEffect(() => {
    const getDishes = async () => {
      onSnapshot(
        collection(firebase.firestore, 'dishes'),
        (snapshot) => {
          const dishes: Dish[] = []
          snapshot.forEach((doc) => {
            let dish = doc.data() as Dish

            dishes.push({
              ...dish,
              id: doc.id,
            })
          })

          setDishes(dishes)
        },
        (error) =>
          console.log('🚀 ~ file: Menu.tsx:27 ~ getDishes ~ error:', error)
      )
    }
    getDishes()
  }, [])

  return (
    <div
      className='p-8 min-h-screen'
      style={{
        backgroundColor: '#F3F3F3',
      }}
    >
      <div className='flex flex-row justify-between items-center mb-8 flex-wrap'>
        <h1 className='text-5xl font-Khand font-medium text-slate-900'>Menú</h1>

        <Link
          to='/new-dish'
          className='bg-stone-600 hover:bg-stone-700 text-white font-Poppins py-3 px-6 transition ease-in-out duration-300 rounded-md'
        >
          Agregar nuevo platillo
        </Link>
      </div>

      <hr className='mb-8 border-black opacity-20' />

      {dishes.length === 0 ? (
        <div className='flex flex-col justify-center items-center'>
          <div className='border-gray-300 h-20 w-20 animate-spin rounded-full border-4 border-t-stone-600' />
        </div>
      ) : (
        <>
          {Object.keys(createDishTypeObject()).map((type) => {
            let title = ''

            switch (type) {
              case 'starter':
                title = 'Entradas'
                break
              case 'breakfast':
                title = 'Desayunos'
                break
              case 'main':
                title = 'Platos fuertes'
                break
              case 'cold_drink':
                title = 'Bebidas frías'
                break
              case 'hot_drink':
                title = 'Bebidas calientes'
                break
              case 'dessert':
                title = 'Postres'
                break
            }

            return (
              <div key={type}>
                <h2 className='text-4xl font-Khand font-medium text-slate-900 mb-5'>
                  {title}
                </h2>

                <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10'>
                  {dishes
                    .filter((dish) => dish.type === type)
                    .map((dish) => (
                      <Card
                        key={dish.id}
                        info={dish}
                      />
                    ))}
                </div>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
