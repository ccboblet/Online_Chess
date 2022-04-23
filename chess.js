/* This file contains the functions and data structures to graphically make and play chess.
Requirements - <div> with id "chessBoard"
Optional - <p> with id recentMove */

/* Data strucures */
class twoWayMap {
    constructor() {
        this.map = {};
        this.revmap = {};
    }

    addData([id, data]) {
        this.map[id] = data;
        this.revmap[data] = id;
    }

    getId(data) {
        return this.revmap[data];
    }

    getData(id) {
        return this.map[id];
    }
}

/* Constants */
const numToType = {
    1 : "wrook",
    2 : "wknight",
    3 : "wbishop",
    4 : "wqueen",
    5 : "wking",
    6 : "wpawn",
    9 : "brook",
    10 : "bknight",
    11 : "bbishop",
    12 : "bqueen",
    13 : "bking",
    14 : "bpawn"
};

/* Variables */
let squares = new twoWayMap();

let pieces = {}

/* These functions are used to graphically make the board and pieces */
/* This function creates the squares of the board
Default square size is 50px
Each square gets an id of row + column + _
ex. 07_ is the last square on the first row */
function makeBoard(letter = "_", size = "50px") {
    let newSquare;
    let colors = ["lightSquare", "darkSquare"]
    let toggle = true;
    for (let i = 7; i >= 0; i--) {
        toggle ^= true
        for (let j = 0; j < 8; j++) {
            toggle ^= true;
            newSquare = document.createElement("div")
            newSquare.className = colors[toggle] + " squareSize";
            newSquare.id = "" + i + j + "_";
            squares.addData([newSquare.id, i * 16 + j]);
            newSquare.addEventListener("drop", endMove);
            newSquare.addEventListener("dragover", allowMove);
            document.getElementById("chessBoard").appendChild(newSquare);
        }
    }
    resize(size);
}

/* This function loads the piece images and initializes the Board_0x88 data structure
The element ids are also stored in a board object for fast lookup
Input - Board_0x88 */
function loadPieces(position) {
    for(let i = 0; i < position.board.length; i++) {
        if(position.board[i] > 0) {
            let newPiece = document.createElement("img");
            newPiece.src = "img/" + numToType[position.board[i]] + ".png";
            newPiece.id = i + squares.getId(i);
            pieces[newPiece.id] = position.board[i];
            newPiece.className = "chessPiece";
            newPiece.draggable = true;
            newPiece.addEventListener("dragstart", startMove);
            document.getElementById(squares.getId(i)).appendChild(newPiece);
        }
    }
}

/* This function resizes the board and pieces
Input - string size ex. "100px" */
function resize(size) {
    let squares = document.getElementsByClassName("squareSize");
    let board = document.getElementsByClassName("chessBoard");
    for (let i = 0; i < squares.length; i++) {
        squares[i].style.height = size;
        squares[i].style.width = size
    }
    for (let i = 0; i < board.length; i++) {
        board[i].style.gridTemplateColumns = size + " " + size + " " + size + " " + size + " " + size + " " + size + " " + size + " " + size;
    }
}

/* These are the event listeners used to move pieces */

