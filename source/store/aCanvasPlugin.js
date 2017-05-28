// eslint-disable-next-line no-extra-semi, func-names
;(function (glob, canvasLib) {
  'use strict';

  let models = ['name', 'description', 'requirement', 'hasA', 'isA'];
  const modelObjects = [];
  let totalLength = 0;

  function ModelItem(text, ctx) {
    this.text = text;
    this.weight = 0;
    this.angle = 0;
    const textSprite = new canvasLib.sprite.Text({
      content: this.text,
      baseLine: 'middle',
    });
    textSprite.render(ctx);
    this.ad = 6;
    this.size = textSprite.width + this.ad;
    textSprite.x = this.ad / 2;
    textSprite.y = this.size / 2;
    const circleSprite = new canvasLib.sprite.Circle({
      diameter: this.size,
    });
    this.sprite = new canvasLib.sprite.Group(circleSprite, textSprite);
  }

  function renderSmth(canvasData) {
    const stage = new canvasLib.DisplayObject();
    stage.height = canvasData.height;
    stage.width = canvasData.width;
    models.forEach((model) => {
      const modelObject = new ModelItem(model, canvasData.canvas.getContext('2d'));
      totalLength += modelObject.size;
      modelObjects.push(modelObject);
      stage.addChild(modelObject.sprite);
    });
    const maxDiameter = modelObjects.reduce((maxDim, model) => {
      const modelSize = model.size;
      return modelSize > maxDim ? modelSize : maxDim;
    }, 0);
    const radius = maxDiameter * 2;
    modelObjects.forEach((model) => {
      model.weight = model.size / totalLength;
      model.angle = 2 * Math.PI * model.weight;
    });
    // const angle = (2 * Math.PI) / modelObjects.length;
    let accAngle = 0;
    modelObjects.forEach((model) => {
      const addAngle = model.angle / 2;
      accAngle += model.angle;
      model.sprite.x = Math.cos(accAngle - addAngle) * radius;
      model.sprite.y = Math.sin(accAngle - addAngle) * radius;
      stage.putCenter(model.sprite, { xOffset: model.sprite.x, yOffset: model.sprite.y });
    });
    const canvasWidth = canvasData.width;
    const canvasHeight = canvasData.height;
    canvasData.canvas.width = canvasWidth;
    canvasData.canvas.height = canvasHeight;
    canvasLib.sprite.render(canvasData.canvas, stage);
  }

  const pluginName = 'canvas';
  function canvasPlugin(store) {
    store.subscribe((mutation, state) => {
      if (mutation.type === 'setModelCanvasElement') {
        totalLength = 0;
        models = state.model.items.map(item => item.name);
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
