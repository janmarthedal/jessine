import { Board, initBoard } from "./board";
import { generateMoves, makeMoveIfLegal, unmakeMove } from "./moves";

function perftSub(board: Board, depth: number) {
    if (depth === 0)
        return 1;

    const moves = generateMoves(board);

    let result = 0;
    for (const move of moves) {
        const legalMove = makeMoveIfLegal(board, move);
        if (legalMove) {
            const countSub = perftSub(board, depth - 1);
            unmakeMove(board, move);
            result += countSub;
        }
    }
    return result;
}

export function perft(fen: string, depth: number) {
    const board = initBoard(fen);
    const save = [...board];
    const result = perftSub(board, depth);
    if (!save.every((v, i) => v === board[i]))
        throw 'board mismatch';
    return result;
}
