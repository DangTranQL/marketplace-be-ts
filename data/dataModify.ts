// import * as fs from 'fs';
// import csv from 'csv-parser';
// import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';

// // Define the path of your CSV file
// const csvFilePath = 'data/sample_data.csv';

// // Define the new columns
// const newColumns = ['sold', 'totalRating', 'totalReview'];

// // Read and parse the CSV file
// let data: { [key: string]: string | number }[] = [];
// fs.createReadStream(csvFilePath)
//   .pipe(csv())
//   .on('data', (row) => {
//     // Add new columns to each row
//     newColumns.forEach((col) => {
//       row[col] = false;
//     });
//     data.push(row);
//   })
//   .on('end', () => {
//     // Define the CSV writer
//     const csvWriter = createCsvWriter({
//       path: csvFilePath,
//       header: Object.keys(data[0]).map((id) => ({ id, title: id })),
//     });

//     // Write the updated data back to the CSV file
//     csvWriter
//       .writeRecords(data)
//       .then(() => console.log('The CSV file was updated successfully.'));
//   });

import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import csv from 'csv-parser';
import * as fs from 'fs';

const csvFilePath = 'data/sample_data.csv';
let data: { [key: string]: string | number }[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Check if any property of the row is null
    if (Object.values(row).some(value => value === null)) {
      return; // Skip this row
    }

    // If 'category' is null, assign a random value from the given array
    if (!row['category']) {
      const categories = ['electronics', 'medicine', 'clothing', 'food', 'others'];
      row['category'] = categories[Math.floor(Math.random() * categories.length)];
    }

    // If 'stocks' is null, assign a random integer from 0 to 100
    if (!row['stocks']) {
      row['stocks'] = Math.floor(Math.random() * 101);
    } else {
      // Convert negative 'stocks' values to positive
      row['stocks'] = Math.abs(row['stocks']);
    }

    // If 'price' is null, assign a random float from 0.99 to 20
    if (!row['price']) {
      row['price'] = (Math.random() * (20 - 0.99) + 0.99).toFixed(2);
    }

    // If 'sold', 'totalRating', 'totalReview' are null, assign default values
    if (!row['sold']) {
      row['sold'] = Math.floor(Math.random() * 50);
    }

    if (!row['totalRating']) {
      row['totalRating'] = Math.floor(Math.random() * 5);
    }

    if (!row['totalReview']) {
      row['totalReview'] = Math.floor(Math.random() * 300);
    }

    data.push(row);
  })

  .on('end', () => {
    const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: Object.keys(data[0]).map((id) => ({ id, title: id })),
    });

    csvWriter
      .writeRecords(data)
      .then(() => console.log('The CSV file was updated successfully.'));
  });
