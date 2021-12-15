import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { parameter } from "../expression/parameter";
import { _struct } from "../literal/_struct";

export class declaration_struct extends instruction {

    public translate(environment: environment): type {
        if (this.value instanceof expression || this.value instanceof literal) {
            let valueType = this.value.translate(environment);
            return valueType
        } else {

        }
        return type.NULL
    }

    constructor(public variable_id: string, public value: Array<parameter>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        // Save the variable 
        if (environment.get_variable(this.variable_id).type != type.UNDEFINED) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable ya inicializada: ' + this.variable_id));
        } else {
            environment.save_variable(this.variable_id, { value: new _struct(this.value, this.line, this.column), type: type.STRUCT }, 0, 0, 0)
        }

        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}