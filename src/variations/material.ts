import {
    Game, PAWN, WHITE, BLACK, BOARD_INDEX_TURN, BISHOP, KNIGHT, ROOK, QUEEN
} from "../board";
import { Move, makeMove, unmakeMove, generateMoves, isAttackedBy } from "../moves";

const PAWN_VALUE = 100;
const BISHOP_VALUE = 300;
const KNIGHT_VALUE = 300;
const ROOK_VALUE = 500;
const QUEEN_VALUE = 900;

function evaluate(game: Game, side: number): number {
    let pos = 21;
    let value = 0;
    for (let r = 8; r >= 1; r--) {
        for (let c = 1; c <= 8; c++) {
            switch (game.board[pos]) {
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

function search(game: Game, depth: number): number {
    const turn = game.board[BOARD_INDEX_TURN];
    if (depth === 0) {
        return evaluate(game, turn);
    } else {
        const scores: Array<number> = [];
        for (const move of generateMoves(game)) {
            const legalMove = makeMove(game, move);
            if (legalMove) {
                const score = -search(game, depth - 1);
                scores.push(score);
                unmakeMove(game, move);
            }
        }
        if (scores.length === 0) {
            // draw or mate?
            const kingPosition = turn === WHITE ? game.whiteKing : game.blackKing;
            const opponent = turn === WHITE ? BLACK : WHITE;
            return isAttackedBy(game, kingPosition, opponent) ? -1000000 : 0;
        }
        return Math.max(...scores);
    }
}

export function create(depth: number, debug: (msg: string) => void) {
    return (board: Game): Move => {
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
