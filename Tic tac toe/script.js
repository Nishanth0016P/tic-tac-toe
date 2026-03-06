// Select elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartButton = document.getElementById("restart");
const difficultyButtons = document.querySelectorAll("input[name='difficulty']");

// Game variables
let board = ["","","","","","","","",""];
let player = "X";
let computer = "O";
let running = true;
let difficulty = "normal";

// Winning combinations
const winPatterns = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];


// Difficulty selector
difficultyButtons.forEach(button => {

  button.addEventListener("change", function(){

    difficulty = this.value;

  });

});


// Add click listeners
cells.forEach(cell => {

  cell.addEventListener("click", cellClicked);

});


// Restart button
restartButton.addEventListener("click", restartGame);


// Player move
function cellClicked(){

  const index = this.dataset.index;

  if(board[index] !== "" || !running){
    return;
  }

  makeMove(index, player);

  if(checkWinner()){
    return;
  }

  setTimeout(computerMove, 400);

}


// Place move
function makeMove(index, currentPlayer){

  board[index] = currentPlayer;

  cells[index].textContent = currentPlayer;

  cells[index].classList.add(currentPlayer);

}


// Computer move depending on difficulty
function computerMove(){

  let move;

  if(difficulty === "normal"){

    move = randomMove();

  }else{

    move = minimax(board, computer).index;

  }

  makeMove(move, computer);

  checkWinner();

}


// Random AI (Normal mode)
function randomMove(){

  let empty = [];

  for(let i=0;i<9;i++){

    if(board[i] === ""){

      empty.push(i);

    }

  }

  return empty[Math.floor(Math.random()*empty.length)];

}


// Check winner
function checkWinner(){

  for(let i=0;i<winPatterns.length;i++){

    const condition = winPatterns[i];

    const a = board[condition[0]];
    const b = board[condition[1]];
    const c = board[condition[2]];

    if(a === "" || b === "" || c === ""){
      continue;
    }

    if(a === b && b === c){

      cells[condition[0]].classList.add("win");
      cells[condition[1]].classList.add("win");
      cells[condition[2]].classList.add("win");

      statusText.textContent = a + " wins!";

      running = false;

      return true;

    }

  }

  if(!board.includes("")){

    statusText.textContent = "Draw!";

    running = false;

    return true;

  }

  return false;

}


// Restart game
function restartGame(){

  board = ["","","","","","","","",""];

  running = true;

  statusText.textContent = "Your Turn (X)";

  cells.forEach(cell => {

    cell.textContent = "";

    cell.classList.remove("X","O","win");

  });

}


// Minimax AI (Hard difficulty)

function minimax(newBoard, playerTurn){

  let availSpots = [];

  for(let i=0;i<9;i++){

    if(newBoard[i] === ""){

      availSpots.push(i);

    }

  }

  if(checkWin(newBoard, player)){

    return {score: -10};

  }

  if(checkWin(newBoard, computer)){

    return {score: 10};

  }

  if(availSpots.length === 0){

    return {score: 0};

  }


  let moves = [];

  for(let i=0;i<availSpots.length;i++){

    let move = {};

    move.index = availSpots[i];

    newBoard[availSpots[i]] = playerTurn;


    if(playerTurn === computer){

      let result = minimax(newBoard, player);

      move.score = result.score;

    }else{

      let result = minimax(newBoard, computer);

      move.score = result.score;

    }

    newBoard[availSpots[i]] = "";

    moves.push(move);

  }


  let bestMove;

  if(playerTurn === computer){

    let bestScore = -10000;

    for(let i=0;i<moves.length;i++){

      if(moves[i].score > bestScore){

        bestScore = moves[i].score;

        bestMove = i;

      }

    }

  }else{

    let bestScore = 10000;

    for(let i=0;i<moves.length;i++){

      if(moves[i].score < bestScore){

        bestScore = moves[i].score;

        bestMove = i;

      }

    }

  }

  return moves[bestMove];

}


// Helper function for minimax
function checkWin(boardState, currentPlayer){

  return winPatterns.some(pattern =>

    pattern.every(index => boardState[index] === currentPlayer)

  );

}