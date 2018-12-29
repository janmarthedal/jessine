import { Game, initGame } from "./board";
import { generateMoves, unmakeMove, makeMove } from "./moves";

function perftSub(game: Game, depth: number) {
    if (depth === 0)
        return 1;

    const moves = generateMoves(game);

    let result = 0;
    for (const move of moves) {
        const legalMove = makeMove(game, move);
        if (legalMove) {
            const countSub = perftSub(game, depth - 1);
            unmakeMove(game, move);
            result += countSub;
        }
    }
    return result;
}

export function perft(fen: string, depth: number) {
    const game = initGame(fen);
    const save = [...game.board];
    const result = perftSub(game, depth);
    if (!save.every((v, i) => v === game.board[i]))
        throw 'board mismatch';
    return result;
}
