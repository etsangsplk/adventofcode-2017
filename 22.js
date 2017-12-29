// --- Day 22: Sporifica Virus ---
// https://adventofcode.com/2017/day/22

const WEAKENED = 1;
const INFECTED = 2;
const FLAGGED = 3;

const nonEmpty = str => {
    return str !== undefined && str.length > 0;
};

const cellForStatus = status => {
    if (status === WEAKENED) return 'W';
    if (status === INFECTED) return '#';
    if (status === FLAGGED) return 'F';
    return '.';
};

const print = (map, pos = { x: 0, y: 0 }, size) => {
    const top = pos.y - (size - 1) / 2;
    const bottom = pos.y + (size - 1) / 2;
    const left = pos.x - (size - 1) / 2;
    const right = pos.x + (size - 1) / 2;

    for (let y = top; y <= bottom; y++) {
        let line = '';
        for (let x = left; x <= right; x++) {
            const cell = cellForStatus(map[at(x, y)]);
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
                map[at(x, y)] = INFECTED;
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
        newMap[at(pos.x, pos.y)] = INFECTED;
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

const tick2 = ({ map, pos, infected }) => {
    const newMap = map;
    let newPos = pos;

    if (map[at(pos.x, pos.y)] === undefined) {
        newMap[at(pos.x, pos.y)] = WEAKENED;
        newPos.direction = (pos.direction + 3) % 4; // turn left
    } else if (map[at(pos.x, pos.y)] === WEAKENED) {
        newMap[at(pos.x, pos.y)] = INFECTED;
        infected += 1;
    } else if (map[at(pos.x, pos.y)] === INFECTED) {
        newMap[at(pos.x, pos.y)] = FLAGGED;
        newPos.direction = (pos.direction + 1) % 4; // turn right
    } else if (map[at(pos.x, pos.y)] === FLAGGED) {
        delete newMap[at(pos.x, pos.y)];
        newPos.direction = (pos.direction + 2) % 4; // reverse
    }

    newPos = move(newPos);

    return {
        map: newMap,
        pos: newPos,
        infected,
    };
};

const run = (state, ticks, ticker = tick) => {
    let newState = state;
    while (ticks--) {
        newState = ticker(newState);
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

const testInput = `
..#
#..
...
`;

// -- Tests -----------
const tests = ticker => {
    const testMap = parse(testInput);
    // print(testMap, -2, -2, 2, 2);

    let testState = { map: testMap, pos: { x: 0, y: 0, direction: 0 }, infected: 0 };
    print(testState.map, testState.pos, 9);

    // run first 7 cycles
    for (let cycle = 1; cycle < 8; cycle++) {
        console.log(cycle);
        testState = run(testState, 1, ticker);
        print(testState.map, testState.pos, 9);
    }
    console.log('infected:', testState.infected, '\n'); // 5

    // continue to 70 cycles
    for (let cycle = 7; cycle < 70; cycle++) {
        testState = run(testState, 1, ticker);
    }
    print(testState.map, testState.pos, 9);
    console.log('infected:', testState.infected); // 41
    console.log(
        'position:',
        at(testState.pos.x, testState.pos.y),
        'direction:',
        facing(testState.pos),
        '\n'
    );

    // continue to 70 cycles
    for (let cycle = 70; cycle < 10000; cycle++) {
        testState = run(testState, 1, ticker);
    }
    print(testState.map, testState.pos, 9);
    console.log('infected:', testState.infected); // 5587
    console.log(
        'position:',
        at(testState.pos.x, testState.pos.y),
        'direction:',
        facing(testState.pos),
        '\n'
    );
};
// tests(tick);
// tests(tick2);

const test2 = () => {
    const testMap = parse(testInput);
    let testState = { map: testMap, pos: { x: 0, y: 0, direction: 0 }, infected: 0 };

    for (let cycle = 0; cycle < 100; cycle++) {
        testState = run(testState, 1, tick2);
    }
    print(testState.map, -4, -4, 4, 4, testState.pos);
    console.log('infected:', testState.infected); // 26
    console.log(
        'position:',
        at(testState.pos.x, testState.pos.y),
        'direction:',
        facing(testState.pos),
        '\n'
    );

    for (let cycle = 100; cycle < 10000000; cycle++) {
        testState = run(testState, 1, tick2);
    }
    print(
        testState.map,
        testState.pos.y - 10,
        testState.pos.x - 10,
        testState.pos.y + 10,
        testState.pos.x + 10,
        testState.pos
    );
    console.log('infected:', testState.infected); // 2511944
    console.log(
        'position:',
        at(testState.pos.x, testState.pos.y),
        'direction:',
        facing(testState.pos),
        '\n'
    );
};
// test2();

const runCycles = (cycles, ticker) => {
    const map = parse(input);

    let state = {
        map,
        pos: { x: 0, y: 0, direction: 0 },
        infected: 0,
    };

    while (cycles--) {
        state = run(state, 1, ticker);
    }

    print(state.map, state.pos, 9);
    console.log('infected:', state.infected);
    console.log('position:', at(state.pos.x, state.pos.y), 'direction:', facing(state.pos), '\n');
};

// -- Part 1 ----------
runCycles(10000, tick); // infected: 5433

// -- Part 2 ----------
runCycles(10000000, tick2); // infected: 2512599
