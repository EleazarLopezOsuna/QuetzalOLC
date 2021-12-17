"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._for = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
const _break_1 = require("./_break");
const _continue_1 = require("./_continue");
const assignation_unary_1 = require("./assignation_unary");
const declaration_list_1 = require("./declaration_list");
class _for extends instruction_1.instruction {
    constructor(initialization, condition, unary, code, line, column) {
        super(line, column);
        this.initialization = initialization;
        this.condition = condition;
        this.unary = unary;
        this.code = code;
    }
    translate(environment) {
        console_1._3dCode.actualTag++;
        let inicio = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        let final = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        let continueTag = console_1._3dCode.actualTag;
        this.initialization.translate(environment);
        console_1._3dCode.output += 'L' + inicio + ':\n';
        this.condition.translate(environment);
        let conditionTemp = console_1._3dCode.actualTemp;
        console_1._3dCode.output += 'if(T' + conditionTemp + ' == 0) goto L' + final + ';\n';
        let tempContinue = console_1._3dCode.continueTag;
        console_1._3dCode.continueTag = continueTag;
        let tempBreak = console_1._3dCode.breakTag;
        console_1._3dCode.breakTag = final;
        for (const instruction of this.code) {
            instruction.translate(environment);
        }
        console_1._3dCode.breakTag = tempBreak;
        console_1._3dCode.continueTag = tempContinue;
        console_1._3dCode.output += 'L' + continueTag + ':\n';
        this.unary.translate(environment);
        console_1._3dCode.output += "goto L" + inicio + ";\n";
        console_1._3dCode.output += "L" + final + ":\n";
        return type_1.type.NULL;
    }
    execute(environment) {
        if (this.initialization instanceof assignation_unary_1.assignation_unary
            || this.initialization instanceof declaration_list_1.declaration_list) {
            this.initialization.execute(environment);
        }
        else {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La inicializacion del for tiene que ser una declaracion o asignacion'));
            // Default
            return { value: null, type: type_1.type.NULL };
        }
        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
            // Default
            return { value: null, type: type_1.type.NULL };
        }
        while (condition_data.value == true) {
            for (const instruction of this.code) {
                let instruction_data = instruction.execute(environment);
                if (instruction instanceof _return_1._return) {
                    return instruction_data;
                }
                else if (instruction instanceof _break_1._break) {
                    break;
                }
                else if (instruction instanceof _continue_1._continue) {
                    continue;
                }
            }
            this.unary.execute(environment);
            condition_data = this.condition.execute(environment);
            if (condition_data.type != type_1.type.BOOLEAN) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
                // Default
                return { value: null, type: type_1.type.NULL };
            }
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._for = _for;
//# sourceMappingURL=_for.js.map