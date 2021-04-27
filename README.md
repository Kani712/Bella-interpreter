# Bella Semantics and interpreter
Bella is a prohramming language designed in a Programming language Semantics Class.



## Example
```
let x = 3;
while x < 10 {
    print x;
    x = x + 2;
}
```
This Program outputs 3 5 7 9

## Abstract Syntax

```
p: Prog 
e: Exp 
s: Stmt 
c: Cond 
i: Ide
n: Numeral

Prog ::= s*
Exp  ::= n | i | e + e | e - e | e * e | e / e 
      | e ** e | - e | ( e ) | i e*
      | c ? e1 : e2
Cond ::= true | false | ~ c | c && c | c || c
      |e == e | e != e | e <= e | e >= e 
      |e > e | e < e
Stmt ::=  let i e | i = e | while c s* | print e
      | fun i i* e
```


function gcd(x, y) = y==0 ? x: gcd(y, x%y)


## Denotational Semantics 

```
type File = Num*
type Memeory = Ide -> Num
type State = Memory x File


P: Prog -> Num*
E: Exp -> Memeory -> Num
S: Stmt -> (Memeory x Num*) -> State
C: Cond -> Memeory -> Bool

C [[e1 == e2]] m = E [[e1]] m = E [[e2]] m
C [[e1 != e2]] m = E [[e1]] m != E [[e2]] m
C [[e1 >= e2]] m = E [[e1]] m >= E [[e2]] m
C [[e1 <= e2]] m = E [[e1]] m <= E [[e2]] m
C [[e1 > e2]] m = E [[e1]] m > E [[e2]] m
C [[e1 < e2]] m = E [[e1]] m < E [[e2]] m
C [[true]] m = T
C [[false]] m = F
C [[~c]] m = not C[[c]]m
C [[c1 && c2]] m = if C [[c1]] m then C [[c2]] m else F
C [[c1 || c2]] m = if C [[c1]] m then T
```

## Using the Interpreter for the language Bella

