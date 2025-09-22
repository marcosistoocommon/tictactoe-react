import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const XIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sort, setSort] = useState(0);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move == currentMove && move != 0) {
      description = "Go to move #" + move;
      return <li key={move}>{description}</li>;
    } else if (move > 0) {
      description = "Go to move #" + move;
    } else if (move == currentMove && move == 0) {
      description = "Go to game start";
      return <li key={move}>{description}</li>;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <div className="game">
        <div className="game-board">
          <Board
            XIsNext={XIsNext}
            squares={currentSquares}
            onPlay={handlePlay}
            currentMove={currentMove}
          />
        </div>
        <div className="game-info">
          <button onClick={() => setSort(sort === 0 ? 1 : 0)}>
            {sort === 0 ? "Desc" : "Asc"}
          </button>
          <GameState sort={sort} moves={moves} />
        </div>
      </div>
    </>
  );
}

function GameState({ sort, moves }) {
  return sort === 0 ? (
    <>
      <ol>{moves}</ol>
    </>
  ) : (
    <>
      <ol>{[...moves].reverse()}</ol>
    </>
  );
}

function Board({ XIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (XIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winnerLines = calculateWinner(squares);
  let status;
  let winner;
  if (winnerLines) {
    winner = squares[winnerLines[0]];
    status = "Winner: " + winner;
  } else if (currentMove < 9) {
    status = "Next player: " + (XIsNext ? "X" : "O");
  } else {
    status = "Tie";
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: squares.length / 3 }).map((_, o_i) => {
        const start = o_i * 3;
        const end = start + 3;
        return (
          <div className="board-row">
            {squares.slice(start, end).map((square, i_i) => (
              <Square
                winner={winnerLines?.includes(i_i + 3 * o_i)}
                value={square}
                onSquareClick={() => handleClick(i_i + 3 * o_i)}
              />
            ))}
          </div>
        );
      })}
    </>
  );
}

function Square({ winner, value, onSquareClick }) {
  return (
    <button
      className="square"
      style={{ backgroundColor: winner ? "green" : "white" }}
      onClick={onSquareClick}
    >
      {value}
    </button>
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
      return lines[i];
    }
  }
  return null;
}
