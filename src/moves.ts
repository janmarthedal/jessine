import {
    Board, WHITE, BLACK, COLOR_MASK, PAWN, EMPTY, PIECE_MASK,
    BISHOP, QUEEN, ROOK, KNIGHT, KING, BOARD_INDEX_TURN, BOARD_INDEX_EP, BOARD_INDEX_PLYS, BOARD_INDEX_CASTLING, BOARD_INDEX_WHITE_KING, BOARD_INDEX_BLACK_KING, posToAlgebraic, CASTLING_QUEEN_WHITE, CASTLING_KING_WHITE, CASTLING_QUEEN_BLACK, CASTLING_KING_BLACK
} from './board';

// 0: from
// 1: to
// 2: captured
// 3: promoted
// 4: castling xor
// 5: EP xor
// 6: ply xor
export type Move = Uint8Array;

const BISHOP_MOVEMENTS = [9, 11, -9, -11];
const KNIGHT_MOVEMENTS = [-21, -19, 19, 21, -12, -8, 8, 12];
const ROOK_MOVEMENTS = [-1, 1, -10, 10];
const KING_MOVEMENTS = [9, 11, -9, -11, -1, 1, -10, 10];

// maximum number of moves of any position: 218 (http://www.talkchess.com/forum3/viewtopic.php?t=61792)

