// --- Day 14: Disk Defragmentation ---
// https://adventofcode.com/2017/day/14

const { hash } = require('./10');

const range = (start, stop) => {
    const values = [];
    for (let i = start; i < stop; i++) {
        values.push(i);
    }
    return values;
};

const print = (grid, width, height) => {
    range(0, height).forEach(row => {
        const out = [];
        range(0, width).forEach(col => {
            out.push(grid(row, col) ? '#' : '.');
        });
        console.log(out.join(''));
    });
};

const hexToBinary = digit => ('000' + parseInt(digit, 16).toString(2)).slice(-4);

const bits = hashcode => {
    return hashcode
        .split('')
        .map(hexToBinary)
        .join('')
        .split('')
        .map(bit => parseInt(bit, 10));
};

const generateGrid = key => {
    const grid = [];

    range(0, 128).forEach(row => {
        const rowKey = `${key}-${row}`;
        const rowHash = hash(rowKey);
        grid.push(bits(rowHash));
    });

    return (row, col) => grid[row][col];
};

const totalUsed = grid =>
    // prettier-ignore
    range(0, 128).reduce((subTotal, row) => (
        range(0, 128).reduce((total, col) => (
            total + grid(row, col)
        ), subTotal)
    ), 0);

// ##.#.#..-->
// .#.#.#.#
// ....#.#.
// #.#.##.#
// .##.#...
// ##..#..#
// .#...#..
// ##.#.##.-->
// |      |
// V      V

const testKey = 'flqrgnkx';
const testGrid = generateGrid(testKey);
// print(testGrid, 16, 8);
console.log(totalUsed(testGrid)); // 8108

const grid = generateGrid('ugkiagan');
console.log(totalUsed(grid)); // 8292
