## Precedencia
left 'tk_concat' 'tk_repeat' 'tk_dot'
left 'tk_ternary'
left 'tk_or'
left 'tk_and'
left 'tk_double_equal', 'tk_not_equal'
left 'tk_greater_equal', 'tk_less_equal', 'tk_less', 'tk_greater'
left 'tk_plus' 'tk_minus'
left 'tk_times' 'tk_division' 'tk_mod'
left 'tk_pow'
right 'tk_double_plus' 'tk_double_minus'
left UMINUS
right 'tk_not' 

## Producciones
pr_init     ::= pr_globals EOF 

pr_globals ::= pr_globals pr_global | pr_globals pr_main  | pr_global  | pr_main 

pr_main ::= tk_void tk_main tk_par_o tk_par_c tk_cbra_o pr_instructions tk_cbra_c

pr_global ::= pr_declaration_function  | pr_declaration_list tk_semicolon  | pr_declaration_struct tk_semicolon  | pr_declaration_array tk_semicolon 


pr_declaration_function ::= pr_type tk_id tk_par_o pr_params tk_par_c tk_cbra_o pr_instructions tk_cbra_c  | pr_type tk_id tk_par_o tk_par_c tk_cbra_o pr_instructions tk_cbra_

pr_params ::= pr_params tk_comma pr_type tk_id  | pr_type tk_id 

pr_declaration_list ::= pr_declaration_list tk_comma pr_declaration_item | pr_type pr_declaration_item 

pr_declaration_item ::= tk_id tk_equal pr_expr  | tk_id 

pr_declaration_struct ::= tk_struct tk_id tk_cbra_o pr_params tk_cbra_c 

pr_type ::= tk_integer_type  | tk_double_type  | tk_string_type  | tk_boolean_type  | tk_char_type  | tk_void 


pr_instructions ::= pr_instructions pr_instruction  | pr_instruction 

pr_instruction  ::= pr_if  | pr_switch  | pr_while  | pr_do  | pr_for  | tk_id tk_id tk_equal tk_id tk_par_o pr_expression_list tk_par_c tk_semicolon | pr_unary_instruction tk_semicolon  | pr_assignation tk_semicolon  | pr_call tk_semicolon  | pr_declaration_list tk_semicolon  | pr_declaration_struct tk_semicolon  | pr_declaration_array tk_semicolon  | tk_break tk_semicolon | tk_continue tk_semicolon  | tk_return pr_expr tk_semicolon | pr_print tk_semicolon  | pr_native_function tk_semicolon  | pr_array_native_function tk_semicolon 

pr_array_native_function  ::= pr_expr tk_dot tk_push tk_par_o pr_expr tk_par_c | pr_expr tk_dot tk_pop tk_par_o tk_par_c

pr_declaration_array  ::= pr_type tk_id tk_bra_o tk_bra_c  | pr_type tk_bra_o tk_bra_c tk_id  | pr_type tk_id tk_bra_o tk_bra_c tk_equal pr_array  | pr_type tk_bra_o tk_bra_c tk_id tk_equal pr_array | pr_type tk_id tk_bra_o tk_bra_c tk_equal tk_hash pr_expr | pr_type tk_bra_o tk_bra_c tk_id tk_equal tk_hash pr_expr 

pr_array_list ::= pr_array_list tk_comma pr_array  | pr_array 

pr_array  ::= tk_bra_o pr_expression_list tk_bra_c  | tk_bra_o pr_array_list tk_bra_c 

pr_unary_instruction  ::= tk_id tk_double_plus  | tk_id tk_double_minus

pr_print ::= tk_print tk_par_o pr_expression_list tk_par_c  | tk_println tk_par_o pr_expression_list tk_par_c

pr_native_function ::= pr_type tk_dot tk_parse tk_par_o pr_expr tk_par_c  | pr_native_function_option tk_par_o pr_expr tk_par_c

pr_native_function_option ::= tk_to_int  | tk_to_double  | tk_string_func  | tk_typeof 

pr_assignation ::= tk_id tk_equal pr_expr | tk_id pr_index_list tk_equal pr_expr 

