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
    if (ev.target.id[1] == "_") {
        ev.preventDefault();
    } else {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        ev.target.appendChild(document.getElementById(data));
        let move = board[data].type + " from" + " "  + board[data].square + " to" + " " + ev.target.id + "<br>";
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