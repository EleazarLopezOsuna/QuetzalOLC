import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";
import { _array } from "../literal/_array";

export enum string_unary_type {
    LENGTH,
    UPPERCASE,
    LOWERCASE,
}

export class string_unary extends expression {
    public translate(environment: environment): type {
        const exprType = this.expr.translate(environment);
        const leftTemp = _3dCode.actualTemp;
        switch (this.type) {
            case string_unary_type.LENGTH:
                switch (exprType) {
                    case type.STRING:
                        _3dCode.actualTemp++;
                        const savedEnvironment = _3dCode.actualTemp;
                        _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        _3dCode.output += 'SP = 18;//Set StringConcat environment\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                        _3dCode.output += 'StringLength();//Call function\n';
                        _3dCode.actualTemp++;
                        const resultTemp = _3dCode.actualTemp;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type.INTEGER;
                    default:
                        let expr_data = this.expr.execute(environment);
                        if (expr_data.value instanceof _array) {
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + expr_data.value.body.length + ';//Length\n';
                            return type.INTEGER
                        }
                }
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar length para: ' + exprType));
                break;
            case string_unary_type.UPPERCASE:
                switch (exprType) {
                    case type.STRING:
                        _3dCode.actualTemp++;
                        const savedEnvironment = _3dCode.actualTemp;
                        _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        _3dCode.output += 'SP = 6;//Set StringConcat environment\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                        _3dCode.output += 'StringUpperCase();//Call function\n';
                        _3dCode.actualTemp++;
                        const resultTemp = _3dCode.actualTemp;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type.STRING;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar uppercase para: ' + exprType));
                }
                break;
            case string_unary_type.LOWERCASE:
                switch (exprType) {
                    case type.STRING:
                        _3dCode.actualTemp++;
                        const savedEnvironment = _3dCode.actualTemp;
                        _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                        _3dCode.output += 'SP = 4;//Set StringConcat environment\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set first String position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + leftTemp + ';//Save string\n';
                        _3dCode.output += 'StringLowerCase();//Call function\n';
                        _3dCode.actualTemp++;
                        const resultTemp = _3dCode.actualTemp;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type.STRING;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar lowecase para: ' + exprType));
                }
                break;
        }
        // Default
        return type.NULL;
    }

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
                        return { value: string_value.length, type: type.INTEGER };
                    default:
                        if (expr_data.value instanceof _array) {
                            return { value: expr_data.value.body.length, type: type.INTEGER }
                        }
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
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") String unario (" + string_unary_type[this.type] + ")\"];";
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