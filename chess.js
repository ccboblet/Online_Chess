// Data structure that contains all the information to repiplicate a chess position
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
        // Move 0 = white, 1 = black
        this.turn = 0b0
        // Set a flag for promotion
        this.promotion = 255
        // Set king position to help find checks
        this.kings = [4, 116];
    }
};

// Data structure to store a move
class Move {
    constructor(start=255, stop=255, pieceId=255) {
        this.start = start;
        this.stop = stop;
        this.pieceId = pieceId;
    };
};

// Input - htm board element id string "chessBoard"; square identifier character "_"; square size string "50px"
// Output - twoWayMap key - htm square id string; val - integer representation of the square
// This function creates the htm elements for the squares on the chess board.
class twoWayMap {
    constructor() {
        this.map = {};
        this.revmap = {};
    };

    addData([id, data]) {
        this.map[id] = data;
        this.revmap[data] = id;
    };

    getId(data) {
        return this.revmap[data];
    };

    getData(id) {
        return this.map[id];
    };
};
let squares = new twoWayMap();
// The eventlistener allow pieces to be dragged over squares.
function allowMove(ev) {
    ev.preventDefault();
};
function makeBoard(boardId = "chessBoard", letter = "_", size = "50px") {
    let newSquare;
    let colors = ["lightSquare", "darkSquare"];
    let toggle = true;
    for (let i = 7; i >= 0; i--) {
        toggle ^= true;
        for (let j = 0; j < 8; j++) {
            toggle ^= true;
            newSquare = document.createElement("div");
            newSquare.className = colors[toggle] + " squareSize";
            newSquare.id = "" + i + j + letter;
            squares.addData([newSquare.id, i * 16 + j]);
            newSquare.addEventListener("drop", endMove);
            newSquare.addEventListener("dragover", allowMove);
            document.getElementById(boardId).appendChild(newSquare);
        };
    };
    resize(size);
};

// Input - size in pixels as a string ex: "50px"
// Output - None
// This function changes the size of the board by manipulating the properties of the chessBoard and squareSize classes.
function resize(size = "50px") {
    let squares = document.getElementsByClassName("squareSize");
    let board = document.getElementsByClassName("chessBoard");
    for (let i = 0; i < squares.length; i++) {
        squares[i].style.height = size;
        squares[i].style.width = size;
    };
    for (let i = 0; i < board.length; i++) {
        board[i].style.gridTemplateColumns = size + " " + size + " " + size + " " + size + " " + size + " " + size + " " + size + " " + size;
    };
};

// Input - Board_0x88 object
// Output - object key - htm piece id string; val - integer representaion of piece location
// This function loads the piece images using the numToType constant object and adds them as children to htm squares.
// Activates an event listener on dragstart for pieces.
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
// This event is triggered on drag start to store data of the piece dragged
function startMove(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
};
let pieces = {}
function loadPieces(position) {
    for(let i = 0; i < position.board.length; i++) {
        if(position.board[i] > 0 && ((position.board[i] & 0xF0) == 0)) {
            let newPiece = document.createElement("img");
            newPiece.src = "img/" + numToType[position.board[i]] + ".png";
            newPiece.id = i + squares.getId(i);
            pieces[newPiece.id] = position.board[i];
            newPiece.className = "chessPiece";
            newPiece.draggable = true;
            newPiece.addEventListener("dragstart", startMove);
            document.getElementById(squares.getId(i)).appendChild(newPiece);
        };
    };
};

