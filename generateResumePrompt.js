const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Function to read YAML files
function readYAML(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err.message);
    process.exit(1);
  }
}

// Function to write the output file
function writeOutput(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File written successfully to ${filePath}`);
  } catch (err) {
    console.error(`Error writing file ${filePath}:`, err.message);
    process.exit(1);
  }
}

// Function to load and compile the Handlebars template
function loadTemplate(templatePath) {
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(templateContent);
  } catch (err) {
    console.error(`Error reading template file ${templatePath}:`, err.message);
    process.exit(1);
  }
}

// Main function
function generateResumeTxt(resumePath, jobDescriptionPath, templatePath, outputPath) {
  const resumeContent = readYAML(resumePath);
  const jobDescription = fs.readFileSync(jobDescriptionPath, 'utf8');
  const jobYaml = readYAML('job-cv.yml');

  const template = loadTemplate(templatePath);

  const data = {
    resumeContent,
    jobDescription,
    jobYaml
  };

  const outputContent = template(data);

  writeOutput(outputPath, outputContent);
}

// CLI arguments
const args = process.argv.slice(2);
if (args.length < 4) {
  console.error('Usage: node generateResumeTxt.js <resume.yml> <jobdescription.txt> <template.hbs> <output.txt>');
  process.exit(1);
}

const [resumePath, jobDescriptionPath, templatePath, outputPath] = args;

// Run the script
generateResumeTxt(
  path.resolve(resumePath),
  path.resolve(jobDescriptionPath),
  path.resolve(templatePath),
  path.resolve(outputPath)
);
