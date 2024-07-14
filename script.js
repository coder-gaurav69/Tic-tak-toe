let entity = document.querySelectorAll(".entity");
let gameEnded = false;
let isComputerTurn = false;
let user2 = false;
let User_score = document.querySelector(".U_score");
let Computer_score = document.querySelector(".C_score");
let U = 0;      // user score
let C = 0;      // computer score
let play = document.querySelector(".play")
let reset = document.querySelector(".reset")
let line = document.querySelector(".line")
let tick_sound = document.querySelector(".tick_sound")
let win_sound = document.querySelector(".win_sound")
let lose_sound = document.querySelector(".lose_sound")
let result = document.querySelector(".result")
let Match = document.querySelector("#Match_select");
let mode  = document.querySelector("#gameModeSelect");
let GameMode;
let Match_value;


document.addEventListener('DOMContentLoaded', (event) => {
    mode.addEventListener("change",(event)=>{
        GameMode = event.target
        result.innerHTML = GameMode.value;
        if(GameMode.value == "friend"){    
        document.querySelector(".User").innerHTML = "User1_score (X):";
        document.querySelector(".User_type").innerHTML = "User2_score (O):";
        }
        else{
            document.querySelector(".User_type").innerHTML = "Computer_score (O) :";
        }
    })
});

document.addEventListener('DOMContentLoaded', (event) => {  
    Match.addEventListener("change",(event)=>{
        Match_value = event.target.value;
        result.innerHTML = Match_value;
    
    })
});

play.addEventListener("click",()=>{
    start();
})

// reset.addEventListener("click",()=>{
//     // U = 0;
//     // C = 0;
//     // User_score.innerHTML = ""
//     // Computer_score.innerHTML = ""
//     // entity.forEach(function(a,i){
//     //     a.innerHTML = ""; // Reset the entity's inner HTML
//     // })
//     // line.style.display = "none"
//     // mode.selectedIndex = 0;
//     // Match.selectedIndex = 0;
//     // result.innerHTML = ""
//     location.reload();

// })

document.addEventListener('DOMContentLoaded', function() {
    reset.addEventListener('click', function() {
        location.reload();
    });
});

function start(){
    
    entity.forEach(function(a,i){
        a.addEventListener("click",()=>{first_move(i)});
        a.addEventListener("touchstart",()=>{first_move(i)})  
    });
        
}

// first move
async function first_move(i){
    if(Match_value){
        // console.log(Match_value)

        if( entity[i].innerHTML != "X" && entity[i].innerHTML != "O" && !gameEnded && !isComputerTurn && !user2){          // for user to tick 
            
            await tick();
            entity[i].innerHTML = "X";
            winner_checker()
            
            if(GameMode.value == "computer"){
                isComputerTurn = true
                await next_move()
                isComputerTurn = false
            }
            else{
                user2 = true;
            }
            

            // if(GameMode.value == "computer"){

                

            // }
            
            if(gameEnded){
                Match_value = Match_value > 0 ? Match_value - 1 : 0;
                console.log(Match_value)
                resetGame()
                // localStorage.setItem("match",Match_value);                       
            }

            if(Match_value == 0){
                await win();
            }

        }

        else if(entity[i].innerHTML != "X" && entity[i].innerHTML != "O" && GameMode.value == "friend" && !isComputerTurn){
            await tick();
            entity[i].innerHTML = "O";
            winner_checker()
            user2 = false;


            if(gameEnded){
                Match_value = Match_value > 0 ? Match_value - 1 : 0;
                resetGame()
            }

            if(Match_value == 0){
                console.log("helo")
                await win();
            }

        }

    }
}

// for tick sound effect
async function tick(){
    const a = new Promise((resolve,reject)=>{
            tick_sound.play();
            resolve(); 
    })
    return a
}

// for winning sound
async function win(){
    let promise = new Promise((resolve,reject)=>{
        if(U>C){
            result.innerText = "X has won the game"
            win_sound.play();
            resolve(1);
        }
        else if(U<C && GameMode.value == "friend"){
            result.innerText = "0 has won the game"
            win_sound.play();
            resolve(1);
        }
        else if(U==C){
            result.innerText = "Draw!"
            resolve(1)
        }
        else{
            result.innerText = "0 has won the game"
            lose_sound.play();
            resolve(1);
        }
    })
    return promise;
}

// for computer to tick
// async function next_move(){

//     await new Promise(resolve=> setTimeout(resolve,500))
//     let random = Math.floor(Math.random()*9)
    
