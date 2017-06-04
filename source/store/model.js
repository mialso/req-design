// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const storeName = 'model';
  const store = {};

  function callAPI(path, method) {
    const request = new glob.Request(path, { method });
    return fetch(request)
      .then(response => response.json())
      .catch(error => store.commit('loadFileError', error));
  }

  function Model(data) {
    this.name = data.text;
    this.isA = data.isA;
    this.hasA = data.hasA;
    this.relation = data.relation[0];
  }

  store.state = {
    items: [],
    names: [],
    relations: [],
  };
  store.mutations = {
    loadModels(state, data) {
      Object.keys(data).forEach((key) => {
        // load models
        data[key].forEach((modelData) => {
          const newModel = new Model(modelData);
          const currentModelIndex = state.names.indexOf(newModel.name);
          if (currentModelIndex === -1) {
            state.items = state.items.concat([newModel]);
            state.names = state.names.concat([newModel.name]);
          } else {
            state.items = state.items
              .filter(model => newModel.name !== model.name)
              .concat(newModel);
            state.names = state.items
              .filter(modelName => newModel.name !== modelName)
              .concat(newModel.name);
          }
          // update relations
          if (state.relations.indexOf(newModel.relation) === -1) {
            state.relations = state.relations.concat([newModel.relation]);
          }
        });
      });
    },
  };
  store.actions = {
    getModelData({ commit }) {
      callAPI('/requirements/byName/model-level.json', 'GET')
        .then((jsonData) => {
          commit('loadModels', jsonData);
        })
        .catch((error) => {
          commit('loadFileError', error);
        });
    },
  };
  store.getters = {
    relatedModels: state => relation => (
      state.items.filter(item => item.relation === relation)
    ),
    modelChildren: state => (modelName) => {
      const model = state.items.find(item => item.name === modelName);
      return state.items.filter(item => model.hasA.indexOf(item.name) !== -1);
    },
    missedNames: state => (modelName) => {
      const model = state.items.find(item => item.name === modelName);
      const foundItems = state.items.filter(item => model.hasA.indexOf(item.name) !== -1);
      const notFound = model.hasA.filter(
        name => !(foundItems.find(mod => mod.name === name) instanceof Model));
      return notFound;
    },
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
