import { perft } from "./perft";

const RUNS = 3;

function runPerft(name: string, fen: string, depth: number, verification: number) {
    const start = Date.now();
    const nodes = perft(fen, depth);
    console.log(`${name} (${depth}) ${Date.now() - start} ms`);
    if (nodes !== verification) {
        console.error('FAIL');
    }
}

const start = Date.now();

for (let run = 0; run < RUNS; run++) {
    runPerft('Initial position', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0', 5, 4865609);
    runPerft('Kiwipete', 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq -', 4, 4085603);
    runPerft('Position 3', '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - -', 5, 674624);
    runPerft('Position 6', 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10', 4, 3894594);
}

console.log(`Total time (${RUNS} runs):`, Date.now() - start, 'ms');
