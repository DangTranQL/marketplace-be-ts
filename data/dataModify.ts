import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import csv from 'csv-parser';
import * as fs from 'fs';

const csvFilePath = 'data/sample_data.csv';
const finalData = 'data/data.csv';
let data: { [key: string]: string | number }[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // Check if any property of the row is null
    if (Object.values(row).some(value => value === null || value === '')) {
      return; // Skip this row
    }

    data.push(row);
  })

  .on('end', () => {
    const csvWriter = createCsvWriter({
      path: finalData,
      header: Object.keys(data[0]).map((id) => ({ id, title: id })),
    });

    csvWriter
      .writeRecords(data)
      .then(() => console.log('The CSV file was updated successfully.'));
  });



// import * as fs from 'fs';
// import csv from 'csv-parser';
// import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
// import moment from 'moment';

// const csvFilePath = 'data/sample_data.csv';
// let data: { [key: string]: string | number }[] = [];

// // Read the CSV file
// fs.createReadStream(csvFilePath)
//   .pipe(csv())
//   .on('data', (row) => {
//     // Generate a random date between 1/1/2023 and 12/31/2023
//     const start = moment('2023-01-01');
//     const end = moment('2023-12-31');
//     const randomDate = start.add(Math.random() * (end.diff(start, 'days')), 'days').format('YYYY-MM-DD');

//     // Add the new column
//     row['createdAt'] = randomDate;

//     data.push(row);
//   })
//   .on('end', () => {
//     // Write the updated data back to the CSV file
//     const csvWriter = createCsvWriter({
//       path: csvFilePath,
//       header: Object.keys(data[0]).map((id) => ({ id, title: id })),
//     });

//     csvWriter
//       .writeRecords(data)
//       .then(() => console.log('The CSV file was updated successfully.'));
//   });