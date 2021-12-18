import { expression } from "../abstract/expression";
import { environment } from "../system/environment";
import { data, type } from "../system/type";
import { _3dCode } from "../system/console";

export enum relational_type {
    EQUAL,
    NOTEQUAL,
    LESS,
    LESSOREQUAL,
    GREATER,
    GREATEROREQUAL
}

export class relational extends expression {
    public translate(environment: environment): type {
        const leftType = this.left.translate(environment);
        const leftTemp = _3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = _3dCode.actualTemp;

        switch (this.type) {
            case relational_type.EQUAL:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' == T' + rightTemp + ';\n'
                return type.BOOLEAN;
            case relational_type.NOTEQUAL:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' != T' + rightTemp + ';\n'
                return type.BOOLEAN;
            case relational_type.GREATER:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' > T' + rightTemp + ';\n'
                return type.BOOLEAN;
            case relational_type.GREATEROREQUAL:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' >= T' + rightTemp + ';\n'
                return type.BOOLEAN;
            case relational_type.LESS:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' < T' + rightTemp + ';\n'
                return type.BOOLEAN;
            case relational_type.LESSOREQUAL:
                _3dCode.actualTemp++;
                _3dCode.output += 'T' + _3dCode.actualTemp + ' = T' + leftTemp + ' <= T' + rightTemp + ';\n'
                return type.BOOLEAN;
            default:
                return type.INTEGER;
        }
    }
    public plot(count: number): string {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Relacional (" + relational_type[this.type] + ")\"];";
        const this_count = count

        const child_list = [this.left, this.right]
        for (const instr of child_list) {
            try {
                result += "node" + this_count + " -> " + "node" + count + "1;";
                result += instr.plot(Number(count + "1"))
                count++
            } catch (error) {
                console.log(error);
            }
        }
        return result
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