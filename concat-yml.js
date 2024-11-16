const fs = require('fs');

// Function to load the contents of a file
function loadFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return fileContent;
  } catch (e) {
    console.error(`Error reading file ${filePath}:`, e);
    return null;
  }
}

// Function to save concatenated content to a file
function saveFile(data, outputPath) {
  try {
    fs.writeFileSync(outputPath, data, 'utf8');
    console.log(`Concatenated content saved to ${outputPath}`);
  } catch (e) {
    console.error('Error saving file:', e);
  }
}

// Get command line arguments (excluding the first two default arguments)
const args = process.argv.slice(2);

// Check if two arguments are provided
if (args.length !== 2) {
  console.error('Please provide exactly two files as arguments.');
  process.exit(1);
}

// Paths to the files from command line arguments
const file1Path = args[0];
const file2Path = args[1];
const outputPath = 'output/output-design.yml';  // Output file name

// Load the contents of the files
const file1Content = loadFile(file1Path);
const file2Content = loadFile(file2Path);

if (file1Content !== null && file2Content !== null) {
  // Concatenate the contents of the two files
  const concatenatedContent = file1Content + '\n' + file2Content;
  saveFile(concatenatedContent, outputPath);
}
