const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml'); // Use js-yaml instead of yaml

async function updateResumeWithHighlights(directory, yamlFile) {
  try {
    // Load and parse the YAML file
    const yamlContent = await fs.readFile(yamlFile, 'utf8');
    const data = yaml.load(yamlContent); // Use js-yaml's load method

    // Check if "experience" section exists
    if (!data.cv || !data.cv.sections || !data.cv.sections.experience) {
      throw new Error('YAML file does not contain a valid experience section');
    }

    // Process each experience entry
    for (const experience of data.cv.sections.experience) {
      const { key } = experience;

      // Skip if no key is defined for this entry
      if (!key) continue;

      const mdFilePath = path.join(directory, `${key}.md`);

      // Check if the .md file exists
      if (await fs.pathExists(mdFilePath)) {
        const mdContent = await fs.readFile(mdFilePath, 'utf8');

        // Extract bullet points (lines that start with "- ")
        const bulletPoints = mdContent
          .split('\n')
          .filter(line => line.trim().startsWith('- '))
          .map(line => line.trim().substring(2)); // Remove "- " from each bullet point

        // Assign bullet points to the "highlights" field in the YAML data
        experience.highlights = bulletPoints;
      } else {
        console.warn(`Warning: ${mdFilePath} does not exist.`);
      }
    }

    // Convert the updated data back to YAML with the specified options
    const outputYaml = yaml.dump(data, {
      noRefs: true,         // Disable references to avoid unnecessary data duplication
      indent: 2,            // Set indentation to 2 spaces for readability
      lineWidth: 80,        // Limit line width to prevent overly long lines
      quotingType: '"',     // Force double quotes around all strings
      forceQuotes: true,    // Force quotes on all values
      flowLevel: -1         // Ensure block-style YAML formatting
    });

    // Write the result to output-filled-cv
    await fs.writeFile('output/output-filled-cv.yml', outputYaml, 'utf8');
    console.log('Updated YAML saved output-filled-cv.yml');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Capture arguments and run the script
const [directory, yamlFile] = process.argv.slice(2);
if (!directory || !yamlFile) {
  console.error('Usage: node script.js <directory> <yamlFile>');
  process.exit(1);
}

updateResumeWithHighlights(directory, yamlFile);
