// --- Day 6: Memory Reallocation ---
// https://adventofcode.com/2017/day/6

const maxIndex = list =>
    list.reduce(
        (max, value, index) => (value > max.value ? { value, index } : max),
        { value: -1, index: -1 }
    ).index;

const rebalance = banks => {
    const lastSeen = {};
    let cycle = 1;

    while (true) {
        let pos = maxIndex(banks);
        let blocks = banks[pos];

        banks[pos] = 0;
        while (blocks) {
            pos = (pos + 1) % banks.length;
            banks[pos] = banks[pos] + 1;
            blocks--;
        }
        // console.log(cycle, banks);

        const pattern = banks.join(',');
        if (lastSeen[pattern]) {
            return {
                cycle,
                length: cycle - lastSeen[pattern]
            };
        }

        lastSeen[pattern] = cycle;
        cycle++;
    }
};

const test = [0, 2, 7, 0];
// console.log(rebalance(test));

const input = [11, 11, 13, 7, 0, 15, 5, 5, 4, 4, 1, 1, 7, 1, 15, 11];
console.log(rebalance(input)); // { cycle: 4074, length: 2793 }
