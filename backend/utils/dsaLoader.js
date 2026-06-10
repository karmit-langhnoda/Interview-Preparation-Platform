import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_MAP = {
  easy: path.join(__dirname, '..', 'data', 'easy', 'easy.csv'),
  medium: path.join(__dirname, '..', 'data', 'medium', 'medium.csv'),
  hard: path.join(__dirname, '..', 'data', 'hard', 'hard.csv')
};

export const loadProblemsFromCsv = (difficulty) => {
  const filePath = FILE_MAP[difficulty];

  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error(`CSV file not found for difficulty: ${difficulty}`);
  }

  const csvContent = fs.readFileSync(filePath, 'utf-8');

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  return records.map((row) => ({
    index: Number(row.index),
    title: row.title,
    url: row.url
  }));
};