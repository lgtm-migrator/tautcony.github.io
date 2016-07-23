/**
 * Common classes and constants.
 */

// Define namespace for closure compiler but don't make it a requirement.
try {
  goog.provide('ascii');
  throw 1;
} catch (e) {
  /** type {Object} */
  window.ascii = window.ascii || {};
}

/** @const */ var MAX_GRID_WIDTH = 2000;
/** @const */ var MAX_GRID_HEIGHT = 600;

/** @const */ var SPECIAL_VALUE = '+';
/** @const */ var ALT_SPECIAL_VALUE = '^';
/** @const */ var SPECIAL_ARROW_LEFT = '<';
/** @const */ var SPECIAL_ARROW_UP = '^';
/** @const */ var SPECIAL_ARROW_RIGHT = '>';
/** @const */ var SPECIAL_ARROW_DOWN = 'v';
/** @const */ var SPECIAL_VALUES = ['+', '\u2012', '\u2013', '-', '|'];
/** @const */ var ALT_SPECIAL_VALUES = ['>', '<', '^', 'v'];
/** @const */ var ALL_SPECIAL_VALUES = SPECIAL_VALUES.concat(ALT_SPECIAL_VALUES);

/** @const */ var MAX_UNDO = 50;

/** @const */ var SPECIAL_LINE_H = '-';
/** @const */ var SPECIAL_LINE_V = '|';

/** @const */ var ERASE_CHAR = '\u2009';

/** @const */ var DRAG_LATENCY = 150; // Milliseconds.
/** @const */ var DRAG_ACCURACY = 6; // Pixels.

/** @const */ var CHAR_PIXELS_H = 9;
/** @const */ var CHAR_PIXELS_V = 17;

/** @const */ var RENDER_PADDING_CELLS = 3;

/** @const */ var KEY_RETURN = '<enter>';
/** @const */ var KEY_BACKSPACE = '<backspace>';
/** @const */ var KEY_COPY = '<copy>';
/** @const */ var KEY_PASTE = '<paste>';
/** @const */ var KEY_CUT = '<cut>';
/** @const */ var KEY_UP = '<up>';
/** @const */ var KEY_DOWN = '<down>';
/** @const */ var KEY_LEFT = '<left>';
/** @const */ var KEY_RIGHT = '<right>';

// http://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript
/** @const */ var TOUCH_ENABLED =
    'ontouchstart' in window ||
    'onmsgesturechange' in window;

/**
 * Stores a 2D vector.
 *
 * @constructor
 * @param {number} x
 * @param {number} y
 */
ascii.Vector = function(x, y) {
  /** type {Number} */ this.x = x;
  /** type {Number} */ this.y = y;
};

/**
 * @param {ascii.Vector} other
 * @return {boolean}
 */
ascii.Vector.prototype.equals = function(other) {
  return (other != null) && (this.x == other.x) && (this.y == other.y);
};

/**
 * @param {ascii.Vector} other
 * @return {ascii.Vector}
 */
ascii.Vector.prototype.subtract = function(other) {
  return new ascii.Vector(this.x - other.x, this.y - other.y);
};

/**
 * @param {ascii.Vector} other
 * @return {ascii.Vector}
 */
ascii.Vector.prototype.add = function(other) {
  return new ascii.Vector(this.x + other.x, this.y + other.y);
};

/**
 * @return {ascii.Vector}
 */
ascii.Vector.prototype.clone = function() {
  return new ascii.Vector(this.x, this.y);
};

/** @return {number} */
ascii.Vector.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

/**
 * @param {number} scale
 * @return {ascii.Vector}
 */
ascii.Vector.prototype.scale = function(scale) {
  return new ascii.Vector(this.x * scale, this.y * scale);
};

/**
 * Represents a box with normalized position vectors.
 *
 * @constructor
 * @param {ascii.Vector} a
 * @param {ascii.Vector} b
 */
