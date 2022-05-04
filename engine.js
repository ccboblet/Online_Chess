let engine = {
    pieceVal : {
        1 : 5,
        2 : 3,
        3 : 3,
        4 : 9,
        5 : 100,
        6 : 1
    },

    evaluate: function(board) {
        let points = 0;
        let color;
        for(let i = 0; i < board.board.length; i++) {
            color = board.board[i] & 0x8
            if(board.board[i] > 0 && color) {
                points -= this.pieceVal[board.board[i] & 0x7];
            } else if(board.board[i] > 0 && !color) {
                points += this.pieceVal[board.board[i] & 0x7];
            }
        }
        return points;
    },

    miniMaxRoot: function(board, depth) {
        let bestMove
        let nextBoard;
        let points, p;
        if(board.turn == 0) {
            points = -200;
        } else {
            points = 200
        }
        let allMoves = rules.computerMove(board);
        for(let m in allMoves) {
            nextBoard = JSON.parse(JSON.stringify(board));
            rules.updateBoard(nextBoard, allMoves[m]);
            nextBoard.turn ^= 1;
            p = this.minimax(nextBoard, depth - 1)
            if(p <= points && board.turn) {
                points = p;
                bestMove = allMoves[m]
            } else if(p >= points && !board.turn) {
                points = p;
                bestMove = allMoves[m];
            }
        }
        return bestMove;
    },

    minimax: function(board, depth = 0) {
        if(depth == 0) {
            return this.evaluate(board)
        }
        let nextBoard;
        let points, p;
        if(board.turn == 0) {
            points = -200;
        } else {
            points = 200
        }
        let allMoves = rules.computerMove(board);
        for(let m in allMoves) {
            nextBoard = JSON.parse(JSON.stringify(board));
            rules.updateBoard(nextBoard, allMoves[m]);
            nextBoard.turn ^= 1;
            p = this.minimax(nextBoard, depth - 1)
            if(p <= points && board.turn) {
                points = p;
                bestMove = allMoves[m]
            } else if(p >= points && !board.turn) {
                points = p;
                bestMove = allMoves[m];
            }
        }
        return points;
    }
}