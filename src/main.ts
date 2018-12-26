import { initBoardFromFEN, showBoard, Board, PIECE_MASK, BISHOP, KNIGHT, ROOK, QUEEN, KING } from './board';
import { generateMoves, makeMove, unmakeMove, Move } from './moves';

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

    if (depth === 1)
        return moves.length;

    let result = 0;
    for (const move of moves) {
        makeMove(board, move);
        const countSub = perftSub(board, depth - 1, false);
        unmakeMove(board, move);
        if (showMove)
            console.log(moveToString(board, move), countSub);
        result += countSub;
    }
    return result;
}

function perft(fen: string, depth: number) {
    const board = initBoardFromFEN(fen);
    showBoard(board);
    return perftSub(board, depth, true);
    
}

const count = perft('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', 4);

console.log(count);
