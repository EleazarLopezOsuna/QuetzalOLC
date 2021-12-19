"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._forin = void 0;
const expression_1 = require("../abstract/expression");
const type_1 = require("../system/type");
const console_1 = require("../system/console");
const instruction_1 = require("../abstract/instruction");
const array_access_1 = require("./array_access");
const native_1 = require("../literal/native");
class _forin extends instruction_1.instruction {
    constructor(id, operator, code, line, column) {
        super(line, column);
        this.id = id;
        this.operator = operator;
        this.code = code;
    }
    translate(environment) {
        if (this.operator instanceof array_access_1.array_access) {
        }
        else if (this.operator instanceof native_1.native || this.operator instanceof expression_1.expression) {
            let operatorType = this.operator.translate(environment);
            let relativePos = console_1._3dCode.relativePos;
            console_1._3dCode.relativePos = 0;
            environment.save_variable(this.id, { value: null, type: operatorType }, console_1._3dCode.absolutePos, console_1._3dCode.relativePos, 1);
            let operatorTemp = console_1._3dCode.actualTemp;
            console_1._3dCode.actualTemp++;
            let caracter = console_1._3dCode.actualTemp;
            if (operatorType == type_1.type.STRING) {
                console_1._3dCode.actualTag++;
                let inicio = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                let final = console_1._3dCode.actualTag;
                console_1._3dCode.actualTag++;
                let continueTag = console_1._3dCode.actualTag;
                console_1._3dCode.output += 'L' + inicio + ':\n';
                console_1._3dCode.output += 'T' + caracter + ' = HEAP[(int)T' + operatorTemp + '];//Get character\n';
                console_1._3dCode.output += 'if(T' + caracter + ' == 36) goto L' + final + ';\n';
                console_1._3dCode.actualTemp++;
                let inicioString = console_1._3dCode.actualTemp;
                console_1._3dCode.output += 'T' + inicioString + ' = HP;//Save new start\n';
                console_1._3dCode.output += 'HEAP[(int)HP] = T' + caracter + ';//Save character\n';
                console_1._3dCode.output += 'HP = HP + 1;\n';
                console_1._3dCode.output += 'HEAP[(int)HP] = 36;//Save end of string\n';
                console_1._3dCode.output += 'HP = HP + 1;\n';
                let relativePos = environment.get_relative(this.id);
                console_1._3dCode.actualTemp++;
                console_1._3dCode.output += 'T' + console_1._3dCode.actualTemp + ' = SP + ' + relativePos + ';\n';
                console_1._3dCode.output += 'STACK[(int)T' + console_1._3dCode.actualTemp + '] = T' + inicioString + ';//Update value for variable ' + this.id + '\n';
                let tempContinue = console_1._3dCode.continueTag;
                console_1._3dCode.continueTag = continueTag;
                let tempBreak = console_1._3dCode.breakTag;
                console_1._3dCode.breakTag = final;
                for (const instruction of this.code) {
                    instruction.translate(environment);
                }
                console_1._3dCode.breakTag = tempBreak;
                console_1._3dCode.continueTag = tempContinue;
                console_1._3dCode.output += 'L' + continueTag + ':\n';
                console_1._3dCode.output += 'T' + operatorTemp + ' = T' + operatorTemp + ' + 1;//Update position\n';
                console_1._3dCode.output += "goto L" + inicio + ";\n";
                console_1._3dCode.output += "L" + final + ":\n";
            }
            console_1._3dCode.relativePos = relativePos;
        }
        return type_1.type.NULL;
    }
    execute(environment) {
        throw new Error("Method not implemented.");
    }
    plot(count) {
        throw new Error("Method not implemented.");
    }
}
exports._forin = _forin;
//# sourceMappingURL=_forin.js.map