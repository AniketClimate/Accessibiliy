// Application Data
const disabilityTypes = {
  "locomotor": { "name": "Locomotor/Physical", "percentage": 44.73, "description": "Mobility impairments, wheelchair users" },
  "mental": { "name": "Mental/Intellectual", "percentage": 17.2, "description": "Cognitive and intellectual disabilities" },
  "speech": { "name": "Speech & Language", "percentage": 12.8, "description": "Communication difficulties" },
  "visual": { "name": "Visual", "percentage": 18.9, "description": "Blindness and low vision" },
  "hearing": { "name": "Hearing", "percentage": 6.37, "description": "Deafness and hearing loss" }
};

const facilityAreas = {
  "entrance": {
    "name": "Entrance & Loading Zone",
    "requirements": [
      {"id": "e1", "item": "Loading zone 2400mm wide, 6000mm long", "cost": 15000, "priority": "high"},
      {"id": "e2", "item": "Accessible entrance door (900mm minimum width)", "cost": 8000, "priority": "high"},
      {"id": "e3", "item": "Smooth transition from entrance to loading zone", "cost": 5000, "priority": "medium"},
      {"id": "e4", "item": "Clear signage and directional indicators", "cost": 3000, "priority": "medium"}
    ]
  },
  "reception": {
    "name": "Reception Area",
    "requirements": [
      {"id": "r1", "item": "Dual-height reception counter (750-800mm & 950-1100mm)", "cost": 12000, "priority": "high"},
      {"id": "r2", "item": "Knee space under counter (750mm wide, 480mm deep)", "cost": 3000, "priority": "high"},
      {"id": "r3", "item": "Communication request forms for hearing impaired", "cost": 500, "priority": "medium"},
      {"id": "r4", "item": "Loop system for hearing aid users", "cost": 8000, "priority": "low"}
    ]
  },
  "waiting": {
    "name": "Waiting Area",
    "requirements": [
      {"id": "w1", "item": "Wheelchair accessible seating (1100mm spaces)", "cost": 6000, "priority": "high"},
      {"id": "w2", "item": "Dual-height drinking water sources", "cost": 4000, "priority": "medium"},
      {"id": "w3", "item": "Accessible magazine rack and furniture", "cost": 2500, "priority": "low"},
      {"id": "w4", "item": "Visual alarm systems", "cost": 7000, "priority": "medium"}
    ]
  },
  "examination": {
    "name": "Examination Rooms",
    "requirements": [
      {"id": "ex1", "item": "Height-adjustable examination table (400-500mm minimum)", "cost": 45000, "priority": "high"},
      {"id": "ex2", "item": "Wheelchair turning space (1500mm diameter)", "cost": 0, "priority": "high"},
      {"id": "ex3", "item": "Accessible weighing scale (250kg capacity)", "cost": 18000, "priority": "medium"},
      {"id": "ex4", "item": "Patient lift/hoist equipment", "cost": 65000, "priority": "low"}
    ]
  },
  "toilets": {
    "name": "Accessible Toilets",
    "requirements": [
      {"id": "t1", "item": "Accessible toilet with grab bars (1800x1800mm)", "cost": 25000, "priority": "high"},
      {"id": "t2", "item": "Door width 900mm minimum", "cost": 4000, "priority": "high"},
      {"id": "t3", "item": "Accessible sink and fixtures", "cost": 8000, "priority": "medium"},
      {"id": "t4", "item": "Tactile signage in Braille", "cost": 1500, "priority": "medium"}
    ]
  },
  "laboratory": {
    "name": "Laboratory",
    "requirements": [
      {"id": "l1", "item": "Adjustable work surface height (750-850mm)", "cost": 15000, "priority": "medium"},
      {"id": "l2", "item": "Wheelchair accessible laboratory equipment", "cost": 35000, "priority": "medium"},
      {"id": "l3", "item": "Clear pathways for wheelchair movement", "cost": 2000, "priority": "high"},
      {"id": "l4", "item": "Accessible specimen collection area", "cost": 8000, "priority": "medium"}
    ]
  },
  "pharmacy": {
    "name": "Pharmacy",
    "requirements": [
      {"id": "p1", "item": "Accessible counter (max 1000mm height)", "cost": 8000, "priority": "high"},
      {"id": "p2", "item": "Good lighting for low vision users", "cost": 3000, "priority": "medium"},
      {"id": "p3", "item": "Visual display of medications", "cost": 2500, "priority": "low"},
      {"id": "p4", "item": "E-prescription accessibility features", "cost": 5000, "priority": "low"}
    ]
  },
  "emergency": {
    "name": "Emergency Exits",
    "requirements": [
      {"id": "em1", "item": "Accessible emergency exit route (1200mm wide)", "cost": 8000, "priority": "high"},
      {"id": "em2", "item": "Emergency ramps (not just stairs)", "cost": 20000, "priority": "high"},
      {"id": "em3", "item": "Emergency lighting and alarm systems", "cost": 12000, "priority": "medium"},
      {"id": "em4", "item": "Clear evacuation signage", "cost": 4000, "priority": "medium"}
    ]
  }
};

