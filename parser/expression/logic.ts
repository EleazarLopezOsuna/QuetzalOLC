import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { data, type } from "../system/type";

export enum logic_type {
    AND,
    OR,
    NOT
}

export class logic extends expression {
    public translate(environment: environment): type {
        throw new Error("Method not implemented.");
    }
    
    public plot(count: number): string {
        throw new Error("Method not implemented.");
    }

    constructor(public left: expression, public right: expression, public type: logic_type, line: number, column: number) {
        super(line, column);
    }

    public execute(environment: environment): data {

        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);

        switch (this.type) {
            case logic_type.AND:
                return { value: (left_data.value && right_data.value), type: type.BOOLEAN };
            case logic_type.OR:
                return { value: (left_data.value || right_data.value), type: type.BOOLEAN };
            default:
                return { value: 0, type: type.INTEGER }
        }
    }
}