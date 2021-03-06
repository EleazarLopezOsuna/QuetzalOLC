import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";
import { exit } from "process";

export enum arithmetic_binary_type {
    PLUS,
    MINUS,
    TIMES,
    DIV,
    POWER,
    MOD
}

export class arithmetic_binary extends expression {

    public translate(environment: environment): type {
        const left_data = this.left.translate(environment);
        let leftTemp = _3dCode.actualTemp;
        const right_data = this.right.translate(environment);
        let rightTemp = _3dCode.actualTemp;
        const dominant_type = this.get_dominant_type(left_data, right_data);

        switch (this.type) {
            case arithmetic_binary_type.PLUS:
                switch (dominant_type) {
                    case type.STRING:
                        if (left_data === type.INTEGER || left_data === type.FLOAT) {
                            _3dCode.actualTemp++;
                            const savedEnvironment = _3dCode.actualTemp;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP;//Save environment\n';
                            _3dCode.output += 'SP = 14;//Set IntToString environment\n';
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + 'SP + 1;//Set number position\n';
                            _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + leftTemp + ';//Save number\n';
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = HP;//Save start position of new string\n';
                            leftTemp = _3dCode.actualTemp;
                            _3dCode.output += 'intToString();//Call function\n';
                            _3dCode.actualTemp++;
                            const resultTemp = _3dCode.actualTemp;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                            _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        } else if (right_data === type.INTEGER || right_data === type.FLOAT) {
                            _3dCode.actualTemp++;
                            const savedEnvironment = _3dCode.actualTemp;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP;//Save environment\n';
                            _3dCode.output += 'SP = 14;//Set IntToString environment\n';
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + 'SP + 1;//Set number position\n';
                            _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + rightTemp + ';//Save number\n';
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = HP;//Save start position of new string\n';
                            rightTemp = _3dCode.actualTemp;
                            _3dCode.output += 'intToString();//Call function\n';
                            _3dCode.actualTemp++;
                            const resultTemp = _3dCode.actualTemp;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                            _3dCode.actualTemp++;
                            _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                            _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        }
                        _3dCode.actualTemp++;
                        const savedEnvironment = _3dCode.actualTemp;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP;//Save environment\n';
                        _3dCode.output += 'SP = 0;//Set IntToString environment\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + 'SP + 1;//Set string1 position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + leftTemp + ';//Save string1\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + 'SP + 2;//Set string2 position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + rightTemp + ';//Save string2\n';
                        _3dCode.output += 'StringConcat();//Call function\n';
                        _3dCode.actualTemp++;
                        const resultTemp = _3dCode.actualTemp;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type.STRING;
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' + T' + rightTemp + ';\n'
                        return dominant_type;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data + ' + ' + right_data));
                }
                break;
            case arithmetic_binary_type.MINUS:
                switch (dominant_type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' - T' + rightTemp + ';\n'
                        return dominant_type;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data + ' - ' + right_data));
                }
                break;
            case arithmetic_binary_type.TIMES:
                switch (dominant_type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' * T' + rightTemp + ';\n'
                        return dominant_type;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data + ' * ' + right_data));
                }
                break;
            case arithmetic_binary_type.POWER:
                switch (dominant_type) {
                    case type.INTEGER:
                        _3dCode.actualTemp++;
                        const savedEnvironment = _3dCode.actualTemp;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP;//Save environment\n';
                        _3dCode.output += 'SP = 11;//Set NumberPower environment\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + 'SP + 1;//Set base position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + leftTemp + ';//Save base\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = ' + 'SP + 2;//Set exponent position\n';
                        _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + rightTemp + ';//Save exponent\n';
                        _3dCode.output += 'NumberPower();//Call function\n';
                        _3dCode.actualTemp++;
                        const resultTemp = _3dCode.actualTemp;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + resultTemp + '];//Get return value\n';
                        _3dCode.output += 'SP = T' + savedEnvironment + ';//Recover environment\n';
                        return type.INTEGER;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data + ' POW ' + right_data));
                }
                break;
            case arithmetic_binary_type.MOD:
                switch (dominant_type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = (int)T' + leftTemp + ' % (int)T' + rightTemp + ';\n'
                        return type.FLOAT;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data + ' MOD ' + right_data));
                }
                break;
            case arithmetic_binary_type.DIV:
                switch (dominant_type) {
                    case type.INTEGER:
                    case type.FLOAT:
                        _3dCode.actualTag++
                        const trueTag = _3dCode.actualTag;
                        _3dCode.actualTag++
                        const falseTag = _3dCode.actualTag;
                        _3dCode.actualTag++
                        const exitTag = _3dCode.actualTag;
                        _3dCode.output += 'if(T' + rightTemp + ' == 0) goto L' + trueTag + ';//Check if division by 0\n'
                        _3dCode.output += 'goto L' + falseTag + ';\n';
                        _3dCode.output += 'L' + trueTag + '://True tagn\n';
                        _3dCode.output += 'DivisionBy0();//Call division by 0 error\n';
                        _3dCode.output += 'goto L' + exitTag + ';\n';
                        _3dCode.output += 'L' + falseTag + '://False tag, operate division\n';
                        _3dCode.actualTemp++;
                        _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' / T' + rightTemp + ';\n';
                        _3dCode.output += 'goto L' + exitTag + ';\n';
                        _3dCode.output += 'L' + exitTag + ':\n';
                        return type.FLOAT;
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data + ' / ' + right_data));
                }
                break;
        }
        // Default
        return type.NULL;
    }

    constructor(public left: expression, public right: expression, public type: arithmetic_binary_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        const dominant_type = this.get_dominant_type(left_data.type, right_data.type);

        switch (this.type) {
            case arithmetic_binary_type.PLUS:
                switch (dominant_type) {
                    case type.STRING:
                        return { value: (left_data.value.toString() + right_data.value.toString()), type: type.STRING };
                    case type.INTEGER:
                        left_data.value = (left_data.type == type.CHAR) ? left_data.value.charCodeAt(0) : left_data.value
                        right_data.value = (right_data.type == type.CHAR) ? right_data.value.charCodeAt(0) : right_data.value
                        return { value: (left_data.value + right_data.value), type: type.INTEGER };
                    case type.FLOAT:
                        left_data.value = (left_data.type == type.CHAR) ? left_data.value.charCodeAt(0) : left_data.value
                        right_data.value = (right_data.type == type.CHAR) ? right_data.value.charCodeAt(0) : right_data.value
                        return { value: (left_data.value + right_data.value), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' + ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MINUS:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value - right_data.value), type: type.INTEGER };
                    case type.FLOAT:
                        return { value: (left_data.value - right_data.value), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' - ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.TIMES:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value * right_data.value), type: type.INTEGER };
                    case type.FLOAT:
                        return { value: (left_data.value * right_data.value), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' * ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.POWER:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (Math.pow(left_data.value, right_data.value)), type: type.INTEGER };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' ** ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.MOD:
                switch (dominant_type) {
                    case type.INTEGER:
                        return { value: (left_data.value % right_data.value), type: type.INTEGER };
                    case type.FLOAT:
                        return { value: (left_data.value % right_data.value), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' % ' + right_data.type));
                }
                break;
            case arithmetic_binary_type.DIV:
                switch (dominant_type) {
                    case type.INTEGER:
                        if (right_data.value == 0) {
                            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else return { value: (left_data.value / right_data.value), type: type.INTEGER };
                    case type.FLOAT:
                        if (right_data.value == 0) {
                            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, "No se puede dividir entre 0"));
                            break;
                        }
                        else return { value: (left_data.value / right_data.value), type: type.FLOAT };
                    default:
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'No se puede operar: ' + left_data.type + ' / ' + right_data.type));
                }
                break;
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Aritmetica (" + arithmetic_binary_type[this.type] + ")\"];";
        const this_count = count
        const child_list = [this.left, this.right]
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