// Using ES module syntax
import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a canvas for the icon
const size = 32;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Draw a background
ctx.fillStyle = '#4f46e5'; // Indigo color
ctx.beginPath();
ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
ctx.fill();

// Draw the "J" letter
ctx.fillStyle = 'white';
ctx.font = 'bold 20px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('J3', size/2, size/2);

// Convert canvas to PNG buffer
const buffer = canvas.toBuffer('image/png');

// Write to file
fs.writeFileSync(path.join(__dirname, 'public', 'favicon.png'), buffer);
console.log('Favicon created successfully!');
