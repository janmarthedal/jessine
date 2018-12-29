import {
    Board, PAWN, WHITE, BLACK, BOARD_INDEX_TURN, BISHOP, KNIGHT, ROOK, QUEEN,
    BOARD_INDEX_WHITE_KING, BOARD_INDEX_BLACK_KING
} from "../board";
import { Move, makeMove, unmakeMove, generateMoves, isAttackedBy } from "../moves";

const PAWN_VALUE = 100;
const BISHOP_VALUE = 300;
const KNIGHT_VALUE = 300;
const ROOK_VALUE = 500;
const QUEEN_VALUE = 900;

function evaluateBoard(board: Board, side: number): number {
    let pos = 21;
    let value = 0;
    for (let r = 8; r >= 1; r--) {
        for (let c = 1; c <= 8; c++) {
            switch (board[pos]) {
                case PAWN | WHITE:
                    value += PAWN_VALUE;
                    break;
                case PAWN | BLACK:
                    value -= PAWN_VALUE;
                    break;
                case BISHOP | WHITE:
                    value += BISHOP_VALUE;
                    break;
                case BISHOP | BLACK:
                    value -= BISHOP_VALUE;
                    break;
                case KNIGHT | WHITE:
                    value += KNIGHT_VALUE;
                    break;
                case KNIGHT | BLACK:
                    value -= KNIGHT_VALUE;
                    break;
                case ROOK | WHITE:
                    value += ROOK_VALUE;
                    break;
                case ROOK | BLACK:
                    value -= ROOK_VALUE;
                    break;
                case QUEEN | WHITE:
                    value += QUEEN_VALUE;
                    break;
                case QUEEN | BLACK:
                    value -= QUEEN_VALUE;
                    break;
            }
            pos++;
        }
        pos += 2;
    }
    return side === WHITE ? value : -value;
}

function search(board: Board, depth: number): number {
    const turn = board[BOARD_INDEX_TURN];
    if (depth === 0) {
        return evaluateBoard(board, turn);
    } else {
        const scores: Array<number> = [];
        for (const move of generateMoves(board)) {
            const legalMove = makeMove(board, move);
            if (legalMove) {
                const score = -search(board, depth - 1);
                scores.push(score);
                unmakeMove(board, move);
            }
        }
        if (scores.length === 0) {
            // draw or mate?
            const kingPosition = board[turn === WHITE ? BOARD_INDEX_WHITE_KING : BOARD_INDEX_BLACK_KING];
            const opponent = turn === WHITE ? BLACK : WHITE;
            return isAttackedBy(board, kingPosition, opponent) ? -1000000 : 0;
        }
        return Math.max(...scores);
    }
}

export function create(depth: number, debug: (msg: string) => void) {
    return (board: Board): Move => {
        const moves: Array<{ move: Move, score: number }> = [];
        for (const move of generateMoves(board)) {
            const legalMove = makeMove(board, move);
            if (legalMove) {
                const score = -search(board, depth - 1);
                unmakeMove(board, move);
                moves.push({ move, score });
            }
        }
        if (moves.length === 0) {
            debug('go material: no moves');
            return null;
        }
        const bestScore = Math.max(...moves.map(ms => ms.score));
        debug('best score: ' + bestScore);
        const bestMoves = moves.filter(ms => ms.score === bestScore);
        return bestMoves[Math.floor(bestMoves.length * Math.random())].move;
    };
}
