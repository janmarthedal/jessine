import {
    initBoard, BOARD_INDEX_TURN, WHITE, BOARD_INDEX_CASTLING, CASTLING_KING_WHITE,
    CASTLING_QUEEN_WHITE, CASTLING_KING_BLACK, CASTLING_QUEEN_BLACK, BOARD_INDEX_EP,
    BOARD_INDEX_PLYS, BOARD_INDEX_WHITE_KING, BOARD_INDEX_BLACK_KING, BLACK, algebraicToPos
} from '../src/board';

describe('algebraicToPos', () => {

    test('1', () => {
        expect(algebraicToPos('a1')).toBe(91);
        expect(algebraicToPos('b2')).toBe(82);
        expect(algebraicToPos('c3')).toBe(73);
        expect(algebraicToPos('d4')).toBe(64);
        expect(algebraicToPos('e5')).toBe(55);
        expect(algebraicToPos('f6')).toBe(46);
        expect(algebraicToPos('g7')).toBe(37);
        expect(algebraicToPos('h8')).toBe(28);
    });

});

describe('Set up board', () => {

    test('initBoard 1', () => {
        const board = initBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0');
        expect(board[BOARD_INDEX_TURN]).toBe(WHITE);
        expect(board[BOARD_INDEX_CASTLING]).toBe(CASTLING_KING_WHITE | CASTLING_QUEEN_WHITE | CASTLING_KING_BLACK | CASTLING_QUEEN_BLACK);
        expect(board[BOARD_INDEX_EP]).toBe(0);
        expect(board[BOARD_INDEX_PLYS]).toBe(0);
        expect(board[BOARD_INDEX_WHITE_KING]).toBe(95);
        expect(board[BOARD_INDEX_BLACK_KING]).toBe(25);
    });

    test('initBoard 2', () => {
        const board = initBoard('rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1');
        expect(board[BOARD_INDEX_TURN]).toBe(BLACK);
        expect(board[BOARD_INDEX_CASTLING]).toBe(CASTLING_KING_WHITE | CASTLING_QUEEN_WHITE | CASTLING_KING_BLACK | CASTLING_QUEEN_BLACK);
        expect(board[BOARD_INDEX_EP]).toBe(75);
        expect(board[BOARD_INDEX_PLYS]).toBe(0);
        expect(board[BOARD_INDEX_WHITE_KING]).toBe(95);
        expect(board[BOARD_INDEX_BLACK_KING]).toBe(25);
    });

});
