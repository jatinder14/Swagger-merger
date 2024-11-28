const fs = require('fs');
const path = require('path');
const { merge, isErrorResult } = require('openapi-merge');

// Path to Swagger documents
const swaggerDocs = [
  path.join(__dirname, 'REALCUBE-BOOTSTARP-API/storage/api-docs/api-docs.json'),
  path.join(__dirname, 'swagger-two.json'),
  // path.join(__dirname, 'REPO3/storage/api-docs/swagger.json'),
]; // Add paths for all Swagger files

// Read and parse each Swagger document
const docs = swaggerDocs.map((docPath) => {
  if (!fs.existsSync(docPath)) {
    throw new Error(`File not found: ${docPath}`);
  }
  return JSON.parse(fs.readFileSync(docPath, 'utf-8'));
});

// Merge Swagger documents
const mergeInputs = docs.map((doc, index) => ({
  oas: doc,
}));

console.log(`Merge successful! Merged Swagger saved at`);
const mergeResult = merge(mergeInputs);
console.log(`Merge successful! Merged Swagger saved at ${JSON.stringify(mergeResult)}`);

if (isErrorResult(mergeResult)) {
  console.error(`Merge error: ${mergeResult.message} (${mergeResult.type})`);
  process.exit(1);
}

// // Save the merged document
const outputPath = path.join(__dirname, 'merged-swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(mergeResult.output, null, 2));
console.log(`Merge successful! Merged Swagger saved at ${outputPath}`);
