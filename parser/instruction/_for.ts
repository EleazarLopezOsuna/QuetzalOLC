import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { error, error_arr, error_type } from "../system/error";
import { data, type } from "../system/type";
import { _3dCode, _console } from "../system/console";
import { literal } from "../abstract/literal";
import { instruction } from "../abstract/instruction";
import { _return } from "./_return";
import { _case, _case_type } from "./_case";
import { _break } from "./_break";
import { _continue } from "./_continue";
import { unary_instruction } from "./unary_instruction";
import { assignation_unary } from "./assignation_unary";
import { declaration_item } from "./declaration_item";
import { declaration_list } from "./declaration_list";

export class _for extends instruction {

    public translate(environment: environment): type {
        _3dCode.actualTag++;
        let inicio = _3dCode.actualTag;
        _3dCode.actualTag++;
        let final = _3dCode.actualTag;
        _3dCode.actualTag++;
        let continueTag = _3dCode.actualTag;
        this.initialization.translate(environment);
        _3dCode.output += 'L' + inicio + ':\n';
        this.condition.translate(environment);
        let conditionTemp = _3dCode.actualTemp
        _3dCode.output += 'if(T' + conditionTemp + ' == 0) goto L' + final + ';\n';
        let tempContinue = _3dCode.continueTag;
        _3dCode.continueTag = continueTag;
        let tempBreak = _3dCode.breakTag;
        _3dCode.breakTag = final;
        for (const instruction of this.code) {
            instruction.translate(environment)
        }
        _3dCode.breakTag = tempBreak;
        _3dCode.continueTag = tempContinue;
        _3dCode.output += 'L' + continueTag + ':\n';
        this.unary.translate(environment);
        _3dCode.output += "goto L" + inicio + ";\n";
        _3dCode.output += "L" + final + ":\n";
        return type.NULL
    }

    constructor(public initialization: instruction, public condition: expression, public unary: unary_instruction, public code: Array<instruction>, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        if (this.initialization instanceof assignation_unary
            || this.initialization instanceof declaration_list) {
            this.initialization.execute(environment);
        } else {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La inicializacion del for tiene que ser una declaracion o asignacion'));
            // Default
            return { value: null, type: type.NULL }
        }
        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type.BOOLEAN) {
            error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
            // Default
            return { value: null, type: type.NULL }
        }
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
            this.unary.execute(environment)
            condition_data = this.condition.execute(environment);
            if (condition_data.type != type.BOOLEAN) {
                error_arr.push(new error(this.line, this.column, error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                // Default
                return { value: null, type: type.NULL }
            }
        }
        // Default
        return { value: null, type: type.NULL }
    }

    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") For\"];";
        const this_count = count

        const child_list = [this.initialization, this.condition, this.unary]
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