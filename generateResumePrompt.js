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
function generateResumeTxt(resumePath, jobDescriptionPath, outputPath) {
  const resumeContent = readYAML(resumePath);
  const jobDescription = fs.readFileSync(jobDescriptionPath, 'utf8');
  const jobYaml = readYAML('job-cv.yml');


  const outputContent = `

You are an expert in technical recruiting, and you have been asked to help a candidate create a custom resume for a a job described in a jobdescription.txt file.The output will be a file called output-resume.yml.The candidate's draft resume is in a yml file called resume.yml. Here are the contents:



\`\`\`yaml
${resumeContent}
\`\`\`

Here is the jobdescription.txt that the candidate is applying for:

\`\`\`
${jobDescription}
\`\`\`

You read the jobdescription.txt carefully to create a job.yml file that you'll refer to. An example job.yml file might look like this:

\`\`\`yaml
${jobYaml}
\`\`\`

You then take the resume.yml and create a resume-output.yml that is specifically tailored to the job.yml. The resume-output.yml should customize the following sections:

- Summary: The summary should be 2-3 sentences that highlights the any of the candidate's skills or qualifications that match those in the job.yml. You know that the secret of a great summary is to be specific (for example years of experience) and to use keywords from the job description.
- Experience:
  - This section has a list of the candidate's work experience. You know that the work experience should be listed chronologically. You don't need to edit the company, location, or dates.
  - Title Optimization: Optimize titles to align with the job description while ensuring accuracy and clarity. Use the following guidelines:
    - Alignment with job_title: Change the title to the job_title if at least 50% of the highlights involve responsibilities central to that role (e.g., technical demos, client consultations, solution architecture for "Solutions Engineer"). Use discretion and ensure the change reflects the actual work performed.
    - Enhancing relevance: Titles may be enhanced for relevance by adding descriptors. For example, "Senior Engineer" with leadership duties could become "Team Lead, Senior Engineer" when applying to leadership positions.
    - Preservation of existing titles: If the original title is widely recognized (e.g., "Developer Advocate") and relevant to the job_title, it should remain unchanged unless a better match can be clearly justified.
    - Avoid misrepresentation: Any title changes must accurately reflect the candidate's responsibilities, as supported by evidence in the highlights.
  - Highlights
    - Turn highlights into custom resume bullet points that highlight skills and qualifications that the candidate has that are demonstrte the client has the skills and qualifications that the job.yml is looking for.
    - You also know that highlights should use numbers if possible, but you don't make them up.
    - You always use specific examples whenever possible, and focus on impact and contribtions.
    - If a particular experience's highlights don't demonstrate any skills or qualifications specific to the job.yml you can remove the highlights section entirely, but you don't remove the experience as you want to show the candidate's full work history.
    - Skills: Match any skills that the candidate has in their resume.yml with those listed in job.yml.
    - Certifications: You only include certifications from the candidate's resume.yml that are relevant to the job.yml
    - Writing: You only include these items if they are relevant to the job description in job.yml
    - Volunteering: You only include these items if they are relevant to the job description in job.yml

After you create the resume-output.yml you carefully compare it to the original resume.yml to make sure it accurately portrays the candidate and doesn't include any false information.

Please provide the final resume-output.yml file and the job.yml file as the output of this task.
`.trim();

  writeOutput(outputPath, outputContent);
}

// CLI arguments
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error('Usage: node generateResumeTxt.js <resume.yml> <output.txt>');
  process.exit(1);
}

const [resumePath, jobDescriptionPath, outputPath] = args;

// Run the script
generateResumeTxt(path.resolve(resumePath), path.resolve(jobDescriptionPath), path.resolve(outputPath));
