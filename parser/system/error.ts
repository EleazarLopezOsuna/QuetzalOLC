export class error {
    
    constructor(public line : number, private column: number, private type : error_type, private message : string) { }

    html() : string {
        let result = "<td>"+error_type[this.type]+"</td>";
        result += "<td>"+this.message+"</td>";
        result += "<td>"+this.line+"</td>";
        result += "<td>"+this.column+"</td>";
        return result;
    }
}

export enum error_type {
    LEXICO = 0,
    SINTACTICO = 1,
    SEMANTICO = 2,
}

export let error_arr : Array<error> = [];