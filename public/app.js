/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/particle.js":
/*!****************************!*\
  !*** ./src/js/particle.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Particle": () => (/* binding */ Particle)
/* harmony export */ });
const FRICTION = 0.98;
const MOVE_SPEED = 0.2;

class Particle {
  constructor(pos, texture) {
    this.sprite = new PIXI.Sprite(texture);
    this.sprite.scale.set(0.2);

    this.savedX = pos.x;
    this.savedY = pos.y;
    this.x = pos.x;
    this.y = pos.y;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    this.vx = 0;
    this.vy = 0;
    this.radius = 10;
  }

  draw() {
    this.x += (this.savedX - this.x) * MOVE_SPEED;
    this.y += (this.savedY - this.y) * MOVE_SPEED;

    this.vx *= FRICTION;
    this.vy *= FRICTION;

    this.x += this.vx;
    this.y += this.vy;

    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }
}


/***/ }),

/***/ "./src/js/text.js":
/*!************************!*\
  !*** ./src/js/text.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Text": () => (/* binding */ Text)
/* harmony export */ });
class Text {
    constructor() {
      this.canvas = document.createElement("canvas");
      //this.canvas.style.position = "absolute";
      //this.canvas.style.left = "0";
      //this.canvas.style.top = "0";
      //document.body.appendChild(this.canvas);
  
      this.ctx = this.canvas.getContext("2d");
    }
  
    setText(str, density, stageWidth, stageHeight) {
      this.canvas.width = stageWidth;
      this.canvas.height = stageHeight;
  
      const myText = str;
      const fontWidth = 700;
      const fontSize = stageHeight / 1.2;
      const fontName = "Hind";
  
      this.ctx.clearRect(0, 0, stageWidth, stageHeight);
      this.ctx.font = `${fontWidth} ${fontSize}px ${fontName}`;
      this.ctx.fillStyle = `rgba(0, 0, 0, 0.3)`;
      this.ctx.textBaseline = `middle`;
      const fontPos = this.ctx.measureText(myText);
      this.ctx.fillText(
        myText,
        (stageWidth - fontPos.width) / 2,
        fontPos.actualBoundingBoxAscent +
          fontPos.actualBoundingBoxDescent +
          (stageHeight - fontSize) / 2
      );
  
      return this.dotPos(density, stageWidth, stageHeight);
    }
  
    dotPos(density, stageWidth, stageHeight) {
      const imageData = this.ctx.getImageData(0, 0, stageWidth, stageHeight).data;
  
      const particles = [];
      let i = 0;
      let width = 0;
      let pixel;
  
      for (let height = 0; height < stageHeight; height += density) {
        ++i;
        const slide = i % 2 == 0;
        width = 0;
        if (slide == 1) {
          width += 6;
        }
  
        for (width; width < stageWidth; width += density) {
          pixel = imageData[(width + height * stageWidth) * 4 - 1];
          if (
            pixel != 0 &&
            width > 0 &&
            width < stageWidth &&
            height > 0 &&
            height < stageHeight
          ) {
            particles.push({
              x: width,
              y: height,
            });
          }
        }
      }
  
      return particles;
    }
  }
  

/***/ }),

/***/ "./src/js/visual.js":
/*!**************************!*\
  !*** ./src/js/visual.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Visual": () => (/* binding */ Visual)
/* harmony export */ });
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./text.js */ "./src/js/text.js");
/* harmony import */ var _particle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./particle.js */ "./src/js/particle.js");



class Visual {
  constructor() {
    this.text = new _text_js__WEBPACK_IMPORTED_MODULE_0__.Text();

    this.texture = PIXI.Texture.from("particle.png");

    this.particles = [];

    this.mouse = {
      x: 0,
      y: 0,
      radius: 100,
    };

    document.addEventListener("pointermove", this.onMove.bind(this), false);
    document.addEventListener("touchend", this.onTouchEnd.bind(this), false);
  }

