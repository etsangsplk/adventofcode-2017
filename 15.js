// --- Day 15: Dueling Generators ---
// https://adventofcode.com/2017/day/15

const range = (start, stop) => {
    const values = [];
    for (let i = start; i < stop; i++) {
        values.push(i);
    }
    return values;
};

const format = value => {
    return ('          ' + value).slice(-10);
};

const generator = (factor, initial) => {
    let prev = initial;
    return () => {
        prev = (prev * factor) % 2147483647;
        return prev;
    };
};

const multipleGenerator = (next, multiple) => {
    return () => {
        let value = next();
        while (value % multiple !== 0) {
            value = next();
        }
        return value;
    };
};

const match = (a, b) => {
    return (a & 0xffff) === (b & 0xffff);
};

//    (16807)     (48271)
// --Gen. A--  --Gen. B--
//    1092455   430625591
// 1181022009  1233683848
//  245556042  1431495498
// 1744312007   137874439
// 1352636452   285222916

// const testgenA = generator(16807, 65);
// const testgenB = generator(48271, 8921);

// console.log(format('A'), format('B'), 'match?');
// for (let i = 0; i < 5; i++) {
//     const a = testgenA();
//     const b = testgenB();
//     console.log(format(a), format(b), match(a, b));
// }

const progress = i => {
    if (i % 100000 === 0) process.stdout.write('.');
};

const countMatches = (genA, genB, iterations) => {
    let total = 0;
    for (let i = 0; i < iterations; i++) {
        if (match(genA(), genB())) {
            total++;
        }
        progress(i);
    }
    return total;
};

// test generators
// const testgenA = generator(16807, 65);
// const testgenB = generator(48271, 8921);
// console.log('\nmatches:', countMatches(testgenA, testgenB, 40000000)); // 588

// const genA = multipleGenerator(generator(16807, 65), 4);
// const genB = multipleGenerator(generator(48271, 8921), 8);
// console.log('\nmatches:', countMatches(genA, genB, 1056)); // first multiples match
// console.log('\nmatches:', countMatches(genA, genB, 5000000)); // 309

// Part 1
const genA = generator(16807, 883);
const genB = generator(48271, 879);
console.log('\nmatches:', countMatches(genA, genB, 40000000)); // 609

// Part 2
const genA2 = multipleGenerator(generator(16807, 883), 4);
const genB2 = multipleGenerator(generator(48271, 879), 8);
console.log('\nmatches:', countMatches(genA2, genB2, 5000000)); // 253
