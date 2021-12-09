import { expression } from "../abstract/expression";
import { instruction } from "../abstract/instruction";
import { literal } from "../abstract/literal";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export class assignation_unary extends instruction {
    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public id: string, public expr: expression | literal, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const expr_data = this.expr.execute(environment);
        // validate that exists
        let saved_variable = environment.get_variable(this.id)
        if (saved_variable.type != type.NULL) {
            // validate the type
            if (saved_variable.type == expr_data.type) {
                // assign the value
                environment.save_variable(this.id, expr_data)
            } else {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Tipo diferente, no se puede asignar'));
            }
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'Variable no inicializada'));
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}