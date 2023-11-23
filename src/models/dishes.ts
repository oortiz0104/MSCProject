export type DishTypeKey =
  | 'starter'
  | 'breakfast'
  | 'main'
  | 'cold_drink'
  | 'hot_drink'
  | 'dessert'

export type DishTypeValue =
  | 'Entrada'
  | 'Desayuno'
  | 'Plato principal'
  | 'Bebida fría'
  | 'Bebida caliente'
  | 'Postre'

export interface Dish {
  id: string
  name: string
  price: number
  type: DishTypeKey
  image: string
  description: string
  stock: boolean
}

export const createDishTypeObject = (): Record<DishTypeKey, DishTypeValue> => {
  const dishTypes: Record<DishTypeKey, DishTypeValue> = {
    starter: 'Entrada',
    breakfast: 'Desayuno',
    main: 'Plato principal',
    cold_drink: 'Bebida fría',
    hot_drink: 'Bebida caliente',
    dessert: 'Postre',
  }

  return dishTypes
}

export const sortDishesByType = (dishes: Dish[]): Dish[] => {
  const starterDishes = dishes.filter((dish) => dish.type === 'starter')
  const breakfastDishes = dishes.filter((dish) => dish.type === 'breakfast')
  const mainDishes = dishes.filter((dish) => dish.type === 'main')
  const coldDrinkDishes = dishes.filter((dish) => dish.type === 'cold_drink')
  const hotDrinkDishes = dishes.filter((dish) => dish.type === 'hot_drink')
  const dessertDishes = dishes.filter((dish) => dish.type === 'dessert')

  return [
    ...starterDishes,
    ...breakfastDishes,
    ...mainDishes,
    ...coldDrinkDishes,
    ...hotDrinkDishes,
    ...dessertDishes,
  ]
}