const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

// Function to load a YAML file
function loadYAML(filePath) {
  return yaml.load(fs.readFileSync(filePath, 'utf8'));
}

// Function to save data back to a YAML file
function saveYAML(filePath, data) {
  const yamlData = yaml.dump(data, {
    noRefs: true,          // Disable references to avoid unnecessary data duplication
    indent: 2,             // Set indentation to 2 spaces for readability
    lineWidth: 80,         // Limit line width to prevent overly long lines
    quotingType: '"',      // Force double quotes around all strings
    forceQuotes: true,
    flowLevel: -1          // Disable flow style, ensuring block-style YAML formatting
  });
  fs.writeFileSync(filePath, yamlData, 'utf8');
}

// Function to clean position only for existing experiences that have multiple roles
function cleanPositionsForExistingExperience(experience) {
  return experience.map(exp => {
    if (exp.position && exp.position.includes(',')) {
      // Split the position by commas and take only the first item
      exp.position = exp.position.split(',')[0].trim();
    }
    return exp; // Leave position as is if no comma is found
  });
}

// Function to add missing experiences based only on start_date
function addMissingExperiences(input, comparison) {
  const inputExperience = input.cv.sections.experience || [];
  const comparisonExperience = comparison.cv.sections.experience || [];

  comparisonExperience.forEach(compExperience => {
    // Check if the experience with the same start_date already exists in input
    const exists = inputExperience.some(inputExp =>
      inputExp.start_date === compExperience.start_date
    );

    if (!exists) {
      // If the experience is missing, add it to the input list
      inputExperience.push({
        company: compExperience.company || '',
        position: compExperience.position || '',
        location: compExperience.location || '',
        start_date: compExperience.start_date,
        end_date: compExperience.end_date || 'present', // Default to 'present' if not specified
      });
      console.log(`Added new experience: ${compExperience.company || 'Unknown Company'} - ${compExperience.position || 'Unknown Position'}`);
    }
  });

  // Sort experiences by start_date in descending order (newest first)
  inputExperience.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);
    return dateB - dateA; // Descending order
  });

  return inputExperience;
}

// Main function to process the YAML files
function processYAML(inputFile, comparisonFile, outputFile) {
  // Load the input and comparison YAML files
  const input = loadYAML(inputFile);
  const comparison = loadYAML(comparisonFile);

  // Clean positions in the input experience
  input.cv.sections.experience = cleanPositionsForExistingExperience(input.cv.sections.experience || []);

  // Add missing experiences from comparison to input and sort by start_date (newest first)
  input.cv.sections.experience = addMissingExperiences(input, comparison);

  // Save the updated input to a new YAML file
  saveYAML(outputFile, input);
  console.log(`Updated YAML saved to ${outputFile}`);
}

// Get command line arguments
const args = process.argv.slice(2);

// Ensure that there are enough arguments
if (args.length < 3) {
  console.error('Usage: node addExperience.js <input.yml> <comparison.yml> <output.yml>');
  process.exit(1);
}

// Extract file paths from command line arguments
const inputFile = path.resolve(args[0]);
const comparisonFile = path.resolve(args[1]);
const outputFile = path.resolve(args[2]);

// Process the YAML files
processYAML(inputFile, comparisonFile, outputFile);
