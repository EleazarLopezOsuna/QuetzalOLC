/* Importaciones */
%{

%}
%lex
%options case-insensitive
%%

/* Area de palabras reservadas */
"int"                   %{  return 'INT'; %}
"double"                %{  return 'DOUBLE'; %}
"boolean"               %{  return 'BOOLEAN'; %}
"char"                  %{  return 'CHAR'; %}
"String"                %{  return 'T_STRING'; %}
"if"                    %{  return 'IF'; %}
"else"                  %{  return 'ELSE'; %}
"switch"                %{  return 'SWITCH'; %}
"case"                  %{  return 'CASE'; %}
"default"               %{  return 'DEFAULT'; %}
"break"                 %{  return 'BREAK'; %}
"continue"              %{  return 'CONTINUE'; %}
"while"                 %{  return 'WHILE'; %}
"do"                    %{  return 'DO'; %}
"for"                   %{  return 'FOR'; %}
"while"                 %{  return 'WHILE'; %}
"void"                  %{  return 'VOID'; %}
"main"                  %{  return 'MAIN'; %}
"println"               %{  return 'PRINTLN'; %}
"print"                 %{  return 'PRINT'; %}
"return"                %{  return 'RETURN'; %}
"struct"                %{  return 'STRUCT'; %}
"pow"                   %{  return 'POW'; %}
"sin"                   %{  return 'SIN'; %}
"cos"                   %{  return 'COS'; %}
"log10"                 %{  return 'LOG10'; %}
"tan"                   %{  return 'TAN'; %}
"sqrt"                  %{  return 'SQRT'; %}
"caracterOfPosition"    %{  return 'CARACTEROFPOSITION'; %}
"subString"             %{  return 'SUBSTRING'; %}
"length"                %{  return 'LENGTH'; %}
"toUppercase"           %{  return 'TOUPPERCASE'; %}
"toLowercase"           %{  return 'TOLOWERCASE'; %}
"parse"                 %{  return 'PARSE'; %}
"toInt"                 %{  return 'TOINT'; %}
"toDouble"              %{  return 'TODOUBLE'; %}
"string"                %{  return 'STRING'; %}
"typeof"                %{  return 'TYPEOF'; %}
"function"              %{  return 'FUNCTION'; %}
"elseif"                %{  return 'ELSEIF'; %}
"break"                 %{  return 'BREAK'; %}
"continue"              %{  return 'CONTINUE'; %}
"do"                    %{  return 'DO'; %}
"in"                    %{  return 'IN'; %}
"begin"                 %{  return 'BEGIN'; %}
"end"                   %{  return 'END'; %}
"push"                  %{  return 'PUSH'; %}
"pop"                   %{  return 'POP'; %}
"null"                  %{  return 'NULL'; %}

/* Area de Expresiones regulares */
[0-9]+("."[0-9]+)       %{ return 'DECIMAL'; %}
[a-zA-Z_][a-zA-Z0-9_]*  %{ return 'IDENTIFICADOR'; %}
[0-9]+                  %{ return 'ENTERO'; %}
"false"|"true"          %{ return 'BOLEANO'; %}
\"[^\"]*\"              %{ return 'CADENA'; %}
\'[^\'']\'              %{ return 'CARACTER'; %}

/* Area de Simbolo */
"["                     %{ return '['; %}
"]"                     %{ return ']'; %}
","                     %{ return '['; %}
"{"                     %{ return '{'; %}
"}"                     %{ return '}'; %}
"=="                    %{ return '=='; %}
"="                     %{ return '='; %}
"("                     %{ return '('; %}
")"                     %{ return ')'; %}
"!="                    %{ return '!='; %}
">"                     %{ return '>'; %}
"<"                     %{ return '<'; %}
">="                    %{ return '>='; %}
"<="                    %{ return '<='; %}
"&&"                    %{ return '&&'; %}
"||"                    %{ return '||'; %}
"!"                     %{ return '!'; %}
"&"                     %{ return '&'; %}
"^"                     %{ return '^'; %}
"."                     %{ return '.'; %}
"?"                     %{ return '?'; %}
":"                     %{ return ':'; %}
"++"                    %{ return '++'; %}
"+"                     %{ return '+'; %}
"--"                    %{ return '--'; %}
"-"                     %{ return '-'; %}
"*"                     %{ return '*'; %}
"/"                     %{ return '/'; %}
"#"                     %{ return '#'; %}


