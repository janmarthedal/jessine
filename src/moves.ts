import {
    Board, WHITE, BLACK, COLOR_MASK, PAWN, EMPTY, PIECE_MASK,
    BISHOP, QUEEN, ROOK, KNIGHT, KING, BOARD_INDEX_TURN, BOARD_INDEX_EP, BOARD_INDEX_PLYS
} from './board';

// 0: from
// 1: to
// 2: captured
// 3: promoted
// 4-8: board state xor
export type Move = Uint8Array;

const PIECE_MOVEMENTS: Array<Array<number>> = [
    [],
    [],                                  // PAWN
    [9, 11, -9, -11],                    // BISHOP
    [-21, -19, 19, 21, -12, -8, 8, 12],  // KNIGHT
    [-1, 1, -10, 10],                    // ROOK
    [9, 11, -9, -11, -1, 1, -10, 10],    // QUEEN
    [9, 11, -9, -11, -1, 1, -10, 10]     // KING
]

export function generateMoves(board: Board): Array<Move> {
    const thisTurn = board[BOARD_INDEX_TURN];
    const nextTurn = thisTurn === WHITE ? BLACK : WHITE;
    // const thisCastling = board[BOARD_INDEX_CASTLING];
    const thisEP = board[BOARD_INDEX_EP];
    const thisPlys = board[BOARD_INDEX_PLYS];
    const moves: Array<Move> = [];
    let pos = 21, piece: number, basePiece: number;

    function addMove(to: number, nextEP: number) {
        const captured = board[to];
        const nextPlys = captured !== EMPTY || basePiece === PAWN ? 0 : thisPlys + 1;
        moves.push(new Uint8Array([
            pos,
            to,
            captured,
            0,
            thisTurn ^ nextTurn,
            0,
            thisEP ^ nextEP,
            thisPlys ^ nextPlys    
        ]));
    }

    for (let r = 8; r >= 1; r--) {
        for (let c = 1; c <= 8; c++) {
            piece = board[pos];
            basePiece = piece & PIECE_MASK;
            if ((piece & COLOR_MASK) === thisTurn) {
                switch (basePiece) {
                    case PAWN:
                        if (thisTurn === WHITE) {
                            if (board[pos - 10] === EMPTY) {
                                addMove(pos - 10, 0);
                                if (r === 2 && board[pos - 20] === EMPTY) {
                                    addMove(pos - 20, pos - 10);
                                }
                            }
                            if ((board[pos - 11] & COLOR_MASK) === BLACK) {
                                addMove(pos - 11, 0);
                            }
                            if ((board[pos - 9] & COLOR_MASK) === BLACK) {
                                addMove(pos - 9, 0);
                            }
                        } else {
                            if (board[pos + 10] === EMPTY) {
                                addMove(pos + 10, 0);
                                if (r === 7 && board[pos + 20] === EMPTY) {
                                    addMove(pos + 20, pos + 10);
                                }
                            }
                            if ((board[pos + 11] & COLOR_MASK) === WHITE) {
                                addMove(pos + 11, 0);
                            }
                            if ((board[pos + 9] & COLOR_MASK) === WHITE) {
                                addMove(pos + 9, 0);
                            }
                        }
                    case BISHOP:
                    case ROOK:
                    case QUEEN:
                        {
                            const movements = PIECE_MOVEMENTS[basePiece];
                            for (const delta of movements) {
                                let to = pos + delta;
                                while (board[to] === EMPTY) {
                                    addMove(to, 0);
                                    to += delta;
                                }
                                if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMove(to, 0);
                                }
                            }
                        }
                        break;
                    case KNIGHT:
                    case KING:
                        {
                            const movements = PIECE_MOVEMENTS[basePiece];
                            for (const delta of movements) {
                                const to = pos + delta;
                                if (board[to] === EMPTY || (board[to] & COLOR_MASK) === nextTurn) {
                                    addMove(to, 0);
                                }
                            }
                        }
                        break;
                }
            }
            pos++;
        }
        pos += 2;
    }

    return moves;
}