import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export enum unary_type {
    ARITHMETIC,
    LOGIC,
}

export class unary extends expression {
    public translate(environment: environment): data {
        throw new Error("Method not implemented.");
    }

    constructor(public expr: expression, public type: unary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const expr_data = this.expr.execute(environment);

        switch (this.type) {
            case unary_type.ARITHMETIC:
                switch (expr_data.type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        return { value: (Number(expr_data.value) * -1), type: expr_data.type };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar - para: ' + expr_data.value));
                }
                break;
            case unary_type.LOGIC:
                switch (expr_data.type) {
                    case type.BOOLEAN:
                        return { value: !expr_data.value, type: type.BOOLEAN };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar ! para: ' + expr_data.value));
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