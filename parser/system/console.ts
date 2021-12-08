import { error, error_arr } from "./error";

class console {
    public output = "";
    public symbols = new Map();
    public stack: any[];
    public heap: any[];
    public actualTemp: number;
    public actualTag: number;
    public trueTag: number;
    public falseTag: number;
    public exitTag: number;

    constructor() {
        this.stack = new Array;
        this.heap = new Array;
        this.actualTemp = 0;
        this.actualTag = 0;
        this.trueTag = 0;
        this.falseTag = 0;
        this.exitTag = 0;
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
        this.actualTemp = 0;
        this.actualTag = 0;
        this.trueTag = 0;
        this.falseTag = 0;
        this.exitTag = 0;
        while(error_arr.length > 0) {
            error_arr.pop();
        }
    }


}
export const _console = new console();

export const _3dCode = new console();