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
            this.case_value.translate(environment);
            const conditionTemp = _3dCode.actualTemp;
            _3dCode.actualTag++;
            let lTrue = _3dCode.actualTag;
            _3dCode.output += 'if(T' + conditionTemp + ' == T' + _3dCode.switchEvaluation + ') goto L' + lTrue + ';\n';
            _3dCode.actualTag++;
            let lFalse = _3dCode.actualTag;
            _3dCode.output += "goto L" + lFalse + ";\n";
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
            _3dCode.output += "L" + lFalse + ":\n";
        } else {
            _3dCode.actualTag++;
            let salida = _3dCode.actualTag;
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

    constructor(public case_value: expression | literal, public code: Array<instruction>, public type: _case_type, line: number, column: number) {
        super(line, column);
    }

    public get_value(): expression | literal {
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
        throw new Error("Method not implemented.");
    }
}