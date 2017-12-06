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

// Total distance is steps out to the layer + distance from the nearest midpoint
const distance = square => {
    let length = 1;
    let layer = 0;
    while (length ** 2 < square) {
        length += 2;
        layer += 1;
    }

    const midpoints = [1, 3, 5, 7].map(d => (length ** 2) - (layer * d));
    const deltas = midpoints.map(mid => Math.abs(mid - square));

    return layer + Math.min(...deltas);
};

const cases = [1, 2, 9, 12, 23, 1024];
// cases.forEach(square => console.log(square, distance(square)));

input = 289326;
console.log('Part 1:', distance(input));

