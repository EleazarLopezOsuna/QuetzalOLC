"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._struct = void 0;
const type_1 = require("../system/type");
const literal_1 = require("../abstract/literal");
class _struct extends literal_1.literal {
    constructor(body, line, column) {
        super(line, column);
        this.body = body;
    }
    translate(environment) {
        // Default
        return type_1.type.NULL;
    }
    check_length(parameters) {
        return (parameters.length == this.body.length);
    }
    check_types(parameters, environment) {
        for (let index = 0; index < this.body.length; index++) {
            const declared_parameter_data = this.body[index].execute(environment);
            const obtained_parameter_data = parameters[index].execute(environment);
            if (declared_parameter_data.type != obtained_parameter_data.type) {
                return false;
            }
        }
        return true;
    }
    execute(environment) {
        // Default
        return { value: this, type: type_1.type.UNDEFINED };
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Struct\"];";
        const this_count = count;
        for (const instr of this.body) {
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
exports._struct = _struct;
//# sourceMappingURL=_struct.js.map