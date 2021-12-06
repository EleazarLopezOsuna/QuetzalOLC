import { literal } from "../abstract/literal.js";
import { type } from "../system/type.js";
export default class native extends literal {
    constructor(value, type, line, column) {
        super(line, column);
        this.value = value;
        this.type = type;
    }
    execute(environment) {
        switch (this.type) {
            case type.INTEGER:
                return { value: Number(this.value), type: type.INTEGER };
            case type.FLOAT:
                return { value: Number(this.value), type: type.FLOAT };
            case type.STRING:
                return { value: this.get_string_value(this.value), type: type.STRING };
            case type.BOOLEAN:
                return { value: (this.value === 'false') ? false : true, type: type.BOOLEAN };
            default:
                return { value: this.value, type: type.STRING };
        }
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
