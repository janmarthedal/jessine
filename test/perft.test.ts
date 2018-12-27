import { perft } from '../src/perft';

describe('perft', () => {

    test('Initial Position', () => {
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0';
        expect(perft(fen, 1)).toBe(20);
        expect(perft(fen, 2)).toBe(400);
        expect(perft(fen, 3)).toBe(8902);
        expect(perft(fen, 4)).toBe(197281);
    });

    test('Position 2', () => {
        const fen = 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0';
        expect(perft(fen, 1)).toBe(48);
        expect(perft(fen, 2)).toBe(2039);
        expect(perft(fen, 3)).toBe(97862);
    });

    test('Position 3', () => {
        const fen = '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0';
        expect(perft(fen, 1)).toBe(14);
        expect(perft(fen, 2)).toBe(191);
        expect(perft(fen, 3)).toBe(2812);
        expect(perft(fen, 4)).toBe(43238);
        expect(perft(fen, 5)).toBe(674624);
    });

    test('Position 4w', () => {
        const fen = 'r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0';
        expect(perft(fen, 1)).toBe(6);
        expect(perft(fen, 2)).toBe(264);
        expect(perft(fen, 3)).toBe(9467);
        expect(perft(fen, 4)).toBe(422333);
    });

    test('Position 4b', () => {
        const fen = 'r2q1rk1/pP1p2pp/Q4n2/bbp1p3/Np6/1B3NBn/pPPP1PPP/R3K2R b KQ - 0';
        expect(perft(fen, 1)).toBe(6);
        expect(perft(fen, 2)).toBe(264);
        expect(perft(fen, 3)).toBe(9467);
        expect(perft(fen, 4)).toBe(422333);
    });

    test('Position 5', () => {
        const fen = 'rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8';
        expect(perft(fen, 1)).toBe(44);
        expect(perft(fen, 2)).toBe(1486);
        expect(perft(fen, 3)).toBe(62379);
    });

    test('Position 6', () => {
        const fen = 'r4rk1/1pp1qppp/p1np1n2/2b1p1B1/2B1P1b1/P1NP1N2/1PP1QPPP/R4RK1 w - - 0 10';
        expect(perft(fen, 1)).toBe(46);
        expect(perft(fen, 2)).toBe(2079);
        expect(perft(fen, 3)).toBe(89890);
    });

});
