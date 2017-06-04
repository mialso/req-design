// eslint-disable-next-line no-extra-semi, func-names
;(function (glob, Vuex) {
  'use strict';

  const modulesToAdd = [];
  if (glob.reqAppStoreRegister) {
    Object.keys(glob.reqAppStoreRegister).forEach((key) => {
      const moduleWrapper = { name: key, module: glob.reqAppStoreRegister[key] };
      console.log(`module to add: ${key}`);
      modulesToAdd.push(moduleWrapper);
    });
    delete glob.reqAppStoreRegister;
  }
  const pluginsToAdd = [];
  if (glob.reqAppStorePluginRegister) {
    Object.keys(glob.reqAppStorePluginRegister).forEach((key) => {
      console.log(`plugin to add: ${key}`);
      pluginsToAdd.push(glob.reqAppStorePluginRegister[key]);
    });
    delete glob.reqAppStorePluginRegister;
  }
  const store = {
    modules: {},
    plugins: pluginsToAdd,
  };
  modulesToAdd.forEach((moduleWrapper) => {
    store.modules[moduleWrapper.name] = moduleWrapper.module;
  });

  glob.reqAppStore = new Vuex.Store(store);
}(self, Vuex));
