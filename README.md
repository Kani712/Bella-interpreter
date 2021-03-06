# Bella Semantics and Interpreter

Bella is a simple programming language designed in a Programming Language Semantics class.

## Example

```
let x = 3;
while x < 10 {
  print x;
  x = x + 2;
}
```

This program outputs 3 5 7 9

## Abstract Syntax

```
p: Prog
c: Cond
e: Exp
s: Stmt
i: Ide
n: Numeral

Prog ::= s*
Exp  ::= n | i | e + e | e - e | e * e | e / e
      |  e ** e | - e | i e* | c ? e1 : e2
Cond ::= true | false | ~ c | c && c | c || c
      |  e == e | e != e | e < e | e <= e
      |  e > e | e >= e
Stmt ::= let i e | i = e | while c s* | print e
      |  fun i i* e
```

## Denotational Semantics

```
type File = Num*
type Memory = Ide -> Num
type State = Memory x File

P: Prog -> File
E: Exp -> Memory -> Num
S: Stmt -> State -> State
C: Cond -> Memory -> Bool

P [[s*]] = S*[[s*]] ({}, [])

S [[let i e]] (m,o) = m[i]
S [[fun i i* e]] (m,o) = (m[i*, e], o)
S [[i = e]] (m,o) = (m[E[[e]] m/i], o)
S [[print e]] (m,o) = (m, o + E[[e]] m)
S [[while c do s*]] (m,o) = if C[[c]] m = F then (m, o) else (S [[while c do ]]) ([[s*]] (m, o))

E [[n]] m = n
E [[i]] m = m i
E [[e1 + e2]] m = E [[e1]] m + E [[e2]] m
E [[e1 - e2]] m = E [[e1]] m - E [[e2]] m
E [[e1 * e2]] m = E [[e1]] m * E [[e2]] m
E [[e1 / e2]] m = E [[e1]] m / E [[e2]] m
E [[e1 % e2]] m = E [[e1]] m % E [[e2]] m
E [[e1 ** e2]] m = E [[e1]] m ** E [[e2]] m
E [[- e]] m = - E [[e]] m
E [[i e*]] m = let (p*, e) = m(f) m E[[e]] m[E[ai] / pi]]i
E [[c ? e1 : e2]] m = if C[[c]]m = T then E[[e1]] m else E[[e2]] m

C [[true]] m = T
C [[false]] m = F
C [[e1 == e2]] m = E [[e1]] m = E [[e2]] m
C [[e1 != e2]] m = not (E [[e1]] m = E [[e2]] m)
C [[e1 < e2]] m = E [[e1]] m < E [[e2]] m
C [[e1 <= e2]] m = E [[e1]] m <= E [[e2]] m
C [[e1 > e2]] m = E [[e1]] m > E [[e2]] m
C [[e1 >= e2]] m = E [[e1]] m >= E [[e2]] m
C [[~c]] m = not (C [[c]] m)
C [[c1 && c2]] m = if C [[c1]] m then C [[c2]] m else F
C [[c1 || c2]] m = if C [[c1]] m then T else C [[c2]] m
```

## Using the Interpreter

```
console.log(interpret(program([vardec("x", 2), print("x")])))

console.log(
    interpret(
        program([
            vardec("x", 3),
            whileLoop(less("x", 10), [print("x"), assign("x", plus("x", 2))]),
        ])
    ));

console.log(
    interpret(
        program([
            fundec("multiply", ["a", "b"], times("a", "b")),
            vardec("x", 3),
            vardec("y", plus("x", 10)),
            assign("x", 20),
            print(remainder('x', 'y')),
            print(power('x', 2)),
            print(ternary(greater(10, 2), true, false)),
            print(call("multiply", [10, 5])),
            print("x"),
            print("y"),
        ])
    )
);
```

## Expected output

```

[ 2 ]
[ 3, 5, 7, 9 ]
[ 7, 400, true, 50, 20, 13 ]

```