import {
    initBoard, BOARD_INDEX_TURN, WHITE, BOARD_INDEX_CASTLING, CASTLING_KING_WHITE,
    CASTLING_QUEEN_WHITE, CASTLING_KING_BLACK, CASTLING_QUEEN_BLACK, BOARD_INDEX_EP,
    BOARD_INDEX_PLYS, BOARD_INDEX_WHITE_KING, BOARD_INDEX_BLACK_KING, BLACK, algebraicToPos, Board
} from '../src/board';
import { generateMoves, makeMoveIfLegal, unmakeMove, isAttackedBy } from '../src/moves';

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

describe('isAttackedBy', () => {

    test('1', () => {
        const board = initBoard('rnbqk1nr/pppp1ppp/8/4p3/1b2P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1');
        expect(isAttackedBy(board, 84, BLACK)).toBe(true);
    });

});

function generateLegalMoves(board: Board) {
    return generateMoves(board).filter(move => {
        const legalMove = makeMoveIfLegal(board, move);
        if (legalMove) {
            unmakeMove(board, move);
            return true;
        }
        return false;
    });
}

describe('Move generation', () => {

    test('Initial position', () => {
        const board = initBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => [m[0], m[1]]);
        ml.sort((a, b) => (a[0] - b[0]) | (a[1] - b[1]));
        expect(ml).toEqual([
            [ 81, 61 ], [ 81, 71 ], [ 82, 62 ], [ 83, 63 ],
            [ 82, 72 ], [ 83, 73 ], [ 84, 64 ], [ 85, 65 ],
            [ 84, 74 ], [ 86, 66 ], [ 87, 67 ], [ 88, 68 ],
            [ 92, 71 ], [ 92, 73 ], [ 85, 75 ], [ 86, 76 ],
            [ 87, 77 ], [ 88, 78 ], [ 97, 76 ], [ 97, 78 ]
        ]);
    });

    test('2', () => {
        const board = initBoard('rnbqk1nr/pppp1ppp/8/4p3/1b2P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => [m[0], m[1]]);
        ml.sort((a, b) => (a[0] - b[0]) | (a[1] - b[1]));
        expect(ml).toEqual([
            [81, 61], [83, 63], [86, 66], [88, 68], [81, 71], [83, 73],
            [86, 76], [87, 77], [92, 71], [82, 72], [87, 67], [94, 58],
            [94, 67], [94, 76], [88, 78], [96, 41], [96, 52], [96, 63],
            [92, 73], [96, 74], [97, 76], [97, 78], [94, 85], [95, 85],
            [96, 85], [97, 85]
        ]);
    });

});
