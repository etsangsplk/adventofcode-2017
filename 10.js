// --- Day 10: Knot Hash ---
// https://adventofcode.com/2017/day/10

const debug = (list, pos) => {
    const values = list.map((value, idx) => (idx === pos ? `[${value}]` : `${value}`));
    console.log(values.join(' '));
};

const range = (min, max) => {
    const list = [];
    for (let i = min; i < max; i++) {
        list.push(i);
    }
    return list;
};

const swap = (list, a, b) => {
    const tmp = list[a];
    list[a] = list[b];
    list[b] = tmp;
};

const permute = (list, lengths, pos = 0, skip = 0, rounds = 1) => {
    let result = list.slice();

    while (rounds) {
        for (let i = 0; i < lengths.length; i++) {
            // debug(result, pos);
            const length = lengths[i];
            let end = pos + length - 1;
            for (let j = pos; j < end; j++, end--) {
                swap(result, j % list.length, end % list.length);
            }
            pos = (pos + length + skip) % list.length;
            skip++;
            // debug(result, pos);
        }
        rounds--;
    }
    return result;
};

// console.log(permute(range(0, 5), [3, 4, 1, 5]));

const toInt = str => str.split(',').map(num => parseInt(num, 10));
const toAscii = str => str.split('').map(char => char.charCodeAt(0));
const toHex = int => ('0' + int.toString(16)).substr(-2);
const toHexStr = list => list.map(toHex).join('');
const xor = (a, b) => a ^ b;

const densify = list => {
    const result = [];
    while (list.length) {
        result.push(list.splice(0, 16).reduce(xor));
    }
    return result;
};

const hash = str => {
    const suffix = [17, 31, 73, 47, 23];

    const lengths = toAscii(str).concat(suffix);
    const sparseHash = permute(range(0, 256), lengths, 0, 0, 64);
    const denseHash = densify(sparseHash);

    return toHexStr(denseHash);
};

// prettier-ignore
const cases = [
    '',         // a2582a3a0e66e6e86e3812dcb672a272
    'AoC 2017', // 33efeb34ea91902bb2f59c9920caa6cd
    '1,2,3',    // 3efbe78a8d82f29979031a4aa0b16a9d
    '1,2,4',    // 63960835bcdc130f0b66d7ff4f6a5a8e
];

// cases.forEach(str => console.log(hash(str), str));

const input = '106,16,254,226,55,2,1,166,177,247,93,0,255,228,60,36';
// const result = permute(range(0, 256), toInt(input));
// console.log(result.slice(0, 2));
// console.log(result[0] * result[1]); // 11413

console.log(input);
console.log(hash(input)); // 7adfd64c2a03a4968cf708d1b7fd418d
