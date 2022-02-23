export default async ({ $axios, redirect, store, app }) => {
  const token = app.$cookies.get('token')
  if (token != undefined) {
    const jwt = require('jsonwebtoken');
    const data = jwt.verify(token, 'shin');
    store.commit('add', { _id: data._id, username: data.user })
  }
  const isAuthenticated = store.state.isAuth ? true : false
  if (!isAuthenticated) {
    redirect({ name: 'Auth' })
  }
}