"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._3dCode = exports._console = void 0;
class console {
    constructor() {
        this.output = "";
        this.symbols = new Map();
        this.stack = new Array;
        this.heap = new Array;
        this.actualTemp = 5;
        this.actualTag = 0;
        this.breakTag = 0;
        this.continueTag = 0;
        this.absolutePos = 43; //Initial value 36 because of default functions
        this.relativePos = 0;
        this.switchEvaluation = 0;
        this.finalCode = "";
        this.functionsCode = "";
        this.environmentList = new Array;
        this.symbolTables = "";
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
        this.actualTemp = 5;
        this.actualTag = 0;
        this.breakTag = 0;
        this.continueTag = 0;
        this.absolutePos = 43;
        this.relativePos = 0;
        this.switchEvaluation = 0;
        this.finalCode = "";
        this.functionsCode = "";
        this.environmentList = new Array;
        this.symbolTables = "";
    }
}
exports._console = new console();
exports._3dCode = new console();
//# sourceMappingURL=console.js.map