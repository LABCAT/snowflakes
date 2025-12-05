export const sketchMetadata = {
  'number-2': {
    title: '#SnowflakesNo2',
    description: 'An exploration into generative animations inspired by snowflakes.',
    sketch: 'SnowflakesNo2.js',
  },
};

export function getAllSketches() {
  return Object.keys(sketchMetadata).map(id => ({
    id,
    ...sketchMetadata[id]
  }));
}
  
export function getSketchById(id) {
  return sketchMetadata[id] || null;
}
