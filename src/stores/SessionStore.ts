import { action, computed, makeAutoObservable, observable } from 'mobx'
import { persist, create } from 'mobx-persist'
import { SessionInformation as SessionStoreData } from '../interfaces'

class SessionStore {
  @persist('object') @observable SessionStore: SessionStoreData = {
    sessionID: '',
    isLogged: false,
    id: '',
    username: '',
    password: '',
    name: '',
    lastname: '',
    role: 0,
  }

  constructor() {
    makeAutoObservable(this)
    hydrate('SessionStore', this).then(() => {
      console.log('SessionInformation has been hydrated')
    })
  }

  @computed getSessionStore() {
    return this.SessionStore
  }

  @action setSessionStore(data: SessionStoreData) {
    this.SessionStore = data
  }

  @action signOut() {
    this.SessionStore = {
      sessionID: '',
      isLogged: false,
      id: '',
      username: '',
      password: '',
      name: '',
      lastname: '',
      role: 0,
    }
  }
}

const hydrate = create({
  storage: localStorage,
  jsonify: true,
})

export const SessionStoreInstance = new SessionStore()
