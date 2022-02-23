export const state = () => ({
  user: null,
  isAuth: false
})
  
export const mutations = {
  add(state, value) {
    state.user = value
    state.isAuth = true
  },
  remove(state) {
    state.user = null
    state.isAuth = false
  },
}