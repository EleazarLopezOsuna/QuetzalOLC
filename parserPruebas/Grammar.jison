/*  */
%{
    class SintacticNode {
        constructor(name, value, children, number) {
            this.name = name;
            this.value = value;
            this.number = number;
            this.children = children;
        }
    }
  contador = 0;
%}
%lex
%options case-insensitive
%%

/* Area de palabras reservadas */

/* Area de Expresiones regulares */
[0-9]+("."[0-9]+)       %{ return 'DECIMAL'; %}
[a-zA-Z_][a-zA-Z0-9_]*  %{ return 'IDENTIFICADOR'; %}
[0-9]+                  %{ return 'ENTERO'; %}
"false"|"true"          %{ return 'BOLEANO'; %}
\"[^\"]*\"              %{ return 'CADENA'; %}
\'[^\'']\'              %{ return 'CARACTER'; %}

/* Area de Simbolo */
"+"                     %{ return '+'; %}
"-"                     %{ return '-'; %}
"*"                     %{ return '*'; %}
"/"                     %{ return '/'; %}
"%"                     %{ return '%'; %}


/* Area de Ignorar */
(\s|\t|\r)              %{  %}
\/\/.*                  %{  %}
\/\*[^\*]*\*\/          %{  %}

/* Area de Fin de Cadena */
<<EOF>>         { return 'EOF'; }

/lex

/* Precedencia */
%left '+' '-'
%left '*' '/' '%'
%left UMINUS

%start inicio

%%

/* Gramatica */
inicio: expresion EOF
    {
        contador++
        nodo = new SintacticNode('Root', 'Root', [$1], contador)
        $$ = $1
        return $$
    }
    ;

expresion: expresion '+' expresion
    {
        contador++
        nodo = new SintacticNode('SUM', 'SUM', [$1, $3], contador)
        $$ = nodo
    }
    | expresion '-' expresion
    {
        contador++
        nodo = new SintacticNode('SUBSTRACTION', 'SUBSTRACTION', [$1, $3], contador)
        $$ = nodo
    }
    | dato
    {
        $$ = $1
    }
    ;

dato: ENTERO
    {
        contador++
        hijo = new SintacticNode($1, $1, contador)
        contador++
        nodo = new SintacticNode('Primitive', 'INT', [hijo], contador)
        $$ = nodo
    }
    | CADENA
    {
        contador++
        hijo = new SintacticNode($1, $1, contador)
        contador++
        nodo = new SintacticNode('Primitive', 'STRING', [hijo], contador)
        $$ = nodo
    }
    | BOLEANO
    {
        contador++
        hijo = new SintacticNode($1, $1, contador)
        contador++
        nodo = new SintacticNode('Primitive', 'BOOLEAN', [hijo], contador)
        $$ = nodo
    }
    | CARACTER
    {
        contador++
        hijo = new SintacticNode($1, $1, contador)
        contador++
        nodo = new SintacticNode('Primitive', 'CHARACTER', [hijo], contador)
        $$ = nodo
    }
    | DECIMAL
    {
        contador++
        hijo = new SintacticNode($1, $1, contador)
        contador++
        nodo = new SintacticNode('Primitive', 'DOUBLE', [hijo], contador)
        $$ = nodo
    }
    | IDENTIFICADOR
    {
        contador++
        nodo = new SintacticNode('ID', 'ID', [$1], contador)
        $$ = nodo
    }
    ;