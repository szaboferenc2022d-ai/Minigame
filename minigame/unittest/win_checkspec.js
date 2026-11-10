test.each(WIN_POSITIONS)( 
"sets the winner when positions %j contain the same mark", 
(...positions) => { 
const board = Array(9).fill(null); 
positions.forEach((position) => { 
board[position] = "X"; 
}); 
const setWinner = jest.fn(); 
const setGameOver = jest.fn(); 
win_check(board, "X", setWinner, setGameOver); 
expect(setWinner).toHaveBeenCalledWith("X"); 
expect(setGameOver).toHaveBeenCalledWith(true); 
}, 
); 
