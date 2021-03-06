// board: 12 x 10 = 120
// turn: 1
// castling: 1
// en passant: 1
// plys since pawn move or capture: 1
export interface Game {
    board: Uint8Array;
    whiteKing: number;
    blackKing: number;
}
export const BOARD_INDEX_TURN = 120;
export const BOARD_INDEX_CASTLING = 121;
export const BOARD_INDEX_EP = 122;
export const BOARD_INDEX_PLYS = 123;

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

function createGame(): Game {
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
    return {
        board,
        whiteKing: 0,
        blackKing: 0
    };
}

const SPACES = '        ';

export function initGame(fen: string): Game {
    const game = createGame();
    const board = game.board;
    const items = fen.split(' ');
    let pieces = items[0];
    pieces = fen.replace(/\//g, '');
    for (let k = 1; k <= 8; k++) {
        pieces = pieces.replace(new RegExp(k.toString(), 'g'), SPACES.substr(0, k));
    }
    for (let k = 0; k < 64; k++) {
        const p = pieces[k];
        const boardIndex = ((k >> 3) + 2) * 10 + (k & 7) + 1;
        const i = ASCII_CHARS.indexOf(p);
        const piece = ASCII_PIECES[i];
        board[boardIndex] = piece;
        if (piece === (KING | WHITE)) {
            game.whiteKing = boardIndex;
        } else if (piece === (KING | BLACK)) {
            game.blackKing = boardIndex;
        }
    }
    const castling = items[2];
    board[BOARD_INDEX_TURN] = items[1].toUpperCase() === 'W' ? WHITE : BLACK;
    board[BOARD_INDEX_CASTLING] = (castling.indexOf('K') >= 0 ? CASTLING_KING_WHITE : 0) |
        (castling.indexOf('Q') >= 0 ? CASTLING_QUEEN_WHITE : 0) |
        (castling.indexOf('k') >= 0 ? CASTLING_KING_BLACK : 0) |
        (castling.indexOf('q') >= 0 ? CASTLING_QUEEN_BLACK : 0);
    board[BOARD_INDEX_EP] = items[3].length === 2 ? algebraicToPos(items[3]) : 0;
    board[BOARD_INDEX_PLYS] = Number.parseInt(items[4]);
    return game;
}

/*function fenCastling(castling: number) {
    let s = '';
    if ((castling & CASTLING_KING_WHITE) !== 0) s += 'K';
    if ((castling & CASTLING_QUEEN_WHITE) !== 0) s += 'Q';
    if ((castling & CASTLING_KING_BLACK) !== 0) s += 'k';
    if ((castling & CASTLING_QUEEN_BLACK) !== 0) s += 'q';
    return s.length === 0 ? '-' : s;
}*/

export function showBoard(game: Game) {
    for (let r = 2; r < 10; r++) {
        process.stdout.write((10 - r).toString() + ' ');
        for (let c = 1; c <= 8; c++) {
            const piece = game.board[10 * r + c];
            const index = ASCII_PIECES.indexOf(piece);
            process.stdout.write(' ');
            process.stdout.write(ASCII_CHARS[index]);
        }
        process.stdout.write('\n');
    }
    process.stdout.write('\n   a b c d e f g h\n');
}

export function algebraicToPos(alg: string) {
    alg = alg.toLowerCase();
    return (alg.charCodeAt(0) - 96) + 10 * (58 - alg.charCodeAt(1));
}

export function posToAlgebraic(pos: number) {
    return String.fromCharCode(96 + pos % 10) + String.fromCharCode(58 - Math.floor(pos / 10));
}