const costFactors = {
  "urban": 1.3,
  "rural": 1.0,
  "laborMultiplier": 0.6,
  "contingency": 0.15
};

const implementationPhases = [
  { "phase": 1, "name": "Critical Access", "duration": "2-3 months", "description": "Basic entrance, toilets, and emergency exits" },
  { "phase": 2, "name": "Service Areas", "duration": "3-4 months", "description": "Reception, waiting areas, and examination rooms" },
  { "phase": 3, "name": "Specialized Equipment", "duration": "4-6 months", "description": "Medical equipment and advanced accessibility features" }
];

// Application State
let appState = {
  population: 0,
  areaType: 'rural',
  facilityName: '',
  state: '',
  disabilityStats: {},
  assessmentResults: {},
  requirementsCost: 0,
  currentSection: 'demographics',
  nonCompliantRequirements: [],
  totalCost: 0,
  complianceScore: 0
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Application loading...');
  initializeNavigation();
  initializeDemographics();
  initializeAssessment();
  initializeResults();
  initializeReport();
  renderDisabilityChart();
  console.log('Application loaded successfully');
});

// Navigation Functions
function initializeNavigation() {
  const navSteps = document.querySelectorAll('.nav__step');
  navSteps.forEach(step => {
    step.addEventListener('click', function(e) {
      e.preventDefault();
      const targetStep = this.dataset.step;
      console.log('Nav step clicked:', targetStep);
      
      // Allow navigation to any completed or current step
      if (this.classList.contains('nav__step--completed') || 
          this.classList.contains('nav__step--active') || 
          canNavigateToSection(targetStep)) {
        navigateToSection(targetStep);
      }
    });
  });
  console.log('Navigation initialized');
}

function canNavigateToSection(sectionName) {
  // Define navigation rules
  const sectionOrder = ['demographics', 'assessment', 'results', 'report'];
  const currentIndex = sectionOrder.indexOf(appState.currentSection);
  const targetIndex = sectionOrder.indexOf(sectionName);
  
  // Can always go back, or go to next section if current is completed
  return targetIndex <= currentIndex + 1;
}

function navigateToSection(sectionName) {
  console.log('Navigating to section:', sectionName);
  
  // Hide all sections
  const allSections = document.querySelectorAll('.section');
  allSections.forEach(section => {
    section.classList.remove('section--active');
  });
  
  // Show target section
  const targetSection = document.getElementById(`${sectionName}-section`);
  if (targetSection) {
    targetSection.classList.add('section--active');
    appState.currentSection = sectionName;
    updateNavigation(sectionName);
    console.log('Successfully navigated to:', sectionName);
  } else {
    console.error('Section not found:', sectionName);
  }
}

