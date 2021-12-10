import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";

export class _continue extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor( line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        return {value: null, type: type.NULL}
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}