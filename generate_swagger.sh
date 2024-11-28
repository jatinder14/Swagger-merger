#!/bin/bash

# List of repositories
repos=("REALCUBE-BOOTSTARP-API") # Add more repo names here
# repos=("REALCUBE-BOOTSTARP-API" "REPO2" "REPO3") # Add more repo names here

# Iterate through repositories
for repo in "${repos[@]}"; do
  echo "Processing $repo..."

  # Navigate to repository
  cd "$repo" || { echo "Failed to access $repo"; exit 1; }

  # Run Swagger generation
  echo "Running Swagger generation in $repo..."
  php artisan l5-swagger:generate
  if [ $? -ne 0 ]; then
    echo "Swagger generation failed in $repo."
    exit 1
  fi

  # Return to the root directory
  cd - || exit
  echo "Completed $repo."
done

echo "Swagger generation completed for all repositories."

# Call the Node.js script to merge Swagger files
echo "Calling the Node.js script to merge Swagger files..."
npm i openapi-merge
node merge_swagger_docs.js
if [ $? -ne 0 ]; then
  echo "Swagger merge failed."
  exit 1
fi

echo "Swagger merge completed successfully."
