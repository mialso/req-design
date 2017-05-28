// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  if (!glob.reqApp) {
    glob.reqApp = { canvas: {} };
  } else {
    glob.reqApp.canvas = {};
  }
  glob.reqApp.canvas.sprite = {};
  glob.reqApp.canvas.controls = {};
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  const assets = {
    toLoad: 0,
    loaded: 0,
    imageExtensions: ['png', 'jpg', 'gif'],
    fontExtensions: ['ttf', 'otf', 'ttc', 'woff'],
    jsonExtensions: ['json'],
    audioExtensions: ['mp3', 'ogg', 'wav', 'webm'],

    load(sources) {
      return new Promise((resolve) => {
        const loadHandler = () => {
          this.loaded += 1;
          console.log(this.loaded);

          if (this.toLoad === this.loaded) {
            this.toLoad = 0;
            this.loaded = 0;
            console.log('Assets finished loading');

            resolve();
          }
        };
        console.log('Loading assests...');
        this.toLoad = sources.length;
        sources.forEach((source) => {
          const extension = source.split('.').pop();
          if (this.imageExtensions.indexOf(extension) !== -1) {
            this.loadImage(source, loadHandler);
          } else if (this.jsonExtensions.indexOf(extension) !== -1) {
            this.loadJson(source, loadHandler);
          } else if (this.audioExtensions.indexOf(extension) !== -1) {
            this.loadSound(source, loadHandler);
          } else {
            console.log(`File type not recognized: ${source}`);
          }
        });
      });
    },

    loadImage(source, loadHandler) {
      const image = new glob.Image();
      image.addEventListener('load', loadHandler, false);
      this[source] = image;
      image.src = source;
    },

    loadFont(source, loadHandler) {
      const fontFamily = source.split('/').pop().split('.')[0];
      const newStyle = glob.document.createElement('style');
      const fontFace = `@font-face {font-family: "${fontFamily}"; src: url("${source}");}`;
      newStyle.appendChild(glob.document.createTextNode(fontFace));
      glob.document.head.appendChild(newStyle);

      loadHandler();
    },

    loadJson(source, loadHandler) {
      const xhr = new glob.XMLHttpRequest();
      xhr.open('GET', source, true);
      xhr.responseType = 'text';
      xhr.onload = () => {
        if (xhr.status === 200) {
          const file = JSON.parse(xhr.responseText);
          file.name = source;
          this[file.name] = file;
          if (file.frames) {
            this.createTilesetFrames(file, source, loadHandler);
          } else {
            loadHandler();
          }
        }
      };
      xhr.send();
    },

    createTilesetFrames(file, source, loadHandler) {
      const baseUrl = source.replace(/[^/]*$/, '');
      const imageSource = baseUrl + file.meta.image;
      const image = new glob.Image();
      const imageLoadHandler = () => {
        this[imageSource] = image;
        Object.keys(file.frames).forEach((frame) => {
          console.log(`frame: ${frame}`);
          this[frame] = file.frames[frame];
          this[frame].source = image;
        });
        loadHandler();
      };
      image.addEventListener('load', imageLoadHandler, false);
      image.src = imageSource;
    },
    /*
    loadSound(source, loadHandler) {
      console.log('loadSound called - not supported yet');
    },
    */
  };

  canvasLib.assets = assets;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;

  function createCanvas({ width = 256, height = 256, parent }) {
    const canvas = glob.document.createElement('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    if (parent) {
      glob.document.querySelector(parent).appendChild(canvas);
    } else {
      glob.document.body.appendChild(canvas);
    }
    canvas.ctx = canvas.getContext('2d');
    return canvas;
  }

  canvasLib.createCanvas = createCanvas;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  const buttons = [];
  const draggableSprites = [];

  function makeInteractive(o) {
    o.press = o.press || undefined;
    o.release = o.release || undefined;
    o.over = o.over || undefined;
    o.out = o.out || undefined;
    o.tap = o.tap || undefined;

    o.state = 'up';
    // tells whether 'pressed' or 'released'
    o.action = '';
    o.pressed = false;
    o.hoverOver = false;
    o.update = (pointer) => {
      const hit = pointer.hitTestSprite(o);
      if (pointer.isUp) {
        o.state = 'up';
        if (o instanceof canvasLib.sprite.Button) o.gotoAndStop(0);
      }
      if (hit) {
        o.state = 'over';
        if (o.frames && o.frames.length === 3 && o instanceof canvasLib.sprite.Button) {
          o.gotoAndStop(1);
        }
        if (pointer.isDown) {
          o.state = 'down';
          if (o instanceof canvasLib.sprite.Button) {
            if (o.frames.length === 3) {
              o.gotoAndStop(2);
            } else {
              o.gotoAndStop(1);
            }
          }
        }
      }
      // run the 'press' method if sprite state is 'down' and hasn't already been pressed
      if (o.state === 'down') {
        if (!o.pressed) {
          if (o.press) o.press();
          o.pressed = true;
          o.action = 'pressed';
        }
      }
      // run the 'release' method if sprite state is 'over' and has been pressed
      if (o.state === 'over') {
        if (o.pressed) {
          if (o.release) o.release();
          o.pressed = false;
          o.action = 'released';
          if (pointer.tapped && o.tap) o.tap();
        }
        if (!o.hoverOver) {
          if (o.over) o.over();
          o.hoverOver = true;
        }
      }
      // check pointer release outside the sprite's area
      if (o.state === 'up') {
        if (o.pressed) {
          if (o.release) o.release();
          o.pressed = false;
          o.action = 'released';
        }
        if (o.hoverOver) {
          if (o.out) o.out();
          o.hoverOver = false;
        }
      }
    };
  }

  class DisplayObject {
    constructor() {
      // position and size
      this.x = 0;
      this.y = 0;
      this.width = 0;
      this.height = 0;

      this.rotation = 0;
      this.alpha = 1;
      this.visible = true;
      this.scaleX = 1;
      this.scaleY = 1;
      // axis rotation, 0.5 is center point
      this.pivotX = 0.5;
      this.pivotY = 0.5;
      // velocity to move
      this.vx = 0;
      this.vy = 0;

      this._layer = null;

      this.children = [];
      this.parent = null;
      // shadow properties
      this.shadow = false;
      this.shadowColor = 'rgba(100, 100, 100, 0.5)';
      this.shadowOffsetX = 3;
      this.shadowOffsetY = 3;
      this.shadowBlur = 3;

      this.blendMode = undefined;

      // advanced features
      this.frames = [];
      this.loop = true;
      this._currentFrame = 0;
      this.playing = false;

      this._draggable = undefined;
      this._circular = false;
      this._interactive = false;
    }

    get gx() {
      if (this.parent) {
        return this.x + this.parent.gx;
      }
      return this.x;
    }

    get gy() {
      if (this.parent) {
        return this.y + this.parent.gy;
      }
      return this.y;
    }

    get layer() {
      return this._layer;
    }

    set layer(value) {
      this._layer = value;
      if (this.parent) {
        this.parent.children.sort((a, b) => a.layer - b.layer);
      }
    }

    addChild(sprite) {
      if (sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
      sprite.parent = this;
      this.children.push(sprite);
    }

    removeChild(sprite) {
      if (sprite.parent === this) {
        this.children.splice(this.children.indexOf(sprite), 1);
      } else {
        throw new Error(`${sprite} + is not a child of  + ${this}`);
      }
    }

    get halfWidth() {
      return this.width / 2;
    }

    get halfHeight() {
      return this.height / 2;
    }

    get centerX() {
      return this.x + this.halfWidth;
    }

    get centerY() {
      return this.y + this.halfHeight;
    }

    get position() {
      return { x: this.x, y: this.y };
    }

    set position({ x, y }) {
      this.x = x;
      this.y = y;
    }

    get localBounds() {
      return {
        x: 0,
        y: 0,
        width: this.width,
        height: this.height,
      };
    }

    get globalBounds() {
      return {
        x: this.gx,
        y: this.gy,
        width: this.gx + this.width,
        height: this.gy + this.height,
      };
    }

    get empty() {
      if (this.children.length === 0) {
        return true;
      }
      return false;
    }

    putCenter(b, { xOffset = 0, yOffset = 0 }) {
      const a = this;
      b.x = (a.x + (a.halfWidth - b.halfWidth)) + xOffset;
      b.y = (a.y + (a.halfHeight - b.halfHeight)) + yOffset;
    }

    putTop(b, { xOffset = 0, yOffset = 0 }) {
      const a = this;
      b.x = (a.x + (a.halfWidth - b.halfWidth)) + xOffset;
      b.y = (a.y - b.height) + yOffset;
    }

    putRight(b, { xOffset = 0, yOffset = 0 }) {
      const a = this;
      b.x = (a.x + a.width) + xOffset;
      b.y = (a.y + (a.halfHeight - b.halfHeight)) + yOffset;
    }

    putBottom(b, { xOffset = 0, yOffset = 0 }) {
      const a = this;
      b.x = (a.x + (a.halfWidth - b.halfWidth)) + xOffset;
      b.y = (a.y + a.height) + yOffset;
    }

    putLeft(b, { xOffset = 0, yOffset = 0 }) {
      const a = this;
      b.x = (a.x - b.width) + xOffset;
      b.y = (a.y + (a.halfHeight - b.halfHeight)) + yOffset;
    }

    swapChildren(child1, child2) {
      const index1 = this.children.indexOf(child1);
      const index2 = this.children.indexOf(child2);
      if (index1 !== -1 && index2 !== -1) {
        child1.childIndex = index2;
        child2.childIndex = index1;
        this.children[index1] = child2;
        this.children[index2] = child1;
      } else {
        throw new Error(`Both objects must be a child of the caller ${this}`);
      }
    }

    add(...spritesToAdd) {
      spritesToAdd.forEach(sprite => this.addChild(sprite));
    }

    remove(...spritesToRemove) {
      spritesToRemove.forEach(sprite => this.removeChild(sprite));
    }

    get currentFrame() {
      return this._currentFrame;
    }

    get circular() {
      return this._circular;
    }

    set circular(value) {
      if (value === true && this._circular === false) {
        Object.defineProperties(this, {
          diameter: {
            get() {
              return this.width;
            },
            set(val) {
              this.width = val;
              this.height = val;
            },
            enumerable: true,
            configurable: true,
          },
          radius: {
            get() {
              return this.halfWidth;
            },
            set(val) {
              this.width = val * 2;
              this.height = val * 2;
            },
            enumerable: true,
            configurable: true,
          },
        });
        this._circular = true;
      }

      if (value === false && this._circular === true) {
        delete this.diameter;
        delete this.radius;
        this._circular = false;
      }
    }

    get draggable() {
      return this._draggable;
    }

    set draggable(value) {
      if (value === true) {
        draggableSprites.push(this);
        this._draggable = true;
      }
      if (value === false) {
        draggableSprites.splice(draggableSprites.indexOf(this), 1);
      }
    }

    get interactive() {
      return this._interactive;
    }

    set interactive(value) {
      if (value === true) {
        makeInteractive(this);
        buttons.push(this);
        this._interactive = true;
      }
      if (value === false) {
        buttons.splice(buttons.indexOf(this), 1);
        this._interactive = false;
      }
    }
  }

  canvasLib.stage = new DisplayObject();
  canvasLib.DisplayObject = DisplayObject;
  canvasLib.buttons = buttons;
  canvasLib.draggableSprites = draggableSprites;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  function keyboard(keyCode) {
    const key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    function keyDownHandler(event) {
      if (event.keyCode === key.code) {
        if (key.press) key.press();
        // if (key.isUp && key.press) key.press()
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    }
    key.downHandler = keyDownHandler;

    function keyUpHandler(event) {
      if (event.keyCode === key.code) {
        // if (key.isDown && key.release) key.release()
        if (key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    }
    key.upHandler = keyUpHandler;

    glob.addEventListener('keydown', key.downHandler.bind(key), false);
    glob.addEventListener('keyup', key.upHandler.bind(key), false);
    return key;
  }

  canvasLib.controls.keyboard = keyboard;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  function makePointer(element, scale = 1) {
    const pointer = {
      element,
      scale,
      _x: 0,
      _y: 0,

      get x() {
        return this._x / this.scale;
      },
      get y() {
        return this._y / this.scale;
      },
      get centerX() {
        return this.x;
      },
      get centerY() {
        return this.y;
      },
      get position() {
        return { x: this.x, y: this.y };
      },
      // to track pointer state
      isDown: false,
      isUp: true,
      tapped: false,

      // to help measure the time between up and down states
      downTime: 0,
      elapsedTime: 0,

      // optional user definable
      press: undefined,
      release: undefined,
      tap: undefined,

      // mouse move handler
      moveHandler(event) {
        const elem = event.target;
        this._x = (event.pageX - elem.offsetLeft);
        this._y = (event.pageY - elem.offsetTop);
        event.preventDefault();
      },

      touchMoveHandler(event) {
        const elem = event.target;
        this._x = (event.targetTouches[0].pageX - elem.offsetLeft);
        this._y = (event.targetTouches[0].pageY - elem.offsetTop);
        event.preventDefault();
      },

      downHandler(event) {
        this.isDown = true;
        this.isUp = false;
        this.tapped = false;
        this.downTime = Date.now();
        if (this.press) this.press();
        event.preventDefault();
      },

      touchStartHandler(event) {
        const elem = event.target;
        this._x = event.targetTouches[0].pageX - elem.offsetLeft;
        this._y = event.targetTouches[0].pageY - elem.offsetTop;
        this.isDown = true;
        this.isUp = false;
        this.tapped = false;

        this.downTime = Date.now();
        if (this.press) this.press();
        event.preventDefault();
      },

      upHandler(event) {
        this.elapsedTime = Math.abs(this.downTime - Date.now());
        if (this.elapsedTime <= 200 && this.tapped === false) {
          this.tapped = true;
          if (this.tap) this.tap();
        }
        this.isDown = false;
        this.isUp = true;
        if (this.release) this.release();
        event.preventDefault();
      },

      touchEndHandler(event) {
        this.elapsedTime = Math.abs(this.downTime - Date.now());
        if (this.elapsedTime <= 200 && this.tapped === false) {
          this.tapped = true;
          if (this.tap) this.tap();
        }
        this.isDown = false;
        this.isUp = true;
        if (this.release) this.release();
        event.preventDefault();
      },

      hitTestSprite(sprite) {
        let hit = false;
        if (!sprite.circular) {
          const left = sprite.gx;
          const right = sprite.gx + sprite.width;
          const top = sprite.gy;
          const bottom = sprite.gy + sprite.height;

          hit =
            this.x > left && this.x < right
            && this.y > top && this.y < bottom;
        } else {
          const vx = this.x - (sprite.gx + sprite.radius);
          const vy = this.y - (sprite.gy + sprite.radius);
          const distance = Math.sqrt((vx * vx) + (vy * vy));
          hit = distance < sprite.radius;
        }
        return hit;
      },

      dragSprite: null,
      dragOffsetX: 0,
      dragOffsetY: 0,

      updateDragAndDrop() {
        const draggableSprites = canvasLib.draggableSprites;
        if (this.isDown) {
          if (this.dragSprite === null) {
            for (let i = draggableSprites.length - 1; i > -1; i -= 1) {
              const sprite = draggableSprites[i];
              if (this.hitTestSprite(sprite) && sprite.draggable) {
                this.dragOffsetX = this.x - sprite.gx;
                this.dragOffsetY = this.y - sprite.gy;

                this.dragSprite = sprite;

                const children = sprite.parent.children;
                children.splice(children.indexOf(sprite), 1);
                children.push(sprite);

                draggableSprites.splice(draggableSprites.indexOf(sprite), 1);
                draggableSprites.push(sprite);
                break;
              }
            }
          } else {
            this.dragSprite.x = this.x - this.dragOffsetX;
            this.dragSprite.y = this.y - this.dragOffsetY;
          }
        }
        if (this.isUp) {
          this.dragSprite = null;
        }
        draggableSprites.some((sprite) => {
          if (this.hitTestSprite(sprite) && sprite.draggable) {
            this.element.style.cursor = 'pointer';
            return true;
          }
          this.element.style.cursor = 'auto';
          return false;
        });
      },
    };
    element.addEventListener(
      'mousemove', pointer.moveHandler.bind(pointer), false);
    element.addEventListener(
      'mousedown', pointer.downHandler.bind(pointer), false);
    glob.addEventListener(
      'mouseup', pointer.upHandler.bind(pointer), false);
    element.addEventListener(
      'touchmove', pointer.touchMoveHandler.bind(pointer), false);
    element.addEventListener(
      'touchstart', pointer.touchStartHandler.bind(pointer), false);
    glob.addEventListener(
      'touchend', pointer.touchEndHandler.bind(pointer), false);
    element.style.touchAction = 'none';

    return pointer;
  }

  canvasLib.controls.makePointer = makePointer;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Sprite extends canvasLib.DisplayObject {
    constructor({
      source,
      x = 0,
      y = 0,
    }) {
      super();
      Object.assign(this, { x, y });
      if (source instanceof glob.Image) {
        this.createFromImage(source);
      } else if (source.frame) {
        this.createFromAtlas(source);
      } else if (source.image && !source.data) {
        this.createFromTileset(source);
      } else if (source.image && source.data) {
        this.createFromTilesetFrames(source);
      } else if (source instanceof Array) {
        if (source[0] && source[0].source) {
          this.createFromAtlasFrames(source);
        } else if (source[0] instanceof glob.Image) {
          this.createFromImages(source);
        } else {
          throw new Error(`The image sources in ${source} are not recognized`);
        }
      } else {
        throw new Error(`The image source ${source} is not recognized`);
      }
    }
    createFromImage(source) {
      if (!(source instanceof glob.Image)) {
        throw new Error(`${source} is not an image object`);
      } else {
        this.source = source;
        this.sourceX = 0;
        this.sourceY = 0;
        this.width = source.width;
        this.height = source.height;
        this.sourceWidth = source.width;
        this.sourceHeight = source.height;
      }
    }
    createFromAtlas(source) {
      this.tilesetFrame = source;
      this.source = this.tilesetFrame.source;
      this.sourceX = this.tilesetFrame.frame.x;
      this.sourceY = this.tilesetFrame.frame.y;
      this.width = this.tilesetFrame.frame.w;
      this.height = this.tilesetFrame.frame.h;
      this.sourceWidth = this.tilesetFrame.frame.w;
      this.sourceHeight = this.tilesetFrame.frame.h;
    }
    createFromTileset(source) {
      if (!(source.image instanceof glob.Image)) {
        throw new Error(`${source.image} is not an image object`);
      } else {
        this.source = source.image;
        this.sourceX = source.x;
        this.sourceY = source.y;
        this.width = source.width;
        this.height = source.height;
        this.sourceWidth = source.width;
        this.sourceHeight = source.height;
      }
    }
    createFromTilesetFrames(source) {
      if (!(source.image instanceof glob.Image)) {
        throw new Error(`${source.image} is not an image object`);
      } else {
        this.source = source.image;
        this.frames = source.data;
        // set the sprite to the first frame
        this.sourceX = this.frames[0][0];
        this.sourceY = this.frames[0][1];
        this.width = source.width;
        this.height = source.height;
        this.sourceWidth = source.width;
        this.sourceHeight = source.height;
      }
    }
    createFromAtlasFrames(source) {
      this.frames = source;
      this.source = source[0].source;
      this.sourceX = source[0].frame.x;
      this.sourceY = source[0].frame.y;
      this.width = source[0].frame.w;
      this.height = source[0].frame.h;
      this.sourceWidth = source[0].frame.w;
      this.sourceHeight = source[0].frame.h;
    }
    createFromImages(source) {
      this.frames = source;
      this.source = source[0];
      this.sourceX = 0;
      this.sourceY = 0;
      this.width = source[0].width;
      this.height = source[0].height;
      this.sourceWidth = source[0].width;
      this.sourceHeight = source[0].height;
    }
    gotoAndStop(frameNumber) {
      if (this.frames.length > 0 && frameNumber < this.frames.length) {
        if (this.frames[0] instanceof Array) {
          this.sourceX = this.frames[frameNumber][0];
          this.sourceY = this.frames[frameNumber][1];
        } else if (this.frames[frameNumber].frame) {
          this.sourceX = this.frames[frameNumber].frame.x;
          this.sourceY = this.frames[frameNumber].frame.y;
          this.sourceWidth = this.frames[frameNumber].frame.w;
          this.sourceHeight = this.frames[frameNumber].frame.h;
          this.width = this.frames[frameNumber].frame.w;
          this.height = this.frames[frameNumber].frame.h;
        } else {
          this.source = this.frames[frameNumber];
          this.sourceX = 0;
          this.sourceY = 0;
          this.width = this.source.width;
          this.height = this.source.height;
          this.sourceWidth = this.source.width;
          this.sourceHeight = this.souce.height;
        }
        this._currentFrame = frameNumber;
      } else {
        throw new Error(`Frame number ${frameNumber} does not exists`);
      }
    }
    render(ctx) {
      ctx.drawImage(
        this.source,
        this.sourceX, this.sourceY,
        this.sourceWidth, this.sourceHeight,
        -this.width * this.pivotX,
        -this.height * this.pivotY,
        this.width, this.height);
    }
  }
  function sprite(configObject, stage) {
    const newSprite = new Sprite(configObject);
    stage.addChild(newSprite);
    return newSprite;
  }
  canvasLib.sprite.sprite = sprite;
  canvasLib.Sprite = Sprite;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Button extends canvasLib.Sprite {
    constructor({ source, x = 0, y = 0 }) {
      super({ source, x, y });
      this.interactive = true;
    }
  }
  function button(configObject, stage) {
    if (typeof stage !== 'object') {
      throw new Error('[ERROR]: <canvasLib>: BUTTON: stage is not defined');
    }
    const sprite = new Button(configObject);
    stage.addChild(sprite);
    return sprite;
  }
  canvasLib.sprite.button = button;
  canvasLib.sprite.Button = Button;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Circle extends canvasLib.DisplayObject {
    constructor({
      diameter = 32,
      fillStyle = 'gray',
      strokeStyle = 'none',
      lineWidth = 0,
      x = 0,
      y = 0,
    }) {
      super();
      this.circular = true;
      Object.assign(this, { diameter, fillStyle, strokeStyle, lineWidth, x, y });
      this.mask = false;
    }
    render(ctx) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.fillStyle = this.fillStyle;
      ctx.beginPath();

      ctx.arc(
        this.radius + (-this.diameter * this.pivotX),
        this.radius + (-this.diameter * this.pivotY),
        this.radius,
        0,
        2 * Math.PI,
        false);
      if (this.strokeStyle !== 'none') ctx.stroke();
      if (this.fillStyle !== 'none') ctx.fill();
      if (this.mask && this.mask === true) ctx.clip();
    }
  }

  function circle(configObject, stage) {
    const sprite = new Circle(configObject);
    stage.addChild(sprite);
    return sprite;
  }
  canvasLib.sprite.circle = circle;
  canvasLib.sprite.Circle = Circle;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Group extends canvasLib.DisplayObject {
    constructor(...spritesToGroup) {
      super();
      spritesToGroup.forEach(sprite => this.addChild(sprite));
    }
    addChild(sprite) {
      if (sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
      sprite.parent = this;
      this.children.push(sprite);
      this.calculateSize();
    }
    removeChild(sprite) {
      if (sprite.parent === this) {
        this.children.splice(this.children.indexOf(sprite), 1);
        this.calculateSize();
      } else {
        throw new Error(`${sprite} is not a child of ${this}`);
      }
    }
    calculateSize() {
      if (this.children.length > 0) {
        this._newWidth = 0;
        this._newHeight = 0;
        this.children.forEach((child) => {
          if (child.x + child.width > this._newWidth) {
            this._newWidth = child.x + child.width;
          }
          if (child.y + child.height > this._newHeight) {
            this._newHeight = child.y + child.height;
          }
        });
        this.width = this._newWidth;
        this.height = this._newHeight;
      }
    }
  }
  function group(...spritesToGroup) {
    const stage = spritesToGroup.pop();
    const sprite = new Group(...spritesToGroup);
    stage.addChild(sprite);
    return sprite;
  }
  canvasLib.sprite.group = group;
  canvasLib.sprite.Group = Group;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Line extends canvasLib.DisplayObject {
    constructor({
      strokeStyle = 'none',
      lineWidth = 0,
      ax = 0,
      ay = 0,
      bx = 32,
      by = 32,
    }) {
      super();
      Object.assign(this, { strokeStyle, lineWidth, ax, ay, bx, by });
      this.lineJoin = 'round';
    }
    render(ctx) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.lineJoin = this.lineJoin;
      ctx.beginPath();
      ctx.moveTo(this.ax, this.ay);
      ctx.lineTo(this.bx, this.by);
      if (this.strokeStyle !== 'none') ctx.stroke();
    }
  }
  function line(configObject, stage) {
    const sprite = new Line(configObject);
    stage.addChild(sprite);
    return sprite;
  }
  canvasLib.sprite.line = line;
}(self));

// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Rectangle extends canvasLib.DisplayObject {
    constructor({
      width = 32,
      height = 32,
      fillStyle = 'gray',
      strokeStyle = 'none',
      lineWidth = 0,
      x = 0,
      y = 0,
    }) {
      super();
      Object.assign(this, { width, height, fillStyle, strokeStyle, lineWidth, x, y });
      this.mask = false;
    }
    render(ctx) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.fillStyle = this.fillStyle;
      ctx.beginPath();
      ctx.rect(
        -this.width * this.pivotX,
        -this.height * this.pivotY,
        this.width,
        this.height);
      if (this.strokeStyle !== 'none') ctx.stroke();
      if (this.fillStyle !== 'none') ctx.fill();
      if (this.mask && this.mask === true) ctx.clip();
    }
  }
  function rectangle(configObject, stage) {
    const sprite = new Rectangle(configObject);
    stage.addChild(sprite);
    return sprite;
  }
  canvasLib.sprite.rectangle = rectangle;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;

  function remove(...spritesToRemove) {
    spritesToRemove.forEach((sprite) => {
      sprite.parent.removeChild(sprite);
    });
  }

  function render(canvas, stage) {
    const ctx = canvas.getContext('2d');
    if (typeof stage !== 'object') {
      throw new Error('[ERROR]: <canvasLib>: render(): no stage provided');
    }

    function displaySprite(sprite) {
      if (
        sprite.visible
        && sprite.gx < canvas.width + sprite.width
        && sprite.gx + sprite.width >= -sprite.width
        && sprite.gy < canvas.height + sprite.height
        && sprite.gy + sprite.height >= -sprite.height
      ) {
        ctx.save();
        ctx.translate(
          sprite.x + (sprite.width * sprite.pivotX),
          sprite.y + (sprite.height * sprite.pivotY));
        ctx.rotate(sprite.rotation);
        ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
        ctx.scale(sprite.scaleX, sprite.scaleY);

        if (sprite.shadow) {
          ctx.shadowColor = sprite.shadowColor;
          ctx.shadowOffsetX = sprite.shadowOffsetX;
          ctx.shadowOffsetY = sprite.shadowOffsetY;
          ctx.shadowBlur = sprite.shadowBlur;
        }

        if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;
        if (sprite.render) sprite.render(ctx);
        if (sprite.children && sprite.children.length > 0) {
          ctx.translate(-sprite.width * sprite.pivotX, -sprite.height * sprite.pivotY);
          sprite.children.forEach(child => displaySprite(child));
        }
        ctx.restore();
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stage.children.forEach(sprite => displaySprite(sprite));
  }

  canvasLib.sprite.render = render;
  canvasLib.sprite.remove = remove;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Sprite extends canvasLib.DisplayObject {
    constructor({
      source,
      x = 0,
      y = 0,
    }) {
      super();
      Object.assign(this, { x, y });
      if (source instanceof glob.Image) {
        this.createFromImage(source);
      } else if (source.frame) {
        this.createFromAtlas(source);
      } else if (source.image && !source.data) {
        this.createFromTileset(source);
      } else if (source.image && source.data) {
        this.createFromTilesetFrames(source);
      } else if (source instanceof Array) {
        if (source[0] && source[0].source) {
          this.createFromAtlasFrames(source);
        } else if (source[0] instanceof glob.Image) {
          this.createFromImages(source);
        } else {
          throw new Error(`The image sources in ${source} are not recognized`);
        }
      } else {
        throw new Error(`The image source ${source} is not recognized`);
      }
    }
    createFromImage(source) {
      if (!(source instanceof glob.Image)) {
        throw new Error(`${source} is not an image object`);
      } else {
        this.source = source;
        this.sourceX = 0;
        this.sourceY = 0;
        this.width = source.width;
        this.height = source.height;
        this.sourceWidth = source.width;
        this.sourceHeight = source.height;
      }
    }
    createFromAtlas(source) {
      this.tilesetFrame = source;
      this.source = this.tilesetFrame.source;
      this.sourceX = this.tilesetFrame.frame.x;
      this.sourceY = this.tilesetFrame.frame.y;
      this.width = this.tilesetFrame.frame.w;
      this.height = this.tilesetFrame.frame.h;
      this.sourceWidth = this.tilesetFrame.frame.w;
      this.sourceHeight = this.tilesetFrame.frame.h;
    }
    createFromTileset(source) {
      if (!(source.image instanceof glob.Image)) {
        throw new Error(`${source.image} is not an image object`);
      } else {
        this.source = source.image;
        this.sourceX = source.x;
        this.sourceY = source.y;
        this.width = source.width;
        this.height = source.height;
        this.sourceWidth = source.width;
        this.sourceHeight = source.height;
      }
    }
    createFromTilesetFrames(source) {
      if (!(source.image instanceof glob.Image)) {
        throw new Error(`${source.image} is not an image object`);
      } else {
        this.source = source.image;
        this.frames = source.data;
        // set the sprite to the first frame
        this.sourceX = this.frames[0][0];
        this.sourceY = this.frames[0][1];
        this.width = source.width;
        this.height = source.height;
        this.sourceWidth = source.width;
        this.sourceHeight = source.height;
      }
    }
    createFromAtlasFrames(source) {
      this.frames = source;
      this.source = source[0].source;
      this.sourceX = source[0].frame.x;
      this.sourceY = source[0].frame.y;
      this.width = source[0].frame.w;
      this.height = source[0].frame.h;
      this.sourceWidth = source[0].frame.w;
      this.sourceHeight = source[0].frame.h;
    }
    createFromImages(source) {
      this.frames = source;
      this.source = source[0];
      this.sourceX = 0;
      this.sourceY = 0;
      this.width = source[0].width;
      this.height = source[0].height;
      this.sourceWidth = source[0].width;
      this.sourceHeight = source[0].height;
    }
    gotoAndStop(frameNumber) {
      if (this.frames.length > 0 && frameNumber < this.frames.length) {
        if (this.frames[0] instanceof Array) {
          this.sourceX = this.frames[frameNumber][0];
          this.sourceY = this.frames[frameNumber][1];
        } else if (this.frames[frameNumber].frame) {
          this.sourceX = this.frames[frameNumber].frame.x;
          this.sourceY = this.frames[frameNumber].frame.y;
          this.sourceWidth = this.frames[frameNumber].frame.w;
          this.sourceHeight = this.frames[frameNumber].frame.h;
          this.width = this.frames[frameNumber].frame.w;
          this.height = this.frames[frameNumber].frame.h;
        } else {
          this.source = this.frames[frameNumber];
          this.sourceX = 0;
          this.sourceY = 0;
          this.width = this.source.width;
          this.height = this.source.height;
          this.sourceWidth = this.source.width;
          this.sourceHeight = this.souce.height;
        }
        this._currentFrame = frameNumber;
      } else {
        throw new Error(`Frame number ${frameNumber} does not exists`);
      }
    }
    render(ctx) {
      ctx.drawImage(
        this.source,
        this.sourceX, this.sourceY,
        this.sourceWidth, this.sourceHeight,
        -this.width * this.pivotX,
        -this.height * this.pivotY,
        this.width, this.height);
    }
  }
  function sprite(configObject, stage) {
    const newSprite = new Sprite(configObject);
    stage.addChild(newSprite);
    return newSprite;
  }
  canvasLib.sprite.sprite = sprite;
  canvasLib.Sprite = Sprite;
}(self));
// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;
  class Text extends canvasLib.DisplayObject {
    constructor({
      content = 'Hello!',
      font = '12px sans-serif',
      fillStyle = 'red',
      x = 0,
      y = 0,
      baseLine = '',
    }) {
      super();
      Object.assign(this, { content, font, fillStyle, x, y });
      this.textBaseline = baseLine || 'top';
      this.strokeText = 'none';
    }
    render(ctx) {
      ctx.font = this.font;
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.fillStyle = this.fillStyle;

      this.width = ctx.measureText(this.content).width;
      // if (this.width === 0) this.width = ctx.measureText(this.content).width
      this.height = ctx.measureText('M').width;
      // if (this.height === 0) this.height = ctx.measureText("M").width

      ctx.translate(-this.width * this.pivotX, -this.height * this.pivotY);
      ctx.textBaseline = this.textBaseline;
      ctx.fillText(this.content, 0, 0);
      if (this.strokeText !== 'none') ctx.strokeText();
    }
  }

  function text(configObject, stage) {
    const sprite = new Text(configObject);
    stage.addChild(sprite);
    return sprite;
  }
  canvasLib.sprite.text = text;
  canvasLib.sprite.Text = Text;
}(self));

