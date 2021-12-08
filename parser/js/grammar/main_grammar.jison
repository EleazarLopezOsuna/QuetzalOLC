 
%{
    const {type} = require("../system/type") ;
    const { error, error_arr, error_type }= require("../system/error");

    const {arithmetic_binary, arithmetic_binary_type} = require('../expression/arithmetic_binary');
    const {arithmetic_unary, arithmetic_unary_type} = require('../expression/arithmetic_unary');
    const {relational, relational_type} = require('../expression/relational');
    const {logic, logic_type} = require('../expression/logic');
    const {unary, unary_type} = require('../expression/unary');
    const {ternary} = require('../expression/ternary');
    const {string_unary, string_unary_type} = require('../expression/string_unary');
    const {string_binary, string_binary_type} = require('../expression/string_binary');
    const {string_ternary, string_ternary_type} = require('../expression/string_ternary');

    
    const {print, print_type} = require('../instruction/print');
    const {declaration_list} = require('../instruction/declaration_list');
    const {declaration_item} = require('../instruction/declaration_item');

    const {native} = require('../literal/native');
%}

%lex
%options case-sensitive

/*********************
        Regex 
**********************/

number      [0-9]+
decimal     [0-9]+("."[0-9]+)
string      ([\"][^"]*[\"])
char        ([\'][^\']{1}[\'])
id          ([a-zA-Z_])[a-zA-Z0-9_ñÑ]*

%%

/*********************
        Ignore 
**********************/

\s+                                     /* Skip Whitespace */
\t                                      /* Skip tabs */
\r                                      /* Skip return */
"//".*                                  /* Comments */
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     /* Multiline Comments */

/*********************
        Tokens 
**********************/

"caracterOfPosition"    return 'tk_position'
"subString"             return 'tk_substring'
"length"                return 'tk_length'
"toUppercase"           return 'tk_uppercase'
"toLowercase"           return 'tk_lowercase'
"null"                  return 'tk_null'
"true"                  return 'tk_bool'
"false"                 return 'tk_bool'
"pow"                   return 'tk_power'
"sqrt"                  return 'tk_sqrt'
"sin"                   return 'tk_sin'
"cos"                   return 'tk_cos'
"tan"                   return 'tk_tan'
"log10"                 return 'tk_log10'

"int"                   return 'tk_integer_type'
"double"                return 'tk_double_type'
"char"                  return 'tk_char_type'
"boolean"               return 'tk_boolean_type'
"String"                return 'tk_string_type'
"if"                    return 'tk_if'
"else"                  return 'tk_else'
"switch"                return 'tk_switch'
"case"                  return 'tk_case'
"default"               return 'tk_default'
"break"                 return 'tk_break'
"continue"              return 'tk_continue'
"while"                 return 'tk_while'
"do"                    return 'tk_do'
"for"                   return 'tk_for'
"void"                  return 'tk_void'
"main"                  return 'tk_main'
"println"               return 'tk_println'
"print"                 return 'tk_print'
"return"                return 'tk_return'
"struct"                return 'tk_struct'
"parse"                 return 'tk_parse'
"toInt"                 return 'tk_toInt'
"toDouble"              return 'tk_toDouble'
"string"                return 'tk_string_func'
"typeof"                return 'tk_typeof'
"elseif"                return 'tk_elseif'
"break"                 return 'tk_break'
"continue"              return 'tk_continue'
"in"                    return 'tk_in'
"begin"                 return 'tk_begin'
"end"                   return 'tk_end'
"push"                  return 'tk_push'
"pop"                   return 'tk_pop'
"null"                  return 'tk_null'

{decimal}               return 'tk_float'
{number}                return 'tk_int'
{string}                return 'tk_string'
{char}                  return 'tk_char'
{id}                    return 'tk_id'
"*"                     return 'tk_times'
"/"                     return 'tk_division'
"++"                    return 'tk_double_plus'
"--"                    return 'tk_double_minus'
"+"                     return 'tk_plus'
"-"                     return 'tk_minus'
"%"                     return 'tk_mod'
"<="                    return 'tk_less_equal'
">="                    return 'tk_greater_equal'
"<"                     return 'tk_less'
">"                     return 'tk_greater'
"=="                    return 'tk_double_equal'
"!="                    return 'tk_not_equal'
"||"                    return 'tk_or'
"&"                     return 'tk_concat'
"&&"                    return 'tk_and'
"!"                     return 'tk_not'
"="                     return 'tk_equal'
"("                     return 'tk_par_o'
")"                     return 'tk_par_c' 
"{"                     return 'tk_cbra_o'
"}"                     return 'tk_cbra_c'
"["                     return 'tk_bra_o'
"]"                     return 'tk_bra_c'
","                     return 'tk_comma'
"^"                     return 'tk_repeat'
"."                     return 'tk_dot'
"?"                     return 'tk_ternary'
":"                     return 'tk_colon'
";"                     return 'tk_semicolon'
"#"                     return 'tk_hash'

<<EOF>>		            return 'EOF'


/*********************
        Options 
**********************/
/* Lexical Errors */
.                   error_arr.push(new error(yylloc.first_line, yylloc.first_column, error_type.LEXICO,'Valor inesperado ' + yytext));  
/lex
/* Prede */
%left 'tk_concat' 'tk_repeat' 'tk_dot'
%left 'tk_ternary'
%left 'tk_or'
%left 'tk_and'
%left 'tk_double_equal', 'tk_not_equal'
%left 'tk_greater_equal', 'tk_less_equal', 'tk_less', 'tk_greater'
%left 'tk_plus' 'tk_minus'
%left 'tk_times' 'tk_division' 'tk_mod'
%left 'tk_pow'
%right 'tk_double_plus' 'tk_double_minus'
%left UMINUS
%right 'tk_not' 
/* Start production */
%start pr_init

/*********************
      Productions 
**********************/
%%

pr_init    
    : pr_instructions EOF {
        return $1;
    } 
;
// pr_init    
//     : pr_globals EOF {
//         $$ = $1
//     }
// ;


pr_globals
    : pr_globals pr_global{
        $1.push($2)
        $$ = $1
    }
    | pr_globals pr_main {
        $1.push($2)
        $$ = $1
    }
    | pr_global {
        $$ = [$1]
    }
    | pr_main {
        $$ = [$1]
    }
;

pr_main
    : tk_void tk_main tk_par_o tk_par_c tk_cbra_o pr_instructions tk_cbra_c {
        $$ = $6
    }
;

pr_global
    : pr_newSubProgram {$$ = $1}
    | pr_declaration_item tk_semicolon {$$ = $1}
    | pr_declare_struct tk_semicolon {$$ = $1}
;

/* Funciones y metodos, 2 producciones para cada uno (trae o no parametros) */
pr_newSubProgram
    : pr_type tk_id tk_par_o pr_declarations tk_par_c tk_cbra_o pr_instructions tk_cbra_c
    | pr_type tk_id tk_par_o tk_par_c tk_cbra_o pr_instructions tk_cbra_c
    | tk_void tk_id tk_par_o pr_declarations tk_par_c tk_cbra_o pr_instructions tk_cbra_c
    | tk_void tk_id tk_par_o tk_par_c tk_cbra_o pr_instructions tk_cbra_c
;

/* int numero1, int numero2 <- Sirve para declaracion de parametros y atributos de struct */
pr_declarations
    : pr_declarations tk_comma pr_type tk_id
    | pr_type  
;

/*
    id, id, id, id
*/
pr_declaration_list
    : pr_declaration_list tk_comma pr_declaration_item {
        $1.add_to_list($3)
        $$ = $1
    }
    | pr_type pr_declaration_item {
        $$ = new declaration_list($1, [$2], @1.first_line,@1.first_column)
    }
;

/*
    int numero = ...
    int[] numero = ...
    int numero(, id)+
*/
pr_declaration_item
    : tk_id tk_equal pr_expr {
        $$ = new declaration_item($1, $3, @1.first_line,@1.first_column);
    }
    | tk_id{
        $$ = new declaration_item($1, null, @1.first_line,@1.first_column);
    }
    | tk_bra_o tk_bra_c tk_id tk_equal pr_expr
;

/*
    struct persona{
        int edad,
        Strint nombre
    }
*/
pr_declare_struct
    : tk_struct tk_id tk_cbra_o pr_declarations tk_cbra_c
;

pr_type
    : tk_integer_type {$$ = $1}
    | tk_double_type {$$ = $1}
    | tk_string_type {$$ = $1}
    | tk_boolean_type {$$ = $1}
    | tk_char_type {$$ = $1}
;

/*
Produccion Cambiada
pr_instructions
    : pr_instructions pr_instruction {
        $1.push($2)
        $$ = $1
    }
    | pr_instruction {
        $$ = [$1]
    }
;
*/

pr_instructions
    : pr_instructions pr_instruction {
        $1.push($2)
        $$ = $1
    }
    | pr_instruction {
        $$ = [$1]
    }
;

/*
Produccion Cambiada
pr_instruction 
    : pr_expr {
        $$ = $1
    }
    | error {
        error_arr.push(new error(@1.first_line, @1.first_column, error_type.SINTACTICO, yytext));  
    }
;
*/

pr_instruction 
    : pr_if {$$ = $1}
    | pr_switch {$$ = $1}
    | pr_while {$$ = $1}
    | pr_do {$$ = $1}
    | pr_for {$$ = $1}
    | pr_assignment tk_semicolon {$$ = $1}
    | pr_call tk_semicolon {$$ = $1}
    | pr_declaration_list tk_semicolon {$$ = $1}
    | pr_declare_struct tk_semicolon {$$ = $1}
    | tk_break tk_semicolon {$$ = $1}
    | tk_continue tk_semicolon {$$ = $1}
    | tk_id tk_double_plus tk_semicolon
    | tk_id tk_double_minus tk_semicolon
    | tk_return pr_expr tk_semicolon
    | pr_print tk_semicolon {$$ = $1}
    | error
;

pr_print
    : tk_print tk_par_o pr_exprList tk_par_c { 
        $$ = new print($3, print_type.PRINT, @1.first_line,@1.first_column);
    }
    | tk_println tk_par_o pr_exprList tk_par_c { 
        $$ = new print($3, print_type.PRINTLN, @1.first_line,@1.first_column);
    }
;


/*
    id = expression
    id[x][y].attribute.attribute = expression
*/
pr_assignment
    : tk_id tk_equal pr_expr
    | tk_id pr_access tk_equal pr_expr
;

/*
    ... .attribute
    ... [expression]
    .attribute
    .expression
*/
pr_access
    : pr_access tk_dot tk_id
    | pr_access tk_bra_o pr_expr tk_bra_c
    | tk_dot tk_id
    | tk_bra_o pr_expr tk_bra_c
;

/*
    id(exp, exp, exp)
    id()
*/
pr_call
    : tk_id tk_par_o pr_exprList tk_par_c
    | tkid tk_par_o tk_par_c
;

/*
    ... , expression
    expression
*/
pr_exprList
    : pr_exprList tk_comma pr_expr {
        $1.push($3)
        $$ = $1
    }
    | pr_expr {
        $$ = [$1]
    }
;

/*
    for(start;expression;expression){instructions}
    for letra in expression {instructions}
*/
pr_for
    : tk_for tk_par_o pr_forStart tk_semicolon pr_expr tk_semicolon pr_expr tk_par_c tk_cbra_o pr_instructions tk_cbra_c
    | tk_for tk_id tk_in pr_expr tk_cbra_o pr_instructions tk_cbra_c
;

/*
    int iterador = expression
    iterador = expression
*/
pr_forStart
    : pr_type tk_id tk_equal pr_expr
    | tk_id tk_equal pr_expr
;

/* while(expression){instructions} */
pr_while
    : tk_while tk_par_o pr_expr tk_par_c tk_cbra_o pr_instructions tk_cbra_c
;

/* do{instructions}while(expression); */
pr_do
    : tk_do tk_cbra_o pr_instructions tk_cbra_c tk_while tk_par_o pr_expr tk_par_c tk_semicolon
;

/* switch(expression){cases} */
pr_switch
    : tk_switch tk_par_o pr_expr tk_par_c tk_cbra_o pr_cases tk_cbra_c
;

pr_cases
    : pr_cases pr_case
    | pr_case
;

/*
    case type: instructions
    default: instructions
*/
pr_case
    : tk_case pr_type tk_colon pr_instructions
    | tk_default tk_colon pr_instructions
;

/*
    if(expression){instructions}..else..
    if(expression){instructions}
*/
pr_if
    : tk_if tk_par_o pr_expr tk_cbra_o pr_instructions tk_cbra_c pr_else
    | tk_if tk_par_o pr_expr tk_cbra_o pr_instructions tk_cbra_c
;

/*
    La recursividad va al final para evitar else-elseif, al momento de detectar un else termina la recursividad
    elseif(expression){instructions}..else..
    elseif(expression){instructions}
    else{instructions}
*/
pr_else
    : tk_elseif tk_par_o pr_expr tk_cbra_o pr_instructions tk_cbra_c pr_else
    | tk_elseif tk_par_o pr_expr tk_cbra_o pr_instructions tk_cbra_c
    | tk_else tk_cbra_o pr_instructions tk_cbra_c
;

pr_expr
    : pr_expr tk_plus pr_expr {
        $$ = new arithmetic_binary($1, $3, arithmetic_binary_type.PLUS, @1.first_line,@1.first_column);
    }   
    | pr_expr tk_minus pr_expr {
        $$ = new arithmetic_binary($1, $3, arithmetic_binary_type.MINUS, @1.first_line,@1.first_column);
    }
    | pr_expr tk_times pr_expr { 
        $$ = new arithmetic_binary($1, $3, arithmetic_binary_type.TIMES, @1.first_line,@1.first_column);
    }       
    | pr_expr tk_division pr_expr {
        $$ = new arithmetic_binary($1, $3, arithmetic_binary_type.DIV, @1.first_line,@1.first_column);
    }
    | pr_expr tk_mod pr_expr {
        $$ = new arithmetic_binary($1, $3, arithmetic_binary_type.MOD, @1.first_line,@1.first_column);
    }
    | tk_power tk_par_o pr_expr tk_comma pr_expr tk_par_c {
        $$ = new arithmetic_binary($3, $5, arithmetic_binary_type.POWER, @1.first_line,@1.first_column);
    }
    | tk_sqrt tk_par_o pr_expr tk_par_c {
        $$ = new arithmetic_unary($3, arithmetic_unary_type.SQRT, @1.first_line,@1.first_column);
    }
    | tk_sin tk_par_o pr_expr tk_par_c {
        $$ = new arithmetic_unary($3, arithmetic_unary_type.SIN, @1.first_line,@1.first_column);
    }
    | tk_cos tk_par_o pr_expr tk_par_c {
        $$ = new arithmetic_unary($3, arithmetic_unary_type.COS, @1.first_line,@1.first_column);
    }
    | tk_tan tk_par_o pr_expr tk_par_c {
        $$ = new arithmetic_unary($3, arithmetic_unary_type.TAN, @1.first_line,@1.first_column);
    }
    | tk_log10 tk_par_o pr_expr tk_par_c {
        $$ = new arithmetic_unary($3, arithmetic_unary_type.LOG10, @1.first_line,@1.first_column);
    }
    | pr_expr tk_less_equal pr_expr {
        $$ = new relational($1, $3,relational_type.LESSOREQUAL ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_greater_equal pr_expr {
        $$ = new relational($1, $3,relational_type.GREATEROREQUAL ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_double_equal pr_expr {
        $$ = new relational($1, $3,relational_type.EQUAL ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_not_equal pr_expr {
        $$ = new relational($1, $3,relational_type.NOTEQUAL ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_greater pr_expr {
        $$ = new relational($1, $3,relational_type.GREATER ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_less pr_expr {
        $$ = new relational($1, $3,relational_type.LESS, @1.first_line, @1.first_column);
    }
    | pr_expr tk_and pr_expr {
        $$ = new logic($1, $3,logic_type.AND ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_or pr_expr {
        $$ = new logic($1, $3,logic_type.OR ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_dot tk_length tk_par_o tk_par_c {
        $$ = new string_unary($1,string_unary_type.LENGTH ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_dot tk_uppercase tk_par_o tk_par_c {
        $$ = new string_unary($1,string_unary_type.UPPERCASE ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_dot tk_lowercase tk_par_o tk_par_c {
        $$ = new string_unary($1,string_unary_type.LOWERCASE ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_concat pr_expr {
        $$ = new string_binary($1, $3,string_binary_type.CONCAT ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_repeat pr_expr {
        $$ = new string_binary($1, $3,string_binary_type.REPEAT ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_dot tk_position tk_par_o pr_expr tk_par_c {
        $$ = new string_binary($1, $5,string_binary_type.POSITION ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_dot tk_substring tk_par_o pr_expr tk_comma pr_expr tk_par_c {
        $$ = new string_ternary($1, $5, $7, string_ternary_type.SUBSTRING ,@1.first_line, @1.first_column);
    }
    | pr_expr tk_ternary pr_expr tk_colon pr_expr {
        $$ = new ternary($1, $3, $5, @1.first_line, @1.first_column);
    }
    | pr_unary {
        $$ = $1
    }
    | tk_id
    | tk_id tk_hash
;

pr_unary :
    tk_not pr_unary {
        $$ = new unary($2, unary_type.LOGIC ,@1.first_line, @1.first_column);
    }
    | pr_native {
        $$ = $1
    }
    | tk_par_o pr_expr tk_par_c {
        $$ = $2
    }   
;

pr_native :
    tk_float {
        $$ = new native($1, type.FLOAT ,@1.first_line, @1.first_column);
    }
    | tk_string {
        $$ = new native($1, type.STRING ,@1.first_line, @1.first_column);
    }
    | tk_null {
        $$ = new native($1, type.NULL ,@1.first_line, @1.first_column);
    }
    | tk_char {
        $$ = new native($1, type.CHAR ,@1.first_line, @1.first_column);
    }
    | tk_int {
        $$ = new native($1, type.INTEGER ,@1.first_line, @1.first_column);
    }
    | tk_bool {
        $$ = new native($1, type.BOOLEAN ,@1.first_line, @1.first_column);
    }
;
