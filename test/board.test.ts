import {
    initBoard, BOARD_INDEX_TURN, WHITE, BOARD_INDEX_CASTLING, CASTLING_KING_WHITE,
    CASTLING_QUEEN_WHITE, CASTLING_KING_BLACK, CASTLING_QUEEN_BLACK, BOARD_INDEX_EP,
    BOARD_INDEX_PLYS, BOARD_INDEX_WHITE_KING, BOARD_INDEX_BLACK_KING, BLACK, algebraicToPos, Board, posToAlgebraic
} from '../src/board';
import { generateMoves, makeMoveIfLegal, unmakeMove, isAttackedBy, moveToAlgebraic } from '../src/moves';

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

describe('posToAlgebraic', () => {

    test('1', () => {
        expect(posToAlgebraic(91)).toBe('a1');
        expect(posToAlgebraic(82)).toBe('b2');
        expect(posToAlgebraic(73)).toBe('c3');
        expect(posToAlgebraic(64)).toBe('d4');
        expect(posToAlgebraic(55)).toBe('e5');
        expect(posToAlgebraic(46)).toBe('f6');
        expect(posToAlgebraic(37)).toBe('g7');
        expect(posToAlgebraic(28)).toBe('h8');
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
        const ml = moves.map(m => moveToAlgebraic(m));
        ml.sort();
        expect(ml).toEqual([
            "a2a3", "a2a4", "b1a3", "b1c3", "b2b3", "b2b4", "c2c3", "c2c4", "d2d3", "d2d4",
            "e2e3", "e2e4", "f2f3", "f2f4", "g1f3", "g1h3", "g2g3", "g2g4", "h2h3", "h2h4"
        ]);
    });

    test('2', () => {
        const board = initBoard('rnbqk1nr/pppp1ppp/8/4p3/1b2P3/8/PPPP1PPP/RNBQKBNR w KQkq - 1');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => moveToAlgebraic(m));
        ml.sort();
        expect(ml).toEqual([
            "a2a3", "a2a4", "b1a3", "b1c3", "b2b3", "c2c3", "c2c4", "d1e2", "d1f3", "d1g4",
            "d1h5", "e1e2", "f1a6", "f1b5", "f1c4", "f1d3", "f1e2", "f2f3", "f2f4", "g1e2",
            "g1f3", "g1h3", "g2g3", "g2g4", "h2h3", "h2h4"
        ]);
    });

});
