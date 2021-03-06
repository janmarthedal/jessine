import {
    Game, WHITE, BLACK, COLOR_MASK, PAWN, EMPTY, PIECE_MASK, BISHOP, QUEEN, ROOK, KNIGHT, KING,
    BOARD_INDEX_TURN, BOARD_INDEX_EP, BOARD_INDEX_PLYS, BOARD_INDEX_CASTLING, posToAlgebraic,
    CASTLING_QUEEN_WHITE, CASTLING_KING_WHITE, CASTLING_QUEEN_BLACK, CASTLING_KING_BLACK, algebraicToPos
} from './board';

// 0: from
// 1: to
// 2: promoted
// 3: captured
// 4: from castling
// 5: from EP
// 6: from ply
export type Move = Uint8Array;

const BISHOP_MOVEMENTS = [9, 11, -9, -11];
const KNIGHT_MOVEMENTS = [-21, -19, 19, 21, -12, -8, 8, 12];
const ROOK_MOVEMENTS = [-1, 1, -10, 10];
const KING_MOVEMENTS = [9, 11, -9, -11, -1, 1, -10, 10];
const PROMOTION_PIECES = [BISHOP, KNIGHT, ROOK, QUEEN];

// Inspired by TSCP
const castleMask = (function () {
    const castleMask = new Uint8Array(12 * 10);
    for (let i = 0; i < castleMask.length; i++) {
        castleMask[i] = CASTLING_KING_WHITE | CASTLING_QUEEN_WHITE | CASTLING_KING_BLACK | CASTLING_QUEEN_BLACK;
    }
    castleMask[21] &= ~CASTLING_QUEEN_BLACK;
    castleMask[25] &= ~(CASTLING_QUEEN_BLACK | CASTLING_KING_BLACK);
    castleMask[28] &= ~CASTLING_KING_BLACK;
    castleMask[91] &= ~CASTLING_QUEEN_WHITE;
    castleMask[95] &= ~(CASTLING_QUEEN_WHITE | CASTLING_KING_WHITE);
    castleMask[98] &= ~CASTLING_KING_WHITE;
    return castleMask;
})();

// maximum number of moves of any position: 218 (http://www.talkchess.com/forum3/viewtopic.php?t=61792)

