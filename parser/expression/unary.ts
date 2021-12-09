import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";

export enum unary_type {
    ARITHMETIC,
    LOGIC,
}

export class unary extends expression {
    public translate(environment: environment): type {
        const exprType = this.expr.translate(environment);
        const exprTemp = _3dCode.actualTemp;
        switch (this.type) {
            case unary_type.ARITHMETIC:
                switch (exprType) {
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.output = 'T' + exprTemp + ' = T' + exprTemp + ' * -1;\n';
                        return exprType;
                    default:

                }
                break;
            case unary_type.LOGIC:
                _3dCode.actualTag++
                const trueTag = _3dCode.actualTag;
                _3dCode.actualTag++
                const falseTag = _3dCode.actualTag;
                _3dCode.actualTag++
                const exitTag = _3dCode.actualTag;
                switch (exprType) {
                    case type.BOOLEAN:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'if(T' + exprTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                        _3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                        _3dCode.output += 'L' + trueTag + ':\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + exprTemp + ' = 1;//Set value to 1 (true)\n';
                        _3dCode.output += 'goto L' + exitTag + ';\n';
                        _3dCode.output += 'L' + falseTag + ':\n';
                        _3dCode.output += 'T' + exprTemp + ' = 0;//Set value to 0 (false)\n';
                        _3dCode.output += 'goto L' + exitTag + ';\n';
                        _3dCode.output += 'L' + exitTag + ':\n';
                        return type.BOOLEAN;
                    default:

                }
                break;

        }
        // Default
        return type.NULL
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