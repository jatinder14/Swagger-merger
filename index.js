const express = require('express');
const bodyParser = require('body-parser');
const { merge, isErrorResult } = require('openapi-merge');

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '10mb' })); // Increase the limit as needed

// Endpoint to merge OpenAPI documents
app.post('/merge-openapi', (req, res) => {
  const { docs } = req.body;

  if (!Array.isArray(docs) || docs.length === 0) {
    return res.status(400).json({ error: 'Invalid input. Provide an array of OpenAPI documents.' });
  }

  const mergeInputs = docs.map((doc, index) => ({
    oas: doc,
  }));

  const mergeResult = merge(mergeInputs);

  if (isErrorResult(mergeResult)) {
    return res.status(500).json({
      error: `${mergeResult.message} (${mergeResult.type})`,
    });
  }

  res.status(200).json({
    message: 'Merge successful!',
    mergedDocument: mergeResult.output,
  });
});

// Sample OpenAPI documents for testing
const oas1 = {
  openapi: "3.0.2",
  info: {
    title: "First Input",
    version: "1.0"
  },
  paths: {
    "/cats": {
      get: {
        summary: 'Get the cats',
        responses: {
          200: {
            description: "All of the cats"
          }
        }
      }
    }
  }
};

const oas2 = {
  openapi: "3.0.2",
  info: {
    title: "Second Input",
    version: "1.0"
  },
  paths: {
    "/dogs": {
      get: {
        summary: 'Get the dogs',
        responses: {
          200: {
            description: "All of the dogs"
          }
        }
      }
    }
  }
};

// Test the server
app.get('/test-merge', (req, res) => {
  const docs = [
    { oas: oas1, pathModification: { prepend: '/one' } },
    { oas: oas2, pathModification: { prepend: '/two' } }
  ];

  const mergeResult = merge(docs);

  if (isErrorResult(mergeResult)) {
    return res.status(500).json({
      error: `${mergeResult.message} (${mergeResult.type})`,
    });
  }

  res.status(200).json({
    message: 'Merge successful!',
    mergedDocument: mergeResult.output,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