function updateNavigation(currentSection) {
  const navSteps = document.querySelectorAll('.nav__step');
  const sectionOrder = ['demographics', 'assessment', 'results', 'report'];
  const currentIndex = sectionOrder.indexOf(currentSection);
  
  navSteps.forEach((step, index) => {
    step.classList.remove('nav__step--active', 'nav__step--completed');
    
    if (index === currentIndex) {
      step.classList.add('nav__step--active');
    } else if (index < currentIndex) {
      step.classList.add('nav__step--completed');
    }
  });
}

// Demographics Section
function initializeDemographics() {
  const populationInput = document.getElementById('population');
  const areaTypeSelect = document.getElementById('area-type');
  const nextButton = document.getElementById('next-to-assessment');
  
  // Add event listeners
  if (populationInput) {
    populationInput.addEventListener('input', calculateDisabilityStats);
  }
  
  if (areaTypeSelect) {
    areaTypeSelect.addEventListener('change', function() {
      appState.areaType = this.value;
      calculateDisabilityStats();
      console.log('Area type changed to:', this.value);
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Next button clicked');
      if (validateDemographics()) {
        navigateToSection('assessment');
      }
    });
  }
  
  console.log('Demographics section initialized');
}

function calculateDisabilityStats() {
  const populationInput = document.getElementById('population');
  const facilityNameInput = document.getElementById('facility-name');
  const stateInput = document.getElementById('state');
  
  const population = parseInt(populationInput?.value || 0);
  appState.population = population;
  appState.facilityName = facilityNameInput?.value || '';
  appState.state = stateInput?.value || '';
  
  const totalDisabled = Math.round(population * 0.0221); // 2.21% from Census 2011
  const totalDisabledElement = document.getElementById('total-disabled');
  if (totalDisabledElement) {
    totalDisabledElement.textContent = totalDisabled.toLocaleString();
  }
  
  // Calculate breakdown by type
  const breakdown = {};
  Object.keys(disabilityTypes).forEach(type => {
    breakdown[type] = Math.round(totalDisabled * (disabilityTypes[type].percentage / 100));
  });
  
  appState.disabilityStats = { total: totalDisabled, breakdown };
  renderDisabilityBreakdown();
}

function renderDisabilityChart() {
  const chartCanvas = document.getElementById('disability-chart');
  if (!chartCanvas) return;
  
  const ctx = chartCanvas.getContext('2d');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: Object.values(disabilityTypes).map(type => type.name),
      datasets: [{
        data: Object.values(disabilityTypes).map(type => type.percentage),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        title: {
          display: true,
          text: 'Distribution of Disability Types in India (Census 2011)'
        }
      }
    }
  });
}

function renderDisabilityBreakdown() {
  const container = document.getElementById('disability-breakdown');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (appState.disabilityStats.breakdown) {
    Object.keys(disabilityTypes).forEach(type => {
      const count = appState.disabilityStats.breakdown[type] || 0;
      const typeData = disabilityTypes[type];
      
      const div = document.createElement('div');
      div.className = 'disability-type';
      div.innerHTML = `
        <div class="disability-type__name">${typeData.name}</div>
        <div class="disability-type__count">${count.toLocaleString()}</div>
        <div class="disability-type__description">${typeData.description}</div>
      `;
      container.appendChild(div);
    });
  }
}

function validateDemographics() {
  const populationInput = document.getElementById('population');
  const population = parseInt(populationInput?.value || 0);
  if (!population || population < 100) {
    alert('Please enter a valid population (minimum 100)');
    return false;
  }
  return true;
}

// Assessment Section
function initializeAssessment() {
  renderAssessmentAreas();
  
  const backButton = document.getElementById('back-to-demographics');
  const calculateButton = document.getElementById('calculate-results');
  
  if (backButton) {
    backButton.addEventListener('click', function(e) {
      e.preventDefault();
      navigateToSection('demographics');
    });
  }
  
  if (calculateButton) {
    calculateButton.addEventListener('click', function(e) {
      e.preventDefault();
      calculateResults();
      navigateToSection('results');
    });
  }
  
  console.log('Assessment section initialized');
}

