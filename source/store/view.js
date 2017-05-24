// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const storeName = 'view';
  const store = {};

  store.state = {
    main: 'modelView',
    model: 'modelHtmlView',
    canvas: null,
  };
  store.mutations = {
    setMainView(state, name) {
      state.main = name;
    },
    setModelView(state, name) {
      state.model = name;
    },
    setModelCanvasElement(state, data) {
      state.canvas = data;
    },
  };
  store.getters = {
    currentModelView: state => state.model,
    currentMainView: state => state.main,
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
