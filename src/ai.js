// FILE: ai.js
import OpenAI from 'openai';
import fs from 'fs-extra';
import yaml from 'yaml';
import { Command } from 'commander';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateSummary(prompt, inputFilePath, jobDescriptionPath, outputFilePath) {
  try {
    const inputFile = await fs.readFile(inputFilePath, 'utf8');
    const resume = yaml.parse(inputFile);

    const jobDescription = await fs.readFile(jobDescriptionPath, 'utf8');

    const response = await client.Completions.create({
      model: 'text-davinci-003',
      prompt: `${prompt}\n\nJob Description:\n${jobDescription}\n\nResume:\n${yaml.stringify(resume)}`,
      max_tokens: 150,
    });

    const summary = response.choices[0].text.trim();
    resume.cv.sections.summary = [summary];

    const outputFile = yaml.stringify(resume);
    await fs.writeFile(outputFilePath, outputFile, 'utf8');

    console.log('Summary added to output.yml');
  } catch (error) {
    console.error('Error generating summary:', error);
  }
}

async function anotherFunction() {
  // Implement another functionality here
  console.log('Another function executed.');
}

const program = new Command();

program
  .command('generate-summary <inputFilePath> <outputFilePath> <jobDescriptionPath>')
  .description('Generate a resume summary and add it to output.yml')
  .option('-p, --prompt <prompt>', 'Prompt for the resume summary')
  .action((inputFilePath, outputFilePath, jobDescriptionPath, cmdObj) => {
    const prompt = cmdObj.prompt || 'Generate a resume summary based on the job description and resume.';
    generateSummary(prompt, inputFilePath, jobDescriptionPath, outputFilePath);
  });

program
  .command('another-command')
  .description('Execute another function')
  .action(() => {
    anotherFunction();
  });

program.parse(process.argv);
