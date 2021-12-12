import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { instruction } from "../abstract/instruction";
import { parameter } from "../expression/parameter";
import { error, error_arr, error_type } from "../system/error";

export class declaration_function extends instruction {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public native_type: type, public id: string, public parameters: Array<parameter>, public code: Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        environment.save_function(this.id, this, 0, 0, 0);
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}