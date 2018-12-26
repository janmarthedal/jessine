import {
    initBoard, showBoard, Board, PIECE_MASK, BISHOP, KNIGHT, ROOK, QUEEN, KING
} from './board';
import { generateMoves, unmakeMove, Move, makeMoveIfLegal } from './moves';

function moveToString(board: Board, move: Move) {
    let prefix = '';
    switch (board[move[0]] & PIECE_MASK) {
        case BISHOP: prefix = 'B'; break;
        case KNIGHT: prefix = 'N'; break;
        case ROOK: prefix = 'R'; break;
        case QUEEN: prefix = 'Q'; break;
        case KING: prefix = 'K'; break;
    }
    return prefix + 'abcdefgh'[move[1] % 10 - 1] + (10 - Math.floor(move[1] / 10));
}

function perftSub(board: Board, depth: number, showMove: boolean) {
    if (depth === 0)
        return 1;

    const moves = generateMoves(board);

    let result = 0;
    for (const move of moves) {
        const legalMove = makeMoveIfLegal(board, move);
        if (legalMove) {
            const countSub = perftSub(board, depth - 1, false);
            unmakeMove(board, move);
            if (showMove)
                console.log(moveToString(board, move), countSub);
            result += countSub;
        }
    }
    return result;
}

function perft(fen: string, depth: number) {
    const board = initBoard(fen);
    showBoard(board);
    return perftSub(board, depth, true);
}

// const count = perft('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0', 5);
// const count = perft('8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0', 2);
const count = perft('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0', 3);

console.log(count);
