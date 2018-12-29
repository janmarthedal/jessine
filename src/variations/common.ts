import { Game } from "../board";
import { Move, generateMoves, makeMove, unmakeMove } from "../moves";

export function generateLegalMoves(board: Game): Array<Move> {
    return generateMoves(board).filter(move => {
        const legalMove = makeMove(board, move);
        if (legalMove) {
            unmakeMove(board, move);
            return true;
        }
        return false;
    });
}
