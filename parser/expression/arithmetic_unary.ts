import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";

export enum arithmetic_unary_type {
    SQRT,
    SIN,
    COS,
    TAN,
    LOG10,
}

export class arithmetic_unary extends expression {
    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }

    constructor(public expr: expression, public type: arithmetic_unary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const expr_data = this.expr.execute(environment);

        switch (this.type) {
            case arithmetic_unary_type.SQRT:
                switch (expr_data.type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        return { value: (Math.sqrt(expr_data.value)), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar sqrt para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.COS:
                switch (expr_data.type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        return { value: (Math.cos(expr_data.value)), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar cos para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.SIN:
                switch (expr_data.type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        return { value: (Math.sin(expr_data.value)), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar sin para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.TAN:
                switch (expr_data.type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        return { value: (Math.tan(expr_data.value)), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar tan para: ' + expr_data.value));
                }
                break;
            case arithmetic_unary_type.LOG10:
                switch (expr_data.type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        return { value: (Math.log10(expr_data.value)), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar log10 para: ' + expr_data.value));
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