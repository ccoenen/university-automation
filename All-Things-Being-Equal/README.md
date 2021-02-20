# All things being equal

Take a metric ton of JavaScript and cross-compare every implementation with any
other implementation. This will give you a similarity score for every possible
combination, making identification of copied solutions very simple.

Given a directory with the subdirectories

```
workdir
 ├ A
 ├ B
 ├ C
 └ D
```

You will get the following comparison-triangle:

```
   A  B  C  D
A     *  *  *
B        *  *
C           *
D
```

The score is calculated based on the abstract syntax tree, so white space and
trivial changes are irrelevant. Another score is calculated ignoring names and
numbers, discovering simplistic refactoring like changing variable names.

"S" is for structural differences (variable names are irrelevant)
"L" is for literal differences (variable names and values are relevant)
S will always be smaller than L.

Literal similarity (lack of differences, small number) may point at someone copying verbatim.
Structural similarity (lack of differences, small number) may point at someone copying with slight changes.

You'll also be presented with the number of tokens in the file pair. It is more meant as a measure of complexity of each file. Very dissimilar token counts can't be the same file.


## Usage

### Single report

`node index.js fileA fileB`

### Complete comparison triangle
set path in globme.js (`workdir`)
`node globme.js > output-filename.html`
