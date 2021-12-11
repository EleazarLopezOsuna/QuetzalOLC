"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._while = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
const _break_1 = require("./_break");
const _continue_1 = require("./_continue");
class _while extends instruction_1.instruction {
    constructor(condition, code, line, column) {
        super(line, column);
        this.condition = condition;
        this.code = code;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        let condition_data = this.condition.execute(environment);
        if (condition_data.type != type_1.type.BOOLEAN) {
            error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
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
            condition_data = this.condition.execute(environment);
            if (condition_data.type != type_1.type.BOOLEAN) {
                error_1.error_arr.push(new error_1.error(this.line, this.column, error_1.error_type.SEMANTICO, 'La condicion tiene que ser de tipo booleana'));
            }
        }
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._while = _while;
//# sourceMappingURL=_while.js.map