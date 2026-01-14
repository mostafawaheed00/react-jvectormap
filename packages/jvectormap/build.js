const fs = require('fs');
const path = require('path');

const files = [
    'jquery-jvectormap.js',
    'src/jvectormap.js',
    'src/abstract-element.js',
    'src/abstract-canvas-element.js',
    'src/abstract-shape-element.js',
    'src/svg-element.js',
    'src/svg-group-element.js',
    'src/svg-canvas-element.js',
    'src/svg-shape-element.js',
    'src/svg-path-element.js',
    'src/svg-circle-element.js',
    'src/svg-image-element.js',
    'src/svg-text-element.js',
    'src/vml-element.js',
    'src/vml-group-element.js',
    'src/vml-canvas-element.js',
    'src/vml-shape-element.js',
    'src/vml-path-element.js',
    'src/vml-circle-element.js',
    'src/vector-canvas.js',
    'src/simple-scale.js',
    'src/ordinal-scale.js',
    'src/numeric-scale.js',
    'src/color-scale.js',
    'src/legend.js',
    'src/data-series.js',
    'src/proj.js',
    'src/map-object.js',
    'src/region.js',
    'src/marker.js',
    'src/map.js',
    'src/multimap.js'
];

const outputFile = 'jquery.jvectormap.min.js';

try {
    if (fs.existsSync(outputFile)) {
        fs.unlinkSync(outputFile);
    }

    let content = '';
    for (const file of files) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            content += fs.readFileSync(filePath, 'utf8') + '\n';
        } else {
            console.warn(`Warning: File not found: ${file}`);
        }
    }

    fs.writeFileSync(outputFile, content);
    console.log(`Successfully created ${outputFile}`);
} catch (err) {
    console.error('Error building file:', err);
    process.exit(1);
}
