import { Board } from "../board";
import { generateLegalMoves } from "./common";

export function go(board: Board, debug: (msg: string) => void) {
    const moves = generateLegalMoves(board);
    if (moves.length === 0) {
        debug('goRandom: no legal moves');
        return null;
    }
    return moves[Math.floor(moves.length * Math.random())];
}
