"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameter = void 0;
const expression_1 = require("../abstract/expression");
class parameter extends expression_1.expression {
    constructor(native_type, id, line, column) {
        super(line, column);
        this.native_type = native_type;
        this.id = id;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        return { value: this.id, type: this.native_type };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.parameter = parameter;
//# sourceMappingURL=parameter.js.map