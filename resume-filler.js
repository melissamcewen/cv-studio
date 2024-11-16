const fs = require('fs-extra');
const path = require('path');
const yaml = require('yaml');

async function updateResumeWithHighlights(directory, yamlFile) {
  try {
    // Load and parse the YAML file
    const yamlContent = await fs.readFile(yamlFile, 'utf8');
    const data = yaml.parse(yamlContent);

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

    // Convert the updated data back to YAML
    const outputYaml = yaml.stringify(data);

    // Write the result to output-cv.yml
    await fs.writeFile('output/output-filled-cv.yml', outputYaml, 'utf8');
    console.log('Updated YAML saved to output-cv.yml');

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
