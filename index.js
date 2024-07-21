const height = 6; // number of guesses
const width = 5; // length of word

let row = 0; // current guess
let col = 0; // current letter for the guess

let gameOver = false;

let word = words[Math.floor(Math.random() * words.length)].toUpperCase();
console.log(word);

window.onload = function () {
    initialize();
}

function initialize() {
    // Create the game board
    for (let r = 0; r < height; r++) {
        for (let c = 0; c < width; c++) {
            let tile = document.createElement("span");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.innerText = "";
            document.getElementById("board").appendChild(tile);
        }
    }

    // Keyboard
    let keyboard = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L", " "],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ]

    for (let i = 0; i < keyboard.length; i++) {
        let currentRow = keyboard[i];
        let keyboardRow = document.createElement("div");
        keyboardRow.classList.add("keyboard-row");

        for (let j = 0; j < currentRow.length; j++) {
            let keyTile = document.createElement("div");

            let key = currentRow[j];
            keyTile.innerText = key;
            if (key == "Enter") {
                keyTile.id = "Enter";
            }
            else if (key == "⌫") {
                keyTile.id = "Backspace"
            }
            else if ("A" <= key && key <= "Z") {
                keyTile.id = "Key" + key;
            }

            keyTile.addEventListener("click", processKey);

            if (key == "Enter") {
                keyTile.classList.add("enter-key-tile");
            } else {
                keyTile.classList.add("key-tile")
            }
            keyboardRow.appendChild(keyTile);
        }
        document.body.appendChild(keyboardRow)
    }

    // Listen for key press
    document.addEventListener("keyup", (event) => {
        processInput(event);
    });
}

function processKey() {
    let event = {"code" : this.id };
    processInput(event);
}

function processInput(event) {
    if (gameOver) return;

    if ("KeyA" <= event.code && event.code <= "KeyZ") {
        if (col < width) {
            let currentTile = document.getElementById(row.toString() + '-' + col.toString());
            if (currentTile.innerText == "") {
                currentTile.innerText = event.code[3];
                col += 1;
            }
        }
    } else if (event.code == "Backspace") {
        if (0 < col && col <= width) {
            col -= 1;
        }
        let currentTile = document.getElementById(row.toString() + '-' + col.toString());
        currentTile.innerText = "";
    } else if (event.code == "Enter") {
        if (col == width) { // Ensure the guess is complete
            let guess = getCurrentGuess();
            if (words.includes(guess.toLowerCase())) { // Check if the word exists in the list
                update();
                row += 1; // start new row
                col = 0; // start at 0 for new row
            } else {
                alert("Word not in list");
                resetCurrentRow();
            }
            if (!gameOver && row == height) {
                gameOver = true;
                document.getElementById("answer").innerText = word;
            }
        }
    }
}

function getCurrentGuess() {
    let guess = "";
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        guess += currentTile.innerText;
    }
    return guess;
}

function resetCurrentRow() {
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + "-" + c.toString());
        currentTile.innerText = "";
    }
    col = 0;
}

function update() {
    let guess = "";
    document.getElementById("answer").innerText = "";

    // start processing game
    let correct = 0;
    let letterCount = {}; //e.g. KENNY = {K:1, E:1, N:2, Y:1}
    for (let i = 0; i < word.length; i++) {
        letter = word[i];
        if (letterCount[letter]) {
            letterCount[letter] = + 1;
        } else {
            letterCount[letter] = 1;
        }
    }


    // first iteration, check all the correct ones
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currentTile.innerText;
        // check if in correct position
        if (word[c] == letter) {
            currentTile.classList.add("correct");

            let keyTile = document.getElementById("Key" + letter);
            keyTile.classList.remove("present");
            keyTile.classList.add("correct");

            correct += 1;
            letterCount[letter] -= 1;
        }

        if (correct == width) {
            gameOver = true;
            alert("Congratulations! You've guessed the word!");
            return;
        }
    }


    // go again and mark which ones are present but in wrong position
    for (let c = 0; c < width; c++) {
        let currentTile = document.getElementById(row.toString() + '-' + c.toString());
        let letter = currentTile.innerText;

        if (!currentTile.classList.contains("correct")) {
            // check if it's in the word
            if (word.includes(letter) && letterCount[letter] > 0) {
                currentTile.classList.add("present");

                let keyTile = document.getElementById("Key" + letter);
                if (!keyTile.classList.contains("correct")) {
                    keyTile.classList.add("present");
                }
                letterCount[letter] -= 1;
            } // check if not in the word
            else {
                currentTile.classList.add("absent");
            }
        }
    }
}

