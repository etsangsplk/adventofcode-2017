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

const loop = (buffer, dist, times) => {
    let pos = 0;
    for (let i = 1; i < times + 1; i++) {
        pos = (pos + dist) % buffer.length + 1;
        insert(buffer, pos, i);
        // print(buffer, pos);
    }
    print(buffer, pos, pos - 3, 7);
};

const buffer = [0];

// test
// 0 (9) 5 7 2 4 3 8 6 1
// loop(buffer, 3, 9);
// 1512 1134 151 (2017) 638 1513 851
// loop(buffer, 3, 2017);

loop(buffer, 324, 2017);
