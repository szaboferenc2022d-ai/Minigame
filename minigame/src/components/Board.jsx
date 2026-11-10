import { useEffect, useRef, useState } from "react";
import { PLAYER_O, PLAYER_X, Square } from "./Square";
import { win_check } from "../utils/gameUtils"; 

const BOARD_SIDES = 3;
const BOARD_INDICES = [...Array(BOARD_SIDES).keys()];
const CELL_COUNT = BOARD_SIDES * BOARD_SIDES;

const SCORE_STORAGE_KEY = "minigame-score";

function readScore() {
    try {
        const savedScore = window.localStorage.getItem(SCORE_STORAGE_KEY);
        if (!savedScore) return { x: 0, o: 0, draws: 0 };

        const score = JSON.parse(savedScore);
        if (
            Number.isInteger(score.x) && score.x >= 0 &&
            Number.isInteger(score.o) && score.o >= 0 &&
            Number.isInteger(score.draws) && score.draws >= 0
        ) {
            return score;
        }

        console.error("Saved game score has an invalid format.");
    } catch (error) {
        console.error("Could not load the saved game score.", error);
    }

    return { x: 0, o: 0, draws: 0 };
}

export function Board() {
    const [status, setStatus] = useState(new Array(CELL_COUNT).fill(undefined));
    const [winner, setWinner] = useState();
    const [gameOver, setGameOver] = useState(false);
    const [lastCell, setLastCell] = useState();
    const [score, setScore] = useState(readScore);
    let lastPlayer = useRef();

    useEffect(() => {
        try {
            window.localStorage.setItem(SCORE_STORAGE_KEY, JSON.stringify(score));
        } catch (error) {
            console.error("Could not save the game score.", error);
        }
    }, [score]);

    // Update the game status, ignore the click when it is not allowed
    //  - idx: index of the square
    //  - player: left or right mouse button
    function handleClick(idx, player) {
        // ignore the invalid players (to make it foolproof)
        if (player !== PLAYER_O && player !== PLAYER_X) return;
        // ignore the repeated steps
        if (lastPlayer.current === player) return;

        // ignore the occupied cells
        if (status[idx]) return;

        // ignore if gameOver
        if (gameOver) return;

        // update the status
        lastPlayer.current = player;
        const newStatus = status.map((value, index) => (index === idx ? player : value));
        win_check(newStatus, player);
        setStatus(newStatus);
        setLastCell(idx);
    }

    function win_check(newStatus, player) {
        const isWinner = checkWinner(newStatus, player);
        if (isWinner) {
            setWinner(player);
            setGameOver(true);
            setScore((currentScore) => ({
                ...currentScore,
                [player === PLAYER_X ? "x" : "o"]: currentScore[player === PLAYER_X ? "x" : "o"] + 1,
            }));
            return;
        }

        if (newStatus.every((cell) => cell)) {
            setGameOver(true);
            setScore((currentScore) => ({ ...currentScore, draws: currentScore.draws + 1 }));
        }
    }

    function handlePlayAgain() {
        setStatus(new Array(CELL_COUNT).fill(undefined));
        setWinner(undefined);
        setGameOver(false);
        setLastCell(undefined);
        lastPlayer.current = undefined;
    }

    return (
        <div className="board">
            <div className="eredmeny">Player X Win {score.x} | Player O Win {score.o} | Draw {score.draws}</div>
            <button onClick={() => setScore({ x: 0, o: 0, draws: 0 })}>eredmény törlése</button>
            {BOARD_INDICES.map((rowIndex) => (
                <div className="board-row">
                    {BOARD_INDICES.map((columnIndex) => {
                        const index = rowIndex * BOARD_SIDES + columnIndex;
                        return (
                            <Square
                            value={status[index]}
                                highlight={index === lastCell}
                                onSquareClick={(player) => handleClick(index, player)}
                            />
                        );
                    })}
                </div>
            ))}
            <button>Visza lépés</button>
            <p>Aktuális játékos: {lastPlayer.current === PLAYER_X ? "O" : "X"}</p>
            {gameOver && winner && <div>Game over! {winner} won</div>}
            {gameOver && !winner && <div className="gameover">Draw! No winner</div>}
            {gameOver && <button className="gomb" onClick={handlePlayAgain}>Reset</button>}
        </div>
    );
}