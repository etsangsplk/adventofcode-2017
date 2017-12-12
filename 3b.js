// --- Day 3: Spiral Memory ---
// http://adventofcode.com/2017/day/3

//  17  16  15  14  13
//  18   5   4   3  12
//  19   6   1   2  11
//  20   7   8   9  10
//  21  22  23 --> ...
//
// For example:
//
// Data from square 1 is carried 0 steps, since it's at the access port.
// Data from square 12 is carried 3 steps, such as: down, left, left.
// Data from square 23 is carried only 2 steps: up twice.
// Data from square 1024 must be carried 31 steps.

// prettier-ignore
const sides = [
    { dx: 0, dy: -1}, // right
    { dx: -1, dy: 0}, // top
    { dx: 0, dy: 1},  // left
    { dx: 1, dy: 0},  // bottom
];

const generate = max => {
    let x = 0;
    let y = 0;
    let length = 1;
    let square = 1;
    const spiral = [null, { x, y, square }];

    while (square < max) {
        x++;
        y++;
        length += 2;
        for (let s = 0; s < 4; s++) {
            for (let i = 0; i < length - 1; i++) {
                x += sides[s].dx;
                y += sides[s].dy;
                square++;
                spiral.push({ x, y, square });
            }
        }
        // console.log(spiral);
        // console.log(square);
    }
    return spiral;
};

// console.log(generate(9));
// console.log(generate(25));

const at = (x, y) => `${x},${y}`;
const sum = list => list.reduce((a, b) => a + b);

const adjacents = (x, y, squares) => {
    const result = [];
    [-1, 0, 1].forEach(dx => {
        [-1, 0, 1].forEach(dy => {
            const square = squares[at(x + dx, y + dy)];
            if (square) {
                result.push(square);
            }
        });
    });
    return result;
};

const stress = max => {
    let x = 0;
    let y = 0;
    let length = 1;
    let value = 1;

    const spiral = {};
    spiral[at(x, y)] = 1;

    while (true) {
        x++;
        y++;
        length += 2;
        for (let s = 0; s < 4; s++) {
            for (let i = 0; i < length - 1; i++) {
                x += sides[s].dx;
                y += sides[s].dy;
                value = sum(adjacents(x, y, spiral));
                spiral[at(x, y)] = value;
                if (value > max) return value;
            }
        }
    }
};

const distance = (spiral, point) => {
    return Math.abs(spiral[point].x) + Math.abs(spiral[point].y);
};

// [
//     1, // 0
//     2, // 1
//     9, // 2
//     12, // 3
//     23, // 2
//     1024, // 31
// ].forEach(square => console.log(square, distance(generate(1024), square)));

// [
//     1, // 2
//     2, // 4
//     25, // 26
//     26, // 54
// ].forEach(max => console.log(max, stress(max)));

const input = 289326;
console.log('Part 1:', distance(generate(input), input)); // 419
console.log('Part 2:', stress(input)); // 295229
