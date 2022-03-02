function makeBoard() {
    let newSquare;
    let colors = ["lightSquare", "darkSquare"]
    let toggle = true;
    for (let i = 0; i < 8; i++) {
        toggle ^= true
        for (let j = 0; j < 8; j++) {
            toggle ^= true;
            newSquare = document.createElement("div")
            newSquare.className = colors[toggle] + " squareSize";
            newSquare.id = "_" + i + j;
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
    let start, stop, pieceId;
    let data = ev.dataTransfer.getData("text");
    ev.preventDefault();
    if(ev.target.id in board) {
        if(board[ev.target.id].type[0] == board[data].type[0]) {
            return false
        }
    }
    else {
        stop = ev.target.parentNode.id;
    }
    start = board[data].square;
    stop = ev.target.id;
    pieceId = board[data].type;
    //let move = new Move(start, stop, pieceId);
    if (rules.makeMove()) {
        return false;
    } else {
        ev.target.appendChild(document.getElementById(data));
        let move = board[data].type + " from " + board[data].square + " to " + ev.target.id + "<br>";
        document.getElementById("recentMove").innerHTML += move;
        board[data].square = ev.target.id;
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
    _70 : "wrook",
    _71 : "wknight",
    _72 : "wbishop",
    _73 : "wking",
    _74 : "wqueen",
    _75 : "wbishop",
    _76 : "wknight",
    _77 : "wrook",
    _60 : "wpawn",
    _61 : "wpawn",
    _62 : "wpawn",
    _63 : "wpawn",
    _64 : "wpawn",
    _65 : "wpawn",
    _66 : "wpawn",
    _67 : "wpawn",
    _00 : "brook",
    _01 : "bknight",
    _02 : "bbishop",
    _03 : "bking",
    _04 : "bqueen",
    _05 : "bbishop",
    _06 : "bknight",
    _07 : "brook",
    _10 : "bpawn",
    _11 : "bpawn",
    _12 : "bpawn",
    _13 : "bpawn",
    _14 : "bpawn",
    _15 : "bpawn",
    _16 : "bpawn",
    _17 : "bpawn",

}

function loadPieces(piecePositions = defaultPiecePositions) {
    for (square in piecePositions) {
        let newPiece = document.createElement("img");
        newPiece.src = "img/" + piecePositions[square] + ".png";
        newPiece.id = "_" + square;
        newPiece.className = "chessPiece";
        newPiece.draggable = true;
        newPiece.addEventListener("dragstart", startMove);
        document.getElementById(square).appendChild(newPiece);
        board[newPiece.id] = new Piece(newPiece.id, square, piecePositions[square]);
    }
}

class Board_0x88 {
    constructor() {
        // Each entry represents a square
        // The values on the left board represent pieces
        // White pice&15>8 bit black piece&15<8
        // 0 = rook, 1 = knight, 2 = bishop, 3 = queen, 4 = king, 5 = pawn
        // The values on the right board have yet to be determined
        this.board = [
            1,   2,   3,   4,   5,   3,   2,   1,      0,0,0,0,0,0,0,0,
            6,   6,   6,   6,   6,   6,   6,   6,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            0,   0,   0,   0,   0,   0,   0,   0,      0,0,0,0,0,0,0,0,
            14,  14,  14,  14,  14,  14,  14,  14,     0,0,0,0,0,0,0,0,
            9,   10,  11,  12,  13,  11,  10,  9,      0,0,0,0,0,0,0,0,
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

        return false;
    }
}