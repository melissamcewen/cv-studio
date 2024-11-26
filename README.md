# cv-studio

Pipeline

- Scratchpad to store basics in markdown
- Convert to resume.yml and resume.json
- Use hackmyresume to analyze to make sure there are no gaps
- Generate prompt
- Use render.cv to generate

## Fill resume with items from jobs folder to output/output-filled-cv.yml
node resume-filler.js jobs CVs/resume-cv.yml
## Generate a prompt
node generateResumePrompt.js output/output-filled-cv.yml prompt-cv.yml prompts/company.txt
## Use ChatGPT prompt and save as prompts/company.yml
## Add any missing experience
node addExperience.js prompts/company.yml CVs/resume-cv.yml output/output-withexp-cv.yml
## Add Design, output to output/output-design
node concat-yml.js output/output-withexp-cv.yml designs/sb2nov.yml
# Create resume
rendercv render "output/output-design.yml" --output-folder-name "resumes/company"


npm run build-resume --company=company-name


Interview prep
- can you come up with 5 behavioral interview questions I should study before interviewing for this role:


# Pipeline v4

- can you tell me the ideal resume summary (2-3 sentences) that a recruiter is looking for when filling this job


