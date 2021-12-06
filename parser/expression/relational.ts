import { expression } from "../abstract/expression.js";
import { environment } from "../system/environment.js";
import { data, type } from "../system/type.js";

export enum relational_type {
    EQUAL,
    NOTEQUAL,
    LESS,
    LESSOREQUAL,
    GREATER,
    GREATEROREQUAL
}

export class relational extends expression {
    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }

    constructor(public left: expression, public right: expression, public type: relational_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);

        switch (this.type) {
            case relational_type.EQUAL:
                return { value: (left_data.value == right_data.value), type: type.BOOLEAN };
            case relational_type.NOTEQUAL:
                return { value: (left_data.value != right_data.value), type: type.BOOLEAN };
            case relational_type.GREATER:
                return { value: (left_data.value > right_data.value), type: type.BOOLEAN };
            case relational_type.GREATEROREQUAL:
                return { value: (left_data.value >= right_data.value), type: type.BOOLEAN };
            case relational_type.LESS:
                return { value: (left_data.value < right_data.value), type: type.BOOLEAN };
            case relational_type.LESSOREQUAL:
                return { value: (left_data.value <= right_data.value), type: type.BOOLEAN };
            default:
                return { value: 0, type: type.INTEGER }
        }
    }
}