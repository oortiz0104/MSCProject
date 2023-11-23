export interface SessionInformation extends User {
  sessionID: string
  isLogged: boolean
}

export interface User {
  id: string
  username: string
  password: string
  name: string
  lastname: string
  role: 1 | 2 | 0
}

export interface Actividad {
  id: string
  title: string
  description: string
  creationDate: string
  finalizationDate: string | null
  employeeId: string
}

// Otras interfaces para manejar las operaciones pueden ser añadidas según sea necesario
