import { perft } from './perft';

// const count = perft('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0', 3);
const count = perft('8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0', 4);
// const count = perft('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0', 1);

console.log(count);
