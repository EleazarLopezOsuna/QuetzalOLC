"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._console = void 0;
class console {
    constructor() {
        this.output = "";
        this.symbols = new Map();
        this.stack = new Array;
        this.heap = new Array;
        this.printOption = 0;
    }
    saveInHeap(index, id) {
        this.heap[index] = id;
    }
    saveInStack(index, id) {
        this.stack[index] = id;
    }
}
exports._console = new console();
//# sourceMappingURL=console.js.map