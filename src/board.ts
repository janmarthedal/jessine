// board: 12 x 10 = 120
// white king pos: 1
// black king pos: 1
// turn: 1
// castling: 1
// en passant: 1
// plys since pawn move or capture: 1
export type Board = Uint8Array;
export const BOARD_INDEX_WHITE_KING = 120;
export const BOARD_INDEX_BLACK_KING = 121;
export const BOARD_INDEX_TURN = 122;
export const BOARD_INDEX_CASTLING = 123;
export const BOARD_INDEX_EP = 124;
export const BOARD_INDEX_PLYS = 125;

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

export const CASTLING_KING_WHITE = 1;
export const CASTLING_QUEEN_WHITE = 2;
export const CASTLING_KING_BLACK = 4;
export const CASTLING_QUEEN_BLACK = 8;
const ASCII_PIECES = [EMPTY, EMPTY,
    WHITE | PAWN, WHITE | BISHOP, WHITE | KNIGHT, WHITE | ROOK, WHITE | QUEEN, WHITE | KING,
    BLACK | PAWN, BLACK | BISHOP, BLACK | KNIGHT, BLACK | ROOK, BLACK | QUEEN, BLACK | KING
];
const ASCII_CHARS = '. PBNRQKpbnrqk';

function createEmptyBoard(): Board {
    const board = new Uint8Array(124);
    for (let c = 0; c < 10; c++) {
        board[c] = board[10 + c] = board[100 + c] = board[110 + c] = COLOR_MASK;
    }
    for (let r = 2; r < 10; r++) {
        board[10 * r] = board[10 * r + 9] = COLOR_MASK;
    }
    board[BOARD_INDEX_TURN] = WHITE;
    board[BOARD_INDEX_CASTLING] = (CASTLING_KING_WHITE | CASTLING_QUEEN_WHITE |
                                   CASTLING_KING_BLACK | CASTLING_QUEEN_BLACK);
    board[BOARD_INDEX_EP] = 0;
    board[BOARD_INDEX_PLYS] = 0;
    return board;
}

function initBoard(boardString: string): Board {
    const board = createEmptyBoard();
    const charBoard = boardString.replace(/\//g, '');
    for (let k = 0; k < 64; k++) {
        const p = charBoard[k];
        const boardIndex = ((k >> 3) + 2) * 10 + (k & 7) + 1;
        const i = ASCII_CHARS.indexOf(p);
        const piece = ASCII_PIECES[i];
        board[boardIndex] = piece;
        if (piece === (KING | WHITE)) {
            board[BOARD_INDEX_WHITE_KING] = boardIndex;
        } else if (piece === (KING | BLACK)) {
            board[BOARD_INDEX_BLACK_KING] = boardIndex;
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

export function showBoard(board: Board) {
    for (let r = 2; r < 10; r++) {
        process.stdout.write((10 - r).toString() + ' ');
        for (let c = 1; c <= 8; c++) {
            const piece = board[10 * r + c];
            const index = ASCII_PIECES.indexOf(piece);
            process.stdout.write(' ');
            process.stdout.write(ASCII_CHARS[index]);
        }
        process.stdout.write('\n');
    }
    process.stdout.write('\n   a b c d e f g h\n');
}
