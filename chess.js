/* This file contains the functions and data structures to graphically make and play chess.
Requirements - <div> with id "chessBoard"
Optional - <p> with id recentMove */

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
function loadPieces(position = new Board_0x88()) {
    for (square in position.board) {
        if(square > 0) {
            let newPiece = document.createElement("img");
            newPiece.src = "img/" + idToType[square] + ".png";
            newPiece.id = square + "_";
            newPiece.className = "chessPiece";
            newPiece.draggable = true;
            newPiece.addEventListener("dragstart", startMove);
            document.getElementById(square).appendChild(newPiece);

        }
        let newPiece = document.createElement("img");
        
        board[newPiece.id] = new Piece(newPiece.id, square, piecePositions[square]);
        arraySquare = parseInt(square[0]) * 16 + parseInt(square[1]);
    }
}
let idToType = {
    1 : "wrook",
    2 : "wknight",
    3 : "wbishop",
    4 : "wking",
    5 : "wqueen",
    6 : "wpawn",
    9 : "brook",
    10 : "bknight",
    11 : "bbishop",
    12 : "bking",
    13 : "bqueen",
    14 : "bpawn"

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
    // Format variables to determine if move is legal
    let start = "", stop = "", pieceId = "";
    let data = ev.dataTransfer.getData("text");
    ev.preventDefault();
    if(ev.target.id in board) {
        if(board[ev.target.id].type[0] == board[data].type[0]) {
            return false
        } else {
            stop = ev.target.parentNode.id;
        }
    } else {
        stop = ev.target.id
    }
    start = board[data].square;
    start = parseInt(start);
    stop = parseInt(stop);
    pieceId = typeToId[board[data].type];

    // Convert start stop pieceId to ints
    let move = new Move(start, stop, pieceId);

    if (rules.makeMove(position, move)) {
        ev.target.appendChild(document.getElementById(data));
        let move = board[data].type + " from " + board[data].square + " to " + ev.target.id + "<br>";
        document.getElementById("recentMove").innerHTML += move;
        board[data].square = ev.target.id;
    } else {
        return false;
    }
}

/* This event is triggered on  */
function allowMove(ev) {
    ev.preventDefault();
}

class Piece {
    constructor(id, square, type) {
        this.id = id;
        this.square = square;
        this.type = type;
    }
}

let board = {
}

let typeToId = {
    "wrook" : 1,
    "wknight" : 2,
    "wbishop" : 3,
    "wqueen" : 4,
    "wking" : 5,
    "wpawn" : 6,
    "brook" : 9,
    "bknight" : 10,
    "bbishop" : 11,
    "bqueen" : 12,
    "bking" : 13,
    "bpawn" : 14
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
        this.turn = 0b1
        // Set a flag for promotion
        this.promotion = 255
    }

    defaultBoard() {
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
    }

    clearBoard() {
        this.board = [
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
        ];
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
    makeMove: function(board=1, move=1) {
        return true;
    }
}