import { error, error_arr } from "./error";

class console {
    public output = "";
    public symbols = new Map();
    public stack: any[];
    public heap: any[];
    public actualTemp: number;
    public actualTag: number;

    constructor() {
        this.stack = new Array;
        this.heap = new Array;
        this.actualTemp = 5;
        this.actualTag = 0;
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
    }


}
export const _console = new console();

export const _3dCode = new console();