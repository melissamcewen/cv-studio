const fs = require('fs');
const path = require('path');

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

// Main function
function generateResumeTxt(resumePath, examplePath, outputPath) {
  const resumeContent = readYAML(resumePath);
  const exampleContent = readYAML(examplePath);

  const outputContent = `

Here is my input resume.yml

\`\`\`yaml
${resumeContent}
\`\`\`

Here is a a commented description of the yml file that explains the desired output for a custom resume.yml:
\`\`\`yaml
${exampleContent}
\`\`\`

Can you create a custom resume.yml for the following job description: 
`.trim();

  writeOutput(outputPath, outputContent);
}

// CLI arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node generateResumeTxt.js <resume.yml> <example.yml> <output.txt>');
  process.exit(1);
}

const [resumePath, examplePath, outputPath] = args;

// Run the script
generateResumeTxt(path.resolve(resumePath), path.resolve(examplePath), path.resolve(outputPath));
