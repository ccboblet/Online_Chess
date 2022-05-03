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
        let color = board.turn << 3;
        for(let i = 0; i < board.board.length; i++) {
            if(board.board[i] > 0 && board.board[i] & 0x8) {
                points -= this.pieceVal[board.board[i] & 0x7];
            } else if(board.board[i] > 0 && !(board.board[i] & 0x0)) {
                points += this.pieceVal[board.board[i] & 0x7];
            }
        }
        return points;
    },

    oneMoveAhead: function(board) {
        let nowMove = rules.computerMove(board)
        let nextMove;
        let points = -200, nextPoints = 200;
        let bestMove;
        let pointMulti = (-2 * board.turn) + 1
        for(m in nowMove) {
            nextPoints = 200;
            boardCopy = JSON.parse(JSON.stringify(board));
            rules.updateBoard(boardCopy, nowMove[m]);
            boardCopy.turn ^= 1;
            nextMove = rules.computerMove(boardCopy);
            for(n in nextMove) {
                boardCopyNext = JSON.parse(JSON.stringify(boardCopy));
                rules.updateBoard(boardCopyNext, nextMove[n]);
                boardCopy.turn ^= 1;
                nextPoints = Math.min(this.evaluate(boardCopyNext) * (pointMulti), nextPoints);
            }
            if(nextPoints > points) {
                points = nextPoints;
                bestMove = nowMove[m];
            } else if(nextPoints == points && Math.floor(Math.random() * 2)) {
                bestMove = nowMove[m];
            }
        }
        return bestMove;
    }
}