pr_access ::= pr_access tk_dot tk_id | pr_access tk_bra_o pr_expr tk_bra_c |  tk_id | tk_bra_o pr_expr tk_bra_c

pr_call ::= tk_id tk_par_o pr_expression_list tk_par_c  | tk_id tk_par_o tk_par_c

pr_expression_list ::= pr_expression_list tk_comma pr_expr  | pr_expr 

pr_for ::= tk_for tk_par_o pr_declaration_list tk_semicolon pr_expr tk_semicolon pr_unary_instruction tk_par_c tk_cbra_o pr_instructions tk_cbra_c  | tk_for tk_par_o pr_assignation tk_semicolon pr_expr tk_semicolon pr_unary_instruction tk_par_c tk_cbra_o pr_instructions tk_cbra_c  

pr_while ::= tk_while tk_par_o pr_expr tk_par_c tk_cbra_o pr_instructions tk_cbra_c 


pr_do ::= tk_do tk_cbra_o pr_instructions tk_cbra_c tk_while tk_par_o pr_expr tk_par_c tk_semicolon 


pr_switch ::= tk_switch tk_par_o pr_expr tk_par_c tk_cbra_o pr_cases tk_cbra_c

pr_cases ::= pr_cases pr_case  | pr_case 

pr_case ::= tk_case pr_expr tk_colon pr_instructions  | tk_default tk_colon pr_instructions 

pr_if ::= tk_if tk_par_o pr_expr tk_par_c tk_cbra_o pr_instructions tk_cbra_c pr_else  | tk_if tk_par_o pr_expr tk_par_c tk_cbra_o pr_instructions tk_cbra_c

pr_else ::= tk_else tk_cbra_o pr_instructions tk_cbra_c | tk_else pr_if 

pr_expr ::= pr_expr tk_plus pr_expr  | pr_expr tk_minus pr_expr  | pr_expr tk_times pr_expr  | pr_expr tk_division pr_expr  | pr_expr tk_mod pr_expr  | tk_power tk_par_o pr_expr tk_comma pr_expr tk_par_c  | tk_sqrt tk_par_o pr_expr tk_par_c  | tk_sin tk_par_o pr_expr tk_par_c | tk_cos tk_par_o pr_expr tk_par_c  | tk_tan tk_par_o pr_expr tk_par_c | tk_log10 tk_par_o pr_expr tk_par_c | pr_expr tk_less_equal pr_expr  | pr_expr tk_greater_equal pr_expr | pr_expr tk_double_equal pr_expr  | pr_expr tk_not_equal pr_expr  | pr_expr tk_greater pr_expr  | pr_expr tk_less pr_expr  | pr_expr tk_and pr_expr  | pr_expr tk_or pr_expr  | pr_expr tk_dot tk_length tk_par_o tk_par_c | pr_expr tk_dot tk_uppercase tk_par_o tk_par_c  | pr_expr tk_dot tk_lowercase tk_par_o tk_par_c  | pr_expr tk_concat pr_expr | pr_expr tk_repeat pr_expr  | pr_expr tk_dot tk_position tk_par_o pr_expr tk_par_c  | pr_expr tk_dot tk_substring tk_par_o pr_expr tk_comma pr_expr tk_par_c  | pr_expr tk_ternary pr_expr tk_colon pr_expr  | pr_native_function  | pr_call  | pr_unary  | pr_expr tk_dot tk_id  | tk_id  | tk_id tk_hash  | tk_id pr_index_list  | pr_array_native_function

pr_index_list  ::= pr_index_list tk_bra_o pr_array_range tk_bra_c  | tk_bra_o pr_array_range tk_bra_c 

pr_array_range ::= pr_expr  | tk_begin tk_colon pr_expr  | pr_expr tk_colon tk_end  | pr_expr tk_colon pr_expr 

pr_unary ::= tk_not pr_unary  | pr_native  | tk_par_o pr_expr tk_par_c 

pr_native ::= tk_float  | tk_string  | tk_null  | tk_char  | tk_int | tk_bool 
