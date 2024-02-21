import * as fs from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

// Define the path of your CSV file
const csvFilePath = 'data/sample_data.csv';

// Define the new columns
const newColumns = ['sold', 'totalRating', 'totalReview'];

// Read and parse the CSV file
let data: { [key: string]: string | number }[] = [];
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Add new columns to each row
    newColumns.forEach((col) => {
      row[col] = 0;
    });
    data.push(row);
  })
  .on('end', () => {
    // Define the CSV writer
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: Object.keys(data[0]).map((id) => ({ id, title: id })),
    });

    // Write the updated data back to the CSV file
    csvWriter
      .writeRecords(data)
      .then(() => console.log('The CSV file was updated successfully.'));
  });