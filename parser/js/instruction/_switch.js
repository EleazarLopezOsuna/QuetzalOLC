"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._switch = void 0;
const error_1 = require("../system/error");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const _case_1 = require("./_case");
class _switch extends instruction_1.instruction {
    constructor(switch_value, case_list, line, column) {
        super(line, column);
        this.switch_value = switch_value;
        this.case_list = case_list;
    }
    translate(environment) {
        this.switch_value.translate(environment);
        console_1._3dCode.switchEvaluation = console_1._3dCode.actualTemp;
        console_1._3dCode.actualTag++;
        let salida = console_1._3dCode.actualTag;
        console_1._3dCode.breakTag = salida;
        for (const case_instr of this.case_list) {
            case_instr.translate(environment);
        }
        console_1._3dCode.output += "L" + salida + ":\n";
        return type_1.type.NULL;
    }
    execute(environment) {
        const switch_value_data = this.switch_value.execute(environment);
        // comprobar tipos de los case
        for (const case_instr of this.case_list) {
            if (case_instr.type == _case_1._case_type.CASE) {
                let case_value_data = case_instr.get_value();
                if (case_value_data != null) {
                    if (case_value_data.type != switch_value_data.type) {
                        error_1.error_arr.push(new error_1.error(case_instr.line, case_instr.column, error_1.error_type.SEMANTICO, 'El case tiene tipo distinto al switch'));
                    }
                }
            }
        }
        // ejecutar los case
        let default_case;
        for (const case_instr of this.case_list) {
            // Guardar el default por si ningun case es verdadero
            if (case_instr.type == _case_1._case_type.DEFAULT) {
                default_case = case_instr;
            }
            else {
                let case_value_data = case_instr.get_value();
                if (case_value_data != null) {
                    case_value_data = case_value_data.execute(environment);
                    if (case_value_data.value == switch_value_data.value) {
                        return case_instr.execute(environment);
                    }
                }
            }
        }
        return default_case ? default_case.execute(environment) : { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Switch\"];";
        const this_count = count;
        const child_list = [this.switch_value];
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
        for (const instr of this.case_list) {
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
exports._switch = _switch;
//# sourceMappingURL=_switch.js.map