function renderAssessmentAreas() {
  const container = document.getElementById('assessment-areas');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.keys(facilityAreas).forEach(areaKey => {
    const area = facilityAreas[areaKey];
    const div = document.createElement('div');
    div.className = 'assessment-area';
    div.innerHTML = `
      <div class="assessment-area__header" onclick="toggleArea('${areaKey}')">
        <div class="assessment-area__title">${area.name}</div>
        <div class="assessment-area__status status--info" id="status-${areaKey}">Not Assessed</div>
      </div>
      <div class="assessment-area__content" id="content-${areaKey}">
        <div class="assessment-requirements">
          ${area.requirements.map(req => `
            <div class="requirement-item">
              <div class="requirement-item__text">${req.item}</div>
              <div class="requirement-item__controls">
                <button class="requirement-status" data-status="compliant" data-req="${req.id}" onclick="setRequirementStatus('${req.id}', 'compliant')">
                  Compliant
                </button>
                <button class="requirement-status" data-status="non-compliant" data-req="${req.id}" onclick="setRequirementStatus('${req.id}', 'non-compliant')">
                  Non-Compliant
                </button>
                <button class="requirement-status" data-status="na" data-req="${req.id}" onclick="setRequirementStatus('${req.id}', 'na')">
                  N/A
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

function toggleArea(areaKey) {
  const area = document.querySelector(`#content-${areaKey}`).closest('.assessment-area');
  if (area) {
    area.classList.toggle('assessment-area--expanded');
  }
}

function setRequirementStatus(reqId, status) {
  console.log('Setting requirement status:', reqId, status);
  
  // Update UI
  const buttons = document.querySelectorAll(`[data-req="${reqId}"]`);
  buttons.forEach(btn => {
    btn.classList.remove('requirement-status--compliant', 'requirement-status--non-compliant', 'requirement-status--na');
    if (btn.dataset.status === status) {
      btn.classList.add(`requirement-status--${status}`);
    }
  });
  
  // Store in state
  if (!appState.assessmentResults) {
    appState.assessmentResults = {};
  }
  appState.assessmentResults[reqId] = status;
  
  updateAssessmentProgress();
  updateAreaStatus();
}

function updateAssessmentProgress() {
  const totalRequirements = Object.values(facilityAreas).reduce((sum, area) => sum + area.requirements.length, 0);
  const assessedRequirements = Object.keys(appState.assessmentResults || {}).length;
  const progressPercent = (assessedRequirements / totalRequirements) * 100;
  
  const progressFill = document.getElementById('assessment-progress-fill');
  const progressText = document.getElementById('progress-text');
  
  if (progressFill) {
    progressFill.style.width = `${progressPercent}%`;
  }
  if (progressText) {
    progressText.textContent = `${Math.round(progressPercent)}% Complete`;
  }
}

function updateAreaStatus() {
  Object.keys(facilityAreas).forEach(areaKey => {
    const area = facilityAreas[areaKey];
    const statusElement = document.getElementById(`status-${areaKey}`);
    if (!statusElement) return;
    
    const areaRequirements = area.requirements.map(req => req.id);
    const assessedInArea = areaRequirements.filter(reqId => appState.assessmentResults && appState.assessmentResults[reqId]);
    
    if (assessedInArea.length === 0) {
      statusElement.textContent = 'Not Assessed';
      statusElement.className = 'assessment-area__status status--info';
    } else if (assessedInArea.length === areaRequirements.length) {
      const nonCompliant = assessedInArea.filter(reqId => appState.assessmentResults[reqId] === 'non-compliant');
      if (nonCompliant.length === 0) {
        statusElement.textContent = 'Fully Compliant';
        statusElement.className = 'assessment-area__status status--success';
      } else {
        statusElement.textContent = `${nonCompliant.length} Issues Found`;
        statusElement.className = 'assessment-area__status status--error';
      }
    } else {
      statusElement.textContent = 'Partially Assessed';
      statusElement.className = 'assessment-area__status status--warning';
    }
  });
}

// Results Section
function initializeResults() {
  initializeTabs();
  
  const backButton = document.getElementById('back-to-assessment');
  const generateButton = document.getElementById('generate-report');
  
  if (backButton) {
    backButton.addEventListener('click', function(e) {
      e.preventDefault();
      navigateToSection('assessment');
    });
  }
  
  if (generateButton) {
    generateButton.addEventListener('click', function(e) {
      e.preventDefault();
      generateReport();
      navigateToSection('report');
    });
  }
  
  console.log('Results section initialized');
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const tabName = this.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('tab-btn--active');
  });
  const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
  if (activeTab) {
    activeTab.classList.add('tab-btn--active');
  }
  
  // Update tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('tab-pane--active');
  });
  const activePane = document.getElementById(`${tabName}-tab`);
  if (activePane) {
    activePane.classList.add('tab-pane--active');
  }
}

