class console {
    public output = "";
    public symbols = new Map();
    public stack: any[];
    public heap: any[];

    constructor() {
        this.stack = new Array;
        this.heap = new Array;
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
    }


}
export const _console = new console();