/* This event is triggered on dragstart from a piece */
function startMove(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

/* This event is triggered on drop from a square
This function creates a Move object and passes it to makeMove */
function endMove(ev) {
    ev.preventDefault();
    // Format variables to determine if move is legal
    let start, stop;
    let data = ev.dataTransfer.getData("text");
    
    startSquare = document.getElementById(data).parentElement;
    start = squares.getData(startSquare.id);
    stopSquare = ev.target;
    if(stopSquare.id in pieces) {stopSquare = document.getElementById(stopSquare.id).parentElement;}
    stop = squares.getData(stopSquare.id);
    pieceId = pieces[data];

    if(pieceId >> 3 != boardState.turn) {
        return
    }

    let move = new Move(start, stop, pieceId);

    let valid;
    [valid, boardState] = rules.humanMove(boardState, move);
    if(valid) {
        if(stopSquare.childNodes.length>0){
            stopSquare.removeChild(stopSquare.childNodes[0])
        }
        stopSquare.appendChild(document.getElementById(data));
    
        let computer = rules.computerMove(boardState)
        move = computer[Math.floor(Math.random() * computer.length)]
        rules.updateBoard(boardState, move)
        boardState.turn ^= 1
        startSquare = document.getElementById(squares.getId(move.start))
        pieceId = startSquare.childNodes[0].id
        stopSquare = document.getElementById(squares.getId(move.stop))
        if(stopSquare.childNodes.length>0){
            stopSquare.removeChild(stopSquare.childNodes[0])
        }
        stopSquare.appendChild(document.getElementById(pieceId));
    
    }
}

/* This event is triggered on  */
function allowMove(ev) {
    ev.preventDefault();
}

/* Data structure that contains all the information to repiplicate a chess position */
class Board_0x88 {
    constructor() {
        // Each entry represents a square
        // The values on the left board represent pieces
        // White pice&15>8 bit black piece&15<8
        // 1 = rook, 2 = knight, 3 = bishop, 4 = queen, 5 = king, 6 = pawn
        // The values on the right board have yet to be determined
        this.board = [
            1,   2,   3,   4,   5,   3,   2,   1,      0,0,0,0,0,0,0,0,
            6,   6,   6,   6,   6,   6,   6,   6,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            14, 14,  14,  14,  14,  14,  14,  14,      0,0,0,0,0,0,0,0,
            9,  10,  11,  12,  13,  11,  10,   9,      0,0,0,0,0,0,0,0,
        ];
        // 2 sets of 2 for each castle 
        // 1 => able to castle, 0 => unable to castle 
        // if the king move then both are set to 0
        this.castleflag = 0b1111
        // When a pawn double moves set the en passant square
        this.enpassant = 255
        // Move 1 = white, 0 = black
        this.turn = 0b0
        // Set a flag for promotion
        this.promotion = 255
        // Set king position to help find checks
        this.kings = [4, 116];
    }
}

/* Data structure passed to rules object
Contains start, stop, and piece id (from Board_0x88) */
class Move {
    constructor(start=255, stop=255, pieceId=255) {
        this.start = start
        this.stop = stop
        this.pieceId = pieceId
    }
}

/* Contains all methods and data for determining if a move is legal
Inputs - Board_0x88, Move
Output - Boolean */
let rules = {
    // ruleMap: {
    //         1 : rookRules,
    //         2 : knightRules,
    //         3 : bishopRules,
    //         4 : queenRules,
    //         5 : kingRules,
    //         6 : pawnRules
    //     },

    castleMap: {
        0x00 : 0b0111,
        0x07 : 0b1011,
        0x04 : 0b0011,
        0x70 : 0b1101,
        0x77 : 0b1110,
        0x74 : 0b1100
    },

    // Checks for illegal capture
    // If it is a legal move - 
    // updates turn, en passant
    // returns new position
    // If it is an illegal move - 
    // returns current position

    // Legal move qualifications
    // Capture
    // Path collision
    // Check
    findChecks: function(board) {
        let moves = {};
        let move = new Move(board.kings[board.turn], null, board.turn << 3)
        moveTypes = [1, 2, 3, 4, 5, 6];
        let fakeMove, moveStop, destination;
        for(let i = 0; i < moveTypes.length; i++) {
            fakeMove = new Move(move.start, null, moveTypes[i] + move.pieceId);
            moves = this.generateMove(board, fakeMove);
            for(let j in moves) {
                moveStop = moves[j].stop;
                destination = board.board[moveStop];
                if((destination & 0x7) == moveTypes[i]) {
                    return true;
                } 
            }
        }
        return false;
    },

    updateBoard: function(board, move) {
        board.board[move.start] = 0;
        board.board[move.stop] = move.pieceId;
        if((move.pieceId & 0x7) == 5) {
            let color = (move.pieceId & 0x8)>>3;
            board.kings[color] = move.stop;
        }
    },

    generateMove: function(board, move) {
        let moves = {};
        let direction, destination, moveStop, capture;
        switch(move.pieceId) {
            case 6:
            case 14:
                let row;
                direction = ((move.pieceId>>3)*-2)+1;
                moveStop = move.start + (16 * direction);
                destination = board.board[moveStop];
                if(destination == 0) {
                    moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);

                    row = move.start < 24 || move.start > 95;
                    moveStop = move.start + (32 * direction)
                    destination = board.board[moveStop]
                    if((destination == 0) && row) {
                        moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                    }
                }
                moveStop = move.start + (15 * direction);
                destination = board.board[moveStop];
                capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                if(capture) {
                    moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                }
                moveStop = move.start + (17 * direction);
                destination = board.board[moveStop];
                capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                if(capture) {
                    moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                }
                return moves;
            case 1:
            case 9:
                direction = [1, -1, 16, -16];
                for(i in direction) {
                    moveStop = move.start + direction[i];
                    while(!(moveStop&0x88)) {
                        destination = board.board[moveStop];
                        capture = (destination != 0) && ((move.pieceId&0x8) != (destination&0x8));
                        if(destination == 0 || capture) {
                            moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                        } else {break;}
                        if(capture) {break;}
                        moveStop += direction[i];
                    }
                }
                return moves;
            case 2:
            case 10:
                direction = [31, 33, 14, 18, -31, -33, -14, -18];
                for(i in direction) {
                    moveStop = move.start + direction[i];
                    destination = board.board[moveStop];
                    capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                    if((destination == 0 || capture) && !(moveStop&0x88)) {
                        moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                    }
                }
                return moves;
            case 3:
            case 11:
                direction = [15, 17, -15, -17];
                for(i in direction) {
                    moveStop = move.start + direction[i];
                    while(!(moveStop&0x88)) {
                        destination = board.board[moveStop];
                        capture = (destination != 0) && ((move.pieceId&0x8) != (destination&0x8));
                        if(destination == 0 || capture) {
                            moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                        } else {break;}
                        if(capture) {break;}
                        moveStop += direction[i];
                    }
                }
                return moves;
            case 4:
            case 12:
                direction = [1, -1, 16, -16, 15, 17, -15, -17];
                for(i in direction) {
                    moveStop = move.start + direction[i];
                    while(!(moveStop&0x88)) {
                        destination = board.board[moveStop];
                        capture = (destination != 0) && ((move.pieceId&0x8) != (destination&0x8));
                        if(destination == 0 || capture) {
                            moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                        } else {break;}
                        if(capture) {break;}
                        moveStop += direction[i];
                    }
                }
            case 5:
            case 13:
                direction = [1, -1, 16, -16, 15, 17, -15, -17];
                for(i in direction) {
                    moveStop = move.start + direction[i];
                    destination = board.board[moveStop];
                    capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                    if((destination == 0 || capture) && !(moveStop&0x88)) {
                        moves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                    }
                }
                return moves;
        }
    },

    humanMove: function(board, move) {
        let checkCopyBoardState = JSON.parse(JSON.stringify(board))
        let moveId = "" + move.start + move.stop;
        moves = rules.generateMove(checkCopyBoardState, move);
        if(moves.hasOwnProperty(moveId)) {
            rules.updateBoard(checkCopyBoardState, moves[moveId]);
            if(!rules.findChecks(checkCopyBoardState)){
                checkCopyBoardState.turn ^= 1
                return [true, checkCopyBoardState];
            }
        }
        return [false, boardState]
        // Generate all moves
        // If move in all moves
        // Check for checks
        // Return updated board
    },

    computerMove: function(board) {
        let allMoves = [];
        let fakeBoard, testMoves;
        for(let i = 0; i < 128; i++) {
            if(board.board[i] > 0 && (board.board[i] >> 3 == board.turn)) {
                move = new Move(i, null, board.board[i])
                testMoves = this.generateMove(board, move)
                for(j in testMoves) {
                    fakeBoard = JSON.parse(JSON.stringify(board));
                    this.updateBoard(fakeBoard, testMoves[j])
                    if(this.findChecks(fakeBoard)) {
                        delete testMoves.j;
                    } else {
                        allMoves.push(testMoves[j])
                    }
                }
            }
        }
        return allMoves;
    }
}