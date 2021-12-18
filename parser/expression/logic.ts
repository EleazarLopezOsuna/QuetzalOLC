import { exit } from "process";
import { expression } from "../abstract/expression";
import { _3dCode } from "../system/console";
import { environment } from "../system/environment";
import { data, type } from "../system/type";

export enum logic_type {
    AND,
    OR,
    NOT
}

export class logic extends expression {
    public translate(environment: environment): type {
        const leftType = this.left.translate(environment);
        const leftTemp = _3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = _3dCode.actualTemp;
        _3dCode.actualTag++
        const trueTag = _3dCode.actualTag;
        _3dCode.actualTag++
        const falseTag = _3dCode.actualTag;
        _3dCode.actualTag++
        const exitTag = _3dCode.actualTag;
        switch (this.type) {
            case logic_type.AND:
                if (leftType === type.BOOLEAN && rightType == type.BOOLEAN) {
                    _3dCode.actualTemp++;
                    _3dCode.output += 'if(T' + leftTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                    _3dCode.output += 'if(T' + rightTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                    _3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                    _3dCode.output += 'L' + trueTag + ':\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = 0;//Set value to 0 (false)\n';
                    _3dCode.output += 'goto L' + exitTag + ';\n';
                    _3dCode.output += 'L' + falseTag + ':\n';
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = 1;//Set value to 1 (true)\n';
                    _3dCode.output += 'goto L' + exitTag + ';\n';
                    _3dCode.output += 'L' + exitTag + ':\n';
                }
                return type.BOOLEAN;
            case logic_type.OR:
                if (leftType === type.BOOLEAN && rightType == type.BOOLEAN) {
                    _3dCode.actualTemp++;
                    _3dCode.output += 'if(T' + leftTemp + ' == 1) goto L' + trueTag + ';//Expression is true\n';
                    _3dCode.output += 'if(T' + rightTemp + ' == 1) goto L' + trueTag + ';//Expression is true\n';
                    _3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                    _3dCode.output += 'L' + trueTag + ':\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = 1;//Set value to 1 (true)\n';
                    _3dCode.output += 'goto L' + exitTag + ';\n';
                    _3dCode.output += 'L' + falseTag + ':\n';
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = 0;//Set value to 0 (false)\n';
                    _3dCode.output += 'goto L' + exitTag + ';\n';
                    _3dCode.output += 'L' + exitTag + ':\n';
                }
                return type.BOOLEAN;
            default:
                return type.INTEGER;
        }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Logica (" + logic_type[this.type] + ")\"];";
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

    constructor(public left: expression, public right: expression, public type: logic_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);

        switch (this.type) {
            case logic_type.AND:
                return { value: (left_data.value && right_data.value), type: type.BOOLEAN };
            case logic_type.OR:
                return { value: (left_data.value || right_data.value), type: type.BOOLEAN };
            default:
                return { value: 0, type: type.INTEGER }
        }
    }
}