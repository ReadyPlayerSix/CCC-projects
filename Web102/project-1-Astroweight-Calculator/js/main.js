// =====================
// FUTURE ENHANCEMENTS
// =====================
/*
This section contains ideas and code for future improvements to the application.
Each enhancement is documented with its intended purpose and any existing implementation.

1. Processing Animation Enhancement
--------------------------------
A processing animation feature was developed to create an educational "mission control" 
experience, simulating computer processing time with animated dots in the command log. 
While the animation enhanced user engagement, it was removed to maintain compatibility 
with the automated tests which expect immediate output. The animation code has been 
preserved for future implementation in a version not constrained by immediate response 
requirements.

Implementation:
*/
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

// =====================
// STATE MANAGEMENT
// =====================
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

// =====================
// UTILITY FUNCTIONS
// =====================
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

function commandLog(message, type = "info") {
  const logEntries = document.getElementById("log-entries");
  const logEntry = document.createElement("div");
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });

  logEntry.className = `log-entry log-${type}`;
  logEntry.innerHTML = `<span class="log-timestamp">[${timestamp}]</span> <span class="log-message">${message}</span>`;

  logEntries.appendChild(logEntry);
  logEntries.scrollTop = logEntries.scrollHeight;

  state.logHistory.push({ timestamp, message, type });
}

// =====================
// EVENT HANDLERS
// =====================
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
    if (isNaN(weight))
      commandLog("ERROR: Please enter a valid weight", "error");
    if (!planetName) commandLog("ERROR: Please select a planet", "error");
  }
}

