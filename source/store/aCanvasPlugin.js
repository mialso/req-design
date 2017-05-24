// eslint-disable-next-line no-extra-semi, func-names
;(function (glob, canvasLib) {
  'use strict';

  function renderSmth(canvasData) {
    const stage = new canvasLib.DisplayObject();
    console.log(`renderSmth(): canvas w: ${canvasData.width}, h: ${canvasData.height}`);
    stage.height = canvasData.height;
    stage.width = canvasData.width;
    const circle = canvasLib.sprite.circle({}, stage);
    stage.putCenter(circle, {});
    canvasData.canvas.width = canvasData.width;
    canvasData.canvas.height = canvasData.height;
    canvasLib.sprite.render(canvasData.canvas, stage);
  }

  const pluginName = 'canvas';
  function canvasPlugin(store) {
    store.subscribe((mutation, state) => {
      if (mutation.type === 'setModelCanvasElement') {
        console.log('mutation: %o', mutation);
        console.log('state: %o', state.model);
        renderSmth(mutation.payload);
      }
    });
  }


  if (glob.reqAppStore) {
    throw new Error(`[ERROR]: plugin <${pluginName}>: store already initialized`);
  }

  if (!glob.reqAppStorePluginRegister) glob.reqAppStorePluginRegister = {};
  glob.reqAppStorePluginRegister[pluginName] = canvasPlugin;
}(self, self.reqApp.canvas));
