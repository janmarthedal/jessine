import { Board } from "../board";
import { Move, generateMoves, makeMove, unmakeMove } from "../moves";

export function generateLegalMoves(board: Board): Array<Move> {
    return generateMoves(board).filter(move => {
        const legalMove = makeMove(board, move);
        if (legalMove) {
            unmakeMove(board, move);
            return true;
        }
        return false;
    });
}
