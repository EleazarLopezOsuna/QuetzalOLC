import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";
import { _break } from "./_break";

export enum _case_type {
    CASE,
    DEFAULT
}

export class _case extends instruction {

    public translate(environment: environment): type {
        if (this.type == _case_type.CASE) {
            _3dCode.actualTag++;
            let lTrue = _3dCode.actualTag;
            _3dCode.actualTag++;
            let lFalse = _3dCode.actualTag;
            _3dCode.actualTag++;
            let salida = _3dCode.actualTag;
            if (this.case_value != null) {
                let caseType = this.case_value.translate(environment);
                const conditionTemp = _3dCode.actualTemp;
                if (caseType == type.CHAR || caseType == type.STRING) {
                    _3dCode.actualTemp++;
                    let savedEnvironment = _3dCode.actualTemp;
                    _3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    _3dCode.output += 'SP = 36;//Set new environment\n';
                    _3dCode.actualTemp++;
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 1;//Set first string position\n';
                    _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + _3dCode.switchEvaluation + ';//Save first string\n';
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 2;//Set second string position\n';
                    _3dCode.output += 'STACK[(int)T' + _3dCode.actualTemp + '] = T' + conditionTemp + ';//Save second string\n';
                    _3dCode.output += 'stringCompare();//Call function stringCompare\n';
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    _3dCode.output += 'T' + _3dCode.actualTemp + ' = STACK[(int)T' + _3dCode.actualTemp + '];//Get return value\n';
                    _3dCode.output += 'SP = T' + savedEnvironment + ';//Get environment back\n';
                    _3dCode.output += 'if(T' + _3dCode.actualTemp + ' == 1) goto L' + lTrue + ';\n';
                } else {
                    _3dCode.output += 'if(T' + conditionTemp + ' == T' + _3dCode.switchEvaluation + ') goto L' + lTrue + ';\n';
                }
                _3dCode.output += "goto L" + lFalse + ";\n";
                _3dCode.output += "L" + lTrue + ":\n"
                for (const instr of this.code) {
                    try {
                        instr.translate(environment);
                    } catch (error) {
                        console.log(error);
                    }
                }
                _3dCode.output += "goto L" + (salida + 1) + ";\n";
                _3dCode.output += "L" + salida + ":\n";
                _3dCode.output += "L" + lFalse + ":\n";
            }
        } else {
            _3dCode.actualTag++;
            let lTrue = _3dCode.actualTag;
            _3dCode.actualTag++;
            let salida = _3dCode.actualTag;
            _3dCode.output += "L" + lTrue + ":\n"
            for (const instr of this.code) {
                try {
                    instr.translate(environment);
                } catch (error) {
                    console.log(error);
                }
            }
            _3dCode.output += "goto L" + salida + ";\n";
            _3dCode.output += "L" + salida + ":\n";
        }
        return type.NULL;
    }

    constructor(public case_value: expression | literal | null, public code: Array<instruction>, public type: _case_type, line: number, column: number) {
        super(line, column);
    }

    public get_value(): expression | literal | null {
        return this.case_value
    }

    public execute(environment: environment): data {
        for (const instr of this.code) {
            const instr_data = instr.execute(environment)
            if (instr_data instanceof _break) {
                break;
            } else if (instr_data instanceof _return) {
                return instr_data
            }
        }
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Case (" + _case_type[this.type] + ")\"];";
        const this_count = count
        if (this.case_value != null) {
            const child_list = [this.case_value]
            for (const instr of child_list) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"))
                    count++
                } catch (error) {
                    console.log(error);
                }
            }
        }
        for (const instr of this.code) {
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