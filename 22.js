// --- Day 22: Sporifica Virus ---
// https://adventofcode.com/2017/day/22

const nonEmpty = str => {
    return str !== undefined && str.length > 0;
};

const print = (map, top, left, bottom, right, pos = { x: 0, y: 0 }) => {
    for (let y = top; y <= bottom; y++) {
        let line = '';
        for (let x = left; x <= right; x++) {
            const cell = map[at(x, y)] ? '#' : '.';
            let pre = ' ';
            if (pos.x === x && pos.y === y) {
                pre = '[';
            } else if (pos.x === x - 1 && pos.y === y) {
                pre = ']';
            }
            line += pre + cell;
        }
        console.log(line);
    }
    console.log();
};

const at = (x, y) => `${x},${y}`;

const facing = pos => {
    if (pos.direction === 0) return 'up';
    if (pos.direction === 1) return 'right';
    if (pos.direction === 2) return 'down';
    if (pos.direction === 3) return 'left';

    return pos.direction;
};

const parse = input => {
    const lines = input.split('\n').filter(nonEmpty);
    const top = (lines.length - 1) / -2;
    const left = (lines[0].length - 1) / -2;
    const map = {};

    lines.forEach((line, dy) => {
        line.split('').forEach((cell, dx) => {
            if (cell === '#') {
                const x = left + dx;
                const y = top + dy;
                map[at(x, y)] = true;
            }
        });
    });

    return map;
};

const move = pos => {
    const newPos = pos;

    if (pos.direction === 0) newPos.y--;
    if (pos.direction === 1) newPos.x++;
    if (pos.direction === 2) newPos.y++;
    if (pos.direction === 3) newPos.x--;

    return newPos;
};

const tick = ({ map, pos, infected }) => {
    const newMap = map;
    let newPos = pos;

    if (map[at(pos.x, pos.y)]) {
        delete newMap[at(pos.x, pos.y)];
        newPos.direction = (pos.direction + 1) % 4; // turn right
    } else {
        newMap[at(pos.x, pos.y)] = true;
        newPos.direction = (pos.direction + 3) % 4; // turn left
        infected += 1;
    }

    newPos = move(newPos);

    return {
        map: newMap,
        pos: newPos,
        infected,
    };
};

const run = (state, ticks) => {
    let newState = state;

    while (ticks--) {
        newState = tick(newState);
    }

    return newState;
};

const input = `
..#..##...##.######.##...
..#...#####..#.#####..#..
...##.#..##.#.##....#...#
#.#.#.#..###...#....##..#
..#..#####.....##..#.#..#
.##.#####.#.....###.#..#.
##..####...#.##.#...##...
###.#.#####...##.#.##..#.
#.##..##.#....#.#..#.##..
###.######......####..#.#
###.....#.##.##.######..#
...####.###.#....#..##.##
#..####.#.....#....###.#.
#..##..#.####.#.##..#.#..
#..#.#.##...#...#####.##.
#.###..#.##.#..##.#######
...###..#..####.####.#.#.
.#..###..###.#....#######
.####..##.#####.#.#..#.#.
#.#....##.....##.##.....#
....####.....#..#.##..##.
######..##..#.###...###..
..##...##.....#..###.###.
##.#.#..##.#.#.##....##.#
.#.###..##..#....#...##.#
`;

// -- Tests -----------
const testInput = `
..#
#..
...
`;

// const testMap = parse(testInput);
// // // print(testMap, -2, -2, 2, 2);

// let testState = run({ map: testMap }, 0);
// print(testState.map, -4, -4, 4, 4, testState.pos);

// // run first 7 cycles
// for (let cycle = 1; cycle < 8; cycle++) {
//     console.log(cycle);
//     testState = run(testState, 1);
//     print(testState.map, -4, -4, 4, 4, testState.pos);
// }
// console.log('infected:', testState.infected, '\n'); // 5

// // continue to 70 cycles
// for (let cycle = 7; cycle < 70; cycle++) {
//     testState = run(testState, 1);
// }
// print(testState.map, -4, -4, 4, 4, testState.pos);
// console.log('infected:', testState.infected); // 41
// console.log(
//     'position:',
//     at(testState.pos.x, testState.pos.y),
//     'direction:',
//     facing(testState.pos),
//     '\n'
// );

// // continue to 70 cycles
// for (let cycle = 70; cycle < 10000; cycle++) {
//     testState = run(testState, 1);
// }
// print(testState.map, -4, -4, 4, 4, testState.pos);
// console.log('infected:', testState.infected); // 5587
// console.log(
//     'position:',
//     at(testState.pos.x, testState.pos.y),
//     'direction:',
//     facing(testState.pos),
//     '\n'
// );

// -- Part 1 ----------
const map = parse(input);
// print(map, -12, -12, 12, 12);

let state = {
    map,
    pos: { x: 0, y: 0, direction: 0 },
    infected: 0,
};

for (let cycle = 1; cycle < 10000; cycle++) {
    state = run(state, 1);
}
print(state.map, 59, 78, 67, 86, state.pos);
console.log('infected:', state.infected); // 5433
console.log('position:', at(state.pos.x, state.pos.y), 'direction:', facing(state.pos), '\n');
