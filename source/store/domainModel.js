// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const storeName = 'domainModel';
  const store = {};

  function callAPI(path, method, body) {
    const request = new glob.Request(path, { method, body });
    return fetch(request);
  }

  store.state = {
    items: ['item'],
  };

  store.mutations = {
    addModel: (state, model) => {
      state.items = state.items.concat([model]);
    },
    removeModel: (state, model) => {
      state.items = state.items.filter(item => item !== model);
    },
  };

  store.actions = {
    toggleDomainModel({ commit, dispatch, state }, model) {
      console.log('toggleDomainModel: %s', model);
      if (!model || typeof model !== 'string') return;
      if (state.items.indexOf(model) === -1) {
        commit('addModel', model);
      } else {
        commit('removeModel', model);
      }
      dispatch('saveModels');
    },
    saveModels({ state }) {
      const models = JSON.stringify(state.items);
      console.log('save models: %s', models);
      callAPI('/domainModel/all', 'POST', models)
        .then((jsonData) => {
          console.log('save models: success: %s', jsonData);
          // commit('loadRequirementFile', { name: fileName, data: jsonData });
        })
        .catch((error) => {
          console.log('save models: error: %s', error);
          // commit('loadFileError', error);
        });
    },
  };

  store.getters = {
    domainModels: state => state.items,
  };

  if (glob.reqAppStore) {
    console.log(`store.registerModule(): ${storeName}`);
    glob.reqAppStore.registerModule(storeName, store);
  } else {
    console.log(`reqAppStoreRegister: ${storeName}`);
    if (!glob.reqAppStoreRegister) glob.reqAppStoreRegister = {};
    glob.reqAppStoreRegister[storeName] = store;
  }
}(self));
