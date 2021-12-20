"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._case = exports._case_type = void 0;
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _return_1 = require("./_return");
const _break_1 = require("./_break");
var _case_type;
(function (_case_type) {
    _case_type[_case_type["CASE"] = 0] = "CASE";
    _case_type[_case_type["DEFAULT"] = 1] = "DEFAULT";
})(_case_type = exports._case_type || (exports._case_type = {}));
class _case extends instruction_1.instruction {
    constructor(case_value, code, type, line, column) {
        super(line, column);
        this.case_value = case_value;
        this.code = code;
        this.type = type;
    }
    translate(environment) {
        if (this.type == _case_type.CASE) {
            if (this.case_value != null) {
                this.case_value.translate(environment);
                const conditionTemp = console_1._3dCode.actualTemp;
                console_1._3dCode.actualTag++;
                let lTrue = console_1._3dCode.actualTag;
                console_1._3dCode.output += 'if(T' + conditionTemp + ' == T' + console_1._3dCode.switchEvaluation + ') goto L' + lTrue + ';\n';
                console_1._3dCode.actualTag++;
                let lFalse = console_1._3dCode.actualTag;
                console_1._3dCode.output += "goto L" + lFalse + ";\n";
                console_1._3dCode.actualTag++;
                let salida = console_1._3dCode.actualTag;
                console_1._3dCode.output += "L" + lTrue + ":\n";
                for (const instr of this.code) {
                    try {
                        instr.translate(environment);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                console_1._3dCode.output += "goto L" + (salida + 1) + ";\n";
                console_1._3dCode.output += "L" + salida + ":\n";
                console_1._3dCode.output += "L" + lFalse + ":\n";
            }
        }
        else {
            console_1._3dCode.actualTag++;
            let lTrue = console_1._3dCode.actualTag;
            console_1._3dCode.actualTag++;
            let salida = console_1._3dCode.actualTag;
            console_1._3dCode.output += "L" + lTrue + ":\n";
            for (const instr of this.code) {
                try {
                    instr.translate(environment);
                }
                catch (error) {
                    console.log(error);
                }
            }
            console_1._3dCode.output += "goto L" + salida + ";\n";
            console_1._3dCode.output += "L" + salida + ":\n";
        }
        return type_1.type.NULL;
    }
    get_value() {
        return this.case_value;
    }
    execute(environment) {
        for (const instr of this.code) {
            const instr_data = instr.execute(environment);
            if (instr_data instanceof _break_1._break) {
                break;
            }
            else if (instr_data instanceof _return_1._return) {
                return instr_data;
            }
        }
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Case (" + _case_type[this.type] + ")\"];";
        const this_count = count;
        if (this.case_value != null) {
            const child_list = [this.case_value];
            for (const instr of child_list) {
                try {
                    result += "node" + this_count + " -> " + "node" + count + "1;";
                    result += instr.plot(Number(count + "1"));
                    count++;
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
        for (const instr of this.code) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"));
                count++;
            }
            catch (error) {
                console.log(error);
            }
        }
        return result;
    }
}
exports._case = _case;
//# sourceMappingURL=_case.js.map