export function generateMoves(board: Board): Array<Move> {
    const thisTurn = board[BOARD_INDEX_TURN];
    const nextTurn = thisTurn === WHITE ? BLACK : WHITE;
    const thisCastling = board[BOARD_INDEX_CASTLING];
    const thisEP = board[BOARD_INDEX_EP];
    const thisPlys = board[BOARD_INDEX_PLYS];
    const moveData = new Uint8Array(256 * 7);
    let length = 0, pos = 21, piece: number, basePiece: number;

    function addMoveBase(to: number, captured: number, promoted: number, nextCastling: number, nextPlys: number) {
        if (captured === (ROOK | WHITE)) {
            if (to === 91 && (thisCastling & CASTLING_QUEEN_WHITE) !== 0) {
                nextCastling &= ~CASTLING_QUEEN_WHITE;
            } else if (to === 98 && (thisCastling & CASTLING_KING_WHITE) !== 0) {
                nextCastling &= ~CASTLING_KING_WHITE;
            }
        } else if (captured === (ROOK | BLACK)) {
            if (to === 21 && (thisCastling & CASTLING_QUEEN_BLACK) !== 0) {
                nextCastling &= ~CASTLING_QUEEN_BLACK;
            } else if (to === 28 && (thisCastling & CASTLING_KING_BLACK) !== 0) {
                nextCastling &= ~CASTLING_KING_BLACK;
            }
        }
        moveData[length++] = pos;
        moveData[length++] = to;
        moveData[length++] = captured;
        moveData[length++] = promoted;
        moveData[length++] = thisCastling ^ nextCastling;
        moveData[length++] = 0;
        moveData[length++] = thisPlys ^ nextPlys;
    }

    function addMove(to: number, nextPlys: number) {
        addMoveBase(to, board[to], 0, thisCastling, nextPlys);
    }

    function addMovePromotion(to: number, promoted: number) {
        addMoveBase(to, board[to], promoted, thisCastling, 0);
    }

    function addMoveEP(to: number, captured: number) {
        addMoveBase(to, captured, 0, thisCastling, 0);
    }

    function addMoveUpdateCastling(to: number, nextCastling: number, nextPlys: number) {
        addMoveBase(to, board[to], 0, nextCastling, nextPlys);
    }

    for (let r = 8; r >= 1; r--) {
        for (let c = 1; c <= 8; c++) {
            piece = board[pos];
            basePiece = piece & PIECE_MASK;
            if ((piece & COLOR_MASK) === thisTurn) {
                switch (basePiece) {
                    case PAWN:
                        if (thisTurn === WHITE) {
                            if (r === 7) {
                                if (board[pos - 10] === EMPTY) {
                                    addMovePromotion(pos - 10, BISHOP | WHITE);
                                    addMovePromotion(pos - 10, KNIGHT | WHITE);
                                    addMovePromotion(pos - 10, ROOK | WHITE);
                                    addMovePromotion(pos - 10, QUEEN | WHITE);
                                }
                                if ((board[pos - 11] & COLOR_MASK) === BLACK) {
                                    addMovePromotion(pos - 11, BISHOP | WHITE);
                                    addMovePromotion(pos - 11, KNIGHT | WHITE);
                                    addMovePromotion(pos - 11, ROOK | WHITE);
                                    addMovePromotion(pos - 11, QUEEN | WHITE);
                                }
                                if ((board[pos - 9] & COLOR_MASK) === BLACK) {
                                    addMovePromotion(pos - 9, BISHOP | WHITE);
                                    addMovePromotion(pos - 9, KNIGHT | WHITE);
                                    addMovePromotion(pos - 9, ROOK | WHITE);
                                    addMovePromotion(pos - 9, QUEEN | WHITE);
                                }
                            } else {
                                if (board[pos - 10] === EMPTY) {
                                    addMove(pos - 10, 0);
                                    if (r === 2 && board[pos - 20] === EMPTY) {
                                        addMove(pos - 20, 0);
                                    }
                                }
                                if ((board[pos - 11] & COLOR_MASK) === BLACK) {
                                    addMove(pos - 11, 0);
                                }
                                if (pos - 11 === thisEP) {
                                    addMoveEP(pos - 11, PAWN | BLACK);
                                }
                                if ((board[pos - 9] & COLOR_MASK) === BLACK) {
                                    addMove(pos - 9, 0);
                                }
                                if (pos - 9 === thisEP) {
                                    addMoveEP(pos - 9, PAWN | BLACK);
                                }
                            }
                        } else {
                            if (r === 2) {
                                if (board[pos + 10] === EMPTY) {
                                    addMovePromotion(pos + 10, BISHOP | BLACK);
                                    addMovePromotion(pos + 10, KNIGHT | BLACK);
                                    addMovePromotion(pos + 10, ROOK | BLACK);
                                    addMovePromotion(pos + 10, QUEEN | BLACK);
                                }
                                if ((board[pos + 11] & COLOR_MASK) === WHITE) {
                                    addMovePromotion(pos + 11, BISHOP | BLACK);
                                    addMovePromotion(pos + 11, KNIGHT | BLACK);
                                    addMovePromotion(pos + 11, ROOK | BLACK);
                                    addMovePromotion(pos + 11, QUEEN | BLACK);
                                }
                                if ((board[pos + 9] & COLOR_MASK) === WHITE) {
                                    addMovePromotion(pos + 9, BISHOP | BLACK);
                                    addMovePromotion(pos + 9, KNIGHT | BLACK);
                                    addMovePromotion(pos + 9, ROOK | BLACK);
                                    addMovePromotion(pos + 9, QUEEN | BLACK);
                                }
                            } else {
                                if (board[pos + 10] === EMPTY) {
                                    addMove(pos + 10, 0);
                                    if (r === 7 && board[pos + 20] === EMPTY) {
                                        addMove(pos + 20, 0);
                                    }
                                }
                                if ((board[pos + 11] & COLOR_MASK) === WHITE) {
                                    addMove(pos + 11, 0);
                                }
                                if (pos + 11 === thisEP) {
                                    addMoveEP(pos + 11, PAWN | WHITE);
                                }
                                if ((board[pos + 9] & COLOR_MASK) === WHITE) {
                                    addMove(pos + 9, 0);
                                }
                                if (pos + 9 === thisEP) {
                                    addMoveEP(pos + 9, PAWN | WHITE);
                                }
                            }
                        }
                        break;
                    case BISHOP:
                        for (const delta of BISHOP_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                addMove(to, thisPlys + 1);
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0);
                            }
                        }
                        break;
                    case KNIGHT:
                        for (const delta of KNIGHT_MOVEMENTS) {
                            const to = pos + delta;
                            if (board[to] === EMPTY) {
                                addMove(to, thisPlys + 1);
                            } else if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0);
                            }
                        }
                        break;
                    case ROOK:
                        if (pos === 91 && (thisCastling & CASTLING_QUEEN_WHITE) !== 0) {
                            const nextCastling = thisCastling & ~CASTLING_QUEEN_WHITE;
                            for (const delta of ROOK_MOVEMENTS) {
                                let to = pos + delta;
                                while (board[to] === EMPTY) {
                                    addMoveUpdateCastling(to, nextCastling, thisPlys + 1);
                                    to += delta;
                                }
                                if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMoveUpdateCastling(to, nextCastling, 0);
                                }
                            }
                        } else if (pos === 98 && (thisCastling & CASTLING_KING_WHITE) !== 0) {
                            const nextCastling = thisCastling & ~CASTLING_KING_WHITE;
                            for (const delta of ROOK_MOVEMENTS) {
                                let to = pos + delta;
                                while (board[to] === EMPTY) {
                                    addMoveUpdateCastling(to, nextCastling, thisPlys + 1);
                                    to += delta;
                                }
                                if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMoveUpdateCastling(to, nextCastling, 0);
                                }
                            }
                        } else if (pos === 21 && (thisCastling & CASTLING_QUEEN_BLACK) !== 0) {
                            const nextCastling = thisCastling & ~CASTLING_QUEEN_BLACK;
                            for (const delta of ROOK_MOVEMENTS) {
                                let to = pos + delta;
                                while (board[to] === EMPTY) {
                                    addMoveUpdateCastling(to, nextCastling, thisPlys + 1);
                                    to += delta;
                                }
                                if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMoveUpdateCastling(to, nextCastling, 0);
                                }
                            }
                        } else if (pos === 28 && (thisCastling & CASTLING_KING_BLACK) !== 0) {
                            const nextCastling = thisCastling & ~CASTLING_KING_BLACK;
                            for (const delta of ROOK_MOVEMENTS) {
                                let to = pos + delta;
                                while (board[to] === EMPTY) {
                                    addMoveUpdateCastling(to, nextCastling, thisPlys + 1);
                                    to += delta;
                                }
                                if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMoveUpdateCastling(to, nextCastling, 0);
                                }
                            }
                        } else {
                            for (const delta of ROOK_MOVEMENTS) {
                                let to = pos + delta;
                                while (board[to] === EMPTY) {
                                    addMove(to, thisPlys + 1);
                                    to += delta;
                                }
                                if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMove(to, 0);
                                }
                            }
                        }
                        break;
                    case QUEEN:
                        for (const delta of KING_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                addMove(to, thisPlys + 1);
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === nextTurn) {
                                addMove(to, 0);
                            }
                        }
                        break;
                    case KING:
                        if (pos === 95 && (thisCastling & (CASTLING_QUEEN_WHITE | CASTLING_KING_WHITE)) !== 0) {
                            const nextCastling = thisCastling & ~(CASTLING_QUEEN_WHITE | CASTLING_KING_WHITE);
                            for (const delta of KING_MOVEMENTS) {
                                const to = pos + delta;
                                if (board[to] === EMPTY) {
                                    addMoveUpdateCastling(to, nextCastling, thisPlys + 1);
                                } else if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMoveUpdateCastling(to, nextCastling, 0);
                                }
                            }
                            if (!isAttackedBy(board, 95, BLACK)) {
                                if ((thisCastling & CASTLING_QUEEN_WHITE) !== 0
                                        && board[94] === EMPTY && board[93] === EMPTY && board[92] === EMPTY
                                        && !isAttackedBy(board, 94, BLACK)) {
                                    addMoveUpdateCastling(93, nextCastling, thisPlys + 1);
                                }
                                if ((thisCastling & CASTLING_KING_WHITE) !== 0
                                        && board[96] === EMPTY && board[97] === EMPTY
                                        && !isAttackedBy(board, 96, BLACK)) {
                                    addMoveUpdateCastling(97, nextCastling, thisPlys + 1);
                                }
                            }
                        } else if (pos === 25 && (thisCastling & (CASTLING_QUEEN_BLACK | CASTLING_KING_BLACK)) !== 0) {
                            const nextCastling = thisCastling & ~(CASTLING_QUEEN_BLACK | CASTLING_KING_BLACK);
                            for (const delta of KING_MOVEMENTS) {
                                const to = pos + delta;
                                if (board[to] === EMPTY) {
                                    addMoveUpdateCastling(to, nextCastling, thisPlys + 1);
                                } else if ((board[to] & COLOR_MASK) === nextTurn) {
                                    addMoveUpdateCastling(to, nextCastling, 0);
                                }
                            }
                            if (!isAttackedBy(board, 25, WHITE)) {
                                if ((thisCastling & CASTLING_QUEEN_BLACK) !== 0
                                        && board[24] === EMPTY && board[23] === EMPTY && board[22] === EMPTY
                                        && !isAttackedBy(board, 24, WHITE)) {
                                    addMoveUpdateCastling(23, nextCastling, thisPlys + 1);
                                }
                                if ((thisCastling & CASTLING_KING_BLACK) !== 0
                                        && board[26] === EMPTY && board[27] === EMPTY
                                        && !isAttackedBy(board, 26, WHITE)) {
                                    addMoveUpdateCastling(27, nextCastling, thisPlys + 1);
                                }
                            }
                        } else {
                            for (const delta of KING_MOVEMENTS) {
                                const to = pos + delta;
                                if (board[to] === EMPTY) {
                                    addMove(to, thisPlys + 1);
                                } else if ((board[to] & COLOR_MASK) === nextTurn) {
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

    const moves: Array<Move> = [];

    for (let offset = 0; offset < length; offset += 7) {
        moves.push(moveData.subarray(offset, offset + 7));
    }

    return moves;
}

export function isAttackedBy(board: Board, pos: number, color: number): boolean {
    if (color === WHITE) {
        if (board[pos + 9] === (PAWN | WHITE) || board[pos + 11] === (PAWN | WHITE))
            return true;
    } else {
        if (board[pos - 9] === (PAWN | BLACK) || board[pos - 11] === (PAWN | BLACK))
            return true;
    }
    for (const delta of BISHOP_MOVEMENTS) {
        let from = pos + delta;
        while (board[from] === EMPTY) {
            from += delta;
        }
        if (board[from] === (BISHOP | color))
            return true;
    }
    for (const delta of KNIGHT_MOVEMENTS) {
        if (board[pos + delta] === (KNIGHT | color))
            return true;
    }
    for (const delta of ROOK_MOVEMENTS) {
        let from = pos + delta;
        while (board[from] === EMPTY) {
            from += delta;
        }
        if (board[from] === (ROOK | color))
            return true;
    }
    for (const delta of KING_MOVEMENTS) {
        let from = pos + delta;
        while (board[from] === EMPTY) {
            from += delta;
        }
        if (board[from] === (QUEEN | color))
            return true;
    }
    for (const delta of KING_MOVEMENTS) {
        if (board[pos + delta] === (KING | color))
            return true;
    }
    return false;
}

export function makeMove(board: Board, move: Move) {
    const from = move[0];
    const piece = board[from];
    const to = move[1];
    // const captured = move[2];
    const promoted = move[3];
    board[to] = promoted || piece;
    board[from] = EMPTY;
    const thisEP = board[BOARD_INDEX_EP];
    let nextEP = 0;
    if (piece === (PAWN | WHITE)) {
        if (to === board[BOARD_INDEX_EP]) {
            board[to + 10] = EMPTY;
        } else if (from - to === 20) {
            nextEP = from - 10;
        }
    } else if (piece === (PAWN | BLACK)) {
        if (to === board[BOARD_INDEX_EP]) {
            board[to - 10] = EMPTY;
        } else if (to - from === 20) {
            nextEP = from + 10;
        }
    } else if (piece === (KING | WHITE)) {
        board[BOARD_INDEX_WHITE_KING] = to;
        if (from === 95 && to === 93) {
            board[91] = EMPTY;
            board[94] = ROOK | WHITE;
        } else if (from === 95 && to === 97) {
            board[98] = EMPTY;
            board[96] = ROOK | WHITE;
        }
    } else if (piece === (KING | BLACK)) {
        board[BOARD_INDEX_BLACK_KING] = to;
        if (from === 25 && to === 23) {
            board[21] = EMPTY;
            board[24] = ROOK | BLACK;
        } else if (from === 25 && to === 27) {
            board[28] = EMPTY;
            board[26] = ROOK | BLACK;
        }
    }
    move[5] = thisEP ^ nextEP;
    board[BOARD_INDEX_TURN] = board[BOARD_INDEX_TURN] === WHITE ? BLACK : WHITE;
    board[BOARD_INDEX_CASTLING] ^= move[4];
    board[BOARD_INDEX_EP] = nextEP;
    board[BOARD_INDEX_PLYS] ^= move[6];
}

export function unmakeMove(board: Board, move: Move) {
    const from = move[0];
    const to = move[1];
    const captured = move[2];
    const promoted = move[3];
    board[BOARD_INDEX_TURN] = board[BOARD_INDEX_TURN] === WHITE ? BLACK : WHITE;
    board[BOARD_INDEX_CASTLING] ^= move[4];
    board[BOARD_INDEX_EP] ^= move[5];
    board[BOARD_INDEX_PLYS] ^= move[6];
    const piece = promoted ? PAWN | board[BOARD_INDEX_TURN] : board[to];
    board[from] = piece;
    board[to] = captured;
    if (piece === (PAWN | WHITE)) {
        if (to === board[BOARD_INDEX_EP]) {
            board[to] = EMPTY;
            board[to + 10] = PAWN | BLACK;
        }
    } else if (piece === (PAWN | BLACK)) {
        if (to === board[BOARD_INDEX_EP]) {
            board[to] = EMPTY;
            board[to - 10] = PAWN | WHITE;
        }
    } else if (piece === (KING | WHITE)) {
        board[BOARD_INDEX_WHITE_KING] = from;
        if (from === 95 && to === 93) {
            board[91] = ROOK | WHITE;
            board[94] = EMPTY;
        } else if (from === 95 && to === 97) {
            board[98] = ROOK | WHITE;
            board[96] = EMPTY;
        }
    } else if (piece === (KING | BLACK)) {
        board[BOARD_INDEX_BLACK_KING] = from;
        if (from === 25 && to === 23) {
            board[21] = ROOK | BLACK;
            board[24] = EMPTY;
        } else if (from === 25 && to === 27) {
            board[28] = ROOK | BLACK;
            board[26] = EMPTY;
        }
    }
}

export function makeMoveIfLegal(board: Board, move: Move): boolean {
    makeMove(board, move);
    const turn = board[BOARD_INDEX_TURN];
    const inCheck = isAttackedBy(board, board[turn === BLACK ? BOARD_INDEX_WHITE_KING : BOARD_INDEX_BLACK_KING], turn);
    if (inCheck) {
        unmakeMove(board, move);
        return false;
    }
    return true;
}

export function moveToAlgebraic(move: Move) {
    return posToAlgebraic(move[0]) + posToAlgebraic(move[1]);
}
