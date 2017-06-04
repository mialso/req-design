// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const menus = [
    {
      id: 'requirementList',
      text: 'Requirements',
    },
    {
      id: 'modelView',
      text: 'Models',
    },
  ];

  const storeName = 'view';
  const store = {};

  store.state = {
    main: 'modelView',
    model: 'modelHtmlView',
    canvas: null,
    inlineMenu: { text: '', top: 0, left: 0, handler: null, autoclose: false },
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
    openInlineMenu(state, data) {
      state.inlineMenu.text = data.text;
      state.inlineMenu.top = data.top;
      state.inlineMenu.left = data.left;
      state.inlineMenu.autoclose = data.autoclose || false;
      state.inlineMenu.handler = data.handler;
    },
    closeInlineMenu(state) {
      state.inlineMenu = { text: '', top: 0, left: 0, handler: null };
    },
  };
  store.getters = {
    mainViews: () => menus,
    currentModelView: state => state.model,
    currentMainView: state => state.main,
    inlineMenu: state => state.inlineMenu,
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
