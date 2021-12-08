"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._3dCode = exports._console = void 0;
class console {
    constructor() {
        this.output = "";
        this.symbols = new Map();
        this.stack = new Array;
        this.heap = new Array;
        this.lastTemp = 0;
        this.lastTag = 0;
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
    }
}
exports._console = new console();
exports._3dCode = new console();
//# sourceMappingURL=console.js.map