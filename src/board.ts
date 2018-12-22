export const EMPTY = 0;
export const PAWN = 1;
export const BISHOP = 2;
export const KNIGHT = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

export const WHITE = 16;
export const BLACK = 32;
export const COLOR_MASK = WHITE | BLACK;
export const PIECE_MASK = 7;

export const CASTLING_KING_WHITE = 32;
export const CASTLING_QUEEN_WHITE = 64;
export const CASTLING_KING_BLACK = 128;
export const CASTLING_QUEEN_BLACK = 256;
export const TURN_WHITE = 0;
export const TURN_BLACK = 16;
export const TURN_MASK = TURN_BLACK;
const WHITE_PIECES_ASCII = ' PBNRQK';
const BLACK_PIECES_ASCII = '.pbnrqk';

// Status bits
//            1
// XXXXXXXXXXX68421
// *******              ply count since last pawn move or capture
//        *             Castling white king-side
//         *            Castling white queen-side
//          *           Castling black king-side
//           *          Castling black queen-side
//            *         Turn, 0 white, 1 black
//             ****     En pessant

export interface Board {
    pieces: Uint8Array;
    state: number;
}

function createEmptyBoard(): Board {
    const pieces = new Uint8Array(120);
    const state = (CASTLING_KING_WHITE | CASTLING_QUEEN_WHITE |
                   CASTLING_KING_BLACK | CASTLING_QUEEN_BLACK |
                   TURN_WHITE);
    for (let c = 0; c < 10; c++) {
        pieces[c] = pieces[10 + c] = pieces[100 + c] = pieces[110 + c] = COLOR_MASK;
    }
    for (let r = 2; r < 10; r++) {
        pieces[10 * r] = pieces[10 * r + 9] = COLOR_MASK;
    }
    return { pieces, state };
}

function initBoard(boardString: string): Board {
    const board = createEmptyBoard();
    const charBoard = boardString.replace(/\//g, '');
    for (let k = 0; k < 64; k++) {
        const p = charBoard[k];
        const boardIndex = ((k >> 3) + 2) * 10 + (k & 7) + 1;
        let i = WHITE_PIECES_ASCII.indexOf(p);
        if (i >= 1) {
            board.pieces[boardIndex] = i | WHITE;
        } else {
            i = BLACK_PIECES_ASCII.indexOf(p);
            board.pieces[boardIndex] = i >= 1 ? i | BLACK : EMPTY;
        }
    }
    return board;
}

export function initBoardFromFEN(boardString: string): Board {
    const SPACES = '        ';
    let b = boardString;
    for (let k = 1; k <= 8; k++) {
        b = b.replace(new RegExp(k.toString(), 'g'), SPACES.substr(0, k));
    }
    return initBoard(b);
}

export function showBoard(b: Board) {
    for (let r = 2; r < 10; r++) {
        process.stdout.write((10 - r).toString() + ' ');
        for (let c = 1; c <= 8; c++) {
            const piece = b.pieces[10 * r + c];
            process.stdout.write(' ');
            if ((piece & COLOR_MASK) === COLOR_MASK) {
                process.stdout.write('*');
            } else if ((piece & COLOR_MASK) === WHITE) {
                process.stdout.write(WHITE_PIECES_ASCII[piece & PIECE_MASK]);
            } else {
                process.stdout.write(BLACK_PIECES_ASCII[piece & PIECE_MASK]);
            }
        }
        process.stdout.write('\n');
    }
    process.stdout.write('\n   a b c d e f g h\n')
}
