"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logic = exports.logic_type = void 0;
const expression_1 = require("../abstract/expression");
const console_1 = require("../system/console");
const type_1 = require("../system/type");
var logic_type;
(function (logic_type) {
    logic_type[logic_type["AND"] = 0] = "AND";
    logic_type[logic_type["OR"] = 1] = "OR";
    logic_type[logic_type["NOT"] = 2] = "NOT";
})(logic_type = exports.logic_type || (exports.logic_type = {}));
class logic extends expression_1.expression {
    constructor(left, right, type, line, column) {
        super(line, column);
        this.left = left;
        this.right = right;
        this.type = type;
    }
    translate(environment) {
        const leftType = this.left.translate(environment);
        const leftTemp = console_1._3dCode.actualTemp;
        const rightType = this.right.translate(environment);
        const rightTemp = console_1._3dCode.actualTemp;
        console_1._3dCode.actualTag++;
        const trueTag = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        const falseTag = console_1._3dCode.actualTag;
        console_1._3dCode.actualTag++;
        const exitTag = console_1._3dCode.actualTag;
        switch (this.type) {
            case logic_type.AND:
                if (leftType === type_1.type.BOOLEAN && rightType == type_1.type.BOOLEAN) {
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'if(T' + leftTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                    console_1._3dCode.output += 'if(T' + rightTemp + ' == 0) goto L' + trueTag + ';//Expression is false\n';
                    console_1._3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'L' + trueTag + ':\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 0;//Set value to 0 (false)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + falseTag + ':\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 1;//Set value to 1 (true)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + exitTag + ':\n';
                }
                return type_1.type.BOOLEAN;
            case logic_type.OR:
                if (leftType === type_1.type.BOOLEAN && rightType == type_1.type.BOOLEAN) {
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'if(T' + leftTemp + ' == 1) goto L' + trueTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'if(T' + rightTemp + ' == 1) goto L' + trueTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'goto L' + falseTag + ';//Expression is true\n';
                    console_1._3dCode.output += 'L' + trueTag + ':\n';
                    console_1._3dCode.actualTemp++;
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 1;//Set value to 1 (true)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + falseTag + ':\n';
                    console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = 0;//Set value to 0 (false)\n';
                    console_1._3dCode.output += 'goto L' + exitTag + ';\n';
                    console_1._3dCode.output += 'L' + exitTag + ':\n';
                }
                return type_1.type.BOOLEAN;
            default:
                return type_1.type.INTEGER;
        }
    }
    plot(count) {
        let result = "node" + count + "[label=\"(" + this.line + "," + this.column + ") Logica (" + logic_type[this.type] + ")\"];";
        const this_count = count;
        const child_list = [this.left, this.right];
        for (const instr of child_list) {
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
    execute(environment) {
        const left_data = this.left.execute(environment);
        const right_data = this.right.execute(environment);
        switch (this.type) {
            case logic_type.AND:
                return { value: (left_data.value && right_data.value), type: type_1.type.BOOLEAN };
            case logic_type.OR:
                return { value: (left_data.value || right_data.value), type: type_1.type.BOOLEAN };
            default:
                return { value: 0, type: type_1.type.INTEGER };
        }
    }
}
exports.logic = logic;
//# sourceMappingURL=logic.js.map