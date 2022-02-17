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

function loadPieces() {
    let pieces = ["arook", "bknight", "cbishop", "dqueen", "eking", "fpawn", "gwrook", "hwknight", "iwbishop", "jwqueen", "kwking", "lwpawn"];
    let square = "";
    let filename = "";
    let blackPieces = pieces.slice(0, 5);
    blackPieces = blackPieces.concat([pieces[2], pieces[1], pieces[0]]);
    blackPieces = blackPieces.concat([pieces[5], pieces[5], pieces[5], pieces[5], pieces[5], pieces[5], pieces[5], pieces[5]]);
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 8; j++) {
            square = "_" + i + j;
            filename = "img/" + blackPieces[i*8 + j] + ".png";
            id = "_" + square
            document.getElementById(square).innerHTML = '<img src=' + filename + ' class="chessPiece" id=' + id + ' draggable="true" ondragstart="startMove(event)">';
        }
    }

    let whitePieces = pieces.slice(6, 11);
    whitePieces = whitePieces.concat([pieces[8], pieces[7], pieces[6]]);
    whitePieces = [pieces[11], pieces[11], pieces[11], pieces[11], pieces[11], pieces[11], pieces[11], pieces[11]].concat(whitePieces);
    for (let i = 6; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            square = "_" + i + j;
            filename = "img/" + whitePieces[(i - 6) * 8 + j] + ".png";
            id = "_" + square
            document.getElementById(square).innerHTML = '<img src=' + filename + ' class="chessPiece" id=' + id + ' draggable="true" ondragstart="startMove(event)">';
        }
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
    }
}

function allowMove(ev) {
    ev.preventDefault();
}


