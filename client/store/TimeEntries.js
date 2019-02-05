import moment from 'moment'

export const state = () => ({
  entries: [],
  projects: []
})

export const mutations = {
  SET_ENTRIES (state, payload) {
    payload.forEach(item => {
      let index = state.entries.findIndex(e => e.id === item.id)
      if (index < 0) state.entries.push(item)
      else state.entries[index] = item
    })
  },

  ADD_ENTRY (state, payload) {
    state.entries.push(payload)
  },

  SET_PROJECTS (state, payload) {
    payload.forEach(item => {
      let index = state.projects.findIndex(e => e.id === item.id)
      if (index !== -1) state.projects[index] = item
      else state.projects.push(item)
    })
  }
}

export const getters = {
  entries (state) {
    return (service = null) => {
      if (!service) return state.entries
      return state.entries.filter(e => e.serviceId === service.id)
    }
  },

  projects (state) {
    return state.projects
  },

  dayEntries (state) {
    return (service, date) => {
      return state.entries.filter(e => moment(e.spentOn).format('YYYY-MM-DD') === date && e.serviceId === service.id)
    }
  }
}

export const actions = {
  async fetchEntries ({ commit }, payload) {
    const data = await this.$axios.$get(`${process.env.API_URL}/services/${payload.id}/timeEntries/`)
    commit('SET_ENTRIES', data)
  },

  async fetchProjects ({ commit }, payload) {
    const data = await this.$axios.$get(`${process.env.API_URL}/services/${payload.id}/projects/`)
    commit('SET_PROJECTS', data)
  },

  async addTimeEntry ({ commit }, payload) {
    const data = await this.$axios.$post(`${process.env.API_URL}/services/${payload.serviceId}/timeEntries/`, payload)
    commit('ADD_ENTRY', data)
  }
}
