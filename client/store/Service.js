export const state = () => ({
  services: []
})

export const mutations = {
  SET_SERVICES (state, payload) {
    state.services = payload
  }
}

export const getters = {
  services (state) {
    return state.services
  }
}

export const actions = {
  async fetchServices ({ commit }) {
    const data = await this.$axios.$get(`${process.env.API_URL}/services`)
    commit('SET_SERVICES', data)
  }
}
