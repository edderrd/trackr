export const state = () => ({
  loading: false,
  error: null
})

export const mutations = {
  SET_LOADING (state, payload) {
    state.loading = payload
  },

  SET_ERROR (state, payload) {
    state.error = payload
  }
}

export const getters = {
  loading (state) {
    return state.loading
  },

  error (state) {
    return state.error
  }
}
