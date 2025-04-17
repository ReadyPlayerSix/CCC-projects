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
  // New celestial body facts data
  celestialBodyFacts: {
    "Mercury": {
      diameter: "4,879 km",
      gravity: "3.7 m/s²",
      dayLength: "58.6 Earth days",
      yearLength: "88 Earth days",
      temperature: "-173°C to 427°C",
      moons: "0",
      funFact: "Mercury's surface resembles our Moon with heavy cratering."
    },
    "Venus": {
      diameter: "12,104 km",
      gravity: "8.87 m/s²",
      dayLength: "243 Earth days",
      yearLength: "225 Earth days",
      temperature: "462°C",
      moons: "0",
      funFact: "Venus rotates in the opposite direction to most planets."
    },
    "Earth": {
      diameter: "12,756 km",
      gravity: "9.8 m/s²",
      dayLength: "24 hours",
      yearLength: "365.25 days",
      temperature: "-88°C to 58°C",
      moons: "1",
      funFact: "Earth is the only known planet to support life."
    },
    "Mars": {
      diameter: "6,792 km",
      gravity: "3.7 m/s²",
      dayLength: "24.6 hours",
      yearLength: "687 Earth days",
      temperature: "-153°C to 20°C",
      moons: "2",
      funFact: "Mars has the largest dust storms in the solar system."
    },
    "Jupiter": {
      diameter: "142,984 km",
      gravity: "23.1 m/s²",
      dayLength: "9.9 hours",
      yearLength: "11.9 Earth years",
      temperature: "-108°C",
      moons: "79",
      funFact: "Jupiter's Great Red Spot is a storm that has lasted over 300 years."
    },
    "Saturn": {
      diameter: "120,536 km",
      gravity: "9.0 m/s²",
      dayLength: "10.7 hours",
      yearLength: "29.5 Earth years",
      temperature: "-138°C",
      moons: "82",
      funFact: "Saturn's rings are made mostly of ice chunks and are over 270,000 km wide."
    },
    "Uranus": {
      diameter: "51,118 km",
      gravity: "8.7 m/s²",
      dayLength: "17.2 hours",
      yearLength: "84 Earth years",
      temperature: "-195°C",
      moons: "27",
      funFact: "Uranus rotates on its side with an axial tilt of about 98 degrees."
    },
    "Neptune": {
      diameter: "49,528 km",
      gravity: "11.0 m/s²",
      dayLength: "16.1 hours",
      yearLength: "165 Earth years",
      temperature: "-214°C",
      moons: "14",
      funFact: "Neptune has the strongest winds in the solar system, reaching 2,100 km/h."
    },
    "Pluto": {
      diameter: "2,376 km",
      gravity: "0.7 m/s²",
      dayLength: "153.3 hours",
      yearLength: "248 Earth years",
      temperature: "-229°C",
      moons: "5",
      funFact: "Pluto was reclassified as a dwarf planet in 2006."
    },
    "Sun": {
      diameter: "1,392,700 km",
      gravity: "274 m/s²",
      temperature: "5,500°C (surface), 15,000,000°C (core)",
      composition: "Hydrogen (73%), Helium (25%), Other (2%)",
      age: "4.6 billion years",
      funFact: "The Sun contains 99.86% of the mass in the Solar System."
    },
    "Moon": {
      diameter: "3,475 km",
      gravity: "1.6 m/s²",
      dayLength: "29.5 Earth days",
      yearLength: "27.3 Earth days",
      temperature: "-173°C to 127°C",
      funFact: "The Moon is moving away from Earth at a rate of 3.8 cm per year."
    }
  }
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

// Function to update the fact sheet when a celestial body is selected
function updateFactSheet(celestialBodyName) {
  // Get the facts for the selected body
  const facts = state.celestialBodyFacts[celestialBodyName];
  
  // If no facts are found, show a placeholder
  if (!facts) {
    document.getElementById("fact-diameter").textContent = "--";
    document.getElementById("fact-gravity").textContent = "--";
    document.getElementById("fact-day-length").textContent = "--";
    document.getElementById("fact-year-length").textContent = "--";
    document.getElementById("fact-temperature").textContent = "--";
    document.getElementById("fact-moons").textContent = "--";
    document.getElementById("fact-fun-fact").textContent = "--";
    
    // Show placeholder in visualization area
    const wireframeDisplay = document.getElementById("entity-wireframe");
    wireframeDisplay.innerHTML = '<div class="placeholder-message">Select an entity to view details</div>';
    return;
  }
  
  // Update the fact sheet with data from the selected celestial body
  document.getElementById("fact-diameter").textContent = facts.diameter || "--";
  document.getElementById("fact-gravity").textContent = facts.gravity || "--";
  document.getElementById("fact-day-length").textContent = facts.dayLength || "--";
  document.getElementById("fact-year-length").textContent = facts.yearLength || "--";
  document.getElementById("fact-temperature").textContent = facts.temperature || "--";
  document.getElementById("fact-moons").textContent = facts.moons || "--";
  document.getElementById("fact-fun-fact").textContent = facts.funFact || "--";
  
  // Display a simple wireframe based on the celestial body type
  createWireframeVisualization(celestialBodyName);
  
  // Log the action
  commandLog(`FETCHING DATA FOR: ${celestialBodyName.toUpperCase()}`, "processing");
  commandLog(`FACT SHEET UPDATED: ${celestialBodyName.toUpperCase()}`, "success");
}

