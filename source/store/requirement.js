// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const storeName = 'requirement';
  const store = {};

  function RequirementType(fileName, prefix) {
    this.fileName = fileName;
    this.prefix = prefix;
  }

  function Requirement(type, data) {
    this.type = type || new RequirementType('error', 'error');
    this.text = data.text || '';
    this.relation = data.relation || [];
    this.hasA = data.hasA || [];
    this.isA = data.isA || [];
  }

  function callAPI(path) {
    const request = new Request(path, { method: 'GET' });
    return fetch(request)
      .then(response => response.json())
      .catch(error => store.commit('loadFileError', error));
  }

  store.state = {
    reqList: [],
    requirements: [],
    requirementTypes: [],
    errors: [],
  };
  store.mutations = {
    loadRequirementFile(state, dataObj) {
      Object.keys(dataObj.data).forEach((key) => {
        if (state.requirementTypes.filter(type => type.prefix === key).length !== 0) {
          return;
        }
        const type = new RequirementType(dataObj.name, key);
        dataObj.data[key].forEach((item) => {
          if (state.requirements.filter(rq => rq.text === item.text).length === 0) {
            state.requirements = state.requirements.concat([new Requirement(type, item)]);
          }
        });
        state.requirementTypes = state.requirementTypes.concat([type]);
      });
    },
    loadFileError(state, error) {
      state.errors = state.errors.concat([error]);
    },
    cleanError(state, message) {
      state.errors = state.errors.filter(error => error.message !== message);
    },
  };
  store.getters = {
    relatedRequirements: state => relation => (
      state.requirements.filter(rq => rq.relation.indexOf(relation) !== -1)
    ),
    requirements: state => prefix => (
      state.requirements.filter(rq => rq.type.prefix === prefix)
    ),
    requirementTypes: state => name => (
      state.requirementTypes.filter(type => type.fileName === name)
    ),
    errorsArray: state => (
      state.errors.reduce((acc, error) => {
        const stateAccumulated = acc.find(item => item.message === error.message);
        if (stateAccumulated) {
          stateAccumulated.count += 1;
        } else {
          acc.push({ count: 0, message: error.message });
        }
        return acc;
      }, [])
    ),
  };
  store.actions = {
    getRequirementFile({ commit }, fileName) {
      callAPI(`/requirements/byName/${fileName}`)
        .then((jsonData) => {
          commit('loadRequirementFile', { name: fileName, data: jsonData });
        })
        .catch((error) => {
          commit('loadFileError', error);
        });
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

  window.onload = () => {
    callAPI('/requirements/list')
      .then((jsonData) => {
        store.state.reqList = jsonData.reqList;
      });
  };
}(self));
