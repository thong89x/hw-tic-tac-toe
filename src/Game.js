import { useState } from 'react';

function Square({ value, onSquareClick ,...props }) {
  return (
    <button className="square" onClick={onSquareClick} {...props}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares,i);
  }

  const {winner,linewin} =  calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  const getColorWin= (linewin,index)=>{
    console.log("Line win")
    console.log(linewin)
    if (linewin && linewin.includes(index)) {
        return {
          backgroundColor: 'green',
          color: 'white',
        };
      } else {
        return {
         
        };
      } 
  }
  return (
    <>
      <div className="status">{status}</div>
      {
        [0,1,2].map((row)=>{
            return (
                <div className="board-row">
                    {
                        [0,1,2].map(col=>{
                            return (
                                <Square style={getColorWin(linewin,row*3+col)} value={squares[row*3+col]} onSquareClick={() => handleClick(row*3+col)} />
                              );
                        })
                    }
                </div>

            )
        })
      }
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isSortDESC, setIsSortDESC] = useState(false);
  const [historyLocation,setHistoryLocation] = useState([Array(9).fill(null)]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
    // console.log(history)
    // console.log(currentMove)

    const toggleSort= ()=>{
        setIsSortDESC(pre=>!pre);
    }
  function handlePlay(nextSquares,index) {
    // console.log(nextSquares);
    // console.log(index);
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setHistoryLocation([
        ...historyLocation.slice(0, currentMove + 1),
        [Math.floor(index / 3) , (index % 3)],
      ]);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = `Go to move (${historyLocation[move][0]}, ${historyLocation[move][1]})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move === currentMove ? (
          <span>You are at move #{currentMove}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
      <button onClick={toggleSort}>
          {isSortDESC ? "Descending" : "Ascending"}
        </button>
        <ol>{isSortDESC ? moves.reverse() : moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
            winner:squares[a],
            linewin: lines[i]
        };
    }
  }
  return {
        winner:null,
        linewin: null
    };
}
