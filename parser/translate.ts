const parser = require("./grammar/main_grammar")
import { environment } from "./system/environment";
import { _console, _3dCode } from "./system/console"
import { error_arr } from "./system/error";

(<any>window).translate = function (input: string): string {
    _3dCode.clean();
    try {
        if(error_arr.length > 0){
            for(let i = 0; i < error_arr.length; i++){
                error_arr.pop();
            }
        }
        const ast = parser.parse(input);
        const main_environment = new environment(null);
        main_environment.name = 'Global';
        _3dCode.environmentList.push(main_environment);
        console.log("ast", ast)
        for (const instr of ast) {
            try {
                instr.translate(main_environment)
            } catch (error) {
                console.log(error);
            }
        }
        if (_3dCode.symbolTables == '') {
            _3dCode.environmentList.forEach(envi => {
                _3dCode.symbolTables += '<div class="table-wrapper-scroll-y my-custom-scrollbar">\n';
                _3dCode.symbolTables += '<table class="table table-hover">\n';
                _3dCode.symbolTables += '<thead>\n<tr>\n<th scope="col">#</th>\n'
                _3dCode.symbolTables += '<th scope="col">ID</th>\n';
                _3dCode.symbolTables += '<th scope="col">Tipo</th>\n';
                _3dCode.symbolTables += '<th scope="col">Absolute</th>\n';
                _3dCode.symbolTables += '<th scope="col">Relative</th>\n';
                _3dCode.symbolTables += '<th scope="col">Ambito</th>\n';
                _3dCode.symbolTables += '</tr>\n';
                _3dCode.symbolTables += '</thead>\n';
                _3dCode.symbolTables += '<tbody>\n';
                _3dCode.symbolTables += envi.get_html_translation(0);
                _3dCode.symbolTables += '</tbody>\n';
                _3dCode.symbolTables += '</table>\n';
                _3dCode.symbolTables += '</div>\n';
            });
        }
        (<any>window).symbol_table = _3dCode.symbolTables;
    } catch (error) {
        console.log(error);
    }

    if (error_arr.length > 0) {
        // generate error table
        (<any>window).error_table = generate_error_table()
        console.log(error_arr)
        return "$error$"
    }
    _3dCode.finalCode = generateHeader() + generateDefaultFunctions() + _3dCode.functionsCode + _3dCode.output;
    return _3dCode.finalCode
}


function generate_error_table() {
    //console.log(errores);
    let result = '<table class="table">\n';
    result += '<thead>\n<tr>\n<th scope="col">#</th>\n'
    result += '<th scope="col">Tipo</th>\n';
    result += '<th scope="col">Descripcion</th>\n';
    result += '<th scope="col">Linea</th>\n';
    result += '<th scope="col">Columna</th>\n';
    result += '</tr>\n';
    result += '</thead>\n';
    result += '<tbody>\n';

    let count = 1;
    error_arr.forEach(element => {
        result += '<tr>\n';
        result += '<th scope="row">' + count + '</th>\n';
        result += element.html();
        result += '</tr>\n';
        count++;
    });
    result += '</tbody>\n';
    return result += '</table>\n';
}