function calculateResults() {
  console.log('Calculating results...');
  const nonCompliantRequirements = [];
  let totalCost = 0;
  let highPriorityCount = 0;
  
  // Find non-compliant requirements
  Object.values(facilityAreas).forEach(area => {
    area.requirements.forEach(req => {
      const status = appState.assessmentResults && appState.assessmentResults[req.id];
      if (status === 'non-compliant') {
        const adjustedCost = calculateAdjustedCost(req.cost);
        nonCompliantRequirements.push({
          ...req,
          area: area.name,
          adjustedCost
        });
        totalCost += adjustedCost;
        
        if (req.priority === 'high') {
          highPriorityCount++;
        }
      }
    });
  });
  
  // Calculate compliance score
  const totalRequirements = Object.values(facilityAreas).reduce((sum, area) => sum + area.requirements.length, 0);
  const assessedRequirements = Object.keys(appState.assessmentResults || {});
  const compliantRequirements = assessedRequirements.filter(reqId => appState.assessmentResults[reqId] === 'compliant').length;
  const complianceScore = assessedRequirements.length > 0 ? Math.round((compliantRequirements / assessedRequirements.length) * 100) : 0;
  
  // Update summary
  const totalCostElement = document.getElementById('total-cost');
  const highPriorityElement = document.getElementById('high-priority-items');
  const complianceElement = document.getElementById('compliance-score');
  
  if (totalCostElement) totalCostElement.textContent = `₹${totalCost.toLocaleString()}`;
  if (highPriorityElement) highPriorityElement.textContent = highPriorityCount;
  if (complianceElement) complianceElement.textContent = `${complianceScore}%`;
  
  // Store results
  appState.nonCompliantRequirements = nonCompliantRequirements;
  appState.totalCost = totalCost;
  appState.complianceScore = complianceScore;
  
  renderRequirementsList();
  renderCostChart();
  renderImplementationPlan();
  
  console.log('Results calculated successfully');
}

function calculateAdjustedCost(baseCost) {
  const locationMultiplier = costFactors[appState.areaType];
  const laborCost = baseCost * costFactors.laborMultiplier;
  const totalBeforeContingency = baseCost + laborCost;
  const contingencyCost = totalBeforeContingency * costFactors.contingency;
  
  return Math.round((totalBeforeContingency + contingencyCost) * locationMultiplier);
}

function renderRequirementsList() {
  const container = document.getElementById('requirements-list');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!appState.nonCompliantRequirements || appState.nonCompliantRequirements.length === 0) {
    container.innerHTML = `
      <div class="status status--success" style="padding: 20px; text-align: center;">
        <h3>Congratulations! Your facility is fully compliant with accessibility standards.</h3>
        <p>No retrofitting requirements identified based on your assessment.</p>
      </div>
    `;
    return;
  }
  
  const groupedByArea = {};
  appState.nonCompliantRequirements.forEach(req => {
    if (!groupedByArea[req.area]) {
      groupedByArea[req.area] = [];
    }
    groupedByArea[req.area].push(req);
  });
  
  Object.keys(groupedByArea).forEach(areaName => {
    const requirements = groupedByArea[areaName];
    const div = document.createElement('div');
    div.className = 'requirements-area';
    div.innerHTML = `
      <div class="requirements-area__header">${areaName}</div>
      <div class="requirements-area__items">
        ${requirements.map(req => `
          <div class="requirement-detail">
            <div>
              <div>${req.item}</div>
              <span class="requirement-priority requirement-priority--${req.priority}">${req.priority} Priority</span>
            </div>
            <div class="requirement-cost">₹${req.adjustedCost.toLocaleString()}</div>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(div);
  });
}