/* This event is triggered on drop from a square
This function creates a Move object and passes it to makeMove */
function endMove(ev) {
    ev.preventDefault();
    // Board_0x88 id's of start and stop squares
    let start, stop;
    // htm elements of start and stop squares
    let startSquare, stopSquare;
    // htm id of dragged piece
    let data = ev.dataTransfer.getData("text");
    // Board_0x88 id of dragged piece
    let pieceId;
    // All possible moves from a start location
    let allMoves;
    // String representation of move object to use as a key
    let moveId;
    // Deep copy of the boardState to find checks
    let boardStateCopy;

    startSquare = document.getElementById(data).parentElement;
    start = squares.getData(startSquare.id);
    stopSquare = ev.target;
    // Get the htm square id behind a piece if the move ends on another piece
    if(stopSquare.id in pieces) {
        stopSquare = document.getElementById(stopSquare.id).parentElement;
    };
    stop = squares.getData(stopSquare.id);
    pieceId = pieces[data];

    // Check if correct color was moved
    if(pieceId >> 3 != boardState.turn) {
        return
    }

    // Test code
    document.getElementById("recentMove").innerHTML = "Point evaluation " + engine.evaluate(boardState);

    // Create a Move object for the player move
    let move = new Move(start, stop, pieceId);
    moveId = "" + move.start + move.stop;

    allMoves = rules.generateLegalMoves(boardState, move);
    if(moveId in allMoves) {
        rules.updateBoard(boardState, move)
        boardState.turn ^= 1
        if(stopSquare.childNodes.length>0){
            stopSquare.removeChild(stopSquare.childNodes[0])
        }
        stopSquare.appendChild(document.getElementById(data));
        /*
        let compMoves = rules.computerMove(boardState)
        let keys = Object.keys(compMoves);
        let bestMove =  compMoves[keys[ keys.length * Math.random() << 0]];
        */
        let bestMove = engine.miniMaxRoot(boardState, 3);
        if(bestMove == null) {
            return
        }
        rules.updateBoard(boardState, bestMove);
        boardState.turn ^= 1;
        // Print current evaluation code
        document.getElementById("recentMove").innerHTML = "Point evaluation " + engine.evaluate(boardState);
        data = document.getElementById(squares.getId(bestMove.start)).childNodes[0].id;
        stopSquare = document.getElementById(squares.getId(bestMove.stop));
        if(stopSquare.childNodes.length>0) {
            stopSquare.removeChild(stopSquare.childNodes[0]);
        }
        stopSquare.appendChild(document.getElementById(data));
    };
};

