const fs = require('fs');

// Curated list of high-quality Unsplash coffee shop images
const imageIds = [
  '1497935586351-b67a49e012bf', 
  '1501339847302-ac426a4a7cbb',
  '1495474472287-4d71bcdd2085', 
  '1485871981521-5b1fd3805eee',
  '1531218150217-54595bc2b934', 
  '1477959858617-67f85cf4f1df',
  '1534430480872-3498386e7856', 
  '1502175353174-a7a70e73b362',
  '1619468129361-605ebea04b44', 
  '1442512595302-873337c6ba02'
];

try {
  let content = fs.readFileSync('authentic_coffee_shops.csv', 'utf8');
  const lines = content.split(/\r?\n/);
  
  const updatedLines = lines.map((line, index) => {
    // Skip header or empty lines
    if (index === 0 || !line.trim()) return line;
    
    // If the line currently has an empty image_url (ends with a comma)
    if (line.endsWith(',')) {
      const id = imageIds[index % imageIds.length];
      const imageUrl = `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80`;
      return line + imageUrl;
    }
    
    return line;
  });

  fs.writeFileSync('authentic_coffee_shops.csv', updatedLines.join('\n'));
  console.log('Successfully updated authentic_coffee_shops.csv with image URLs!');
} catch (error) {
  console.error('Error updating CSV:', error);
}
