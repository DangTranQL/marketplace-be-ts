"use strict";
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
const csv_writer_1 = require("csv-writer");
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs = __importStar(require("fs"));
const csvFilePath = 'data/sample_data.csv';
const finalData = 'data/data.csv';
let data = [];
fs.createReadStream(csvFilePath)
    .pipe((0, csv_parser_1.default)())
    .on('data', (row) => {
    // Check if any property of the row is null
    if (Object.values(row).some(value => value === null || value === '')) {
        return; // Skip this row
    }
    data.push(row);
})
    .on('end', () => {
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
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