// Function to create a simple wireframe visualization
function createWireframeVisualization(celestialBodyName) {
  const wireframeDisplay = document.getElementById("entity-wireframe");
  
  // Clear any existing content
  wireframeDisplay.innerHTML = '';
  
  // Create a simple SVG wireframe based on the celestial body type
  let svg = '';
  const bodyCategory = state.bodyCategories[celestialBodyName] ? state.bodyCategories[celestialBodyName][0] : '';
  
  switch(bodyCategory) {
    case 'stars':
      // Create a sun wireframe with rays
      svg = `
        <svg viewBox="0 0 100 100" class="wireframe-svg">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#00ff00" stroke-width="1"/>
          <line x1="50" y1="10" x2="50" y2="0" stroke="#00ff00" stroke-width="1"/>
          <line x1="50" y1="90" x2="50" y2="100" stroke="#00ff00" stroke-width="1"/>
          <line x1="10" y1="50" x2="0" y2="50" stroke="#00ff00" stroke-width="1"/>
          <line x1="90" y1="50" x2="100" y2="50" stroke="#00ff00" stroke-width="1"/>
          <line x1="22" y1="22" x2="15" y2="15" stroke="#00ff00" stroke-width="1"/>
          <line x1="78" y1="22" x2="85" y2="15" stroke="#00ff00" stroke-width="1"/>
          <line x1="22" y1="78" x2="15" y2="85" stroke="#00ff00" stroke-width="1"/>
          <line x1="78" y1="78" x2="85" y2="85" stroke="#00ff00" stroke-width="1"/>
        </svg>
      `;
      break;
      
    case 'gasGiants':
      // Create a planet with bands
      svg = `
        <svg viewBox="0 0 100 100" class="wireframe-svg">
          <circle cx="50" cy="50" r="40" fill="none" stroke="#00ff00" stroke-width="1"/>
          <ellipse cx="50" cy="50" rx="40" ry="10" fill="none" stroke="#00ff00" stroke-width="0.5"/>
          <ellipse cx="50" cy="40" rx="32" ry="8" fill="none" stroke="#00ff00" stroke-width="0.5"/>
          <ellipse cx="50" cy="60" rx="32" ry="8" fill="none" stroke="#00ff00" stroke-width="0.5"/>
        </svg>
      `;
      break;
      
    case 'iceGiants':
      // Create an ice giant with a tilted ring
      svg = `
        <svg viewBox="0 0 100 100" class="wireframe-svg">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#00ff00" stroke-width="1"/>
          <ellipse cx="50" cy="50" rx="45" ry="10" fill="none" stroke="#00ff00" stroke-width="0.5" transform="rotate(45 50 50)"/>
        </svg>
      `;
      break;
      
    case 'dwarfPlanets':
      // Create a small rocky planet
      svg = `
        <svg viewBox="0 0 100 100" class="wireframe-svg">
          <circle cx="50" cy="50" r="20" fill="none" stroke="#00ff00" stroke-width="1"/>
          <circle cx="60" cy="40" r="5" fill="none" stroke="#00ff00" stroke-width="0.5"/>
          <circle cx="35" cy="55" r="3" fill="none" stroke="#00ff00" stroke-width="0.5"/>
        </svg>
      `;
      break;
      
    case 'naturalSatellites':
      // Create a moon with craters
      svg = `
        <svg viewBox="0 0 100 100" class="wireframe-svg">
          <circle cx="50" cy="50" r="25" fill="none" stroke="#00ff00" stroke-width="1"/>
          <circle cx="40" cy="40" r="5" fill="none" stroke="#00ff00" stroke-width="0.5"/>
          <circle cx="65" cy="45" r="3" fill="none" stroke="#00ff00" stroke-width="0.5"/>
          <circle cx="55" cy="65" r="4" fill="none" stroke="#00ff00" stroke-width="0.5"/>
        </svg>
      `;
      break;
      
    default:
      // Create a default terrestrial planet
      svg = `
        <svg viewBox="0 0 100 100" class="wireframe-svg">
          <circle cx="50" cy="50" r="30" fill="none" stroke="#00ff00" stroke-width="1"/>
          <path d="M 30 55 Q 40 65, 50 60 T 70 55" fill="none" stroke="#00ff00" stroke-width="0.5"/>
          <path d="M 25 40 Q 40 35, 60 40 T 75 45" fill="none" stroke="#00ff00" stroke-width="0.5"/>
        </svg>
      `;
  }
  
  // Insert the SVG into the display container
  wireframeDisplay.innerHTML = svg;
  
  // Add a glow effect
  const svgElement = wireframeDisplay.querySelector('.wireframe-svg');
  if (svgElement) {
    svgElement.style.filter = 'drop-shadow(0 0 5px rgba(0, 255, 0, 0.7))';
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
      
      // Update the fact sheet with the selected celestial body's information
      updateFactSheet(selectedPlanet);
    } else {
      // Reset the fact sheet if no body is selected
      updateFactSheet(""); 
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
  
  // Initialize the fact sheet
  updateFactSheet("");
});
