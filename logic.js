let generatedSequence = ''; // Global variable to store the generated sequence
let playerInputDigits = ''; // Variable to store the player's entered digits
let startTime; // Timer start time for responses
let currentRound = 0; // Initialize the current round counter
const maxRounds = 3; // Define the maximum number of rounds, in the future will be 20
let gameData = []; // Array to hold each round's data
let generatedNumbers = []; // Array to hold the random info from the game
let timeData = []; // Array to hold timing 
let currentDigitLength = 2;  // Start with 2 digits
let correctCount = 0;        // Counter for consecutive correct answers
const maxDigitLength = 7;    // Prevent going beyond 7 digits for complexity management

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('startButton').addEventListener('click', function () {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('inputScreen').style.display = 'flex';
    });

    document.getElementById('saveButton').addEventListener('click', function () {
        playerInputDigits = document.getElementById('digitInput').value;
        document.getElementById('inputScreen').style.display = 'none';
        startGame();
    });
});

function generateNumber() {
    let maxNumber = Math.pow(10, currentDigitLength) - 1;  // Max number for current digit length
    let minNumber = Math.pow(10, currentDigitLength - 1);  // Min number for current digit length
    return Math.floor(Math.random() * (maxNumber - minNumber + 1) + minNumber).toString();
}

function startGame() {
    if (currentRound < maxRounds) {
        generatedSequence = generateNumber(); // Ensures a 2-digit number and convert to string
        document.getElementById('digitDisplay').textContent = generatedSequence;
        document.getElementById('gameArea').style.display = 'none';
        document.getElementById('messageArea').textContent = '';
        document.getElementById('randomDigits').style.display = 'block';

        setTimeout(function () {
            document.getElementById('randomDigits').style.display = 'none';
            document.getElementById('gameArea').style.display = 'flex';
            startTime = performance.now(); // Start the timer after showing the keypad
        }, 2000);
    } else {
        endGame();
    }
}

document.getElementById('saveButton').addEventListener('click', function () {
    var inputCode = document.getElementById('digitInput').value; // Get the value from the input field
    window.savedCode = inputCode; // Store the input value for later use (e.g., in a global variable)
    gameData.unshift(window.savedCode); // Add the subject code at the beggining of the list 
    generatedNumbers.unshift(window.savedCode); // Add the subject code at the beggining of the list 
    timeData.unshift(window.savedCode); // Add the subject code at the beggining of the list 
    console.log("Saved code:", window.savedCode); // Optionally, log the saved code to the console or do other actions
});

function keyPressed(key) {
    const displayArea = document.getElementById('displayArea');
    displayArea.textContent += key;
}

function clearDisplay() {
    document.getElementById('displayArea').textContent = '';
}

function deleteLast() {
    const displayArea = document.getElementById('displayArea');
    displayArea.textContent = displayArea.textContent.slice(0, -1);
}

// function enterPressed() {
//     const endTime = performance.now();
//     const elapsedTime = endTime - startTime;
//     const displayArea = document.getElementById('displayArea');
//     const enteredSequence = displayArea.textContent;
//     const messageArea = document.getElementById('messageArea');
//     const result = enteredSequence === generatedSequence ? 'Correct' : 'Incorrect';

//     gameData.push(enteredSequence);
//     generatedNumbers.push(generatedSequence);
//     timeData.push(elapsedTime);

//     messageArea.textContent = result;
//     displayArea.textContent = '';
//     currentRound++;

//     logRoundData(playerInputDigits, generatedSequence, enteredSequence, elapsedTime);

//     if (currentRound < maxRounds) {
//         setTimeout(function () {
//             messageArea.textContent = '';
//             startGame();
//         }, 2000);
//     } else {
//         endGame();
//     }
// }
function enterPressed() {
    const endTime = performance.now();
    const elapsedTime = endTime - startTime;
    const displayArea = document.getElementById('displayArea');
    const enteredSequence = displayArea.textContent;
    const messageArea = document.getElementById('messageArea');
    const result = enteredSequence === generatedSequence ? 'Correct' : 'Incorrect';

    gameData.push(enteredSequence);
    generatedNumbers.push(generatedSequence);
    timeData.push(elapsedTime);

    if (result === 'Correct') {
        correctCount++;
        if (correctCount % 2 === 0 && currentDigitLength < maxDigitLength) {
            currentDigitLength++;  // Increase the digit length after every 2 consecutive correct answers
        }
    } else {
        correctCount = 0;  // Reset the correct count on incorrect answer
    }

    messageArea.textContent = result;
    displayArea.textContent = '';
    currentRound++;

    logRoundData(playerInputDigits, generatedSequence, enteredSequence, elapsedTime);

    if (currentRound < maxRounds) {
        setTimeout(function () {
            messageArea.textContent = '';
            startGame();
        }, 2000);
    } else {
        endGame();
    }
}

function logRoundData(inputDigits, generatedDigits, subjectResponse, responseTime) {
    console.log({
        InputDigits: inputDigits,
        GeneratedDigits: generatedDigits,
        SubjectResponse: subjectResponse,
        ResponseTime: responseTime
    });
}

function endGame() {
    document.getElementById('messageArea').textContent = 'המשחק הושלם';
    console.log('המשחק הושלם');
    console.log('Typed Answers:', gameData);
    console.log('Generated Digits:', generatedNumbers);
    console.log('Response Times:', timeData);
}

function generateCSVContent() {
    let csvContent = "Subject's Code,Generated Digit,Typed Answer,Response Time (ms)\n";
    gameData.forEach((round) => {
        csvContent += `${round.inputDigits},${round.generatedDigits},${round.subjectResponse},${round.responseTime}\n`;
    });
    return csvContent;
}

function sendGameData() {
    const csvContent = generateCSVContent(); // Generate the CSV string from game data
    const gameDataToSend = { csv: csvContent }; // Prepare the data object to send
    // make sure to change URL
    fetch('https://yourserver.com/saveGameData', { // Make sure to replace this URL with your actual server URL
        // make sure to change URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameDataToSend),
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch((error) => console.error('Error:', error));
}

function arraysToCSV(array1, array2, filename = 'data.csv') {
    if (array1.length !== array2.length) {
        throw new Error('Both arrays must be of the same length');
    }

    // Prepare CSV data
    let csvContent = 'Column1,Column2\n'; // Column headers
    for (let i = 0; i < array1.length; i++) {
        csvContent += `"${array1[i].toString().replace(/"/g, '""')}","${array2[i].toString().replace(/"/g, '""')}"\n`;
    }

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    // Create a link to download the blob
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.visibility = 'hidden';

    // Append link to the body, click it, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
