// FILE: mergeYml.js
const fs = require('fs-extra');
const yaml = require('yaml');

async function mergeYml(resumePath, bulletPointsPath, outputPath) {
  try {
    // Read and parse the resume.yml file
    const resumeFile = await fs.readFile(resumePath, 'utf8');
    const resume = yaml.parse(resumeFile);

    // Read and parse the bullet-points.yml file
    const bulletPointsFile = await fs.readFile(bulletPointsPath, 'utf8');
    const bulletPoints = yaml.parse(bulletPointsFile);

    // Create a map of bullet points by key
    const bulletPointsMap = bulletPoints.highlights.reduce((map, point) => {
      if (!map[point.key]) {
        map[point.key] = [];
      }
      map[point.key].push(
        `Accomplished ${point.accomplished} as measured by ${point['as-measured-by']} by ${point.by}`
      );
      return map;
    }, {});

    // Add bullet points to the corresponding experience highlights
    resume.cv.sections.experience.forEach((experience) => {
      if (bulletPointsMap[experience.key]) {
        experience.highlights = bulletPointsMap[experience.key];
      }
    });

    // Convert the updated resume object back to YAML
    const outputYaml = yaml.stringify(resume);

    // Write the output YAML to the specified output file
    await fs.writeFile(outputPath, outputYaml, 'utf8');

    console.log('Output written to', outputPath);
  } catch (error) {
    console.error('Error merging YAML files:', error);
  }
}

// CLI arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node mergeYml.js <resume.yml> <bullet-points.yml> <output.yml>');
  process.exit(1);
}

const [resumePath, bulletPointsPath, outputPath] = args;

// Run the script
mergeYml(resumePath, bulletPointsPath, outputPath);
