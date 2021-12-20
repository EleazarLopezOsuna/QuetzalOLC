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
            console_1._3dCode.actualTag++;
            let lTrue = console_1._3dCode.actualTag;
            console_1._3dCode.actualTag++;
            let lFalse = console_1._3dCode.actualTag;
            console_1._3dCode.actualTag++;
            let salida = console_1._3dCode.actualTag;
            if (this.case_value != null) {
                let caseType = this.case_value.translate(environment);
                const conditionTemp = console_1._3dCode.actualTemp;
                if (caseType == type_1.type.CHAR || caseType == type_1.type.STRING) {
                    console_1._3dCode.actualTemp++;
                    let savedEnvironment = console_1._3dCode.actualTemp;
                    console_1._3dCode.output += 'T' + savedEnvironment + ' = SP;//Save environment\n';
                    console_1._3dCode.output += 'SP = 36;//Set new environment\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 1;//Set first string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + console_1._3dCode.switchEvaluation + ';//Save first string\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 2;//Set second string position\n';
                    console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + conditionTemp + ';//Save second string\n';
                    console_1._3dCode.output += 'stringCompare();//Call function stringCompare\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + 0;//Set return position\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = STACK[(int)T' + console_1._3dCode.actualTemp + '];//Get return value\n';
                    console_1._3dCode.output += 'SP = T' + savedEnvironment + ';//Get environment back\n';
                    console_1._3dCode.output += 'if(T' + console_1._3dCode.actualTemp + ' == 1) goto L' + lTrue + ';\n';
                }
                else {
                    console_1._3dCode.output += 'if(T' + conditionTemp + ' == T' + console_1._3dCode.switchEvaluation + ') goto L' + lTrue + ';\n';
                }
                console_1._3dCode.output += "goto L" + lFalse + ";\n";
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