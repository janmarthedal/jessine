import { Game } from "../board";
import { generateLegalMoves } from "./common";
import { Move } from "../moves";

export function create(debug: (msg: string) => void) {
    return (board: Game): Move => {
        const moves = generateLegalMoves(board);
        if (moves.length === 0) {
            debug('goRandom: no legal moves');
            return null;
        }
        return moves[Math.floor(moves.length * Math.random())];
    };
}
