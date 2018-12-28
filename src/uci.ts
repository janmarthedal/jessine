import { createInterface } from 'readline';
import { openSync, writeSync } from 'fs';
import { Board, initBoard } from './board';
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
    const { from, to } = algebraicToMove(moveStr);
    const moves = generateLegalMoves(board);
    const moveMatches = moves.filter(move => move[0] === from && move[1] === to);
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
        // position startpos
        // position startpos moves e2e4 e7e5
        const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0';
        board = initBoard(fen);
        if (items.length >= 3 && items[2] == 'moves') {
            for (let k = 3; k < items.length; k++) {
                makeMoveAlgebraic(board, items[k]);
            }
        }
    } else if (items[0] == 'go') {
        const moves = generateLegalMoves(board);
        if (moves.length === 0) {
            process.exit(1);
        }
        const move = moves[Math.floor(moves.length * Math.random())];
        output('bestmove ' + moveToAlgebraic(move));
    }
});

rl.on('close', () => {
    writeSync(logFD, '- closed');
});
