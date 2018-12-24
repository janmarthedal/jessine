import { initBoardFromFEN, showBoard } from './board';
import { generateMoves } from './moves';

const b = initBoardFromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
// const b = initBoardFromFEN('rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R');
showBoard(b);

const moves = generateMoves(b);
console.log(moves);
