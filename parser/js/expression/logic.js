import { expression } from "../abstract/expression.js";
import { type } from "../system/type.js";
export var logic_type;
(function (logic_type) {
    logic_type[logic_type["AND"] = 0] = "AND";
    logic_type[logic_type["OR"] = 1] = "OR";
    logic_type[logic_type["NOT"] = 2] = "NOT";
})(logic_type || (logic_type = {}));
export class logic extends expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        switch (this.type) {
            case logic_type.AND:
                return { value: (left_data.value && right_data.value), type: type.BOOLEAN };
            case logic_type.OR:
                return { value: (left_data.value || right_data.value), type: type.BOOLEAN };
            default:
                return { value: 0, type: type.INTEGER };
        }
    }
}
