// --- Day 13: Packet Scanners ---
// http://adventofcode.com/2017/day/13

// prettier-ignore
const input =
`0: 3
1: 2
2: 4
4: 4
6: 5
8: 6
10: 8
12: 8
14: 6
16: 6
18: 9
20: 8
22: 6
24: 10
26: 12
28: 8
30: 8
32: 14
34: 12
36: 8
38: 12
40: 12
42: 12
44: 12
46: 12
48: 14
50: 12
52: 12
54: 10
56: 14
58: 12
60: 14
62: 14
64: 14
66: 14
68: 14
70: 14
72: 14
74: 20
78: 14
80: 14
90: 17
96: 18`;

const even = num => !(num % 2);
const maxDepth = layers => layers.reduce((max, b) => Math.max(max, b.depth), 0);

const range = (start, stop) => {
    const values = [];
    for (let i = start; i < stop; i++) {
        values.push(i);
    }
    return values;
};

const initPositions = layers => tick => {
    return layers.map(layer => {
        const max = layer.depth - 1;
        const cycle = Math.floor(tick / max);
        return Object.assign({}, layer, {
            position: even(cycle) ? tick % max : max - tick % max,
        });
    });
};

const parseLayers = str => {
    const layers = [];
    str.split('\n').forEach(layer => {
        const [number, depth] = layer.split(': ');
        layers.push({
            layer: parseInt(number, 10),
            depth: parseInt(depth, 10),
        });
    });
    return layers;
};

const cell = (level, scanner) => {
    if (level >= scanner.depth) return '   ';
    if (scanner.position === level) return '[S]';
    return '[ ]';
};

const initPrinter = layers => positions => {
    const levels = range(0, maxDepth(layers));

    const rows = levels.map(level => {
        let cols = [];
        positions.forEach(scanner => {
            cols.push(cell(level, scanner));
        });
        return cols.join(' ');
    });

    console.log(rows.join('\n') + '\n');
};

const maxLayer = layers => layers.slice(-1).pop().layer;

const calculateTrip = layers => {
    const positionsAt = initPositions(layers);
    // const print = initPrinter(layers);
    const trip = range(0, maxLayer(layers) + 1);

    let total = 0;
    trip.forEach(tick => {
        // print(positionsAt(tick));
        const scanner = positionsAt(tick).find(e => e.layer === tick);
        if (scanner && scanner.position === 0) {
            total += tick * scanner.depth;
        }
    });
    return total;
};

// prettier-ignore
const testInput =
`0: 3
1: 2
4: 4
6: 4`;

// const testLayers = parseLayers(testInput);
// console.log(testLayers);
// const positionsAt = initPositions(testLayers);
// [0, 1, 2, 3, 4, 5, 6, 7].forEach(tick => console.log(positionsAt(tick)));
// const print = initPrinter(testLayers);
// [0, 1, 2, 3, 4, 5, 6, 7].forEach(tick => print(positionsAt(tick)));
// const testSeverity = calculateTrip(testLayers);
// console.log(testSeverity);

const layers = parseLayers(input);
const severity = calculateTrip(layers);
console.log(severity); // 2384