// eslint-disable-next-line no-extra-semi, func-names
;(function (glob) {
  'use strict';

  const canvasLib = glob.reqApp.canvas;

  function contain({
    sprite,
    bounds,
    bounce = false,
    extra = undefined,
  }) {
    const x = bounds.x;
    const y = bounds.y;
    const width = bounds.width;
    const height = bounds.height;
    // collision object used to store which side sprite hits
    let collision;
    // left
    if (sprite.x < x) {
      if (bounce) sprite.vx *= -1;
      if (sprite.mass) sprite.vx /= sprite.mass;
      sprite.x = x;
      collision = 'left';
    }
    // top
    if (sprite.y < y) {
      if (bounce) sprite.vy *= -1;
      if (sprite.mass) sprite.vy /= sprite.mass;
      sprite.y = y;
      collision = 'top';
    }
    // right
    if (sprite.x + sprite.width > width) {
      if (bounce) sprite.vx *= -1;
      if (sprite.mass) sprite.vx /= sprite.mass;
      sprite.x = width - sprite.width;
      collision = 'right';
    }
    // bottom
    if (sprite.y + sprite.height > height) {
      if (bounce) sprite.vy *= -1;
      if (sprite.mass) sprite.vy /= sprite.mass;
      sprite.y = height - sprite.height;
      collision = 'bottom';
    }
    // run extra function in case collision took place
    if (collision && extra) extra(collision);

    return collision;
  }

  function getDistance(sprite1, sprite2) {
    const vx = sprite2.centerX - sprite1.centerX;
    const vy = sprite2.centerY - sprite1.centerY;
    return Math.sqrt((vx * vx) + (vy * vy));
  }

  function followEase({ follower, leader, speed }) {
    const vx = leader.centerX - follower.centerX;
    const vy = leader.centerY - follower.centerY;
    const distance = Math.sqrt((vx * vx) + (vy * vy));
    if (distance >= 1) {
      follower.x += vx * speed;
      follower.y += vy * speed;
    }
  }

  function followConstant({ follower, leader, speed }) {
    const vx = leader.centerX - follower.centerX;
    const vy = leader.centerY - follower.centerY;
    const distance = Math.sqrt((vx * vx) + (vy * vy));
    if (distance >= speed) {
      follower.x += (vx / distance) * speed;
      follower.y += (vy / distance) * speed;
    }
  }

  function getAngle(s1, s2) {
    return Math.atan2(s2.centerY - s1.centerY, s2.centerX - s1.centerX);
  }

  function rotateSprite({
    rotatingSprite,
    centerSprite,
    distance,
    angle,
  }) {
    rotatingSprite.x =
      (distance * Math.cos(angle)) - rotatingSprite.halfWidth
      - centerSprite.centerX - rotatingSprite.parent.x;
    rotatingSprite.y =
      (distance * Math.sin(angle)) - centerSprite.centerY
      - rotatingSprite.parent.y - rotatingSprite.halfWidth;
  }

  function rotatePoint({ pointX, pointY, distanceX, distanceY, angle }) {
    return {
      x: pointX + (Math.cos(angle) * distanceX),
      y: pointY + (Math.sin(angle) * distanceY),
    };
  }

  canvasLib.sprite.contain = contain;
  canvasLib.sprite.distance = getDistance;
  canvasLib.sprite.followEase = followEase;
  canvasLib.sprite.followConstant = followConstant;
  canvasLib.sprite.angle = getAngle;
  canvasLib.sprite.rotateSprite = rotateSprite;
  canvasLib.sprite.rotatePoint = rotatePoint;
}(self));
