#!/usr/bin/env node
/**
 * Script to remove the hardcoded "direction" field from all tracks in tracks.json
 * This field is now provided dynamically from iRacing SDK instead of hardcoded per-track
 */

const fs = require('fs');
const path = require('path');

const tracksFilePath = path.join(__dirname, '../src/assets/normalized/tracks.json');

try {
  // Read the current tracks.json
  const tracksData = JSON.parse(fs.readFileSync(tracksFilePath, 'utf8'));

  // Process each track
  let removedCount = 0;
  Object.keys(tracksData).forEach((trackId) => {
    const track = tracksData[trackId];
    if (
      track['start-finish'] &&
      track['start-finish'].direction !== undefined
    ) {
      delete track['start-finish'].direction;
      removedCount++;
    }
  });

  // Write the updated JSON back
  fs.writeFileSync(
    tracksFilePath,
    JSON.stringify(tracksData, null, 2),
    'utf8',
  );

  console.log(`✓ Successfully removed 'direction' field from ${removedCount} tracks`);
  console.log('✓ Tracks will now use dynamic direction from iRacing SDK');
} catch (error) {
  console.error('Error updating tracks.json:', error.message);
  process.exit(1);
}
