// eslint-disable-next-line no-extra-semi, func-names
;(function (glob, Vue, Vuex) {
  'use strict';

  let store = {};

  function RequirementType(fileName, prefix) {
    this.fileName = fileName;
    this.prefix = prefix;
  }
  function Requirement(type, data) {
    this.type = type || new RequirementType('error', 'error');
    this.text = data.text || '';
    this.relation = data.relation || [];
  }

  function callAPI(path) {
    const request = new Request(path, { method: 'GET' });
    return fetch(request)
      .then(response => response.json())
      .catch(error => store.commit('loadFileError', error));
  }
  store = new Vuex.Store({
    state: {
      reqList: [],
      requirements: [],
      requirementTypes: [],
      errors: [],
    },
    mutations: {
      loadRequirementFile(state, dataObj) {
        Object.keys(dataObj.data).forEach((key) => {
          if (state.requirementTypes.filter(type => type.prefix === key).length !== 0) {
            return;
          }
          const type = new RequirementType(dataObj.name, key);
          dataObj.data[key].forEach((item) => {
            if (state.requirements.filter(rq => rq.text === item.text).length === 0) {
              state.requirements.push(new Requirement(type, item));
            }
          });
          state.requirementTypes.push(type);
        });
      },
      loadFileError(state, error) {
        state.errors.push(error);
      },
      cleanError(state, message) {
        state.errors = state.errors.filter(error => error.message !== message);
      },
    },
    getters: {
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
    },
    actions: {
      getRequirementFile({ commit }, fileName) {
        callAPI(`/requirements/byName/${fileName}`)
          .then((jsonData) => {
            commit('loadRequirementFile', { name: fileName, data: jsonData });
          })
          .catch((error) => {
            commit('loadFileError', error);
          });
      },
    },
  });

  // eslint-disable-next-line no-new
  new Vue({
    el: '#app',
    template: `
      <div class="u-window-box--medium">
        <requirementList></requirementList>
        <errorNotifier></errorNotifier>
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
