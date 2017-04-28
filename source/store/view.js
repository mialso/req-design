// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const storeName = 'view';
  const store = {};

  store.state = {
    current: 'requirementList',
  };
  store.mutations = {
    setCurrentView(state, name) {
      state.current = name;
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