export function generateMoves(game: Game): Array<Move> {
    const board = game.board;
    const side = board[BOARD_INDEX_TURN];
    const xside = side === WHITE ? BLACK : WHITE;
    const castling = board[BOARD_INDEX_CASTLING];
    const ep = board[BOARD_INDEX_EP];
    const moveData = new Uint8Array(256 * 7);
    let length = 0, pos = 21, piece: number;

    for (let r = 8; r >= 1; r--) {
        for (let c = 1; c <= 8; c++) {
            piece = board[pos];
            if ((piece & COLOR_MASK) === side) {
                switch (piece & PIECE_MASK) {
                    case PAWN:
                        if (side === WHITE) {
                            if (r === 7) {
                                if (board[pos - 10] === EMPTY) {
                                    PROMOTION_PIECES.forEach(p => {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos - 10;
                                        moveData[length++] = p | WHITE;
                                        length += 4;
                                    });
                                }
                                if ((board[pos - 11] & COLOR_MASK) === BLACK) {
                                    PROMOTION_PIECES.forEach(p => {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos - 11;
                                        moveData[length++] = p | WHITE;
                                        length += 4;
                                    });
                                }
                                if ((board[pos - 9] & COLOR_MASK) === BLACK) {
                                    PROMOTION_PIECES.forEach(p => {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos - 9;
                                        moveData[length++] = p | WHITE;
                                        length += 4;
                                    });
                                }
                            } else {
                                if (board[pos - 10] === EMPTY) {
                                    moveData[length++] = pos;
                                    moveData[length++] = pos - 10;
                                    length += 5;
                                    if (r === 2 && board[pos - 20] === EMPTY) {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos - 20;
                                        length += 5;
                                    }
                                }
                                if ((board[pos - 11] & COLOR_MASK) === BLACK || pos - 11 === ep) {
                                    moveData[length++] = pos;
                                    moveData[length++] = pos - 11;
                                    length += 5;
                                }
                                if ((board[pos - 9] & COLOR_MASK) === BLACK || pos - 9 === ep) {
                                    moveData[length++] = pos;
                                    moveData[length++] = pos - 9;
                                    length += 5;
                                }
                            }
                        } else {
                            if (r === 2) {
                                if (board[pos + 10] === EMPTY) {
                                    PROMOTION_PIECES.forEach(p => {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos + 10;
                                        moveData[length++] = p | BLACK;
                                        length += 4;
                                    });
                                }
                                if ((board[pos + 11] & COLOR_MASK) === WHITE) {
                                    PROMOTION_PIECES.forEach(p => {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos + 11;
                                        moveData[length++] = p | BLACK;
                                        length += 4;
                                    });
                                }
                                if ((board[pos + 9] & COLOR_MASK) === WHITE) {
                                    PROMOTION_PIECES.forEach(p => {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos + 9;
                                        moveData[length++] = p | BLACK;
                                        length += 4;
                                    });
                                }
                            } else {
                                if (board[pos + 10] === EMPTY) {
                                    moveData[length++] = pos;
                                    moveData[length++] = pos + 10;
                                    length += 5;
                                    if (r === 7 && board[pos + 20] === EMPTY) {
                                        moveData[length++] = pos;
                                        moveData[length++] = pos + 20;
                                        length += 5;
                                    }
                                }
                                if ((board[pos + 11] & COLOR_MASK) === WHITE || pos + 11 === ep) {
                                    moveData[length++] = pos;
                                    moveData[length++] = pos + 11;
                                    length += 5;
                                }
                                if ((board[pos + 9] & COLOR_MASK) === WHITE || pos + 9 === ep) {
                                    moveData[length++] = pos;
                                    moveData[length++] = pos + 9;
                                    length += 5;
                                }
                            }
                        }
                        break;
                    case BISHOP:
                        for (const delta of BISHOP_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === xside) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                            }
                        }
                        break;
                    case KNIGHT:
                        for (const delta of KNIGHT_MOVEMENTS) {
                            const to = pos + delta;
                            if (board[to] === EMPTY) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                            } else if ((board[to] & COLOR_MASK) === xside) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                            }
                        }
                        break;
                    case ROOK:
                        for (const delta of ROOK_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === xside) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                            }
                        }
                        break;
                    case QUEEN:
                        for (const delta of KING_MOVEMENTS) {
                            let to = pos + delta;
                            while (board[to] === EMPTY) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                                to += delta;
                            }
                            if ((board[to] & COLOR_MASK) === xside) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                            }
                        }
                        break;
                    case KING:
                        if (pos === 95 && (castling & (CASTLING_QUEEN_WHITE | CASTLING_KING_WHITE)) !== 0
                                && !isAttackedBy(game, 95, BLACK)) {
                            if ((castling & CASTLING_QUEEN_WHITE) !== 0
                                    && board[94] === EMPTY && board[93] === EMPTY && board[92] === EMPTY
                                    && !isAttackedBy(game, 94, BLACK)) {
                                moveData[length++] = pos;
                                moveData[length++] = 93;
                                length += 5;
                            }
                            if ((castling & CASTLING_KING_WHITE) !== 0
                                    && board[96] === EMPTY && board[97] === EMPTY
                                    && !isAttackedBy(game, 96, BLACK)) {
                                moveData[length++] = pos;
                                moveData[length++] = 97;
                                length += 5;
                            }
                        } else if (pos === 25 && (castling & (CASTLING_QUEEN_BLACK | CASTLING_KING_BLACK)) !== 0
                                && !isAttackedBy(game, 25, WHITE)) {
                            if ((castling & CASTLING_QUEEN_BLACK) !== 0
                                    && board[24] === EMPTY && board[23] === EMPTY && board[22] === EMPTY
                                    && !isAttackedBy(game, 24, WHITE)) {
                                moveData[length++] = pos;
                                moveData[length++] = 23;
                                length += 5;
                            }
                            if ((castling & CASTLING_KING_BLACK) !== 0
                                    && board[26] === EMPTY && board[27] === EMPTY
                                    && !isAttackedBy(game, 26, WHITE)) {
                                moveData[length++] = pos;
                                moveData[length++] = 27;
                                length += 5;
                            }
                        }
                        for (const delta of KING_MOVEMENTS) {
                            const to = pos + delta;
                            if (board[to] === EMPTY) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
                            } else if ((board[to] & COLOR_MASK) === xside) {
                                moveData[length++] = pos;
                                moveData[length++] = to;
                                length += 5;
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

export function makeMove(game: Game, move: Move): boolean {
    const board = game.board;
    const from = move[0];
    const to = move[1];
    const piece = board[from];
    const promoted = move[2];
    const captured = move[3] = board[to];
    board[to] = promoted || piece;
    board[from] = EMPTY;
    const thisEP = board[BOARD_INDEX_EP];
    let nextEP = 0;
    const thisPly = board[BOARD_INDEX_PLYS];
    let nextPly = captured === EMPTY ? thisPly + 1 : 0;
    const thisCastling = board[BOARD_INDEX_CASTLING];
    const nextCastling = thisCastling & castleMask[from] & castleMask[to];
    const thisTurn = board[BOARD_INDEX_TURN];
    const nextTurn = thisTurn === WHITE ? BLACK : WHITE;

    switch (piece) {
        case PAWN | WHITE:
            if (to === thisEP) {
                board[to + 10] = EMPTY;
            } else if (from - to === 20) {
                nextEP = from - 10;
            }
            nextPly = 0;
            break;
        case PAWN | BLACK:
            if (to === thisEP) {
                board[to - 10] = EMPTY;
            } else if (to - from === 20) {
                nextEP = from + 10;
            }
            nextPly = 0;
            break;
        case KING | WHITE:
            game.whiteKing = to;
            if (from === 95) {
                if (to === 93) {
                    board[91] = EMPTY;
                    board[94] = ROOK | WHITE;
                } else if (to === 97) {
                    board[98] = EMPTY;
                    board[96] = ROOK | WHITE;
                }
            }
            break;
        case KING | BLACK:
            game.blackKing = to;
            if (from === 25) {
                if (to === 23) {
                    board[21] = EMPTY;
                    board[24] = ROOK | BLACK;
                } else if (to === 27) {
                    board[28] = EMPTY;
                    board[26] = ROOK | BLACK;
                }
            }
            break;
    }

    move[4] = thisCastling;
    move[5] = thisEP;
    move[6] = thisPly;
    board[BOARD_INDEX_TURN] = nextTurn;
    board[BOARD_INDEX_CASTLING] = nextCastling;
    board[BOARD_INDEX_EP] = nextEP;
    board[BOARD_INDEX_PLYS] = nextPly;

    if (isAttackedBy(game, thisTurn === WHITE ? game.whiteKing : game.blackKing, nextTurn)) {
        unmakeMove(game, move);
        return false;
    }

    return true;
}

export function unmakeMove(game: Game, move: Move) {
    const board = game.board;
    const from = move[0];
    const to = move[1];
    const promoted = move[2];
    const captured = move[3];
    const fromTurn = board[BOARD_INDEX_TURN] === WHITE ? BLACK : WHITE;
    board[BOARD_INDEX_TURN] = fromTurn;
    board[BOARD_INDEX_CASTLING] = move[4];
    board[BOARD_INDEX_EP] = move[5];
    board[BOARD_INDEX_PLYS] = move[6];
    const piece = promoted ? PAWN | fromTurn : board[to];
    board[from] = piece;
    board[to] = captured;

    switch (piece) {
        case PAWN | WHITE:
            if (to === board[BOARD_INDEX_EP]) {
                board[to + 10] = PAWN | BLACK;
            }
            break;
        case PAWN | BLACK:
            if (to === board[BOARD_INDEX_EP]) {
                board[to - 10] = PAWN | WHITE;
            }
            break;
        case KING | WHITE:
            game.whiteKing = from;
            if (from === 95 && to === 93) {
                board[91] = ROOK | WHITE;
                board[94] = EMPTY;
            } else if (from === 95 && to === 97) {
                board[98] = ROOK | WHITE;
                board[96] = EMPTY;
            }
            break;
        case KING | BLACK:
            game.blackKing = from;
            if (from === 25 && to === 23) {
                board[21] = ROOK | BLACK;
                board[24] = EMPTY;
            } else if (from === 25 && to === 27) {
                board[28] = ROOK | BLACK;
                board[26] = EMPTY;
            }
            break;
    }
}

export function isAttackedBy(game: Game, pos: number, color: number): boolean {
    const board = game.board;
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

export function moveToAlgebraic(move: Move) {
    let promotion = '';
    switch (move[2] & PIECE_MASK) {
        case BISHOP:
            promotion = 'b';
            break;
        case KNIGHT:
            promotion = 'n';
            break;
        case ROOK:
            promotion = 'r';
            break;
        case QUEEN:
            promotion = 'q';
            break;
    }
    return posToAlgebraic(move[0]) + posToAlgebraic(move[1]) + promotion;
}

export function algebraicToMove(s: string) {
    let promoted = undefined;
    if (s.length === 5) {
        const pieceStr = s.substr(4, 1).toLowerCase();
        if (pieceStr == 'b') {
            promoted = BISHOP;
        } else if (pieceStr == 'n') {
            promoted = KNIGHT;
        } else if (pieceStr == 'r') {
            promoted = ROOK;
        } else if (pieceStr == 'q') {
            promoted = QUEEN;
        }
    }
    return {
        from: algebraicToPos(s.substr(0, 2)),
        to: algebraicToPos(s.substr(2, 2)),
        promoted
    };
}
