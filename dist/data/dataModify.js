"use strict";
// import * as fs from 'fs';
// import csv from 'csv-parser';
// import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const csv_writer_1 = require("csv-writer");
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs = __importStar(require("fs"));
const csvFilePath = 'data/sample_data.csv';
let data = [];
fs.createReadStream(csvFilePath)
    .pipe((0, csv_parser_1.default)())
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
    }
    else {
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
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: csvFilePath,
        header: Object.keys(data[0]).map((id) => ({ id, title: id })),
    });
    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was updated successfully.'));
});
