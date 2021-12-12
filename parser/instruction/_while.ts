import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _console, _3dCode } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";
import { _case, _case_type } from "./_case";
import { _break } from "./_break";
import { _continue } from "./_continue";

export enum _while_type {
    NORMAL,
    DO
}

export class _while extends instruction {

    public translate(environment: environment): type {
        _3dCode.actualTag++;
        let startTag = _3dCode.actualTag;
        _3dCode.output += "L" + startTag + ":\n";
        let conditionType = this.condition.translate(environment);
        let conditionTemp = _3dCode.actualTemp;
        if (conditionType != type.BOOLEAN) {

        }
        switch (this.type) {
            case _while_type.NORMAL:
                _3dCode.actualTag++;
                let inicio = _3dCode.actualTag;
                _3dCode.actualTag++;
                let final = _3dCode.actualTag;
                _3dCode.output += "if(T" + conditionTemp + " == 1) goto L" + inicio + ";\n";
                _3dCode.output += "goto L" + final + ";\n";
                _3dCode.output += "L" + inicio + ":\n";
                for (const instruction of this.code) {
                    let instructionType = instruction.translate(environment)
                    if (instruction instanceof _return) {
                        return instructionType;
                    } else if (instruction instanceof _break) {
                        _3dCode.output += "goto L" + final + ";\n";
                    } else if (instruction instanceof _continue) {
                        _3dCode.output += "goto L" + startTag + ";\n";
                    }
                }
                _3dCode.output += "goto L" + startTag + ";\n";
                _3dCode.output += "L" + final + ":\n";
                break;
            case _while_type.DO:

                break;
        }

        // Default
        return type.NULL
    }

    constructor(public condition: expression | literal, public code: Array<instruction>, public type: _while_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type.BOOLEAN) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
            // Default
            return { value: null, type: type.NULL }
        }
        switch (this.type) {
            case _while_type.NORMAL:
                while (condition_data.value == true) {
                    for (const instruction of this.code) {
                        let instruction_data = instruction.execute(environment)
                        if (instruction instanceof _return) {
                            return instruction_data
                        } else if (instruction instanceof _break) {
                            break
                        } else if (instruction instanceof _continue) {
                            continue
                        }
                    }
                    condition_data = this.condition.execute(environment);
                    if (condition_data.type != type.BOOLEAN) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                    }
                }
                break;
            case _while_type.DO:
                do {
                    for (const instruction of this.code) {
                        let instruction_data = instruction.execute(environment)
                        if (instruction instanceof _return) {
                            return instruction_data
                        } else if (instruction instanceof _break) {
                            break
                        } else if (instruction instanceof _continue) {
                            continue
                        }
                    }
                    condition_data = this.condition.execute(environment);
                    if (condition_data.type != type.BOOLEAN) {
                        error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                    }
                } while (condition_data.value == true)
                break;
        }

        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }
}