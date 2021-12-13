"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_range = void 0;
const expression_1 = require("../abstract/expression");
const type_1 = require("../system/type");
class array_range extends expression_1.expression {
    constructor(left, right, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
    }
    translate(environment) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const left_data = (this.left instanceof expression_1.expression) ? this.left.execute(environment) : { type: type_1.type.STRING, value: this.left };
        const right_data = (this.right instanceof expression_1.expression) ? this.right.execute(environment) : { type: type_1.type.STRING, value: this.right };
        // Default
        return { value: [left_data.value, right_data.value], type: type_1.type.NULL };
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports.array_range = array_range;
//# sourceMappingURL=array_range.js.map