//     if(!gameEnded && entity[random].innerHTML != "X" && entity[random].innerHTML != "O"){
//         entity[random].innerHTML = "O";   
//         winner_checker()
//     }

//     else if(gameEnded != true){
//         await next_move()
//     }
    
// }
async function next_move() {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (!gameEnded) {
        let move = findBestMove();
        if (move !== -1) {
            entity[move].innerHTML = "O";
            winner_checker();
        } else {
            await next_move(); // Retry if no valid move found (shouldn't happen with a good strategy)
        }
    }
}

// Find the best move for the computer
function findBestMove() {
    // 1. Try to win
    for (let i = 0; i < 9; i++) {
        if (entity[i].innerHTML === "") {
            entity[i].innerHTML = "O";
            if (checkWinner("O")) {
                entity[i].innerHTML = "";
                return i;
            }
            entity[i].innerHTML = "";
        }
    }

    // 2. Block player's win
    for (let i = 0; i < 9; i++) {
        if (entity[i].innerHTML === "") {
            entity[i].innerHTML = "X";
            if (checkWinner("X")) {
                entity[i].innerHTML = "";
                return i;
            }
            entity[i].innerHTML = "";
        }
    }

    // 3. Take center if available
    if (entity[4].innerHTML === "") return 4;

    // 4. Take opposite corner
    const oppositeCorners = [
        [0, 8],
        [2, 6],
        [6, 2],
        [8, 0]
    ];
    for (let [corner, opposite] of oppositeCorners) {
        if (entity[corner].innerHTML === "X" && entity[opposite].innerHTML === "") {
            return opposite;
        }
    }

    // 5. Take any corner
    const corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (entity[corner].innerHTML === "") return corner;
    }

    // 6. Take any side
    const sides = [1, 3, 5, 7];
    for (let side of sides) {
        if (entity[side].innerHTML === "") return side;
    }

    // No move found (should not happen)
    return -1;
}

// Check if a player has won
function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (let pattern of winPatterns) {
        if (
            entity[pattern[0]].innerHTML === player &&
            entity[pattern[1]].innerHTML === player &&
            entity[pattern[2]].innerHTML === player
        ) {
            return true;
        }
    }
    return false;
}

