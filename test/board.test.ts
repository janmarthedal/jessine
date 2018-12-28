import {
    initBoard, BOARD_INDEX_TURN, WHITE, BOARD_INDEX_CASTLING, CASTLING_KING_WHITE,
    CASTLING_QUEEN_WHITE, CASTLING_KING_BLACK, CASTLING_QUEEN_BLACK, BOARD_INDEX_EP,
    BOARD_INDEX_PLYS, BOARD_INDEX_WHITE_KING, BOARD_INDEX_BLACK_KING, BLACK, algebraicToPos, Board, posToAlgebraic
} from '../src/board';
import { generateMoves, makeMove, unmakeMove, isAttackedBy, moveToAlgebraic, Move } from '../src/moves';

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

function generateLegalMoves(board: Board): Array<Move> {
    const save = [...board];
    const moves = generateMoves(board).filter(move => {
        const legalMove = makeMove(board, move);
        if (legalMove) {
            unmakeMove(board, move);
            return true;
        }
        return false;
    });
    expect([...board]).toEqual(save);
    return moves;
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

    test('3', () => {
        const board = initBoard('8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => moveToAlgebraic(m));
        ml.sort();
        expect(ml).toEqual([
            "a5a4", "a5a6", "b4a4", "b4b1", "b4b2", "b4b3", "b4c4", "b4d4", "b4e4", "b4f4",
            "e2e3", "e2e4", "g2g3", "g2g4"
        ]);
    });

    /*test.only('3.e2e4', () => {
        const board = initBoard('8/2p5/3p4/KP5r/1R2Pp1k/8/6P1/8 b - - 0');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => moveToAlgebraic(m));
        ml.sort();
        expect(ml).toEqual([
        ]);
    });*/

    test('black pawns', () => {
        const board = initBoard('k7/pp3ppp/8/8/2pPp3/8/8/K7 b - d3 0');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => moveToAlgebraic(m));
        ml.sort();
        expect(ml).toEqual([
            "a7a5", "a7a6", "a8b8", "b7b5", "b7b6", "c4c3", "c4d3", "e4d3", "e4e3",
            "f7f5", "f7f6", "g7g5", "g7g6", "h7h5", "h7h6"
        ]);
    });

    test('white pawns', () => {
        const board = initBoard('k7/8/8/2PpP3/8/8/PP3PPP/K7 w - d6 0');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => moveToAlgebraic(m));
        ml.sort();
        expect(ml).toEqual([
            "a1b1", "a2a3", "a2a4", "b2b3", "b2b4", "c5c6", "c5d6", "e5d6", "e5e6",
            "f2f3", "f2f4", "g2g3", "g2g4", "h2h3", "h2h4"
        ]);
    });

    test('Position 5', () => {
        const board = initBoard('rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8');
        const moves = generateLegalMoves(board);
        const ml = moves.map(m => moveToAlgebraic(m));
        ml.sort();
        expect(ml).toEqual([
            "a2a3", "a2a4", "b1a3", "b1c3", "b1d2", "b2b3", "b2b4", "c1d2", "c1e3",
            "c1f4", "c1g5", "c1h6", "c2c3", "c4a6", "c4b3", "c4b5", "c4d3", "c4d5",
            "c4e6", "c4f7", "d1d2", "d1d3", "d1d4", "d1d5", "d1d6", "d7c8", "d7c8",
            "d7c8", "d7c8", "e1d2", "e1f1", "e1f2", "e1g1", "e2c3", "e2d4", "e2f4",
            "e2g1", "e2g3", "g2g3", "g2g4", "h1f1", "h1g1", "h2h3", "h2h4"
        ]);
    });

});
