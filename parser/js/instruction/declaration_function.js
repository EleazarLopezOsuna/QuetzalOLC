"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.declaration_function = void 0;
const type_1 = require("../system/type");
const instruction_1 = require("../abstract/instruction");
class declaration_function extends instruction_1.instruction {
    constructor(native_type, id, parametros, statement, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.id = id;
        this.parametros = parametros;
        this.statement = statement;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        environment.save_function(this.id, this);
        // Default
        return { value: null, type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.declaration_function = declaration_function;
//# sourceMappingURL=declaration_function.js.map