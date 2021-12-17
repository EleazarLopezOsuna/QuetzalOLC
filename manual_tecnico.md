# Manual Tecnico
Javier Monterroso 201700831, Jared Ozuna

## Librerias
### D3 Graphviz
Libreria utilizada para graficar el AST en nuestro proyecto
#### Dependencias
D3.js (o simplemente D3 para documentos basados en datos) es una biblioteca de JavaScript para producir visualizaciones de datos dinámicas e interactivas en navegadores web. Hace uso de los estándares SVG, HTML5 y CSS ampliamente implementados.

Graphviz (abreviatura de Graph Visualization Software) es un paquete de herramientas de código abierto iniciado por AT&T Labs Research para dibujar gráficos especificados en los scripts del lenguaje DOT.

Emscripten es un compilador de fuente a fuente que se ejecuta como back-end del compilador LLVM y produce un subconjunto de JavaScript conocido como asm.js.

Viz.js crea Graphviz con Emscripten y proporciona un contenedor simple para usarlo en el navegador.
### Code Mirror
Libreria utilizada para nuestro editor de codigo
CodeMirror es un editor de texto versátil implementado en JavaScript para el navegador. Está especializado en la edición de código y viene con varios modos de lenguaje y complementos que implementan funciones de edición más avanzadas.
### Browserify
Libreria utilizada para compilar nuestras clases de typescript a javascript

Puede usar browserify para organizar su código y usar bibliotecas de terceros incluso si no usa el propio nodo en ninguna otra capacidad, excepto para empaquetar e instalar paquetes con npm.

El sistema de módulos que utiliza browserify es el mismo que el de node, por lo que los paquetes publicados en npm que originalmente estaban pensados para usarse en el nodo pero no en los navegadores también funcionarán bien en el navegador.

Cada vez más, las personas publican módulos en npm que están diseñados intencionalmente para funcionar tanto en el nodo como en el navegador usando browserify y muchos paquetes en npm están pensados para usarse solo en el navegador. npm es para todos los javascript, tanto frontales como backend.