// Global state management
const state = {
  planets: [
    ["Pluto", 0.06],
    ["Neptune", 1.148],
    ["Uranus", 0.917],
    ["Saturn", 1.139],
    ["Jupiter", 2.64],
    ["Mars", 0.3895],
    ["Moon", 0.1655],
    ["Earth", 1],
    ["Venus", 0.9032],
    ["Mercury", 0.377],
    ["Sun", 27.9],
  ],

  categories: {
    terrestrial: ["Mercury", "Venus", "Earth", "Mars"],
    gasGiants: ["Jupiter", "Saturn"],
    iceGiants: ["Uranus", "Neptune"],
    dwarfPlanets: ["Pluto"],
    stars: ["Sun"],
    naturalSatellites: ["Moon"],
    customEntities: [],
  },

  bodyCategories: {
    Mercury: ["terrestrial"],
    Venus: ["terrestrial"],
    Earth: ["terrestrial"],
    Mars: ["terrestrial"],
    Jupiter: ["gasGiants"],
    Saturn: ["gasGiants"],
    Uranus: ["iceGiants"],
    Neptune: ["iceGiants"],
    Pluto: ["dwarfPlanets"],
    Sun: ["stars"],
    Moon: ["naturalSatellites"],
  },

  activeFilters: {
    terrestrial: true,
    gasGiants: true,
    iceGiants: true,
    dwarfPlanets: true,
    stars: true,
    naturalSatellites: true,
    customEntities: true,
  },

  naturalSort: false,

  naturalOrder: [
    "Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ],

  logHistory: [],
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
  const planet = state.planets.find(
    ([name]) => name.toLowerCase() === planetName.toLowerCase()
  );

  if (!planet) return null;

  const multiplier = planet[1];
  return Number((weight * multiplier).toFixed(2));
}

// function to handle the processing animation
function simulateProcessing(callback) {
  const dots = [".", "..", "..."];
  let index = 0;

  // Start with the initial message
  commandLog("PROCESSING CALCULATION", "processing");

  // Create an interval that updates every 400ms
  const processingInterval = setInterval(() => {
    commandLog(`CALCULATING${dots[index]}`, "processing");
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

  const weightInput = document.getElementById("user-weight");
  const planetSelect = document.getElementById("planets");
  const outputElement = document.getElementById("output");

  const weight = parseFloat(weightInput.value);
  const planetName = planetSelect.value;

  if (!isNaN(weight) && planetName) {
    const result = calculateWeight(weight, planetName);
    if (result !== null) {
      const outputText = `If you were on ${planetName}, you would weigh ${result}lbs!`;
      outputElement.innerText = outputText;
      commandLog(`CALCULATION COMPLETE: ${outputText}`, "success");
      commandLog("READY FOR NEXT CALCULATION", "system");
    } else {
      commandLog("ERROR: Invalid calculation result", "error");
    }
  } else {
    if (isNaN(weight)) {
      commandLog("ERROR: Please enter a valid weight", "error");
    }
    if (!planetName) {
      commandLog("ERROR: Please select a planet", "error");
    }
  }
}

function updateDropdownOptions() {
  const planetSelect = document.getElementById("planets");
  const currentValue = planetSelect.value;

  // clear exisiting options except the default "select here..."
  while (planetSelect.options.length > 1) {
    planetSelect.remove(1);
  }

  // this gets all visible celestial bodies based on active filters
  const visibleBodies = new Set();
  Object.entries(state.activeFilters).forEach(([category, isActive]) => {
    if (isActive && state.categories[category]) {
      state.categories[category].forEach((body) => visibleBodies.add(body));
    }
  });

  let bodiesArray = Array.from(visibleBodies);

  if (state.naturalSort) {
    bodiesArray.sort((a, b) => {
      // grab the index from natural orders array
      const indexA = state.naturalOrder.indexOf(a);
      const indexB = state.naturalOrder.indexOf(b);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // if only one body is in the correct order then put the other at the end
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // if neither are in order push them back
      return a.localeCompare(b);
    });
  } else {
    // default alphabetical string
    bodiesArray.sort();
  }

  // add sorted options to dropdown
  bodiesArray.forEach((body) => {
    const option = new Option(body, body);
    planetSelect.add(option);
  });

  // Restore previous selection if it's still available
  if (
    Array.from(planetSelect.options).some(
      (option) => option.value === currentValue
    )
  ) {
    planetSelect.value = currentValue;
  } else {
    planetSelect.selectedIndex = 0; // Select the default option
    commandLog("NOTICE: Previous selection no longer available", "system");
  }
}

// function to handle filter checkbox changes
function handleFilterChange(event) {
  const checkbox = event.target;
  const category = checkbox.id; // checkbox ID must match category name
  const isChecked = checkbox.checked;

  // update state
  state.activeFilters[category] = isChecked;

  // log the change
  commandLog(`FILTER PROCESSING: ${category.toUpperCase()}`, "processing");

  if (!isChecked) {
    // log the celestial bodies that are hidden
    const hiddenBodies = state.categories[category];
    commandLog(`REMOVED: ${hiddenBodies.join(", ")}`, "success");
  } else {
    // log which bodies are being shown
    const shownBodies = state.categories[category];
    commandLog(`ADDED: ${shownBodies.join(", ")}`, "success");
  }

  // update the dropdown
  updateDropdownOptions();
}

function handleNaturalSortChange(event) {
  state.naturalSort = event.target.checked;
  commandLog(
    `SORT ORDER ${state.naturalSort ? "NATURAL" : "ALPHABETICAL"} ACTIVATED`,
    "processing"
  );
  updateDropdownOptions();
}

// function to initilize filter event listener
function initializerFilters() {
  // event listerners for each filter checkbox
  Object.keys(state.categories).forEach((category) => {
    const checkbox = document.getElementById(category);
    if (checkbox) {
      checkbox.addEventListener("change", handleFilterChange);
    }
  });

  updateDropdownOptions(); // populate dropdown

  commandLog("FILTER SYSTEM INITIALIZED", "system");

  const naturalSortCheckbox = document.getElementById("naturalSort");
  if (naturalSortCheckbox) {
    naturalSortCheckbox.addEventListener("change", handleNaturalSortChange);
  }
}

// function to handle commander center style logging
function commandLog(message, type = "info") {
  // log display area
  const logEntries = document.getElementById("log-entries");

  // create a new log entry with timestamp
  const logEntry = document.createElement("div");
  const timestamp = new Date().toLocaleTimeString("en-US", {
    hour12: false, // set to miliary time
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
document.addEventListener("DOMContentLoaded", () => {
  // references to input elements
  const lbsInput = document.getElementById("user-weight");
  const kgsInput = document.getElementById("user-weight-kgs");
  const planetSelect = document.getElementById("planets");

  // Initialize with a welcome message
  commandLog("ASTRO WEIGHT CALCULATOR SYSTEMS INITIALIZING...", "system");
  commandLog("ALL SYSTEMS NOMINAL", "success");

  // Handle pounds input with enhanced logging
  lbsInput.addEventListener("input", (e) => {
    const lbs = parseFloat(e.target.value);
    if (!isNaN(lbs)) {
      commandLog(`PROCESSING INPUT: ${lbs} LBS`, "input");
      const kgs = convertLbsToKg(lbs);
      if (kgsInput.value !== kgs.toFixed(2)) {
        kgsInput.value = kgs.toFixed(2);
        commandLog(`CONVERSION COMPLETE: ${kgs.toFixed(2)} KG`, "result");
      }
    }
  });

  // Handle kilograms input with enhanced logging
  kgsInput.addEventListener("input", (e) => {
    const kgs = parseFloat(e.target.value);
    if (!isNaN(kgs)) {
      commandLog(`PROCESSING INPUT: ${kgs} KG`, "input");
      const lbs = convertKgToLbs(kgs);
      if (lbsInput.value !== lbs.toFixed(2)) {
        lbsInput.value = lbs.toFixed(2);
        commandLog(`CONVERSION COMPLETE: ${lbs.toFixed(2)} LBS`, "result");
      }
    }
  });

  // Handle planet selection changes
  planetSelect.addEventListener("change", () => {
    const selectedPlanet = planetSelect.value;
    if (selectedPlanet) {
      commandLog(
        `CELESTIAL BODY SELECTED: ${selectedPlanet.toUpperCase()}`,
        "info"
      );
    }
  });

  // Set up calculate button with enhanced logging
  const calculateButton = document.getElementById("calculate-button");
  if (calculateButton) {
    calculateButton.onclick = (e) => {
      commandLog("INITIATING WEIGHT CALCULATION...", "processing");
      handleClickEvent(e);
    };
  }

  // initialize the filter system
  initializerFilters();
});
