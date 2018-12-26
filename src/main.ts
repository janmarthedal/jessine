import { initBoardFromFEN, showBoard } from './board';
import { generateMoves } from './moves';

const b = initBoardFromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
// const b = initBoardFromFEN('rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R');
showBoard(b);

const { moves, count } = generateMoves(b);

for (let c = 0; c < count; c++) {
    console.log(moves.subarray(c << 3, (c + 1) << 3));
}
