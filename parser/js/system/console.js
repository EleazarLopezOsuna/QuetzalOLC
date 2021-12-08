"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._3dCode = exports._console = void 0;
const error_1 = require("./error");
class console {
    constructor() {
        this.output = "";
        this.symbols = new Map();
        this.stack = new Array;
        this.heap = new Array;
        this.actualTemp = 0;
        this.actualTag = 0;
        this.trueTag = 0;
        this.falseTag = 0;
        this.exitTag = 0;
    }
    saveInHeap(index, id) {
        this.heap[index] = id;
    }
    saveInStack(index, id) {
        this.stack[index] = id;
    }
    clean() {
        this.output = "";
        this.symbols = new Map();
        this.stack = [];
        this.heap = [];
        this.actualTemp = 0;
        this.actualTag = 0;
        this.trueTag = 0;
        this.falseTag = 0;
        this.exitTag = 0;
        while (error_1.error_arr.length > 0) {
            error_1.error_arr.pop();
        }
    }
}
exports._console = new console();
exports._3dCode = new console();
//# sourceMappingURL=console.js.map