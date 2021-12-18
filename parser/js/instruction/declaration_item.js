"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_item = void 0;
const expression_1 = require("../abstract/expression");
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
const instruction_1 = require("../abstract/instruction");
class declaration_item extends instruction_1.instruction {
    constructor(variable_id, value, line, column) {
        super(line, column);
        this.variable_id = variable_id;
        this.value = value;
    }
    translate(environment) {
        if (this.value != null) {
            let valueType = this.value.translate(environment);
            return valueType;
        }
        else {
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        // If value is different to null then we need to operate the expresion
        let value_data = { value: null, type: type_1.type.NULL };
        if (this.value instanceof expression_1.expression || this.value instanceof literal_1.literal) {
            value_data = this.value.execute(environment);
        }
        return value_data;
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Declaracion de Item (" + this.variable_id + ")\"];";
        const this_count = count;
        const child_list = [this.value];
        for (const instr of child_list) {
            if (instr != null) {
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
        return result;
    }
}
exports.declaration_item = declaration_item;
//# sourceMappingURL=declaration_item.js.map