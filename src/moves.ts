import { Board, TURN_MASK, TURN_WHITE, WHITE, BLACK, COLOR_MASK, PAWN, EMPTY, PIECE_MASK, BISHOP, QUEEN, ROOK, KNIGHT, KING } from './board';

export interface Move {
    from: number;
    to: number;
    captured: number;
    fromState: number;
}

interface SimpleMove {
    from: number;
    to: number;
}

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
    const { pieces, state } = board;
    const colorToMove = (board.state & TURN_MASK) === TURN_WHITE ? WHITE : BLACK;
    const otherColor = colorToMove === WHITE ? BLACK : WHITE;
    const simpleMoves: Array<SimpleMove> = [];
    const moves: Array<Move> = [];

    let pos = 21;
    for (let r = 8; r >= 1; r--) {
        for (let c = 1; c <= 8; c++) {
            const piece = pieces[pos];
            const basePiece = piece & PIECE_MASK;
            if ((piece & COLOR_MASK) === colorToMove) {
                switch (basePiece) {
                    case PAWN:
                        if (colorToMove === WHITE) {
                            if (pieces[pos - 10] === EMPTY) {
                                simpleMoves.push({ from: pos, to: pos - 10 });
                                if (r === 2 && board.pieces[pos - 20] === EMPTY) {
                                    simpleMoves.push({ from: pos, to: pos - 20 });
                                }
                            }
                            if ((pieces[pos - 11] & COLOR_MASK) === BLACK) {
                                simpleMoves.push({ from: pos, to: pos - 11 });
                            }
                            if ((pieces[pos - 9] & COLOR_MASK) === BLACK) {
                                simpleMoves.push({ from: pos, to: pos - 9 });
                            }
                        } else {
                            if (pieces[pos + 10] === EMPTY) {
                                simpleMoves.push({ from: pos, to: pos + 10 });
                                if (r === 7 && board.pieces[pos + 20] === EMPTY) {
                                    simpleMoves.push({ from: pos, to: pos + 20 });
                                }
                            }
                            if ((pieces[pos + 11] & COLOR_MASK) === WHITE) {
                                simpleMoves.push({ from: pos, to: pos + 11 });
                            }
                            if ((pieces[pos + 9] & COLOR_MASK) === WHITE) {
                                simpleMoves.push({ from: pos, to: pos + 9 });
                            }
                        }
                    case BISHOP:
                    case ROOK:
                    case QUEEN:
                        {
                            const movements = PIECE_MOVEMENTS[basePiece];
                            for (const delta of movements) {
                                let to = pos + delta;
                                while (pieces[to] === EMPTY) {
                                    simpleMoves.push({ from: pos, to });
                                    to += delta;
                                }
                                if ((pieces[to] & COLOR_MASK) === otherColor) {
                                    simpleMoves.push({ from: pos, to });
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
                                if (pieces[to] === EMPTY || (pieces[to] & COLOR_MASK) === otherColor) {
                                    simpleMoves.push({ from: pos, to });
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

    for (const simpleMove of simpleMoves) {
        moves.push({
            from: simpleMove.from,
            to: simpleMove.to,
            captured: pieces[simpleMove.to],
            fromState: state
        })
    }

    return moves;
}