function renderCostChart() {
  const chartCanvas = document.getElementById('cost-chart');
  if (!chartCanvas || !appState.nonCompliantRequirements) return;
  
  const ctx = chartCanvas.getContext('2d');
  
  const areaGroups = {};
  appState.nonCompliantRequirements.forEach(req => {
    if (!areaGroups[req.area]) {
      areaGroups[req.area] = 0;
    }
    areaGroups[req.area] += req.adjustedCost;
  });
  
  // Clear any existing chart
  Chart.getChart(chartCanvas)?.destroy();
  
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(areaGroups),
      datasets: [{
        label: 'Estimated Cost (₹)',
        data: Object.values(areaGroups),
        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'],
        borderWidth: 1,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: 'Cost Breakdown by Facility Area'
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '₹' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function renderImplementationPlan() {
  const container = document.getElementById('implementation-phases');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Group requirements by priority for phased implementation
  const phaseMapping = {
    'high': 1,
    'medium': 2,
    'low': 3
  };
  
  const phases = [
    { requirements: [], cost: 0 },
    { requirements: [], cost: 0 },
    { requirements: [], cost: 0 }
  ];
  
  if (appState.nonCompliantRequirements) {
    appState.nonCompliantRequirements.forEach(req => {
      const phaseIndex = phaseMapping[req.priority] - 1;
      phases[phaseIndex].requirements.push(req);
      phases[phaseIndex].cost += req.adjustedCost;
    });
  }
  
  implementationPhases.forEach((phase, index) => {
    const phaseData = phases[index];
    if (phaseData.requirements.length > 0) {
      const div = document.createElement('div');
      div.className = 'phase-card';
      div.innerHTML = `
        <div class="phase-card__header">
          <div class="phase-card__title">Phase ${phase.phase}: ${phase.name}</div>
          <div class="phase-card__duration">${phase.duration}</div>
        </div>
        <div class="phase-card__description">${phase.description}</div>
        <div class="phase-card__cost">₹${phaseData.cost.toLocaleString()}</div>
        <div style="margin-top: 12px; font-size: 14px; color: var(--color-text-secondary);">
          ${phaseData.requirements.length} item(s) to implement
        </div>
      `;
      container.appendChild(div);
    }
  });
}

// Report Section
function initializeReport() {
  const printButton = document.getElementById('print-report');
  const exportButton = document.getElementById('export-pdf');
  const startOverButton = document.getElementById('start-over');
  
  if (printButton) {
    printButton.addEventListener('click', function(e) {
      e.preventDefault();
      window.print();
    });
  }
  
  if (exportButton) {
    exportButton.addEventListener('click', function(e) {
      e.preventDefault();
      alert('PDF export functionality would be implemented with a PDF library in production.');
    });
  }
  
  if (startOverButton) {
    startOverButton.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Are you sure you want to start a new assessment? All current data will be lost.')) {
        resetApplication();
      }
    });
  }
  
  console.log('Report section initialized');
}