ascii.Box = function(a, b) {
  /** type {Number} */ this.startX = Math.min(a.x, b.x);
  /** type {Number} */ this.startY = Math.min(a.y, b.y);
  /** type {Number} */ this.endX = Math.max(a.x, b.x);
  /** type {Number} */ this.endY = Math.max(a.y, b.y);
};

/** @return {ascii.Vector} */
ascii.Box.prototype.topLeft = function() {
  return new ascii.Vector(this.startX, this.startY);
};

/** @return {ascii.Vector} */
ascii.Box.prototype.bottomRight = function() {
  return new ascii.Vector(this.endX, this.endY);
};

/** @return {boolean} */
ascii.Box.prototype.contains = function(position) {
  return position.x >= this.startX && position.x <= this.endX && position.y >= this.startY && position.y <= this.endY;
};

/** @const */ var DIR_LEFT = new ascii.Vector(-1, 0);
/** @const */ var DIR_RIGHT = new ascii.Vector(1, 0);
/** @const */ var DIR_UP = new ascii.Vector(0, -1);
/** @const */ var DIR_DOWN = new ascii.Vector(0, 1);

/** @const */ var DIRECTIONS = [DIR_LEFT, DIR_RIGHT, DIR_UP, DIR_DOWN];

/**
 * An individual cell within the diagram and it's current value.
 *
 * @constructor
 */
ascii.Cell = function() {
  /** @type {?string} */ this.value = null;
  /** @type {?string} */ this.scratchValue = null;
};

/** @return {?string} */
ascii.Cell.prototype.getRawValue = function() {
  return (this.scratchValue != null ? this.scratchValue : this.value);
};

/** @return {boolean} */
ascii.Cell.prototype.isSpecial = function() {
  return ALL_SPECIAL_VALUES.indexOf(this.getRawValue()) != -1;
};

/** @return {boolean} */
ascii.Cell.prototype.isEmpty = function() {
  return this.value == null && this.scratchValue == null;
};

/** @return {boolean} */
ascii.Cell.prototype.hasScratch = function() {
  return this.scratchValue != null;
};

/** @return {boolean} */
ascii.Cell.prototype.isErase = function() {
  return this.scratchValue == ERASE_CHAR;
};

/**
 * The context for a cell, i.e. the status of the cells around it.
 *
 * @param {boolean} left
 * @param {boolean} right
 * @param {boolean} up
 * @param {boolean} down
 * @constructor
 */
ascii.CellContext = function(left, right, up, down) {
  /** @type {boolean} */ this.left = left;
  /** @type {boolean} */ this.right = right;
  /** @type {boolean} */ this.up = up;
  /** @type {boolean} */ this.down = down;
  /** @type {boolean} */ this.leftup = false;
  /** @type {boolean} */ this.rightup = false;
  /** @type {boolean} */ this.leftdown = false;
  /** @type {boolean} */ this.rightdown = false;
};

/**
 * Returns the total number of surrounding special cells.
 * @return {number}
 */
ascii.CellContext.prototype.sum = function() {
  return this.left + this.right + this.up + this.down;
};

/**
 * Returns the total number of surrounding special cells.
 * @return {number}
 */
ascii.CellContext.prototype.extendedSum = function() {
  return this.left + this.right + this.up + this.down + this.leftup + this.leftdown + this.rightup + this.rightdown;
};

/**
 * A pair of a vector and a string value. Used in history management.
 * @constructor
 * @struct
 * @param {ascii.Vector} position
 * @param {string|null} value
 */
ascii.MappedValue = function(position, value) {
  this.position = position;
  this.value = value;
};

/**
 * A pair of a vector and a cell. Used in history management.
 * @constructor
 * @struct
 * @param {ascii.Vector} position
 * @param {ascii.Cell} cell
 */
ascii.MappedCell = function(position, cell) {
  this.position = position;
  this.cell = cell;
};
