import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console } from "../system/console";
import { literal } from "../abstract/literal";

export class declaration_item extends expression {

    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public variable_id: string, public value: expression| literal| null,  line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        // If value is different to null then we need to operate the expresion
        let value_data = { value: null, type: type.NULL }
        if( this.value instanceof expression || this.value instanceof literal ) {
            value_data = this.value.execute(environment);
        }
        
        return value_data
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}