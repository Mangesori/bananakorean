import { PARTICLES } from './src/lib/korean/particles';

const testSplit = (content: string) => {
  console.log(`Testing content: "${content}"`);
  
  const matchedParticle = PARTICLES.find(
    (p) =>
      content.endsWith(p) &&
      content.length > p.length
  );

  if (matchedParticle) {
    console.log(`Found match: "${matchedParticle}"`);
    console.log(`Stem: "${content.slice(0, content.length - matchedParticle.length)}"`);
  } else {
    console.log('No match found.');
  }
};

testSplit('숙제를');