/* Area de Ignorar */
(\s|\t|\r)              %{  %}
\/\/.*                  %{  %}
\/\*[^\*]*\*\/          %{  %}
";"                     %{  %}

/* Area de Fin de Cadena */
<<EOF>>         { return 'EOF'; }

/lex

/* Precedencia */
%left '||'
%left '&&'
%nonassoc '==' '!='
%nonassoc '<' '<=' '>' '>='
%left '+' '-'
%left '*' '/' '%'
%left 'POW'
%right '!'
%right '++'
%right '--'
%left UMINUS

%start inicio

%%

/* Gramatica */
inicio: globales principal EOF

principal: FUNCTION VOID MAIN '(' ')' '{' instrucciones '}'
    ;

globales: globales global
    | global

global: declaracion_funcion
    | declaracion_variable
    | declaracion_struct
    ;

declaracion_funcion: FUNCTION TIPO IDENTIFICADOR '(' parametros ')' '{' instrucciones '}'
    | FUNCTION TIPO IDENTIFICADOR '(' ')' '{' instrucciones '}'
    ;

declaracion_variable: tipo IDENTIFICADOR '=' expresion
    | tipo '[' ']' IDENTIFICADOR '=' expresion
    | tipo IDENTIFICADOR
    | tipo lista_id
    ;

declaracion_struct: STRUCT IDENTIFICADOR '{' lista_declaracion '}'
    ;

lista_declaracion: lista_declaracion ',' tipo IDENTIFICADOR
    | tipo IDENTIFICADOR

lista_id: lista_id ',' IDENTIFICADOR
    | IDENTIFICADOR
    ;

tipo: INT
    | DOUBLE
    | T_STRING
    | BOOLEAN
    | CHAR
    | IDENTIFICADOR
    | VOID
    ;

instrucciones: instrucciones instruccion
    | instruccion
    ;

instruccion: llamadaFuncion
    | declaracion_variable
    | declaracion_struct
    | func_if
    | func_switch
    | func_while
    | func_do
    | func_for
    | asignacion
    | BREAK
    | CONTINUE
    | IDENTIFICADOR '++'
    | IDENTIFICADOR '--'
    | RETURN expresion
    | func_print
    | func_println
    ;

func_if: 

llamadaFuncion: IDENTIFICADOR '(' lista_expresiones ')'
    | IDENTIFICADOR '(' ')'
    ;

lista_expresiones: lista_expresiones ',' expresion
    | expresion
    ;

expresion: llamadaFuncion
    | '(' expresion ')'
    | IDENTIFICADOR
    | expresion '?' expresion ':' expresion
    | '[' lista_expresiones ']'
    | TYPEOF '(' expresion ')'
    | TYPEOF '#' '(' expresion ')'
    | '#' IDENTIFICADOR
    | funcionTrigonometrica '(' expresion ')'
    | funcionTrigonometrica # '(' expresion ')'
    | expresion operadorBinario expresion
    | expresion '#' operadorBinario expresion
    | funcionCadena
    | funcionParseo
    | primitivo
    | funcionActualizacion
    | operacionesUnarias
    | BEGIN
    | END
    ;

operacionesUnarias: '-' expresion %prec UMINUS
    | '-' '#' expresion %prec UMINUS
    | '!' expresion
    | '!' '#' expresion
    ;

funcionActualizacion: expresion '++'
    | expresion '--'
    | expresion '#' '++'
    | expresion '#' '--'
    ;

funcionParseo: INT '.' PARSE '(' expresion ')'
    | DOUBLE '.' PARSE '(' expresion ')'
    | BOOLEAN '.' PARSE '(' expresion ')'
    | TOINT '(' expresion ')'
    | TODOUBLE '(' expresion ')'
    | STRING '(' expresion ')'
    ;

funcionCadena: IDENTIFICADOR '.' CARACTEROFPOSITION '(' expresion ')'
    | IDENTIFICADOR '.' SUBSTRING '(' expresion ',' expresion ')'
    | IDENTIFICADOR '.' LENGTH '(' ')'
    | IDENTIFICADOR '.' TOUPPERCASE '(' ')'
    | IDENTIFICADOR '.' TOLOWERCASE '(' ')'
    ;

primitivo: ENTERO
    | CADENA
    | BOLEANO
    | CARACTER
    | DECIMAL
    ;

funcionTrigonometrica: SIN
    | LOG10
    | COS
    | TAN
    ;

operadorBinario: '=='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | '&'
    | '^'
    | '+'
    | '-'
    | '*'
    | '/'
    | '%'
    | '&&'
    | '||'
    ;