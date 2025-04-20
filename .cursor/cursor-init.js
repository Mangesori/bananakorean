// This script runs when Cursor starts
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get the script path
const scriptPath = path.join(__dirname, 'start-browser-tools.bat');

// Check if the script exists
if (fs.existsSync(scriptPath)) {
  console.log('Starting browser tools...');

  // Run the batch script
  const child = spawn('cmd.exe', ['/c', scriptPath], {
    detached: true,
    stdio: 'ignore',
  });

  // Unref the child to allow the process to run independently
  child.unref();

  console.log('Browser tools started in background.');
} else {
  console.error('Browser tools script not found:', scriptPath);
}
