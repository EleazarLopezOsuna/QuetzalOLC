import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export enum string_unary_type {
    LENGTH,
    UPPERCASE,
    LOWERCASE,
}

export class string_unary extends expression {

    constructor(public expr: expression, public type: string_unary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const expr_data = this.expr.execute(environment);

        switch (this.type) {
            case string_unary_type.LENGTH:
                switch (expr_data.type) {
                    case type.STRING:
                        let string_value: String = expr_data.value.toString()
                        return { value: string_value.length, type: type.STRING };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar length para: ' + expr_data.value));
                }
                break;
            case string_unary_type.UPPERCASE:
                switch (expr_data.type) {
                    case type.STRING:
                        let string_value: String = expr_data.value.toString()
                        return { value: string_value.toUpperCase(), type: type.STRING };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar uppercase para: ' + expr_data.value));
                }
                break;
            case string_unary_type.LOWERCASE:
                switch (expr_data.type) {
                    case type.STRING:
                        let string_value: String = expr_data.value.toString()
                        return { value: string_value.toLowerCase(), type: type.STRING };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar lowercase para: ' + expr_data.value));
                }
                break;
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}