  show(stageWidth, stageHeight, stage) {
    if (this.container) {
      stage.removeChild(this.container);
    }

    this.pos = this.text.setText("A", 2, stageWidth, stageHeight);

    this.container = new PIXI.ParticleContainer(this.pos.length, {
      vertices: false,
      position: true,
      rotation: false,
      scale: false,
      uvs: false,
      tint: false,
    });
    stage.addChild(this.container);

    this.particles = [];
    for (let i = 0; i < this.pos.length; i++) {
      const item = new _particle_js__WEBPACK_IMPORTED_MODULE_1__.Particle(this.pos[i], this.texture);
      this.container.addChild(item.sprite);
      this.particles.push(item);
    }
  }

  animate() {
    for (let i = 0; i < this.particles.length; i++) {
      const item = this.particles[i];
      const dx = this.mouse.x - item.x;
      const dy = this.mouse.y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = item.radius + this.mouse.radius;

      if (dist < minDist) {
        const angle = Math.atan2(dy, dx);
        const tx = item.x + Math.cos(angle) * minDist;
        const ty = item.y + Math.sign(angle) * minDist;
        const ax = tx - this.mouse.x;
        const ay = ty - this.mouse.y;
        item.vx -= ax;
        item.vy -= ay;
      }

      item.draw();
    }
  }

  onMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  onTouchEnd() {
    this.mouse.x = 0;
    this.mouse.y = 0;
  }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/js/app.js ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _visual_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./visual.js */ "./src/js/visual.js");
/* harmony import */ var _particle_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./particle.js */ "./src/js/particle.js");
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./text.js */ "./src/js/text.js");




class App {
  constructor() {
    this.setWebgl();

    WebFont.load({
      google: {
        families: ["Hind:700"],
      },
      fontactive: () => {
        this.visual = new _visual_js__WEBPACK_IMPORTED_MODULE_0__.Visual();

        window.addEventListener("resize", this.resize.bind(this), false);
        this.resize();

        requestAnimationFrame(this.animate.bind(this));
      },
    });
  }

  setWebgl() {
    this.renderer = new PIXI.Renderer({
      width: document.body.clientWidth,
      height: document.body.clientHeight,
      antialias: true,
      transparent: false,
      resolution: window.devicePixelRatio > 1 ? 2 : 1,
      autoDensity: true,
      powerPreference: "high-performance",
      backgroundColor: 0x000000,
    });
    document.querySelector("#canvas").appendChild(this.renderer.view);

    this.stage = new PIXI.Container();

    const blurFilter = new PIXI.filters.BlurFilter();
    blurFilter.blur = 10;
    blurFilter.autoFit = true;

    const fragSource = `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float threshold;
      uniform float mr;
      uniform float mg;
      uniform float mb;
      void main(void) {
        vec4 color = texture2D(uSampler, vTextureCoord);
        vec3 mcolor = vec3(mr, mg, mb);
        if (color.a > threshold) {
          gl_FragColor = vec4(mcolor, 1.0);
        } else {
          gl_FragColor = vec4(vec3(0.0), 0.0);
        }
      }
    `;

    const uniformsData = {
      threshold: 0.5,
      mr: 255.0 / 255.0,
      mg: 255.0 / 255.0,
      mb: 255.0 / 255.0,
    };

    const thresholdFilter = new PIXI.Filter(null, fragSource, uniformsData);
    this.stage.filters = [blurFilter, thresholdFilter];
    this.stage.filterArea = this.renderer.screen;
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.renderer.resize(this.stageWidth, this.stageHeight);

    this.visual.show(this.stageWidth, this.stageHeight, this.stage);
  }

  animate(t) {
    requestAnimationFrame(this.animate.bind(this));

    this.visual.animate();

    this.renderer.render(this.stage);
  }
}

window.onload = () => {
  new App();
};
})();

/******/ })()
;
//# sourceMappingURL=app.js.map