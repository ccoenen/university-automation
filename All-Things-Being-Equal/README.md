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
