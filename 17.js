// --- Day 17: Spinlock ---
// http://adventofcode.com/2017/day/17

const print = (buffer, pos, start = 0, length) => {
    const end = length ? start + length : buffer.length;
    for (let i = start; i < end; i++) {
        if (i === pos) {
            process.stdout.write('(' + buffer[i] + ') ');
        } else {
            process.stdout.write(buffer[i] + ' ');
        }
    }
    process.stdout.write('\n');
};

const insert = (buffer, pos, value) => {
    buffer.splice(pos, 0, value);
};

const loop = (buffer, dist, times, doInsert = true) => {
    const inserted = [];
    let pos = 0;
    let len = 1;
    for (let i = 1; i < times + 1; i++, len++) {
        pos = (pos + dist) % len + 1;
        if (doInsert) insert(buffer, pos, i);
        if (pos === 1) inserted.push(i);
    }
    return {
        pos,
        len,
        inserted,
    };
};

// test
// 0 (9) 5 7 2 4 3 8 6 1
// const buffer1 = [0];
// const r1 = loop(buffer1, 3, 9);
// print(buffer1, r1.pos);
// 1512 1134 151 (2017) 638 1513 851
// const buffer2 = [0];
// const r2 = loop(buffer2, 3, 2017);
// print(buffer2, r2.pos, r2.pos - 3, 7);

// Part 1
const buffer = [0];
const result = loop(buffer, 324, 2017); // 1306
console.log('Part 1');
print(buffer, result.pos, result.pos - 3, 7);
print(buffer, result.pos, 0, 7);

// Part 2
const result2 = loop([], 324, 50000000, false); // 20430489
console.log('Part 2', result2.inserted.slice(-1));