/* Contains all methods and data for determining if a move is legal
Inputs - Board_0x88, Move
Output - Boolean */
let rules = {
    // Input - Board_0x88; Move
    // Output - Object containing all moves from the start square with the pieceId
    //      keys are a string of move.start + move.stop
    generateMove: function(board, move) {
        // All moves stored as Move objects
        let allMoves = {};
        // The direction a piece can move ex: moving forward 1 square resulting in adding 16 to the Board_0x88 square
        let direction;
        // The data stored in the destination square
        let destination;
        // The Board_0x88 square id where the piece will land
        let moveStop;
        // Flag to signal if the move is a legal capture
        let capture;
        // String used as allMoves key
        let moveId;

        switch(move.pieceId) {
            // Pawn moves
            case 6:
            case 14:
                // Flag for if the pawn can dash 2 spaces from its starting row
                let row;
                // Direction is -1 for dark pieces and 1 for light pieces
                direction = ((move.pieceId>>3)*-2)+1;
                moveStop = move.start + (16 * direction);
                destination = board.board[moveStop];
                if(destination == 0) {
                    moveId = "" + move.start + moveStop
                    allMoves[moveId] = new Move(move.start, moveStop, move.pieceId);
                    // Check if the pawn can dash
                    row = move.start < 24 || move.start > 95;
                    moveStop = move.start + (32 * direction)
                    destination = board.board[moveStop]
                    if((destination == 0) && row) {
                        moveId = "" + move.start + moveStop
                        allMoves[moveId] = new Move(move.start, moveStop, move.pieceId);
                    }
                }
                // Check if the pawn can make a capture
                moveStop = move.start + (15 * direction);
                destination = board.board[moveStop];
                capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                if(capture) {
                    moveId = "" + move.start + moveStop
                    allMoves[moveId] = new Move(move.start, moveStop, move.pieceId);
                }
                moveStop = move.start + (17 * direction);
                destination = board.board[moveStop];
                capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                if(capture) {
                    moveId = "" + move.start + moveStop
                    allMoves[moveId] = new Move(move.start, moveStop, move.pieceId);
                }
                break
            case 1:
            case 9:
                // Rooks check along a direction until it reaches off the board or another piece
                direction = [1, -1, 16, -16];
                for(let i in direction) {
                    moveStop = move.start + direction[i];
                    while(!(moveStop&0x88)) {
                        destination = board.board[moveStop];
                        capture = (destination != 0) && ((move.pieceId&0x8) != (destination&0x8));
                        if(destination == 0 || capture) {
                            moveId = "" + move.start + moveStop
                            allMoves[moveId] = new Move(move.start, moveStop, move.pieceId);
                        } else {break;}
                        if(capture) {break;}
                        moveStop += direction[i];
                    }
                }
                break
            case 3:
            case 11:
                // Bishops check along a direction until it reaches off the board or another piece
                direction = [15, 17, -15, -17];
                for(let i in direction) {
                    moveStop = move.start + direction[i];
                    while(!(moveStop&0x88)) {
                        destination = board.board[moveStop];
                        capture = (destination != 0) && ((move.pieceId&0x8) != (destination&0x8));
                        if(destination == 0 || capture) {
                            allMoves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                        } else {break;}
                        if(capture) {break;}
                        moveStop += direction[i];
                    }
                }
                break;
            case 4:
            case 12:
                // Queens check along a direction until it reaches off the board or another piece
                direction = [1, -1, 16, -16, 15, 17, -15, -17];
                for(let i in direction) {
                    moveStop = move.start + direction[i];
                    while(!(moveStop&0x88)) {
                        destination = board.board[moveStop];
                        capture = (destination != 0) && ((move.pieceId&0x8) != (destination&0x8));
                        if(destination == 0 || capture) {
                            allMoves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                        } else {break;}
                        if(capture) {break;}
                        moveStop += direction[i];
                    }
                }
                break;
            case 5:
            case 13:
                // Kings check one square in every direction
                direction = [1, -1, 16, -16, 15, 17, -15, -17];
                for(let i in direction) {
                    moveStop = move.start + direction[i];
                    destination = board.board[moveStop];
                    capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                    if((destination == 0 || capture) && !(moveStop&0x88)) {
                        allMoves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                    }
                }
                break
            case 2:
            case 10:
                // Knights check 8 squares
                direction = [31, 33, 14, 18, -31, -33, -14, -18];
                for(let i in direction) {
                    moveStop = move.start + direction[i];
                    destination = board.board[moveStop];
                    capture = destination != 0 && (move.pieceId&0x8) != (destination&0x8);
                    if((destination == 0 || capture) && !(moveStop&0x88)) {
                        allMoves["" + move.start + moveStop] = new Move(move.start, moveStop, move.pieceId);
                    }
                }
                break
        }
        return allMoves
    },

    // Inputs - Board_0x88; Move
    // Output - updates Move start and stop square in the Board_0x88
    updateBoard: function(board, move) {
        board.board[move.start] = 0;
        board.board[move.stop] = move.pieceId;
        if((move.pieceId & 0x7) == 5) {
            let color = (move.pieceId & 0x8)>>3;
            board.kings[color] = move.stop;
        }
    },

    // Input - Deep copy of boardState
    // Output - True if check was found; False if check was not found
    findChecks: function(board) {
        let allFakeMoves = {};
        let fakeMove = new Move(board.kings[board.turn], null, null)
        moveTypes = [1, 2, 3, 4, 5, 6];
        let destination;
        for(let i = 0; i < moveTypes.length; i++) {
            fakeMove.pieceId = (board.turn << 3) + moveTypes[i];
            allFakeMoves = this.generateMove(board, fakeMove);
            for(let j in allFakeMoves) {
                destination = board.board[allFakeMoves[j].stop];
                if((destination & 0x7) == moveTypes[i]) {
                    return true;
                } 
            }
        }
        return false;
    },

    generateLegalMoves: function(board, move) {
        let boardCopy
        let allMoves = rules.generateMove(board, move);
        for(let moveId in allMoves) {
            boardCopy = JSON.parse(JSON.stringify(board));
            rules.updateBoard(boardCopy, allMoves[moveId]);
            if(rules.findChecks(boardCopy)) {
                delete allMoves[moveId];
            }
        }
        return allMoves;
    },

    computerMove: function(board) {
        let allMoves = {};
        let move;
        let color = board.turn << 3;
        for(let i = 0; i < board.board.length; i++) {
            if((board.board[i] & 0x8) == color) {
                move = new Move(i, null, board.board[i])
                allMoves = Object.assign(allMoves, rules.generateLegalMoves(board, move))
            }
        }
        return allMoves
    }
}