function generateReport() {
  const container = document.getElementById('report-content');
  if (!container) return;
  
  const currentDate = new Date().toLocaleDateString('en-IN');
  
  container.innerHTML = `
    <div class="report-header">
      <h1>Healthcare Facility Accessibility Assessment Report</h1>
      <p><strong>Facility:</strong> ${appState.facilityName || 'Not specified'}</p>
      <p><strong>Location:</strong> ${appState.state || 'Not specified'}</p>
      <p><strong>Assessment Date:</strong> ${currentDate}</p>
      <p><strong>Catchment Population:</strong> ${appState.population.toLocaleString()}</p>
    </div>
    
    <div class="report-section">
      <h3>Executive Summary</h3>
      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-card__number">${appState.complianceScore}%</div>
          <div class="summary-card__label">Compliance Score</div>
        </div>
        <div class="summary-card">
          <div class="summary-card__number">₹${appState.totalCost.toLocaleString()}</div>
          <div class="summary-card__label">Total Investment Required</div>
        </div>
        <div class="summary-card">
          <div class="summary-card__number">${appState.disabilityStats.total || 0}</div>
          <div class="summary-card__label">People with Disabilities Served</div>
        </div>
      </div>
    </div>
    
    <div class="report-section">
      <h3>Disability Demographics in Catchment Area</h3>
      <p>Based on Census 2011 data (2.21% prevalence rate):</p>
      <ul>
        ${Object.keys(disabilityTypes).map(type => `
          <li><strong>${disabilityTypes[type].name}:</strong> ${(appState.disabilityStats.breakdown && appState.disabilityStats.breakdown[type] || 0).toLocaleString()} persons</li>
        `).join('')}
      </ul>
    </div>
    
    <div class="report-section">
      <h3>Assessment Results</h3>
      <p>Your facility requires ${(appState.nonCompliantRequirements || []).length} modifications to achieve full accessibility compliance.</p>
      
      ${(appState.nonCompliantRequirements || []).length > 0 ? `
        <h4>Priority Breakdown:</h4>
        <ul>
          <li><strong>High Priority:</strong> ${appState.nonCompliantRequirements.filter(r => r.priority === 'high').length} items</li>
          <li><strong>Medium Priority:</strong> ${appState.nonCompliantRequirements.filter(r => r.priority === 'medium').length} items</li>
          <li><strong>Low Priority:</strong> ${appState.nonCompliantRequirements.filter(r => r.priority === 'low').length} items</li>
        </ul>
      ` : '<p style="color: var(--color-success); font-weight: 600;">Congratulations! Your facility meets all assessed accessibility standards.</p>'}
    </div>
    
    <div class="report-section">
      <h3>Implementation Recommendations</h3>
      <p>We recommend implementing accessibility improvements in phases based on priority.</p>
    </div>
    
    <div class="report-section">
      <h3>Next Steps</h3>
      <ol>
        <li>Review and approve this assessment report</li>
        <li>Secure budget allocation for high-priority items</li>
        <li>Engage qualified contractors for accessibility modifications</li>
        <li>Begin implementation starting with critical access areas</li>
        <li>Conduct regular progress reviews and compliance monitoring</li>
      </ol>
    </div>
  `;
}

function resetApplication() {
  // Reset application state
  appState = {
    population: 0,
    areaType: 'rural',
    facilityName: '',
    state: '',
    disabilityStats: {},
    assessmentResults: {},
    requirementsCost: 0,
    currentSection: 'demographics',
    nonCompliantRequirements: [],
    totalCost: 0,
    complianceScore: 0
  };
  
  // Reset form fields
  const populationInput = document.getElementById('population');
  const facilityInput = document.getElementById('facility-name');
  const stateInput = document.getElementById('state');
  const areaSelect = document.getElementById('area-type');
  
  if (populationInput) populationInput.value = '';
  if (facilityInput) facilityInput.value = '';
  if (stateInput) stateInput.value = '';
  if (areaSelect) areaSelect.value = 'rural';
  
  // Reset displays
  const totalDisabledElement = document.getElementById('total-disabled');
  const breakdownElement = document.getElementById('disability-breakdown');
  
  if (totalDisabledElement) totalDisabledElement.textContent = '-';
  if (breakdownElement) breakdownElement.innerHTML = '';
  
  // Navigate back to demographics
  navigateToSection('demographics');
  
  console.log('Application reset successfully');
}

// Global functions for HTML onclick handlers
window.toggleArea = toggleArea;
window.setRequirementStatus = setRequirementStatus;