import { createInterface } from 'readline';
import { openSync, writeSync, closeSync } from 'fs';
import { Board, initBoard, PIECE_MASK } from './board';
import { algebraicToMove, Move, generateMoves, makeMove, unmakeMove, moveToAlgebraic } from './moves';

const logFD = openSync('./log.txt', 'w');

function output(line: string) {
    line += '\n';
    writeSync(logFD, '< ' + line);
    process.stdout.write(line);
}

function debug(line: string) {
    writeSync(logFD, '# ' + line + '\n');
}

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

let board: Board;

function generateLegalMoves(board: Board): Array<Move> {
    return generateMoves(board).filter(move => {
        const legalMove = makeMove(board, move);
        if (legalMove) {
            unmakeMove(board, move);
            return true;
        }
        return false;
    });
}

function makeMoveAlgebraic(board: Board, moveStr: string) {
    const { from, to, promoted } = algebraicToMove(moveStr);
    const moves = generateLegalMoves(board);
    const moveMatches = moves.filter(move =>
        move[0] === from && move[1] === to && (!promoted || promoted === (move[2] & PIECE_MASK)));
    if (moveMatches.length !== 1) {
        debug(`from ${from} to ${to}`);
        debug(`${moves.length} moves`);
        moves.forEach(move => debug(`move ${move[0]}-${move[1]}`));
        process.exit(1);
        debug(`${moveMatches.length} move matches`);
    }
    makeMove(board, moveMatches[0]);
}

rl.on('line', (input: string) => {
    writeSync(logFD, '> ' + input + '\n');

    const items = input.split(' ');

    if (items[0] == 'uci') {
        output('id name jessine');
        output('id author Jan Marthedal Rasmussen');
        output('uciok');
    } else if (items[0] == 'isready') {
        output('readyok');
    } else if (items[0] == 'position') {
        let fen: string, movesIndex: number;
        if (items[1] == 'startpos') {
            // position startpos
            // position startpos moves e2e4 e7e5
            fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0';
            movesIndex = 2;
        } /*else if (items[1] == 'fen') {
            //items.
        }*/ else {
            debug('position: unknown');
            process.exit(1);
        }
        board = initBoard(fen);
        if (items.length > movesIndex && items[movesIndex] == 'moves') {
            for (let k = movesIndex + 1; k < items.length; k++) {
                makeMoveAlgebraic(board, items[k]);
            }
        }
    } else if (items[0] == 'go') {
        const moves = generateLegalMoves(board);
        if (moves.length === 0) {
            debug('go: no legal moves');
            process.exit(1);
        }
        const move = moves[Math.floor(moves.length * Math.random())];
        output('bestmove ' + moveToAlgebraic(move));
    }
});

rl.on('close', () => {
    debug('input stream closed');
    closeSync(logFD);
});
