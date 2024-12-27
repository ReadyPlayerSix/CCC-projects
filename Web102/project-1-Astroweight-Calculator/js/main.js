// Global state management
const state = {
    planets: [
        ['Pluto', 0.06],
        ['Neptune', 1.148],
        ['Uranus', 0.917],
        ['Saturn', 1.139],
        ['Jupiter', 2.640],
        ['Mars', 0.3895],
        ['Moon', 0.1655],
        ['Earth', 1],
        ['Venus', 0.9032],
        ['Mercury', 0.377],
        ['Sun', 27.9]
    ],

    logHistory: []
};

/*
Future Enhancement Note:
A processing animation feature was developed to create an educational "mission control" 
experience, simulating computer processing time with animated dots in the command log. 
While the animation enhanced user engagement, it was removed to maintain compatibility 
with the automated tests which expect immediate output. The animation code has been 
preserved for future implementation in a version not constrained by immediate response 
requirements.

Additional comments and notes are added throughout to aide me in future referencing.
*/

// unit conversion functions used thoroughout the application
const convertKgToLbs = (kg) => kg * 2.20462;
const convertLbsToKg = (lbs) => lbs / 2.20462;

function calculateWeight(weight, planetName) {
    const planet = state.planets.find(([name]) => 
        name.toLowerCase() === planetName.toLowerCase()
    );
    
    if (!planet) return null;
    
    const multiplier = planet[1];
    return Number((weight * multiplier).toFixed(2));
}

// function to handle the processing animation
function simulateProcessing(callback) {
    const dots = ['.', '..', '...'];
    let index = 0;
    
    // Start with the initial message
    commandLog('PROCESSING CALCULATION', 'processing');
    
    // Create an interval that updates every 400ms
    const processingInterval = setInterval(() => {
        commandLog(`CALCULATING${dots[index]}`, 'processing');
        index = (index + 1) % dots.length;
    }, 400);

    // After 1.2 seconds (3 dots cycles), clear the interval and continue
    setTimeout(() => {
        clearInterval(processingInterval);
        callback();
    }, 1200);
}

// function to handle click events
function handleClickEvent(e) {
    if (e) e.preventDefault();
    
    const weightInput = document.getElementById('user-weight');
    const planetSelect = document.getElementById('planets');
    const outputElement = document.getElementById('output');
    
    const weight = parseFloat(weightInput.value);
    const planetName = planetSelect.value;
    
    if (!isNaN(weight) && planetName) {
        const result = calculateWeight(weight, planetName);
        if (result !== null) {
            const outputText = `If you were on ${planetName}, you would weigh ${result}lbs!`;
            outputElement.innerText = outputText;
            commandLog(`CALCULATION COMPLETE: ${outputText}`, 'success');
            commandLog('READY FOR NEXT CALCULATION', 'system');
        } else {
            commandLog('ERROR: Invalid calculation result', 'error');
        }
    } else {
        if (isNaN(weight)) {
            commandLog('ERROR: Please enter a valid weight', 'error');
        }
        if (!planetName) {
            commandLog('ERROR: Please select a planet', 'error');
        }
    }
}

// function to handle commander center style logging
function commandLog(message, type = 'info') {
    // log display area
    const logEntries = document.getElementById('log-entries');

    // create a new log entry with timestamp
    const logEntry = document.createElement('div');
    const timestamp = new Date().toLocaleTimeString('en-US', {
        hour12: false // set to miliary time
    });

    // styling class and build message
    logEntry.className = `log-entry log-${type}`;
    logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> <span class="log-message">${message}</span>`;

    // display and scroll view
    logEntries.appendChild(logEntry);
    logEntries.scrollTop = logEntries.scrollHeight;

    // store into history
    state.logHistory.push({
        timestamp,
        message,
        type,
    });
}

// initialize the calculator when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // references to input elements
    const lbsInput = document.getElementById('user-weight');
    const kgsInput = document.getElementById('user-weight-kgs');
    const planetSelect = document.getElementById('planets');
    
    // Initialize with a welcome message
    commandLog('ASTRO WEIGHT CALCULATOR SYSTEMS INITIALIZING...', 'system');
    commandLog('ALL SYSTEMS NOMINAL', 'success');

    // Handle pounds input with enhanced logging
    lbsInput.addEventListener('input', (e) => {
        const lbs = parseFloat(e.target.value);
        if (!isNaN(lbs)) {
            commandLog(`PROCESSING INPUT: ${lbs} LBS`, 'input');
            const kgs = convertLbsToKg(lbs);
            if (kgsInput.value !== kgs.toFixed(2)) {
                kgsInput.value = kgs.toFixed(2);
                commandLog(`CONVERSION COMPLETE: ${kgs.toFixed(2)} KG`, 'result');
            }
        }
    });

    // Handle kilograms input with enhanced logging
    kgsInput.addEventListener('input', (e) => {
        const kgs = parseFloat(e.target.value);
        if (!isNaN(kgs)) {
            commandLog(`PROCESSING INPUT: ${kgs} KG`, 'input');
            const lbs = convertKgToLbs(kgs);
            if (lbsInput.value !== lbs.toFixed(2)) {
                lbsInput.value = lbs.toFixed(2);
                commandLog(`CONVERSION COMPLETE: ${lbs.toFixed(2)} LBS`, 'result');
            }
        }
    });

    // Handle planet selection changes
    planetSelect.addEventListener('change', () => {
        const selectedPlanet = planetSelect.value;
        if (selectedPlanet) {
            commandLog(`CELESTIAL BODY SELECTED: ${selectedPlanet.toUpperCase()}`, 'info');
        }
    });

    // Set up calculate button with enhanced logging
    const calculateButton = document.getElementById('calculate-button');
    if (calculateButton) {
        calculateButton.onclick = (e) => {
            commandLog('INITIATING WEIGHT CALCULATION...', 'processing');
            handleClickEvent(e);
        };
    }
});

// bonus challenge
// reverse the drop down order so that the sun is first

// personal notes
// try styling with a different style library such as Bulma or Materialize for a modern look