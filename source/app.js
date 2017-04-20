// eslint-disable-next-line no-extra-semi, func-names
;(function (glob, Vue, Vuex) {
  'use strict';

  function callAPI(path) {
    const request = new Request(path, { method: 'GET' });
    return fetch(request)
      .then(response => response.json());
  }
  const store = new Vuex.Store({
    state: {
      reqList: [],
      requirement: {},
    },
    mutations: {
      updateRequirement(state, dataObj) {
        const reqItem = {};
        reqItem[dataObj.name] = dataObj.data;
        state.requirement = Object.assign({}, state.requirement, reqItem);
      },
      updateError(state, error) {
        state.error = error;
      },
    },
    getters: {
      requirements: state => (name) => {
        console.log(`getter: ${name}`);
        if (!state.requirement[name]) return false;
        console.log(`getter: ${name}`);
        return state.requirement[name];
      },
    },
    actions: {
      getRequirement({ commit }, fileName) {
        callAPI(`/requirements/byName/${fileName}`)
          .then((jsonData) => {
            commit('updateRequirement', { name: fileName, data: jsonData });
          })
          .catch((error) => {
            commit('updateError', error);
          });
      },
    },
  });

  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    template: `
      <div>
        <requirementList></requirementList>
        <error></error>
      </div>`,
    store,
  });

  window.onload = () => {
    callAPI('/requirements/list')
      .then((jsonData) => {
        store.state.reqList = jsonData.reqList;
      });
  };
}(self, Vue, Vuex));
