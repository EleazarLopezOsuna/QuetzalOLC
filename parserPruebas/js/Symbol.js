export class Symbol {
    constructor(type, value, row, column) {
        this.type = type;
        this.value = value;
        this.row = row;
        this.column = column;
    }
}
export var Type;
(function (Type) {
    Type[Type["cadena"] = 0] = "cadena";
    Type[Type["entero"] = 1] = "entero";
    Type[Type["real"] = 2] = "real";
    Type[Type["boleano"] = 3] = "boleano";
    Type[Type["nulo"] = 4] = "nulo";
    Type[Type["error"] = 5] = "error";
    Type[Type["funcion"] = 6] = "funcion";
    Type[Type["struct"] = 7] = "struct";
    Type[Type["arreglo"] = 8] = "arreglo";
})(Type || (Type = {}));
