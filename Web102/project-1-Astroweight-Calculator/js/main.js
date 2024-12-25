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

// unit conversion functions used thoroughout the application
const convertKgToLbs = (kg) => kg * 2.20462;
const convertLbsToKg = (lbs) => lbs / 2.20462;

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
    const autoCalculateCheckbox = document.getElementById('autosubmit');

    // function to check if auto-calc is on
    function shouldAutoCalculate() {
        return autoCalculateCheckbox.checked;
    }

    // function that triggers auto-calc
    function autoCalculate() {
        if (shouldAutoCalculate()) {
            // simulate a click on the exisiting calculation
            document.getElementById('calculate-button').click();
        }
    }

    // start up message
    commandLog('ASTRO WEIGHT CALCULATOR SYSTEMS INITIALIZING...', 'system');
    commandLog('ALL SYSTEMS NOMINAL', 'success');

    // handle pounds input
    lbsInput.addEventListener('input', (e) => {
        const lbs = parseFloat(e.target.value);
        if (!isNaN(lbs)) {
            commandLog(`PROCESSING INPUT: ${lbs} LBS`, 'input');
            const kgs = convertLbsToKg(lbs);
            if (kgsInput.value !== kgs.toFixed(2)) {
                kgsInput.value = kgs.toFixed(2);
                commandLog(`CONVERSION COMPLETE: ${kgs.toFixed(2)} KG`, 'result');
                autoCalculate();
            }
        }
    });

    // handle kilograms input
    kgsInput.addEventListener('input', (e) => {
        const kgs = parseFloat(e.target.value);
        if (!isNaN(kgs)) {
            commandLog(`PROCESSING INPUT: ${kgs} KG`, 'input');
            const lbs = convertKgToLbs(kgs);
            if (lbsInput.value !== lbs.toFixed(2)) {
                lbsInput.value = lbs.toFixed(2);
                commandLog(`CONVERSION COMPLETE: ${lbs.toFixed(2)} LBS`, 'result');
                autoCalculate();
            }
        }
    });

    // handle listener for planet selection changes
    planetSelect.addEventListener('change', () => {
        commandLog(`CELESTIAL BODY SELECTION CHANGED TO: ${planetSelect.value.toUpperCase()}`, 'info');
        autoCalculate();
    });

    document.getElementById('calculate-button').addEventListener('click', handleClickEvent);
});

function calculateWeight(weight, planetName) {
    // check for weight value
    if (weight === undefined || weight === null || weight === '') {
        commandLog('ERROR: NO WEIGHT VALUE PROVIDED', 'error');
        return null;
    }

    // check if weight is valid number
    if (isNaN(weight) || weight < 0) {
        commandLog('ERROR: WEIGHT MUST BE A VALID POSITIVE NUMBER', 'error');
        return null;
    }

    // check if planetName was selected
    if (!planetName) {
        commandLog('ERROR: NO CELESTIAL BODY SELECTED', 'error');
        return null;
    }

    // find planet's gravity multiplier from our state
    const planet = state.planets.find(p => p[0].toLowerCase() === planetName.toLowerCase());

    if (!planet) {
        commandLog(`ERROR: UNABLE TO LOCATE CELESTIAL BODY "${planetName}"`, 'error');
        return null;
    }

    const gravityMultiplier = planet[1];
    const weightOnPlanet = weight * gravityMultiplier;

    // mission control style logging
    commandLog(`CALCULATING WEIGHT FOR CELESTIAL BODY: ${planet[0]}`, 'processing');
    commandLog(`GRAVITY MULTIPLIER: ${gravityMultiplier}x EARTH GRAVITY`, 'info');
    commandLog(`COMPUTATION COMPLETE: ${weight} x ${gravityMultiplier} = ${weightOnPlanet.toFixed(2)}`, 'result');

    return Number(weightOnPlanet.toFixed(2));
    // Code to return the correct weight
}

function handleClickEvent(e) {

    // prevent form submission
    if (e) e.preventDefault();

    const lbsInput = document.getElementById('user-weight');
    const kgsInput = document.getElementById('user-weight-kgs');
    const planetSelect = document.getElementById('planets');
    const outputElement = document.getElementById('output');

    let weight, unit;
    if (lbsInput.value) {
        weight = parseFloat(lbsInput.value);
        unit = 'lbs';
    } else if (kgsInput.value) {
        weight = parseFloat(kgsInput.value);
        unit = 'kgs';
    } else {
        commandLog('ERROR: Please enter a weight value', 'error');
        return;
    }

    // get selected planet
    const planetName = planetSelect.value;

    // use calculateWeight function
    const result = calculateWeight(weight, planetName);

    // update display if valid result
    if (result !== null) {
        outputElement.textContent = `If you were on ${planetName}, you would weigh ${result}${unit}!`;

        commandLog('CALCULATION SEQUENCE COMPLETE', 'success');

        const formattedPlanet = planetName ? planetName.toUpperCase() : planetName;
        commandLog(`Your weight on ${formattedPlanet} would be ${result}${unit}!`, 'result');
    }
}



// set the #calculate-button element's onclick method to use the handleClickEvent function
// make it look nice by attaching a style.css file to your index.html and writing some basic styling
// feel free to add classes and id's to the HTML elements as you need
// import a google font and use it for some or all of the text on your page

// bonus challenge
// reverse the drop down order so that the sun is first

// personal notes
// include filter options for showing drop down order in distance from the sun
// include toggle filter option for dwarf planets
// include menu for adding new planets, name and weight multiplier
// try styling with a different style library such as Bulma or Materialize for a modern look