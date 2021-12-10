"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const parser = require("./grammar/main_grammar");
const environment_1 = require("./system/environment");
const console_1 = require("./system/console");
const error_1 = require("./system/error");
window.translate = function (input) {
    console_1._3dCode.clean();
    try {
        const ast = parser.parse(input);
        const main_environment = new environment_1.environment(null);
        console.log("ast", ast);
        for (const instr of ast) {
            try {
                instr.translate(main_environment);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    if (error_1.error_arr.length > 0) {
        console.log(error_1.error_arr);
        return "$error$";
    }
    console_1._3dCode.output = generateHeader() + generateDefaultFunctions() + console_1._3dCode.output;
    return console_1._3dCode.output;
};
function generateHeader() {
    let code = '#include <stdio.h>\n';
    code += '#include <math.h>\n';
    code += 'float HEAP[16384];\n';
    code += 'float STACK[16384];\n';
    code += 'float HP;\n';
    code += 'float SP;\n';
    code += 'float ';
    for (let i = 0; i <= console_1._3dCode.actualTemp; i++) {
        if (i == 0)
            code += 'T' + i;
        else
            code += ', T' + i;
    }
    code += ';\n';
    return code;
}
function generateDefaultFunctions() {
    let code = generateStringConcat();
    code += generateStringPrint();
    code += generateLowerCase();
    code += generateUpperCase();
    code += generateStringTimes();
    code += generateNumberPower();
    code += generateIntToString();
    code += generateOutOfBounds();
    code += generateDivisionBy0();
    code += generateStringLength();
    code += generateStringPosition();
    code += generateStringExtract();
    return code;
}
function generateStringConcat() {
    let code = 'void StringConcat(){\n';
    code += 'T0 = SP + 1;//Get stack position of first string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of first string\n';
    code += 'T1 = HP;//Save first position of new string\n';
    code += 'L0://First loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L1;//Check if character is end of string\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L0;//Return to first loop\n';
    code += 'L1://Exit of first loop\n';
    code += 'T0 = SP + 2;//Get stack position of second string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of second string\n';
    code += 'L2://Second loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L3;//Check if character is end of string\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L2;//Return to second loop\n';
    code += 'L3://Exist of second loop\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;//Go back\n';
    code += '}\n';
    return code;
}
function generateStringPrint() {
    let code = 'void StringPrint(){\n';
    code += 'T0 = SP + 0;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'L0:\n';
    code += 'T1 = HEAP[(int)T0];\n';
    code += 'if(T1 == 36) goto L1;\n';
    code += 'if(T1 == -1) goto L1;\n';
    code += 'printf("%c", (int)T1);\n';
    code += 'T0 = T0 + 1;\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateOutOfBounds() {
    let code = 'void OutOfBounds(){\n';
    code += 'printf("%c", 79); //O\n';
    code += 'printf("%c", 117); //u\n';
    code += 'printf("%c", 116); //t\n';
    code += 'printf("%c", 32); // \n';
    code += 'printf("%c", 111); //o\n';
    code += 'printf("%c", 102); //f\n';
    code += 'printf("%c", 32); // \n';
    code += 'printf("%c", 66); //B\n';
    code += 'printf("%c", 111); //o\n';
    code += 'printf("%c", 117); //u\n';
    code += 'printf("%c", 110); //n\n';
    code += 'printf("%c", 100); //d\n';
    code += 'printf("%c", 115); //s\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateDivisionBy0() {
    let code = 'void DivisionBy0(){\n';
    code += 'printf("%c", 68); //D\n';
    code += 'printf("%c", 105); //i\n';
    code += 'printf("%c", 118); //v\n';
    code += 'printf("%c", 105); //i\n';
    code += 'printf("%c", 115); //s\n';
    code += 'printf("%c", 105); //i\n';
    code += 'printf("%c", 111); //o\n';
    code += 'printf("%c", 110); //n\n';
    code += 'printf("%c", 32); // \n';
    code += 'printf("%c", 98); //b\n';
    code += 'printf("%c", 121); //y\n';
    code += 'printf("%c", 32); // \n';
    code += 'printf("%c", 48); //0\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateLowerCase() {
    let code = 'void StringLowerCase(){\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position\n';
    code += 'T1 = HP;//Save position of new string\n';
    code += 'L0://Loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L2;//Check if character is end of string\n';
    code += 'if(T2 < 65) goto L1;//Check if character < A\n';
    code += 'if(T2 > 90) goto L1;//Check if character > Z\n';
    code += 'T2 = T2 + 32;//Lower case\n';
    code += 'L1: //No need to lower case tag\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase hp\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Exit tag\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = SP + 0;//Get return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;//Go back\n';
    code += '}\n';
    return code;
}
function generateUpperCase() {
    let code = 'void StringUpperCase(){\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position\n';
    code += 'T1 = HP;//Save position of new string\n';
    code += 'L0://Loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T2 == 36) goto L2;//Check if character is end of string\n';
    code += 'if(T2 < 97) goto L1;//Check if character < a\n';
    code += 'if(T2 > 122) goto L1;//Check if character > z\n';
    code += 'T2 = T2 - 32;//Lower case\n';
    code += 'L1: //No need to lower case tag\n';
    code += 'HEAP[(int)HP] = T2;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase hp\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Exit tag\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string in heap\n';
    code += 'HP = HP + 1;//Increase heap\n';
    code += 'T0 = SP + 0;//Get return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;//Go back\n';
    code += '}\n';
    return code;
}
function generateStringTimes() {
    let code = 'void StringTimes(){\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of string\n';
    code += 'T1 = SP + 2;//Get number position\n';
    code += 'T1 = STACK[(int)T1];//Get number of times the string will repeat\n';
    code += 'T2 = HP;//Save start position of new string\n';
    code += 'L0://Loop tag\n';
    code += 'if(T1 < 1) goto L3;//Check if finish\n';
    code += 'L1://Second loop tag\n';
    code += 'T3 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T3 == 36) goto L2;//Check if character is end of string\n';
    code += 'HEAP[(int)HP] = T3;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase HP\n';
    code += 'T0 = T0 + 1;//Increase iterator\n';
    code += 'goto L1;//Go back to second loop\n';
    code += 'L2://End of string tag\n';
    code += 'T1 = T1 -1;//Update counter\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of string\n';
    code += 'goto L0;//Go back to first loop\n';
    code += 'L3://Exit tag\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string to new string\n';
    code += 'HP = HP + 1;//Increase HP\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T2;//Set return\n';
    code += 'return;//\n';
    code += '}';
    return code;
}
function generateNumberPower() {
    let code = 'void NumberPower(){\n';
    code += 'T0 = SP + 1;//Get base index\n';
    code += 'T0 = STACK[(int)T0];//Get base value\n';
    code += 'T1 = SP + 2;//Get exponent index\n';
    code += 'T1 = STACK[(int)T1];//Get exponent value\n';
    code += 'T2 = 1;//Set initial value\n';
    code += 'L0://Loop tag\n';
    code += 'if(T1 < 1) goto L1;//Check if completed\n';
    code += 'T2 = T2 * T0;//Previous value * Base\n';
    code += 'T1 = T1 - 1;//Iterator decreses\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1://Exit tag\n';
    code += 'T0 = SP + 0;//Set return index\n';
    code += 'STACK[(int)T0] = T2;//Set return value\n';
    code += 'return;//Go back\n';
    code += '}';
    return code;
}
function generateIntToString() {
    let code = 'void intToString(){\n';
    code += 'T0 = SP + 1; //Get number position\n';
    code += 'T0 = STACK[(int)T0]; //Get number\n';
    code += 'T1 = T0; //Make a copy\n';
    code += 'T2 = 1; //counter\n';
    code += 'L0:\n';
    code += 'if(T1 < 10) goto L1;\n';
    code += 'T3 = (int)T1 % 10; //temp%10\n';
    code += 'T1 = T1 - T3; //temp -= temp%10\n';
    code += 'T1 = T1 / 10; //temp /= 10\n';
    code += 'T2 = T2 * 10; //contador *= 10\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'T3 = T1 + 48; //Get ascii for number\n';
    code += 'HEAP[(int)HP] = T3;\n';
    code += 'HP = HP + 1;\n';
    code += 'if(T0 > 9) goto L2;\n';
    code += 'goto L3;\n';
    code += 'L2:\n';
    code += 'T1 = (int)T0 % (int)T2; //num %= contador\n';
    code += 'T0 = SP + 1; //Get number position\n';
    code += 'STACK[(int)T0] = T1;\n';
    code += 'intToString();\n';
    code += 'L3:\n';
    code += 'HEAP[(int)HP] = 36; //Set end of string\n';
    code += 'HP = HP + 1; //Increase HP\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateStringLength() {
    let code = 'void StringLength(){\n';
    code += 'T0 = SP + 1;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T2 = 0;\n';
    code += 'L0:\n';
    code += 'T1 = HEAP[(int)T0];\n';
    code += 'if(T1 == 36) goto L1;\n';
    code += 'T2 = T2 + 1;\n';
    code += 'T0 = T0 + 1;\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'T0 = SP + 0;\n';
    code += 'STACK[(int)T0] = T2;\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateStringPosition() {
    let code = 'void StringPosition(){\n';
    code += 'T0 = SP + 1;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T2 = SP + 2;\n';
    code += 'T2 = STACK[(int)T2];\n';
    code += 'T3 = 0;\n';
    code += 'L0:\n';
    code += 'T1 = HEAP[(int)T0];\n';
    code += 'if(T1 == 36) goto L1;\n';
    code += 'if(T3 == T2) goto L2;\n';
    code += 'T3 = T3 + 1;\n';
    code += 'T0 = T0 + 1;\n';
    code += 'goto L0;\n';
    code += 'L1:\n';
    code += 'OutOfBounds();\n';
    code += 'T0 = SP + 0;\n';
    code += 'HEAP[(int)HP] = -1;//Set error code\n';
    code += 'STACK[(int)T0] = HP;\n';
    code += 'HP = HP + 1;\n';
    code += 'return;\n';
    code += 'L2:\n';
    code += 'T0 = SP + 0;\n';
    code += 'HEAP[(int)HP] = T1;\n';
    code += 'STACK[(int)T0] = HP;\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;\n';
    code += 'HP = HP + 1;\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
function generateStringExtract() {
    let code = 'void StringExtract(){\n';
    code += 'T0 = SP + 1;//Get String starting position\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T5 = SP;//Save actual environment\n';
    code += 'SP = 18;//Set StringLength environment\n';
    code += 'T2 = SP + 1;\n';
    code += 'STACK[(int)T2] = T0;//Set string\n';
    code += 'StringLength();//Call StringLength\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'T0 = STACK[(int)T0];//Get return value\n';
    code += 'T0 = T0 - 1;//Max value for start or finish position\n';
    code += 'SP = T5;//Get environment back\n';
    code += 'T1 = SP + 1;//Get String starting position\n';
    code += 'T1 = STACK[(int)T1];\n';
    code += 'T2 = SP + 2;//Get start position\n';
    code += 'T2 = STACK[(int)T2];\n';
    code += 'T3 = SP + 3;//Get finish position\n';
    code += 'T3 = STACK[(int)T3];\n';
    code += 'T4 = HP;//Save new string start position\n';
    code += 'if(T2 > T0) goto L0;//Check if index is greater than length\n';
    code += 'if(T3 > T0) goto L0;//Check if index is greater than length\n';
    code += 'T2 = T1 + T2;//Update start position\n';
    code += 'T3 = T1 + T3;//Update finish position\n';
    code += 'goto L1;\n';
    code += 'L1:\n';
    code += 'T5 = HEAP[(int)T2];//Get character in heap\n';
    code += 'if(T2 > T3) goto L2;//End of extraction\n';
    code += 'HEAP[(int)HP] = T5;//Save character in heap\n';
    code += 'HP = HP + 1;//Increase hp\n';
    code += 'T2 = T2 + 1;//Increase iterator\n';
    code += 'goto L1;//Go back to loop\n';
    code += 'L0:\n';
    code += 'OutOfBounds();\n';
    code += 'T0 = SP + 0;\n';
    code += 'HEAP[(int)HP] = -1;//Set error code\n';
    code += 'STACK[(int)T0] = HP;\n';
    code += 'HP = HP + 1;\n';
    code += 'return;\n';
    code += 'L2:\n';
    code += 'HEAP[(int)HP] = 36;//Add end of string to new string\n';
    code += 'HP = HP + 1;//Increase HP\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T4;//Set return\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}
//# sourceMappingURL=translate.js.map