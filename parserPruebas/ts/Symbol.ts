export class Symbol{
    public type: Type;
    public value: any;
    public row: bigint;
    public column: bigint;

    constructor(type: any, value:any, row: bigint, column: bigint){
        this.type = type;
        this.value = value;
        this.row = row;
        this.column = column;
    }
}

export enum Type{
    cadena,
    entero,
    real,
    boleano,
    nulo,
    error,
    funcion,
    struct,
    arreglo
}