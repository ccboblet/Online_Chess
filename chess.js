// var chess = {
//     makeBoard : function() {
//         let newSquare;
//         let colors = ["lightSquare", "darkSquare"]
//         let toggle = true;
//         for (let i = 7; i >= 0; i--) {
//             toggle ^= true
//             for (let j = 0; j < 8; j++) {
//                 toggle ^= true;
//                 newSquare = document.createElement("div")
//                 newSquare.className = colors[toggle] + " squareSize";
//                 newSquare.id = "" + i + j + "_";
//                 newSquare.addEventListener("drop", endMove);
//                 newSquare.addEventListener("dragover", allowMove);
//                 newSquare.addEventListener("drag", allowMove);
//                 document.getElementById("chessBoard").appendChild(newSquare);
//             }
//         }
//     },

//     // Input in pixels ex. "100px"
//     resize : function(size) {
//         let squares = document.getElementsByClassName("squareSize");
//         let board = document.getElementsByClassName("chessBoard");
//         for (let i = 0; i < squares.length; i++) {
//             squares[i].style.height = size;
//             squares[i].style.width = size
//         }
//         for (let i = 0; i < board.length; i++) {
//             board[i].style.gridTemplateColumns = size + " " + size + " " + size + " " + size + " " + size + " " + size + " " + size + " " + size;
//         }
//     },

//     startMove : function(ev) {
//         ev.dataTransfer.setData("text", ev.target.id);
//     },

//     allowMove : function(ev) {
//         ev.preventDefault();
//     },

//     endMove : function(ev) {
//         let start = '', stop = '', pieceId = '';
//         let data = ev.dataTransfer.getData("text");
//         ev.preventDefault();
//         if(ev.target.id in board) {
//             if(board[ev.target.id].type[0] == board[data].type[0]) {
//                 return false
//             } else {
//                 stop = ev.target.parentNode.id;
//             }
//         } else {
//             stop = ev.target.id
//         }
//         start = board[data].square;
//         pieceId = typeToId[board[data].type];
//         // Convert start stop pieceId to ints
//         start = parseInt(start);
//         stop = parseInt(stop);
//         let move = new Move(start, stop, pieceId);
//         if (rules.makeMove()) {
//             return false;
//         } else {
//             ev.target.appendChild(document.getElementById(data));
//             let move = board[data].type + " from " + board[data].square + " to " + ev.target.id + "<br>";
//             document.getElementById("recentMove").innerHTML += move;
//             board[data].square = ev.target.id;
//         }
//     }
// }

function makeBoard() {
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
            newSquare.addEventListener("drag", allowMove);
            document.getElementById("chessBoard").appendChild(newSquare);
        }
    }
}

// Input in pixels ex. "100px"
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

function startMove(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function endMove(ev) {
    // Format variables to determine if move is legal
    let start = '', stop = '', pieceId = '';
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

let defaultPiecePositions = {
    "00_" : "wrook",
    "01_" : "wknight",
    "02_" : "wbishop",
    "03_" : "wking",
    "04_" : "wqueen",
    "05_" : "wbishop",
    "06_" : "wknight",
    "07_" : "wrook",
    "10_" : "wpawn",
    "11_" : "wpawn",
    "12_" : "wpawn",
    "13_" : "wpawn",
    "14_" : "wpawn",
    "15_" : "wpawn",
    "16_" : "wpawn",
    "17_" : "wpawn",
    "70_" : "brook",
    "71_" : "bknight",
    "72_" : "bbishop",
    "73_" : "bking",
    "74_" : "bqueen",
    "75_" : "bbishop",
    "76_" : "bknight",
    "77_" : "brook",
    "60_" : "bpawn",
    "61_" : "bpawn",
    "62_" : "bpawn",
    "63_" : "bpawn",
    "64_" : "bpawn",
    "65_" : "bpawn",
    "66_" : "bpawn",
    "67_" : "bpawn",

}

let typeToId = {
    'wrook' : 1,
    'wknight' : 2,
    'wbishop' : 3,
    'wqueen' : 4,
    'wking' : 5,
    'wpawn' : 6,
    'brook' : 9,
    'bknight' : 10,
    'bbishop' : 11,
    'bqueen' : 12,
    'bking' : 13,
    'bpawn' : 14
}

function loadPieces(piecePositions = defaultPiecePositions) {
    let test = position.board;
    for (square in piecePositions) {
        let newPiece = document.createElement("img");
        newPiece.src = "img/" + piecePositions[square] + ".png";
        newPiece.id = square + "_";
        newPiece.className = "chessPiece";
        newPiece.draggable = true;
        newPiece.addEventListener("dragstart", startMove);
        document.getElementById(square).appendChild(newPiece);
        board[newPiece.id] = new Piece(newPiece.id, square, piecePositions[square]);
        arraySquare = parseInt(square[0]) * 16 + parseInt(square[1]);
        position.board[arraySquare] = typeToId[piecePositions[square]];
    }
}

class Board_0x88 {
    constructor() {
        // Each entry represents a square
        // The values on the left board represent pieces
        // White pice&15>8 bit black piece&15<8
        // 1 = rook, 2 = knight, 3 = bishop, 4 = queen, 5 = king, 6 = pawn
        // The values on the right board have yet to be determined
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
}

class Move {
    constructor(start=255, stop=255, pieceId=255) {
        this.start = start
        this.stop = stop
        this.pieceId = pieceId
    }
}

// An object to with all the methods to determine if a move is legal 
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