// winner checker function
function winner_checker() {

    // Row checker
    if (entity[0].innerHTML !== '' && entity[0].innerHTML === entity[1].innerHTML && entity[1].innerHTML === entity[2].innerHTML) {
        console.log(`${entity[0].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.top = "16.66%"
            line.style.transform = "rotate(0deg) scale(0.8)"
            line.style.left = "0%";
            line.style.display = "block";
        },1000)
        localStorage.setItem("result", `${entity[0].innerHTML} is the winner`);
    }

    else if (entity[3].innerHTML !== '' && entity[3].innerHTML === entity[4].innerHTML && entity[4].innerHTML === entity[5].innerHTML) {
        console.log(`${entity[3].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.top = "50.000%"
            line.style.left = "0%";
            line.style.transform = "rotate(0deg) scale(0.9)"
            line.style.display = "block";
        },1000)
        localStorage.setItem("result", `${entity[3].innerHTML} is the winner`);

    }
    
    else if (entity[6].innerHTML !== '' && entity[6].innerHTML === entity[7].innerHTML && entity[7].innerHTML === entity[8].innerHTML) {
        console.log(`${entity[6].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.top = "83.333%"
            line.style.transform = "rotate(0deg) scale(0.9)"
            line.style.left = "0%";
            line.style.display = "block";
        },1000)
        localStorage.setItem("result", `${entity[6].innerHTML} is the winner`);

    }
    

    // Column checker
    else if (entity[0].innerHTML !== '' && entity[0].innerHTML === entity[3].innerHTML && entity[3].innerHTML === entity[6].innerHTML) {
        console.log(`${entity[0].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.transform = "rotate(90deg) scale(0.9)";
            line.style.top = "50.0001%"
            line.style.left = "-33.33%"
            line.style.display = "block";
        },1000)

        localStorage.setItem("result", `${entity[0].innerHTML} is the winner`);
    }

    else if (entity[1].innerHTML !== '' && entity[1].innerHTML === entity[4].innerHTML && entity[4].innerHTML === entity[7].innerHTML) {
        console.log(`${entity[1].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.transform = "rotate(90deg) scale(0.9)";
            line.style.top = "50.0001%"
            line.style.left = "0%"
            line.style.display = "block";
        },1000)
        localStorage.setItem("result", `${entity[1].innerHTML} is the winner`);

        // return `${entity[1].innerHTML} is the winner`;

    }
    else if (entity[2].innerHTML !== '' && entity[2].innerHTML === entity[5].innerHTML && entity[5].innerHTML === entity[8].innerHTML) {
        console.log(`${entity[2].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.transform = "rotate(90deg) scale(0.9)";
            line.style.top = "50.0001%"
            line.style.left = "33.33%"
            line.style.display = "block";
        },1000)
        localStorage.setItem("result", `${entity[2].innerHTML} is the winner`);
        // return `${entity[2].innerHTML} is the winner`;

    }

    // Diagonal checker
    else if (entity[0].innerHTML !== '' && entity[0].innerHTML === entity[4].innerHTML && entity[4].innerHTML === entity[8].innerHTML) {
        console.log(`${entity[0].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.top = "50%"
            line.style.left = "0%";
            line.style.transform = "rotate(-135deg) scale(1.2)";
            line.style.display = "block";
        },1000)
        localStorage.setItem("result", `${entity[0].innerHTML} is the winner`);
        // return `${entity[0].innerHTML} is the winner`;

    }
    else if (entity[2].innerHTML !== '' && entity[2].innerHTML === entity[4].innerHTML && entity[4].innerHTML === entity[6].innerHTML) {
        console.log(`${entity[2].innerHTML} is the winner`)
        gameEnded = true;
        setTimeout(()=>{
            line.style.top = "50%"
            line.style.left = "0%";
            line.style.transform = "rotate(135deg) scale(1.2)";
            line.style.display = "block";
        },1000)

        localStorage.setItem("result", `${entity[2].innerHTML} is the winner`);
        // return `${entity[2].innerHTML} is the winner`;
    }

    // draw checker
    else if(Array.from(entity).every(cell => cell.innerText != "")){
        console.log("DRAW!");
        gameEnded = true;
        localStorage.setItem("result", "DRAW!");
    }

}

// function winner_checker() {
//     const checkWinningCombination = (indices, lineStyle) => {
//         if (entity[indices[0]].innerHTML !== '' && entity[indices[0]].innerHTML === entity[indices[1]].innerHTML && entity[indices[1]].innerHTML === entity[indices[2]].innerHTML) {
//             console.log(`${entity[indices[0]].innerHTML} is the winner`);
//             gameEnded = true;
//             setTimeout(() => {
//                 Object.assign(line.style, lineStyle, { display: "block" });
//             }, 100);
//             localStorage.setItem("result", `${entity[indices[0]].innerHTML} is the winner`);
//             return true;
//         }
//         return false;
//     };

//     const winningCombinations = [
//         // Rows
//         [[0, 1, 2], { top: "16.66%" }],
//         [[3, 4, 5], { top: "50.00%" }],
//         [[6, 7, 8], { top: "83.33%" }],
//         // Columns
//         [[0, 3, 6], { transform: "rotate(90deg) scale(1)", top: "50.0001%", left: "-33.33%" }],
//         [[1, 4, 7], { transform: "rotate(90deg) scale(1)", top: "50.0001%", left: "0%" }],
//         [[2, 5, 8], { transform: "rotate(90deg) scale(1)", top: "50.0001%", left: "33.33%" }],
//         // Diagonals
//         [[0, 4, 8], { top: "50%", transform: "rotate(-135deg) scale(1.4)" }],
//         [[2, 4, 6], { top: "50%", transform: "rotate(135deg) scale(1.4)" }]
//     ];

//     for (let [indices, lineStyle] of winningCombinations) {
//         if (checkWinningCombination(indices, lineStyle)) {
//             return;
//         }
//     }

//     // Draw checker
//     if (Array.from(entity).every(cell => cell.innerText !== "")) {
//         console.log("DRAW!");
//         gameEnded = true;
//         localStorage.setItem("result", "DRAW!");
//     }
// }



// to select the matches
// function match(){
//    localStorage.setItem("match",Match.value)
// }


// reset the game
function resetGame() {

    if(localStorage.getItem("result") == "X is the winner"){
        U++;
        User_score.innerHTML = U;
    }
    else if(localStorage.getItem("result") == "O is the winner"){
        C++;
        Computer_score.innerHTML = C;
    }
    // console.log(Match_value)

    if(Match_value != 0){
        console.log(Match_value)
        setTimeout(()=>{
            entity.forEach(function(a) {
                a.innerHTML = ""; // Reset the entity's inner HTML
                line.style.display = "none"
                gameEnded = false
            });
        },2000)
    }
        
    start(); // Restart the game logic
}


window.addEventListener("load",()=>{
    localStorage.clear()
})




