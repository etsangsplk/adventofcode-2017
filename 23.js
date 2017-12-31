// --- Day 23: Coprocessor Conflagration ---
// https://adventofcode.com/2017/day/23

// set X Y - sets register X to the value of Y.
// sub X Y - decreases register X by the value of Y.
// mul X Y - sets register X to the result of multiplying the value contained in register X by the
//           value of Y.
// jnz X Y - jumps with an offset of the value of Y, but only if the value of X is not zero. (An
//           offset of 2 skips the next instruction, an offset of -1 jumps to the previous
//           instruction, and so on.)
//
// Only the instructions listed above are used. The eight registers here, named a through h, all
// start at 0.

const registers = [];

const initializeRegisters = () => {
    'abcdefgh'.split('').forEach(r => {
        registers[r] = 0;
    });
};

const input = `
set b 81   // b = 81
set c b    // c = 81
jnz a 2    // if debug {
jnz 1 5
mul b 100
sub b -100000 //  b = 8100 + 100000 = 108100
set c b       //  c = b + 17000 = 125100
sub c -17000  // } end debug
set f 1    // loop 1: f = 1
set d 2    // d = 2
set e 2    // loop 2: e = 2
set g d    // loop 3:
mul g e    //
sub g b    // g = (d * e) - b
jnz g 2    // if b == d * e:
set f 0    //    f = 0
sub e -1   // e++
set g e    //
sub g b    //
jnz g -8   // if b != e: goto loop 3
sub d -1   // d++
set g d    //
sub g b    //
jnz g -13  // if b != d: goto loop 2
jnz f 2    // if f == 0:
sub h -1   //    h++
set g b    //
sub g c    //
jnz g 2    // if b == c:
jnz 1 3    //    exit
sub b -17  // b = b + 17
jnz 1 -23  // goto loop 1
`;

const isPrime = num => {
    const sqrt = Math.sqrt(num);
    for (let i = 2; i <= sqrt; i++) {
        if (num % i === 0) return false;
    }
    return num !== 1;
};

const portedCode = (debug = false) => {
    let mulcount = 0;

    // prettier-ignore
    let b = 81, c = 81, d, e, f, h = 0;

    if (debug) {
        b = b * 100 + 100000;
        c = b + 17000;
    }

    while (true) {
        f = 1;
        d = 2;

        do {
            e = 2;

            do {
                mulcount++;
                if (b === d * e) {
                    f = 0;
                }
                e++;
            } while (b !== e);

            d++;
        } while (b !== d);

        if (f === 0) h++;
        if (b === c) return { h, mulcount };

        b += 17;
    }
};

const portedCodeOptimized = (debug = false) => {
    // prettier-ignore
    let b = 81, c = 81, d, e, h = 0;
    let mulcount = 0;

    if (debug) {
        b = b * 100 + 100000;
        c = b + 17000;
    }

    while (true) {
        if (!isPrime(b)) {
            h++;
        }
        mulcount += (b - 2) * (b - 2);

        if (b === c) return { h, mulcount };

        b += 17;
    }
};

const nonEmpty = str => {
    return str !== undefined && str.length > 0;
};

const maybeInt = str => {
    const val = parseInt(str, 10);
    return isNaN(val) ? str : val;
};

const valueOf = v => {
    return isNaN(v) ? registers[v] : v;
};

const parseLine = line => {
    const [op, reg, value] = line.split(' ');
    return {
        op,
        reg: maybeInt(reg),
        value: maybeInt(value),
    };
};

const parse = input => {
    return input
        .split('\n')
        .filter(nonEmpty)
        .map(parseLine);
};

const run = instructions => {
    const debug = registers['a'] === 1;
    registers['counter'] = 0;
    let pos = 0;

    while (pos < instructions.length) {
        const { op, reg, value } = instructions[pos];

        registers['counter']++;
        if (debug && registers['counter'] > 10000) break;

        if (debug) {
            console.log('\n', pos, registers);
            console.log('   ', instructions[pos]);
        }

        switch (op) {
            case 'set':
                registers[reg] = valueOf(value);
                break;
            case 'sub':
                registers[reg] -= valueOf(value);
                break;
            case 'mul':
                registers[reg] *= valueOf(value);
                registers['mulcount'] = (registers['mulcount'] || 0) + 1;
                break;
            case 'jnz':
                if (valueOf(reg) !== 0) {
                    pos += valueOf(value);
                    continue;
                }
        }

        pos++;
    }
};

// -- Part 1 ----------
console.log('Part 1');
const prog = parse(input);
// console.log(prog);
initializeRegisters();
run(prog);
console.log('mul called:', registers['mulcount']); // 6241
console.log(registers);

// -- Part 2 ----------
console.log('\nPart 2');
console.log(portedCode());
console.log(portedCodeOptimized(false)); // 6241
console.log(portedCodeOptimized(true)); // 909
