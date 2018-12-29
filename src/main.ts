import { createInterface } from 'readline';
import { openSync, writeSync, closeSync } from 'fs';
import { Game, initGame as initGame, PIECE_MASK } from './board';
import { algebraicToMove, makeMove, moveToAlgebraic, Move } from './moves';
import { generateLegalMoves } from './variations/common';
import { create as createRandom } from './variations/random';
import { create as createMaterial } from './variations/material';

const logFD = openSync(`./log-${Date.now()}.txt`, 'w');

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

let game: Game;

function makeMoveAlgebraic(game: Game, moveStr: string) {
    const { from, to, promoted } = algebraicToMove(moveStr);
    const moves = generateLegalMoves(game);
    const moveMatches = moves.filter(move =>
        move[0] === from && move[1] === to && (!promoted || promoted === (move[2] & PIECE_MASK)));
    if (moveMatches.length !== 1) {
        debug(`from ${from} to ${to}`);
        debug(`${moves.length} moves`);
        moves.forEach(move => debug(`move ${move[0]}-${move[1]}`));
        process.exit(1);
        debug(`${moveMatches.length} move matches`);
    }
    makeMove(game, moveMatches[0]);
}

let goFunction: (game: Game) => Move;

if (process.argv[2] == 'random') {
    debug('Engine: random');
    goFunction = createRandom(debug);
} else if (process.argv[2] == 'material') {
    const depth = Number.parseInt(process.argv[3]);
    debug(`Engine: material ${depth}`);
    goFunction = createMaterial(depth, debug);
} else {
    console.error('Usage: node jessine.js [engine] [options...]');
    process.exit(0);
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
        let fen: string;
        let index = 2;
        if (items[1] == 'startpos') {
            // position startpos
            // position startpos moves e2e4 e7e5
            fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0';
        } else if (items[1] == 'fen' && items.length >= 4) {
            // position fen rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w moves e2e4 e7e5
            const fenItems: Array<string> = [];
            while (index < items.length && items[index] != 'moves') {
                fenItems.push(items[index++]);
            }
            fen = fenItems.join(' ');
        } else {
            debug('position: unknown');
            process.exit(1);
        }
        debug('init position: ' + fen);
        game = initGame(fen);
        if (index < items.length && items[index] == 'moves') {
            index++;
            while (index < items.length) {
                makeMoveAlgebraic(game, items[index++]);
            }
        }
    } else if (items[0] == 'go') {
        const move = goFunction(game);
        if (!move) {
            process.exit(1);
        }
        output('bestmove ' + moveToAlgebraic(move));
    }
});

rl.on('close', () => {
    debug('input stream closed');
    closeSync(logFD);
});