function generateHeader() {
    let code = '#include <stdio.h>\n';
    code += '#include <math.h>\n';
    code += 'float HEAP[100000000];\n';
    code += 'float STACK[100000000];\n';
    code += 'float HP;\n';
    code += 'float SP;\n';
    code += 'float mainStart;\n';
    code += 'float ';
    for (let i = 0; i <= _3dCode.actualTemp; i++) {
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
    code += generateTypeOf();
    code += generateStringToInt();
    code += generateStringToFloat();
    code += generateFloatToString();
    code += generateStringCompare();
    code += generatePrintArray();
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
    code += '}\n\n';
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
    code += '}\n\n';
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
    code += '}\n\n';
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
    code += '}\n\n';
    return code;
}

function generateLowerCase() {
    let code = 'void StringLowerCase(){\n'
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
    code += '}\n\n';
    return code;
}

function generateUpperCase() {
    let code = 'void StringUpperCase(){\n'
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
    code += '}\n\n';
    return code;
}

function generateStringTimes() {
    let code = 'void StringTimes(){\n';
    code += 'T0 = SP + 1;//Get stack position of string\n';
    code += 'T0 = STACK[(int)T0];//Get heap position of string\n';
    code += 'T1 = SP + 2;//Get number position\n';
    code += 'T1 = STACK[(int)T1];//Get number of times the string will repeat\n'
    code += 'T2 = HP;//Save start position of new string\n';
    code += 'L0://Loop tag\n';
    code += 'if(T1 < 1) goto L3;//Check if finish\n';
    code += 'L1://Second loop tag\n';
    code += 'T3 = HEAP[(int)T0];//Get character in heap\n';
    code += 'if(T3 == 36) goto L2;//Check if character is end of string\n'
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
    code += '}\n\n'
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
    code += '}\n\n'
    return code;
}

function generateIntToString() {
    let code = 'void intToString(){\n'
    code += 'T0 = SP + 1; //Get number position\n'
    code += 'T0 = STACK[(int)T0]; //Get number\n'
    code += 'T1 = T0; //Make a copy\n'
    code += 'T2 = 1; //counter\n'
    code += 'L0:\n'
    code += 'if(T1 < 10) goto L1;\n'
    code += 'T3 = (int)T1 % 10; //temp%10\n'
    code += 'T1 = T1 - T3; //temp -= temp%10\n'
    code += 'T1 = T1 / 10; //temp /= 10\n'
    code += 'T2 = T2 * 10; //contador *= 10\n'
    code += 'goto L0;\n'
    code += 'L1:\n'
    code += 'T3 = T1 + 48; //Get ascii for number\n'
    code += 'HEAP[(int)HP] = T3;\n'
    code += 'HP = HP + 1;\n'
    code += 'if(T0 > 9) goto L2;\n'
    code += 'goto L3;\n'
    code += 'L2:\n'
    code += 'T1 = (int)T0 % (int)T2; //num %= contador\n'
    code += 'T0 = SP + 1; //Get number position\n'
    code += 'STACK[(int)T0] = T1;\n'
    code += 'intToString();\n'
    code += 'L3:\n'
    code += 'HEAP[(int)HP] = 36; //Set end of string\n'
    code += 'HP = HP + 1; //Increase HP\n'
    code += 'return;\n'
    code += '}\n\n'
    return code;
}

function generateStringLength() {
    let code = 'void StringLength(){\n';
    code += 'T0 = SP + 1;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T2 = 0;\n'
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
    code += '}\n\n';
    return code;
}

function generateStringPosition() {
    let code = 'void StringPosition(){\n';
    code += 'T0 = SP + 1;\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T2 = SP + 2;\n'
    code += 'T2 = STACK[(int)T2];\n';
    code += 'T3 = 0;\n'
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
    code += 'return;\n'
    code += 'L2:\n';
    code += 'T0 = SP + 0;\n';
    code += 'HEAP[(int)HP] = T1;\n';
    code += 'STACK[(int)T0] = HP;\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;\n';
    code += 'HP = HP + 1;\n';
    code += 'return;\n';
    code += '}\n\n';
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
    code += '}\n\n';
    return code;
}

function generateTypeOf() {
    let code = 'void getTypeOf(){\n';
    code += 'T0 = SP + 1;//Get String starting position\n';
    code += 'T0 = STACK[(int)T0];\n';
    code += 'T1 = HP;\n';
    code += 'if(T0 == 0) goto L0;//Type String\n';
    code += 'if(T0 == 1) goto L1;//Type Int\n';
    code += 'if(T0 == 2) goto L2;//Type Float\n';
    code += 'if(T0 == 3) goto L3;//Type Char\n';
    code += 'if(T0 == 4) goto L4;//Type Boolean\n';
    code += 'if(T0 == 5) goto L5;//Type Struct\n';
    code += 'if(T0 == 6) goto L6;//Type Null\n';
    code += 'L0:\n';
    code += 'HEAP[(int)HP] = 83;//S\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 73;//I\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 71;//G\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L1:\n';
    code += 'HEAP[(int)HP] = 73;//I\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 69;//E\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 71;//G\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 69;//E\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L2:\n';
    code += 'HEAP[(int)HP] = 70;//F\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 79;//O\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 65;//A\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L3:\n';
    code += 'HEAP[(int)HP] = 67;//C\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 72;//H\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 65;//A\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L4:\n';
    code += 'HEAP[(int)HP] = 66;//B\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 79;//O\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 79;//O\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 69;//E\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 65;//A\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L5:\n';
    code += 'HEAP[(int)HP] = 83;//S\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 82;//R\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 85;//U\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 67;//C\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 84;//T\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L6:\n';
    code += 'HEAP[(int)HP] = 78;//N\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 85;//U\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 76;//L\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;//End of string\n';
    code += 'HP = HP + 1;\n';
    code += 'goto L7;\n';
    code += 'L7:\n';
    code += 'T0 = SP + 0;//Get return position\n';
    code += 'STACK[(int)T0] = T1;//Save start position of new string\n';
    code += 'return;\n';
    code += '}\n\n';
    return code;
}

function generateStringToInt() {
    let code = '/*\n';
    code += 'Algorithm:\n';
    code += '    iterator = string.length\n';
    code += '    position = iterator + string.position\n';
    code += '    while(iterator >= 0){\n';
    code += '        if(character == 45){\n';
    code += '            result = result * -1\n';
    code += '            position--\n';
    code += '            iterator--\n';
    code += '            continue\n';
    code += '        }\n';
    code += '        character = string.charAt(position)\n';
    code += '        character = character - 48\n';
    code += '        result = result + mul * character\n';
    code += '        mul = mul * 10\n';
    code += '        position--\n';
    code += '        iterator--\n';
    code += '    }\n';
    code += '*/\n';
    code += 'void StringToInt(){\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T3 = SP;//Save environment\n';
    code += 'SP = 18;//Set environment for StringLength function\n';
    code += 'T1 = SP + 1;//Set string position\n';
    code += 'STACK[(int)T1] = T0;//Save string positon\n';
    code += 'StringLength();//Call function\n';
    code += 'T1 = SP + 0;//Get return position\n';
    code += 'T1 = STACK[(int)T1];//Get return value\n';
    code += 'T1 = T1 - 1;//Get last character position\n';
    code += 'SP = T3;//Get environment back\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T5 = T1;//Set iterator to string length\n';
    code += 'T1 = T1 + T0;//Set real position for last character\n';
    code += 'T2 = 1;//Set mul = 1\n';
    code += 'T3 = 0;//Set result = 0\n';
    code += 'L0://Loop tag\n';
    code += 'if(T5 < 0) goto L1;//Check if none characters are left\n';
    code += 'T0 = HEAP[(int)T1];//Get character\n';
    code += 'if(T0 == 45) goto L2;//Check if character is -\n';
    code += 'T0 = T0 - 48;//Transform character into digit\n';
    code += 'T4 = T2 * T0;//mul*digit\n';
    code += 'T3 = T3 + T4;//result = result + mul * digit\n';
    code += 'T2 = T2 * 10;//mul = mul * 10\n';
    code += 'T1 = T1 - 1;//Update character position\n';
    code += 'T5 = T5 - 1;//Update iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Transform to negative\n';
    code += 'T3 = T3 * -1;//result * -1\n';
    code += 'T1 = T1 - 1;//position--\n';
    code += 'T5 = T5 - 1;//iterator--\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1:\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T3;//Set return to result\n';
    code += 'return;\n';
    code += '}\n\n';
    return code;
}

function generateStringToFloat() {
    let code = '/*\n';
    code += 'Algorithm:\n';
    code += '    iterator = string.length\n';
    code += '    position = iterator + string.position\n';
    code += '    while(iterator >= 0){\n';
    code += '        if(character == 46){\n';
    code += '            result = result / mul\n';
    code += '            mul = 1\n';
    code += '            position--\n';
    code += '            iterator--\n';
    code += '            continue\n';
    code += '        }\n';
    code += '        if(character == 45){\n';
    code += '            result = result * -1\n';
    code += '            position--\n';
    code += '            iterator--\n';
    code += '            continue\n';
    code += '        }\n';
    code += '        character = string.charAt(position)\n';
    code += '        character = character - 48\n';
    code += '        result = result + mul * character\n';
    code += '        mul = mul * 10\n';
    code += '        position--\n';
    code += '        iterator--\n';
    code += '    }\n';
    code += '*/\n';
    code += 'void StringToFloat(){\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T3 = SP;//Save environment\n';
    code += 'SP = 18;//Set environment for StringLength function\n';
    code += 'T1 = SP + 1;//Set string position\n';
    code += 'STACK[(int)T1] = T0;//Save string positon\n';
    code += 'StringLength();//Call function\n';
    code += 'T1 = SP + 0;//Get return position\n';
    code += 'T1 = STACK[(int)T1];//Get return value\n';
    code += 'T1 = T1 - 1;//Get last character position\n';
    code += 'SP = T3;//Get environment back\n';
    code += 'T0 = SP + 1;//Get string stack position\n';
    code += 'T0 = STACK[(int)T0];//Get string heap position\n';
    code += 'T5 = T1;//Set iterator to string length\n';
    code += 'T1 = T1 + T0;//Set real position for last character\n';
    code += 'T2 = 1;//Set mul = 1\n';
    code += 'T3 = 0;//Set result = 0\n';
    code += 'T6 = 0;//Set decimal value to 0\n';
    code += 'L0://Loop tag\n';
    code += 'if(T5 < 0) goto L1;//Check if none characters are left\n';
    code += 'T0 = HEAP[(int)T1];//Get character\n';
    code += 'if(T0 == 46) goto L2;//Check if character is .\n';
    code += 'if(T0 == 45) goto L3;//Check if character is -\n';
    code += 'T0 = T0 - 48;//Transform character into digit\n';
    code += 'T4 = T2 * T0;//mul*digit\n';
    code += 'T3 = T3 + T4;//result = result + mul * digit\n';
    code += 'T2 = T2 * 10;//mul = mul * 10\n';
    code += 'T1 = T1 - 1;//Update character position\n';
    code += 'T5 = T5 - 1;//Update iterator\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L2://Transform result to decimal\n';
    code += 'T3 = T3 / T2;//result = result / mul\n';
    code += 'T2 = 1;//mul = 1\n';
    code += 'T1 = T1 - 1;//position--\n';
    code += 'T5 = T5 - 1;//iterator--\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L3://Transform to negative\n';
    code += 'T3 = T3 * -1;//result * -1\n';
    code += 'T1 = T1 - 1;//position--\n';
    code += 'T5 = T5 - 1;//iterator--\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1:\n';
    code += 'T3 = T3 + T6;//result = result + decimal\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = T3;//Set return to result\n';
    code += 'return;\n';
    code += '}\n\n';
    return code;
}

function generateFloatToString() {
    let code = 'void floatToString(){\n';
    code += 'T0 = SP + 1;\n';
    code += 'T0 = STACK[(int)T0];//Get integer part\n';
    code += 'SP = 14;//Change environment for intToString function\n';
    code += 'T2 = SP + 1;\n';
    code += 'STACK[(int)T2] = T0;//Save integer part\n';
    code += 'T5 = HP;\n';
    code += 'intToString();\n';
    code += 'SP = 0;//Change environment for stringConcat\n';
    code += 'T3 = SP + 1;\n';
    code += 'T4 = SP + 2;\n';
    code += 'STACK[(int)T3] = T5;//Save integer string\n';
    code += 'T5 = HP;\n';
    code += 'HEAP[(int)HP] = 46;\n';
    code += 'HP = HP + 1;\n';
    code += 'HEAP[(int)HP] = 36;\n';
    code += 'HP = HP + 1;\n';
    code += 'STACK[(int)T4] = T5;//Save dot string\n';
    code += 'StringConcat();\n';
    code += 'T3 = SP + 0;\n';
    code += 'T5 = STACK[(int)T3];//Get new string position\n';
    code += 'SP = 33;//Set environment back to floatToString\n';
    code += 'T1 = SP + 2;\n';
    code += 'T1 = STACK[(int)T1];//Get float part\n';
    code += 'SP = 14;//Change environment for intToString\n';
    code += 'T2 = SP + 1;\n';
    code += 'STACK[(int)T2] = T1;//Save float part\n';
    code += 'T4 = HP;\n';
    code += 'intToString();\n';
    code += 'SP = 0;\n';
    code += 'T3 = SP + 1;\n';
    code += 'T2 = SP + 2;\n';
    code += 'STACK[(int)T3] = T5;\n';
    code += 'STACK[(int)T2] = T4;\n';
    code += 'StringConcat();\n';
    code += 'T1 = SP + 0;\n';
    code += 'T1 = STACK[(int)T1];//Get new string position\n';
    code += 'SP = 33;//Set environment back to floatToString\n';
    code += 'T0 = SP + 0;\n';
    code += 'STACK[(int)T0] = T1;//Save return\n';
    code += 'return;\n';
    code += '}\n\n';
    return code;
}

function generateStringCompare() {
    let code = 'void stringCompare(){\n';
    code += 'T0 = SP + 1;//Set first string position\n';
    code += 'T1 = SP + 2;//Set second string position\n';
    code += 'T0 = STACK[(int)T0];//Get first string start position\n';
    code += 'T1 = STACK[(int)T1];//Get second string start position\n';
    code += 'L0://Loop tag\n';
    code += 'T2 = HEAP[(int)T0];//Get character in first string\n';
    code += 'T3 = HEAP[(int)T1];//Get character in second string\n';
    code += 'if(T2 != T3) goto L1;//Characters are diferent\n';
    code += 'if(T2 == 36) goto L2;//Both characters are end of string\n';
    code += 'T0 = T0 + 1;//Get next character in first string\n';
    code += 'T1 = T1 + 1;//Get next character in second string\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1:\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = 0;//Save false as return value\n';
    code += 'goto L3;\n';
    code += 'L2:\n';
    code += 'T0 = SP + 0;//Set return position\n';
    code += 'STACK[(int)T0] = 1;//Save true as return value\n';
    code += 'goto L3;\n';
    code += 'L3:\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}

function generatePrintArray() {
    let code = 'void printArray(){\n';
    code += 'T2 = SP + 1;//Set array size position\n';
    code += 'T3 = SP + 2;//Set array start position\n';
    code += 'T4 = SP + 3;//Set array type position\n';
    code += 'T2 = STACK[(int)T2];//Get array size position\n';
    code += 'T3 = STACK[(int)T3];//Get array start position\n';
    code += 'T4 = STACK[(int)T4];//Get array type position\n';
    code += 'T5 = 0;//Set contador = 0\n';
    code += 'printf("%c", 91);\n';
    code += 'L0://Loop start\n';
    code += 'if(T5 == T2) goto L1;//End of array\n';
    code += 'if(T5 == 0) goto L2;\n';
    code += 'printf("%c", 44);\n';
    code += 'goto L2;\n';
    code += 'L2:\n';
    code += 'if(T4 == 0) goto L3;//Element is string or char\n';
    code += 'if(T4 == 1) goto L4;//Element is int\n';
    code += 'if(T4 == 2) goto L5;//Element is float\n';
    code += 'L3:\n';
    code += 'T6 = SP;\n';
    code += 'SP = 3;\n';
    code += 'T0 = STACK[(int)T3];//Get string start position\n';
    code += 'STACK[(int)SP] = T0;\n';
    code += 'StringPrint();\n';
    code += 'SP = T6;\n';
    code += 'goto L7;\n';
    code += 'L4:\n';
    code += 'T0 = STACK[(int)T3];//Get string start position\n';
    code += 'printf("%d", (int)T0);\n';
    code += 'goto L7;\n';
    code += 'L5:\n';
    code += 'T0 = STACK[(int)T3];//Get string start position\n';
    code += 'printf("%f", T0);\n';
    code += 'goto L7;\n';
    code += 'L7:\n';
    code += 'T3 = T3 + 1;//Update array position\n';
    code += 'T5 = T5 + 1;//Update contador\n';
    code += 'goto L0;//Go back to loop\n';
    code += 'L1:\n';
    code += 'printf("%c", 93);\n';
    code += 'return;\n';
    code += '}\n';
    return code;
}