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
  suspended: boolean
}

export interface Activity {
  id: string
  title: string
  description: string
  creationDate: string
  finalizationDate: string | null
  employee: User
}