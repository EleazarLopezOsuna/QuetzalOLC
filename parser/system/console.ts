import { error, error_arr } from "./error";

class console {
    public output = "";
    public symbols = new Map();
    public stack: any[];
    public heap: any[];
    public actualTemp: number;
    public actualTag: number;
    public breakTag: number;
    public continueTag: number;
    public absolutePos: number;
    public relativePos: number;
    public switchEvaluation: number;

    constructor() {
        this.stack = new Array;
        this.heap = new Array;
        this.actualTemp = 5;
        this.actualTag = 0;
        this.breakTag = 0;
        this.continueTag = 0;
        this.absolutePos = 36;//Initial value 36 because of default functions
        this.relativePos = 0;
        this.switchEvaluation = 0;
    }
    saveInHeap(index: number, id: any) {
        this.heap[index] = id;
    }
    saveInStack(index: number, id: any) {
        this.stack[index] = id;
    }

    clean() {
        this.output = ""
        this.symbols = new Map();
        this.stack = []
        this.heap = []
        this.actualTemp = 5;
        this.actualTag = 0;
        this.breakTag = 0;
        this.continueTag = 0;
        this.absolutePos = 36;
        this.relativePos = 0;
        this.switchEvaluation = 0;
    }


}
export const _console = new console();

export const _3dCode = new console();