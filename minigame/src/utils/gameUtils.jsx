const WIN_POSITIONS = [ 
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6], 
]; 
export function win_check(newStatus, player, setWinner, setGameOver) { 
    const win_array = WIN_POSITIONS.map((pos) => { 
    const c1 = newStatus[pos[0]]; 
    const c2 = newStatus[pos[1]]; 
    const c3 = newStatus[pos[2]]; 
    
    return c1 && c1 === c2 && c1 === c3 && c1 === player;
}); 
    const isGameOver = win_array.some((value) => value); 
    if (isGameOver) { 
    setWinner(player); 
    setGameOver(true); 
    return player;
} 
if (newStatus.every((cell) => cell)) {
    setGameOver(true);
    return "draw";
}
return undefined;
} 
