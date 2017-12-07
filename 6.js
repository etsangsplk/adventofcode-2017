// --- Day 6: Memory Reallocation ---
// https://adventofcode.com/2017/day/6

const max = list => {
    let maxIdx = 0;
    let maxValue = -1;
    for (let i = 0; i < list.length; i++) {
        if (list[i] > maxValue) {
            maxValue = list[i];
            maxIdx = i;
        }
    }
    return maxIdx;
};

const rebalance = banks => {
    const seen = {};
    let cycle = 0;

    while (true) {
        cycle++;
        let pos = max(banks);
        let blocks = banks[pos];
        banks[pos] = 0;
        while (blocks) {
            pos = (pos + 1) % banks.length;
            banks[pos] = banks[pos] + 1;
            blocks--;
        }
        // console.log(cycle, banks);
        const config = banks.join(',');
        if (seen[config]) {
            return { cycle, length: cycle - seen[config] };
        }
        seen[config] = cycle;
    }
};

const test = [0, 2, 7, 0];
// console.log(rebalance(test));

const input = [11, 11, 13, 7, 0, 15, 5, 5, 4, 4, 1, 1, 7, 1, 15, 11];
console.log(rebalance(input)); // { cycle: 4074, length: 2793 }
