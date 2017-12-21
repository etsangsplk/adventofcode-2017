// --- Day 18: Duet ---
// http://adventofcode.com/2017/day/18

// snd X plays a sound with a frequency equal to the value of X.
// set X Y sets register X to the value of Y.
// add X Y increases register X by the value of Y.
// mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
// mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
// rcv X recovers the frequency of the last sound played, but only when the value of X is not zero. (If it is zero, the command does nothing.)
// jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)

// prettier-ignore
const input =
`set i 31
set a 1
mul p 17
jgz p p
mul a 2
add i -1
jgz i -2
add a -1
set i 127
set p 952
mul p 8505
mod p a
mul p 129749
add p 12345
mod p a
set b p
mod b 10000
snd b
add i -1
jgz i -9
jgz a 3
rcv b
jgz b -1
set f 0
set i 126
rcv a
rcv b
set p a
mul p -1
add p b
jgz p 4
snd a
set a b
jgz 1 3
snd b
set f 1
add i -1
jgz i -11
snd a
jgz f -16
jgz a -19`;

const registers = 'abcdefghijklmnopqrstuvwxyz'.split('').reduce((all, reg) => {
    all[reg] = 0;
    return all;
}, {});

const numberOrString = str => {
    const num = parseInt(str, 10);
    return Number.isNaN(num) ? str : num;
};

const parse = input => {
    return input.split('\n').map(line => {
        const match = line.split(' ');
        return {
            op: match[0],
            reg: match[1],
            value: numberOrString(match[2]),
        };
    });
};

const run = instructions => {
    let played = null;
    let counter = 0;
    let i = 0;

    while (i < instructions.length) {
        counter++;
        let { op, reg, value } = instructions[i];
        if (typeof value === 'string') {
            // console.log('converting', value, ': ', registers[value]);
            value = registers[value];
        }
        // console.log('trace:', counter, i, registers['a'], instructions[i]);

        if (op === 'set') registers[reg] = value;
        if (op === 'add') registers[reg] = registers[reg] + value;
        if (op === 'mul') registers[reg] = registers[reg] * value;
        if (op === 'mod') registers[reg] = registers[reg] % value;
        if (op === 'snd') played = registers[reg];
        if (op === 'rcv' && registers[reg] !== 0) {
            console.log('played:', played);
            break;
        }
        if (op === 'jgz' && registers[reg] > 0) {
            i += value;
            continue;
        }
        i++;
    }
};

// prettier-ignore
const testInput =
`set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`;

// const testInstructions = parse(testInput);
// console.log(testInstructions);
// run(testInstructions); // played: 4

const instructions = parse(input);
run(instructions);
