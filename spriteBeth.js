//   https://github.com/fabricjs/fabricjs.com/blob/54f61f6afc3817eda1e3bced503e1e6855669f53/js/sprite.class.js#L57-L68
// 
// 
// 


fabric.BSprite = fabric.util.createClass(fabric.Image, {

    type: 'sprite',
  
    spriteWidth: 252,
    spriteHeight: 581,
    spriteIndex: 0,
    flip: 0,     //  1 - X-flipped, 0 - original
  
    initialize: function(element, options) {
      options || (options = { });
  
      options.width = this.spriteWidth;
      options.height = this.spriteHeight;
  
      this.callSuper('initialize', element, options);
  
      this.createTmpCanvas();
      this.createSpriteImages();
    },
  
    createTmpCanvas: function() {
      this.tmpCanvasEl = fabric.util.createCanvasElement();
      this.tmpCanvasEl.width = this.spriteWidth || this.width;
      this.tmpCanvasEl.height = this.spriteHeight || this.height;
    },
  
    createSpriteImages: function() {
      this.spriteImages = [[],[]];
  
      let steps = this._element.width / this.spriteWidth;
      for (let i = 0; i < steps; i++) {
        this.createSpriteImage(i);
      }
    },
  
    createSpriteImage: function(i) {
      let tmpCtx = this.tmpCanvasEl.getContext('2d');
      tmpCtx.clearRect(0, 0, this.tmpCanvasEl.width, this.tmpCanvasEl.height);
      tmpCtx.drawImage(this._element, -i * this.spriteWidth, 0);
  
      let dataURL = this.tmpCanvasEl.toDataURL('image/png');
      let tmpImg = fabric.util.createImage();
      
  
      tmpImg.src = dataURL;
  
      this.spriteImages[0][i] = tmpImg;

      // for flipped sprite:
      let tmpCtxF = this.tmpCanvasEl.getContext('2d');
      tmpCtxF.clearRect(0, 0, this.tmpCanvasEl.width, this.tmpCanvasEl.height);

      
      tmpCtxF.save();

      tmpCtxF.translate(this.spriteWidth, 0);  //location on the canvas to draw your sprite, this is important.
  
      tmpCtxF.scale(-1, 1);  //This does your mirroring/flipping
      tmpCtxF.drawImage(this._element, i * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 0, 0, this.spriteWidth, this.spriteHeight );  //destination x, y is set to 0, 0 (which will be at translated xy)
      let dataURLFlip = this.tmpCanvasEl.toDataURL('image/png');
      let tmpImgFlip = fabric.util.createImage();
      tmpImgFlip.src = dataURLFlip;
      tmpImgFlip.flipX=true;
      this.spriteImages[1][i] = tmpImgFlip;


      tmpCtxF.restore();
    },
  
    _render: function(ctx) {
      ctx.drawImage(
        this.spriteImages[this.flip][this.spriteIndex],
        -this.width / 2,
        -this.height / 2
      );
    },
  
    play: function() {
      let _this = this;
      this.animInterval = setInterval(function() {
  
        _this.onPlay && _this.onPlay();
  
        _this.spriteIndex++;
        if (_this.spriteIndex === _this.spriteImages[0].length) {
          _this.spriteIndex = 0;
        }
        _this.set('dirty', true);
      }, 1000/fps);     // interval: ~ 1/frequence
    },
  
    stop: function() {
      clearInterval(this.animInterval);
    }
  });
  
  fabric.BSprite.fromURL = function(url, callback, imgOptions) {
    fabric.util.loadImage(url, function(img) {
      callback(new fabric.BSprite(img, imgOptions));
    });
  };
  
  fabric.BSprite.async = true;