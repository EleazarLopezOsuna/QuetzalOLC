import { expression } from "../abstract/expression";
import { _3dCode } from "../system/console";
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
        const exprType = this.expr.translate(environment);
        const exprTemp = _3dCode.actualTemp;

        switch (this.type) {
            case arithmetic_unary_type.SQRT:
                switch (exprType) {
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = sqrt(T' + exprTemp + ');//Get sqrt\n';
                        return type.FLOAT;
                    default:

                }
                break;
            case arithmetic_unary_type.COS:
                switch (exprType) {
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = cos(T' + exprTemp + ');//Get cos\n';
                        return type.FLOAT;
                    default:

                }
                break;
            case arithmetic_unary_type.SIN:
                switch (exprType) {
                    case type.INTEGER:
                    case type.FLOAT: _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = sin(T' + exprTemp + ');//Get sin\n';
                        return type.FLOAT;
                    default:

                }
                break;
            case arithmetic_unary_type.TAN:
                switch (exprType) {
                    case type.INTEGER:
                    case type.FLOAT: _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = tan(T' + exprTemp + ');//Get tan\n';
                        return type.FLOAT;
                    default:

                }
                break;
            case arithmetic_unary_type.LOG10:
                switch (exprType) {
                    case type.INTEGER:
                    case type.FLOAT: _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = log10(T' + exprTemp + ');//Get log10\n';
                        return type.FLOAT;
                    default:

                }
                break;

        }
        // Default
        return type.NULL;
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
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Aritmetica (" + arithmetic_unary_type[this.type] + ")\"];";
        const this_count = count

        const child_list = [this.expr]
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        return result
    }
}