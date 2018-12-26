import {
    Board, WHITE, BLACK, COLOR_MASK, PAWN, EMPTY, PIECE_MASK,
    BISHOP, QUEEN, ROOK, KNIGHT, KING, BOARD_INDEX_TURN, BOARD_INDEX_EP, BOARD_INDEX_PLYS, BOARD_INDEX_CASTLING
} from './board';

// 0: from
// 1: to
// 2: captured
// 3: promoted
// 4-8: board state xor
export type Move = Uint8Array;

const BISHOP_MOVEMENTS = [9, 11, -9, -11];
const KNIGHT_MOVEMENTS = [-21, -19, 19, 21, -12, -8, 8, 12];
const ROOK_MOVEMENTS = [-1, 1, -10, 10];
const KING_MOVEMENTS = [9, 11, -9, -11, -1, 1, -10, 10];

// maximum number of moves of any position: 218 (http://www.talkchess.com/forum3/viewtopic.php?t=61792)

export function generateMoves(board: Board): Array<Move> {
    const thisTurn = board[BOARD_INDEX_TURN];
    const nextTurn = thisTurn === WHITE ? BLACK : WHITE;
    const turnXor = thisTurn ^ nextTurn;
    // const thisCastling = board[BOARD_INDEX_CASTLING];
    const thisEP = board[BOARD_INDEX_EP];
    const thisPlys = board[BOARD_INDEX_PLYS];
    const moveData = new Uint8Array(256 * 8);
    let length = 0;
    let pos = 21, piece: number, basePiece: number;

    function addMove(to: number, nextEP: number, nextPlys: number) {
        const captured = board[to];
        moveData.set([
            pos, to, captured, 0,
            turnXor, 0, thisEP ^ nextEP, thisPlys ^ nextPlys
        ], length);
        length += 8;
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
                                addMove(pos - 10, 0, 0);
                                if (r === 2 && board[pos - 20] === EMPTY) {
                                    addMove(pos - 20, pos - 10, 0);
                                }
                            }
                            if ((board[pos - 11] & COLOR_MASK) === BLACK) {
                                addMove(pos - 11, 0, 0);
                            }
                            if ((board[pos - 9] & COLOR_MASK) === BLACK) {
                                addMove(pos - 9, 0, 0);
                            }
                        } else {
                            if (board[pos + 10] === EMPTY) {
                                addMove(pos + 10, 0, 0);
                                if (r === 7 && board[pos + 20] === EMPTY) {
                                    addMove(pos - 20, pos - 10, 0);
                                }
                            }
                            if ((board[pos + 11] & COLOR_MASK) === WHITE) {
                                addMove(pos + 11, 0, 0);
                            }
                            if ((board[pos + 9] & COLOR_MASK) === WHITE) {
                                addMove(pos + 9, 0, 0);
                            }
                        }
                        break;
                    case BISHOP:
                        for (const delta of BISHOP_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                addMove(to, 0, thisPlys + 1);
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0, 0);
                            }
                        }
                        break;
                    case KNIGHT:
                        for (const delta of KNIGHT_MOVEMENTS) {
                            const to = pos + delta;
                            if (board[to] === EMPTY) {
                                addMove(to, 0, thisPlys + 1);
                            } else if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0, 0);
                            }
                        }
                        break;
                    case ROOK:
                        for (const delta of ROOK_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                addMove(to, 0, thisPlys + 1);
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0, 0);
                            }
                        }
                        break;
                    case QUEEN:
                        for (const delta of KING_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                addMove(to, 0, thisPlys + 1);
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0, 0);
                            }
                        }
                        break;
                    case KING:
                        for (const delta of KING_MOVEMENTS) {
                            const to = pos + delta;
                            if (board[to] === EMPTY) {
                                addMove(to, 0, thisPlys + 1);
                            } else if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0, 0);
                            }
                        }
                        break;
                }
            }
            pos++;
        }
        pos += 2;
    }

    const moves: Array<Move> = [];

    for (let offset = 0; offset < length; offset += 8) {
        moves.push(moveData.subarray(offset, offset + 8));
    }

    return moves;
}

export function makeMove(board: Board, move: Move) {
    const from = move[0];
    const to = move[1];
    // const captured = move[2];
    const promoted = move[3];
    board[to] = promoted || board[from];
    board[from] = EMPTY;
    board[BOARD_INDEX_TURN] ^= move[4];
    board[BOARD_INDEX_CASTLING] ^= move[5];
    board[BOARD_INDEX_EP] ^= move[6];
    board[BOARD_INDEX_PLYS] ^= move[7];
}

export function unmakeMove(board: Board, move: Move) {
    const from = move[0];
    const to = move[1];
    const captured = move[2];
    const promoted = move[3];
    board[BOARD_INDEX_TURN] ^= move[4];
    board[BOARD_INDEX_CASTLING] ^= move[5];
    board[BOARD_INDEX_EP] ^= move[6];
    board[BOARD_INDEX_PLYS] ^= move[7];
    board[from] = promoted ? PAWN | board[BOARD_INDEX_TURN] : board[to];
    board[to] = captured;
}
