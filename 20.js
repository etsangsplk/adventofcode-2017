// --- Day 20: Particle Swarm ---
// https://adventofcode.com/2017/day/20

const input = require('./particles');

const nonEmpty = v => {
    return v !== undefined && v.length > 0;
};

const parseXYZ = str => {
    const [x, y, z] = str.split(',').map(v => parseInt(v, 10));
    return { x, y, z };
};

const parseLine = str => {
    const [pos, vel, accel] = str.match(/p=<(.*)>, v=<(.*)>, a=<(.*)>/).slice(1);
    return {
        pos: parseXYZ(pos),
        vel: parseXYZ(vel),
        accel: parseXYZ(accel),
    };
};

const parseInput = input => {
    return input
        .split('\n')
        .filter(nonEmpty)
        .map(parseLine);
};

const applyVelocity = (pos, vel) => {
    return {
        x: pos.x + vel.x,
        y: pos.y + vel.y,
        z: pos.z + vel.z,
    };
};

const endPosition = (pos, vel, accel, ticks) => {
    let newPos = pos;
    let newVel = vel;

    while (ticks--) {
        newVel = endVelocity(newVel, accel);
        newPos = applyVelocity(newPos, newVel);
    }

    return newPos;
};

const endVelocity = (vel, accel, ticks = 1) => {
    return {
        x: vel.x + accel.x * ticks,
        y: vel.y + accel.y * ticks,
        z: vel.z + accel.z * ticks,
    };
};

const update = (start, ticks) => {
    const accel = start.accel;
    const vel = endVelocity(start.vel, accel, ticks);
    const pos = endPosition(start.pos, start.vel, accel, ticks);
    return {
        pos,
        vel,
        accel,
    };
};

const updateAll = (particles, ticks) => {
    return particles.map(p => update(p, ticks));
};

const distance = pos => {
    return Math.abs(pos.x) + Math.abs(pos.y) + Math.abs(pos.z);
};

const xyz = pos => {
    return `${pos.x},${pos.y},${pos.z}`;
};

const format = particle => {
    return `p=<${xyz(particle.pos)}>, v=<${xyz(particle.vel)}>, a=<${xyz(particle.accel)}>`;
};

const sameSign = nums => {
    const sign = Math.sign(nums.slice(0, 1).pop());
    const same = nums.slice(1).every(n => Math.sign(n) === sign);
    // console.log('same?', sign, nums.slice(0, 1), nums.slice(1), same);
    return same;
};

const isStable = particles => {
    return particles.every(p => {
        const { pos, vel, accel } = p;
        const all =
            (sameSign([pos.x, vel.x, accel.x]) || accel.x === 0) &&
            (sameSign([pos.y, vel.y, accel.y]) || accel.y === 0) &&
            (sameSign([pos.z, vel.z, accel.z]) || accel.z === 0);
        // console.log('stable?', all);
        return all;
    });
};

const removeCollided = particles => {
    const positions = {};

    particles.forEach(p => {
        const pos = xyz(p.pos);
        positions[pos] = (positions[pos] || 0) + 1;
    });

    return particles.filter(p => {
        const pos = xyz(p.pos);
        return positions[pos] === 1;
    });
};

const runUntilStable = particles => {
    let tick = 0;
    let state = updateAll(particles, 0);

    while (!isStable(state)) {
        tick++;
        state = updateAll(state, 1);
    }

    return {
        tick,
        particles: state,
    };
};

const runWithCollisions = particles => {
    let tick = 0;
    let state = updateAll(particles, 0);

    while (!isStable(state)) {
        tick++;
        state = updateAll(state, 1);
        state = removeCollided(state);
    }

    return {
        tick,
        particles: state,
    };
};

const findClosest = particles => {
    const distances = particles.map(p => distance(p.pos));
    return distances.reduce((minIdx, dist, idx) => {
        return dist < distances[minIdx] ? idx : minIdx;
    }, 0);
};

const testInput = `
p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>
p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>
`;

// 0
// p=< 3,0,0>, v=< 2,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
// p=< 4,0,0>, v=< 0,0,0>, a=<-2,0,0>                         (0)(1)
// 1
// p=< 4,0,0>, v=< 1,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
// p=< 2,0,0>, v=<-2,0,0>, a=<-2,0,0>                      (1)   (0)
// 2
// p=< 4,0,0>, v=< 0,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
// p=<-2,0,0>, v=<-4,0,0>, a=<-2,0,0>          (1)               (0)
// 3
// p=< 3,0,0>, v=<-1,0,0>, a=<-1,0,0>    -4 -3 -2 -1  0  1  2  3  4
// p=<-8,0,0>, v=<-6,0,0>, a=<-2,0,0>                         (0)

// const testParticles = parseInput(testInput);
// console.log(testParticles);

// [1, 2, 3].forEach(tick => {
//     const endPositions = updateAll(testParticles, tick);
//     console.log(tick);
//     console.log(endPositions.map(format).join('\n'));
// });

// const testResults = runUntilStable(testParticles);
// console.log('STABLE at tick:', testResults.tick);
// console.log(testResults.particles.map(format).join('\n'));
// const testClosest = findClosest(testResults.particles);
// console.log('closest:', testClosest, format(testResults.particles[testClosest]), '\n');

// Part 1
console.log('Part 1 - nearest');
const particles = parseInput(input.particles);
const results = runUntilStable(particles);
console.log('Stable at tick:', results.tick);
const closest = findClosest(results.particles); // 150
console.log(
    'closest:',
    closest,
    distance(results.particles[closest].pos),
    format(results.particles[closest]),
    '\n'
);

// Part 2
console.log('Part 2 - collisions');
const collisionResults = runWithCollisions(particles);
console.log('Done colliding at tick:', collisionResults.tick);
console.log('remaining:', collisionResults.particles.length); //657
