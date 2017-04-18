;(function (glob, Vue, Vuex) {
  'use strict'

  window.onload = function() {
    callAPI('/requirements/list')
      .then((jsonData) => {
        store.state.reqList = jsonData.reqList
      })
  }
  function callAPI (path) {
    let request = new Request(path, {method: 'GET'})
    return fetch(request)
      .then((response) => {
        return response.json()
      })
  }
  const store = new Vuex.Store({
    state: {
      reqList: [],
      requirement: {}
    },
    mutations: {
      updateRequirement (state, dataObj) {
        const reqItem = {}
        reqItem[dataObj.name] = dataObj.data
        state.requirement = Object.assign({}, state.requirement, reqItem)
      },
      updateError (state, error) {
        state.error = error
      }
    },
    getters: {
      requirements: (state, getters) => (name) => {
        console.log(`getter: ${name}`)
        if (!state.requirement[name]) return false
        console.log(`getter: ${name}`)
        return Object.keys(state.requirement[name])
      },
    },
    actions: {
      getRequirement({ commit }, fileName) {
        callAPI(`/requirements/byName/${fileName}`)
          .then((jsonData) => {
            commit('updateRequirement', { name: fileName, data: jsonData})
          })
          .catch((error) => {
            commit('updateError', error)
          })
        }
    }
  })

  const app = new Vue({
    el: '#app',
    template: `
      <div>
        <requirements></requirements>
        <error></error>
      </div>`,
    store: store,
  })
  
})(self, Vue, Vuex);
