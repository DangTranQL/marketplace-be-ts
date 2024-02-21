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
const fs = __importStar(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const csv_writer_1 = require("csv-writer");
// Define the path of your CSV file
const csvFilePath = 'data/sample_data.csv';
// Define the new columns
const newColumns = ['sold', 'totalRating', 'totalReview'];
// Read and parse the CSV file
let data = [];
fs.createReadStream(csvFilePath)
    .pipe((0, csv_parser_1.default)())
    .on('data', (row) => {
    // Add new columns to each row
    newColumns.forEach((col) => {
        row[col] = 0;
    });
    data.push(row);
})
    .on('end', () => {
    // Define the CSV writer
    const csvWriter = (0, csv_writer_1.createObjectCsvWriter)({
        path: csvFilePath,
        header: Object.keys(data[0]).map((id) => ({ id, title: id })),
    });
    // Write the updated data back to the CSV file
    csvWriter
        .writeRecords(data)
        .then(() => console.log('The CSV file was updated successfully.'));
});
