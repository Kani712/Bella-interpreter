function interpret(program) {
    return P(program);
}

const P = (program) => {
    let statements = program.body;
    let w = [{},
        []
    ];
    for (let s of statements) {
        w = S(s)(w);
    }
    return w[1];
};

const S = (statement) => ([memory, output]) => {
    if (statement.constructor === VariableDeclaration) {
        let { variable, initializer } = statement;
        return [
            {...memory, [variable]: E(initializer)([memory, output]) },
            output,
        ];
    } else if (statement.constructor === PrintStatement) {
        let { argument } = statement;
        return [memory, [...output, E(argument)([memory, output])]];
    } else if (statement.constructor === Assignment) {
        const { target, source } = statement;
        return [{...memory, [target]: E(source)([memory, output]) }, output];
    } else if (statement.constructor === WhileStatement) {
        const { test, body } = statement;
        let state = [{...memory },
            [...output]
        ];
        if (C(test)([memory, output])) {
            body.forEach((statement) => {
                state = S(statement)(state);
            });
            return S(statement)(state);
        }
        return [memory, output];
    } else if (statement.constructor === FunctionDeclaration) {
        const { name, parameters, body } = statement;
        return [{...memory, [name]: { parameters, body } }, output];
    }
};

const E = (expression) => (memory) => {
    if (typeof expression === "number") {
        return expression;
    } else if (typeof expression == "string") {
        const i = expression;
        return memory[0][i];
    } else if (typeof expression === "boolean") {
        return expression;
    } else if (expression.constructor === Unary) {
        return -E(expression)(memory);
    } else if (expression.constructor === Binary) {
        const { op, left, right } = expression;
        switch (op) {
            case "+":
                return E(left)(memory) + E(right)(memory);
            case "-":
                return E(left)(memory) - E(right)(memory);
            case "*":
                return E(left)(memory) * E(right)(memory);
            case "/":
                return E(left)(memory) / E(right)(memory);
            case "%":
                return E(left)(memory) % E(right)(memory);
            case "**":
                return E(left)(memory) ** E(right)(memory);
        }
    } else if (expression.constructor === Ternary) {
        const { check, result, alternate } = expression;
        return C(check)(memory) ? E(result)(memory) : E(alternate)(memory);
    } else if (expression.constructor === Call) {
        const { id, args } = expression;
        let param = memory[0][id].parameters;
        for (let i = 0; i < args.length; i++) {
            memory[0][param[i]] = args[i];
        }
        return E(memory[0][id].body)(memory);
    }
};

const C = (condition) => (memory) => {
    if (condition === true) {
        return true;
    } else if (condition === false) {
        return false;
    } else if (condition.constructor === Binary) {
        const { op, left, right } = condition;
        switch (op) {
            case "==":
                return E(left)(memory) === E(right)(memory);
            case "!=":
                return E(left)(memory) !== E(right)(memory);
            case "<":
                return E(left)(memory) < E(right)(memory);
            case "<=":
                return E(left)(memory) <= E(right)(memory);
            case ">":
                return E(left)(memory) >= E(right)(memory);
            case ">=":
                return E(left)(memory) >= E(right)(memory);
            case "&&":
                return C(left)(memory) && C(right)(memory);
            case "||":
                return C(left)(memory) || C(right)(memory);
        }
    } else if (condition.constructor === Unary) {
        const { op, operand } = condition;
        return !C(operand)(memory);
    }
};

class Program {
    constructor(body) {
        this.body = body;
    }
}

class VariableDeclaration {
    constructor(variable, initializer) {
        Object.assign(this, { variable, initializer });
    }
}

class FunctionDeclaration {
    constructor(name, parameters, body) {
        Object.assign(this, { name, parameters, body });
    }
}

class PrintStatement {
    constructor(argument) {
        this.argument = argument;
    }
}

class WhileStatement {
    constructor(test, body) {
        Object.assign(this, { test, body });
    }
}

class Assignment {
    constructor(target, source) {
        Object.assign(this, { target, source });
    }
}

class Binary {
    constructor(op, left, right) {
        Object.assign(this, { op, left, right });
    }
}

class Unary {
    constructor(op, operand) {
        Object.assign(this, { op, operand });
    }
}

class Call {
    constructor(id, args) {
        Object.assign(this, { id, args });
    }
}

class Ternary {
    constructor(check, result, alternate) {
        Object.assign(this, { check, result, alternate });
    }
}

const program = (s) => new Program(s);
const vardec = (i, e) => new VariableDeclaration(i, e);
const assign = (t, s) => new Assignment(t, s);
const fundec = (n, p, b) => new FunctionDeclaration(n, p, b);
const print = (e) => new PrintStatement(e);
const whileLoop = (c, b) => new WhileStatement(c, b);
const plus = (x, y) => new Binary("+", x, y);
const minus = (x, y) => new Binary("-", x, y);
const times = (x, y) => new Binary("*", x, y);
const remainder = (x, y) => new Binary("%", x, y);
const power = (x, y) => new Binary("**", x, y);
const eq = (x, y) => new Binary("==", x, y);
const noteq = (x, y) => new Binary("!=", x, y);
const less = (x, y) => new Binary("<", x, y);
const lesseq = (x, y) => new Binary("<=", x, y);
const greater = (x, y) => new Binary(">", x, y);
const greatereq = (x, y) => new Binary(">=", x, y);
const and = (x, y) => new Binary("&&", x, y);
const or = (x, y) => new Binary("||", x, y);
const call = (i, a) => new Call(i, a);
const ternary = (c, r, a) => new Ternary(c, r, a);

console.log(interpret(program([vardec("x", 2), print("x")])));

console.log(
    interpret(
        program([
            vardec("x", 3),
            whileLoop(less("x", 10), [print("x"), assign("x", plus("x", 2))]),
        ])
    )
);

console.log(
    interpret(
        program([
            fundec("multiply", ["a", "b"], times("a", "b")),
            vardec("x", 3),
            vardec("y", plus("x", 10)),
            assign("x", 20),
            print(remainder("x", "y")),
            print(power("x", 2)),
            print(ternary(greater(10, 2), true, false)),
            print(call("multiply", [10, 5])),
            print("x"),
            print("y"),
        ])
    )
);