const parser = require("./grammar/main_grammar")
import { environment } from "./system/environment";
import { _console, _3dCode } from "./system/console"
import { error_arr } from "./system/error";


(<any>window).exec = function (input: string): string {
    _console.clean();
    try {
        const ast = parser.parse(input);
        const main_environment = new environment(null);
        console.log("ast", ast)
        for (const instr of ast) {
            try {
                instr.execute(main_environment)
            } catch (error) {
                console.log(error);
            }
        }
        (<any>window).symbol_table = main_environment.get_html()
    } catch (error) {
        console.log(error);
    }


    if (error_arr.length > 0) {
        // generate error table
        (<any>window).error_table = generate_error_table()
        return "$error$"
    }
    return _console.output
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