function handleFilterChange(event) {
  const checkbox = event.target;
  const category = checkbox.id;
  const isChecked = checkbox.checked;

  state.activeFilters[category] = isChecked;
  commandLog(`FILTER PROCESSING: ${category.toUpperCase()}`, "processing");

  if (!isChecked) {
    const hiddenBodies = state.categories[category];
    commandLog(`REMOVED: ${hiddenBodies.join(", ")}`, "success");
  } else {
    const shownBodies = state.categories[category];
    commandLog(`ADDED: ${shownBodies.join(", ")}`, "success");
  }

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

function handleAdvancedModeToggle(event) {
  const advancedInputs = document.querySelector(".advanced-inputs");
  const basicInputs = document.querySelector(".basic-inputs");
  const customMassInput = document.getElementById("custom-mass");
  const customRadiusInput = document.getElementById("custom-radius");

  if (event.target.checked) {
    advancedInputs.style.opacity = "1";
    advancedInputs.style.pointerEvents = "auto";
    customMassInput.disabled = false;
    customRadiusInput.disabled = false;
    basicInputs.style.opacity = "0.5";
    basicInputs.style.pointerEvents = "none";
  } else {
    advancedInputs.style.opacity = "0.5";
    advancedInputs.style.pointerEvents = "none";
    customMassInput.disabled = true;
    customRadiusInput.disabled = true;
    basicInputs.style.opacity = "1";
    basicInputs.style.pointerEvents = "auto";
  }
}

function handleSliderInput(event) {
  const slider = event.target;
  const output = document.getElementById(`${slider.id}-value`);

  let displayValue;
  switch (slider.id) {
    case "custom-multiplier":
      displayValue = `${slider.value} Earth gravity`;
      break;
    case "custom-mass":
      displayValue = `${slider.value} Earth mass`;
      break;
    case "custom-radius":
      displayValue = `${slider.value} Earth radius`;
      break;
  }

  if (output && displayValue) {
    output.textContent = displayValue;
  }
}

// =====================
// UI UPDATE FUNCTIONS
// =====================
function updateDropdownOptions() {
  const planetSelect = document.getElementById("planets");
  const currentValue = planetSelect.value;

  while (planetSelect.options.length > 1) {
    planetSelect.remove(1);
  }

  const visibleBodies = new Set();
  Object.entries(state.activeFilters).forEach(([category, isActive]) => {
    if (isActive && state.categories[category]) {
      state.categories[category].forEach((body) => visibleBodies.add(body));
    }
  });

  let bodiesArray = Array.from(visibleBodies);

  if (state.naturalSort) {
    bodiesArray.sort((a, b) => {
      const indexA = state.naturalOrder.indexOf(a);
      const indexB = state.naturalOrder.indexOf(b);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });
  } else {
    bodiesArray.sort();
  }

  bodiesArray.forEach((body) => {
    const option = new Option(body, body);
    planetSelect.add(option);
  });

  if (
    Array.from(planetSelect.options).some(
      (option) => option.value === currentValue
    )
  ) {
    planetSelect.value = currentValue;
  } else {
    planetSelect.selectedIndex = 0;
    commandLog("NOTICE: Previous selection no longer available", "system");
  }
}

// =====================
// INITIALIZATION
// =====================
function initializeFilters() {
  Object.keys(state.categories).forEach((category) => {
    const checkbox = document.getElementById(category);
    if (checkbox) {
      checkbox.addEventListener("change", handleFilterChange);
    }
  });

  updateDropdownOptions();
  commandLog("FILTER SYSTEM INITIALIZED", "system");

  const naturalSortCheckbox = document.getElementById("naturalSort");
  if (naturalSortCheckbox) {
    naturalSortCheckbox.addEventListener("change", handleNaturalSortChange);
  }
}

function initializeSliders() {
  const sliders = ["custom-multiplier", "custom-mass", "custom-radius"];

  sliders.forEach((sliderId) => {
    const slider = document.getElementById(sliderId);
    if (slider) {
      slider.addEventListener("input", handleSliderInput);
    }
  });
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const lbsInput = document.getElementById("user-weight");
  const kgsInput = document.getElementById("user-weight-kgs");
  const planetSelect = document.getElementById("planets");
  const advancedModeToggle = document.getElementById("advanced-mode");
  const resetButton = document.getElementById("reset-button");
  const clearLogButton = document.getElementById("clear-log");

  // Clear Log button handler
  if (clearLogButton) {
    clearLogButton.addEventListener("click", (e) => {
      e.preventDefault();
      const logEntries = document.getElementById("log-entries");
      logEntries.innerHTML = ""; // Clear all log entries
      state.logHistory = []; // Reset the log history array
      commandLog("MISSION CONTROL LOG CLEARED", "system");
      commandLog("SYSTEM RESET COMPLETE", "success");
    });
  }

  // Reset button handler
  if (resetButton) {
    resetButton.addEventListener("click", (e) => {
      e.preventDefault();
      commandLog("INITIATING SYSTEM RESET...", "processing");
      
      // Reset weight inputs
      lbsInput.value = "";
      kgsInput.value = "";
      
      // Reset planet selection
      planetSelect.selectedIndex = 0;
      
      // Reset all filters to checked (default state)
      Object.keys(state.activeFilters).forEach(category => {
        const checkbox = document.getElementById(category);
        if (checkbox) {
          checkbox.checked = true;
          state.activeFilters[category] = true;
        }
      });
      
      // Reset natural sort checkbox
      const naturalSortCheckbox = document.getElementById("naturalSort");
      if (naturalSortCheckbox) {
        naturalSortCheckbox.checked = false;
        state.naturalSort = false;
      }
      
      // Turn off advanced mode if it's on
      if (advancedModeToggle && advancedModeToggle.checked) {
        advancedModeToggle.checked = false;
        const advancedInputs = document.querySelector(".advanced-inputs");
        const basicInputs = document.querySelector(".basic-inputs");
        const customMassInput = document.getElementById("custom-mass");
        const customRadiusInput = document.getElementById("custom-radius");
        
        if (advancedInputs && basicInputs) {
          advancedInputs.style.opacity = "0.5";
          advancedInputs.style.pointerEvents = "none";
          basicInputs.style.opacity = "1";
          basicInputs.style.pointerEvents = "auto";
        }
        
        if (customMassInput) customMassInput.disabled = true;
        if (customRadiusInput) customRadiusInput.disabled = true;
      }
      
      // Reset all sliders to default values
      const sliders = ["custom-multiplier", "custom-mass", "custom-radius"];
      sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const output = document.getElementById(`${sliderId}-value`);
        if (slider) {
          slider.value = 1; // Reset to default value
          
          // Update the displayed value
          if (output) {
            let displayValue = "1";
            switch (sliderId) {
              case "custom-multiplier":
                displayValue = "1 Earth gravity";
                break;
              case "custom-mass":
                displayValue = "1 Earth mass";
                break;
              case "custom-radius":
                displayValue = "1 Earth radius";
                break;
            }
            output.textContent = displayValue;
          }
        }
      });
      
      // Clear any output text
      const outputElement = document.getElementById("output");
      if (outputElement) outputElement.innerText = "";
      
      // Update the dropdown options to reflect the reset filters
      updateDropdownOptions();
      
      commandLog("ALL INPUTS RESET TO DEFAULT VALUES", "success");
      commandLog("SYSTEM READY", "system");
    });
  }

  commandLog("ASTRO WEIGHT CALCULATOR SYSTEMS INITIALIZING...", "system");
  commandLog("ALL SYSTEMS NOMINAL", "success");

  // Weight conversion handlers
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

  // Planet selection handler
  planetSelect.addEventListener("change", () => {
    const selectedPlanet = planetSelect.value;
    if (selectedPlanet) {
      commandLog(
        `CELESTIAL BODY SELECTED: ${selectedPlanet.toUpperCase()}`,
        "info"
      );
    }
  });

  // Calculate button handler
  const calculateButton = document.getElementById("calculate-button");
  if (calculateButton) {
    calculateButton.onclick = (e) => {
      commandLog("INITIATING WEIGHT CALCULATION...", "processing");
      handleClickEvent(e);
    };
  }

  // Initialize advanced mode toggle
  if (advancedModeToggle) {
    advancedModeToggle.addEventListener("change", handleAdvancedModeToggle);
  }

  // Initialize sliders
  initializeSliders();

  // Initialize filters
  initializeFilters();
});
