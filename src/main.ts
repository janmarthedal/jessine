import { initBoardFromFEN, showBoard, Board } from './board';
import { generateMoves, makeMove, unmakeMove } from './moves';

function subPerft(board: Board, depth: number) {
    if (depth === 0)
        return 1;
    
    const moves = generateMoves(board);

    if (depth === 1)
        return moves.length;

    let result = 0;
    for (const move of moves) {
        makeMove(board, move);
        result += subPerft(board, depth - 1);
        unmakeMove(board, move);
    }
    return result;
}

function perft(fen: string, depth: number) {
    const board = initBoardFromFEN(fen);
    showBoard(board);
    return subPerft(board, depth);
    
}

const count = perft('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR', 2);

console.log(count);
