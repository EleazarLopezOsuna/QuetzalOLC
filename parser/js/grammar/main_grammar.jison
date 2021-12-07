 
%{
    const {type} = require("../system/type") ;
    const { error, error_arr, error_type }= require("../system/error");

    const {arithmetic_binary, arithmetic_binary_type} = require('../expression/arithmetic_binary');
    const {arithmetic_unary, arithmetic_unary_type} = require('../expression/arithmetic_unary');
    const {relational, relational_type} = require('../expression/relational');
    const {logic, logic_type} = require('../expression/logic');
    const {unary, unary_type} = require('../expression/unary');
    const {string_unary, string_unary_type} = require('../expression/string_unary');
    const {string_binary, string_binary_type} = require('../expression/string_binary');
    const {string_ternary, string_ternary_type} = require('../expression/string_ternary');

    const {native} = require('../literal/native');
%}

%lex
%options case-sensitive

/*********************
        Regex 
**********************/

number      [0-9]+
decimal     [0-9]+("."[0-9]+)?
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

"int"                   return 'tk_int'
"double"                return 'tk_double'
"char"                  return 'tk_char'
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
"string"                return 'tk_string'
"typeof"                return 'tk_typeof'
"function"              return 'tk_function'
"elseif"                return 'tk_elseif'
"break"                 return 'tk_break'
"continue"              return 'tk_continue'
"in"                    return 'tk_in'
"begin"                 return 'tk_begin'
"end"                   return 'tk_end'
"push"                  return 'tk_push'
"pop"                   return 'tk_pop'
"null"                  return 'tk_null'

{number}                return 'tk_int'
{decimal}               return 'tk_float'
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

pr_instructions
    : pr_instructions pr_instruction {
        $1.push($2)
        $$ = $1
    }
    | pr_instruction {
        $$ = [$1]
    }
;

pr_instruction 
    : pr_expr {
        $$ = $1
    }
    | error {
        error_arr.push(new error(@1.first_line, @1.first_column, error_type.SINTACTICO, yytext));  
    }
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
    | pr_unary {
        $$ = $1
    }
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
