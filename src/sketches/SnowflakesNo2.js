import p5 from "p5";
import '@/lib/p5.audioReact.js';
import initCapture from '@/lib/p5.capture.js';
import SnowSphere from './classes/SnowSphere.js';
import Snowflake from './classes/Snowflake.js';

const base = import.meta.env.BASE_URL || './';
const audio = base + 'audio/SnowflakesNo2.mp3';
const midi = base + 'audio/SnowflakesNo2.mid';

const sketch = (p) => {
  /** 
   * Core audio properties
   */
  p.song = null;
  p.audioSampleRate = 0;
  p.totalAnimationFrames = 0;
  p.PPQ = 3840 * 4;
  p.bpm = 96;
  p.audioLoaded = false;
  p.songHasFinished = false;
  p.snowSphere = null;
  p.snowflakes = []
  
  p.preload = () => {
    p.loadSong(audio, midi, (result) => {
      const track1 = result.tracks[9].notes; // Synth 2 - GlockenSpiel
      const track2 = result.tracks[4].notes; // Rick FUll Strings
      p.scheduleCueSet(track1, 'executeTrack1');
      p.scheduleCueSet(track2, 'executeTrack2');
      p.hideLoader();
    });
  };

  p.setup = () => {
    p.pixelDensity(1);
    p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    p.smooth();
    p.frameRate(60);
    p.canvas.style.position = 'relative';
    p.canvas.style.zIndex = '1';
    initCapture(p, { prefix: 'SnowflakesNo2', enabled: false, captureCSSBackground: false });
    
    p.cam = p.createCamera();
    p.cam.setPosition(0, 0, p.height / 2);
    
    p.snowSphere = new SnowSphere(p, 1000);
    p.rotationFunction = p.random(['rotateX', 'rotateY', 'rotateZ']);
    p.rotationAmount = p.random([-0.005, 0.005]);
    
    // Set aurora background
    const auroraGradient = p.generateAuroraBackground();
    document.documentElement.style.setProperty('--gradient-bg', auroraGradient);
    document.documentElement.style.setProperty('--gradient-blend-mode', 'screen, normal, screen, screen, screen, screen');
  };

  p.draw = () => {
    p.clear();
    p[p.rotationFunction](p.frameCount * p.rotationAmount);
    
    if (p.mouseIsPressed && p.mouseButton === p.CENTER) {
      const zoomSpeed = 2;
      const deltaY = p.mouseY - p.pmouseY;
      p.cam.setPosition(0, 0, p.cam.eyeZ + deltaY * zoomSpeed);
    }
    
    p.snowSphere.show();

    for (let i = p.snowflakes.length - 1; i >= 0; i--) {
        p.snowflakes[i].update();
        p.snowflakes[i].draw();
    }
  };
  
  p.mouseWheel = (event) => {
    const zoomSpeed = 0.5;
    const newZ = p.cam.eyeZ + event.delta * zoomSpeed;
    p.cam.setPosition(0, 0, newZ);
    return false;
  };

  p.executeTrack1 = (note) => {
    const notesPerBarForLoop = [8, 6, 8, 8, 8, 8, 7, 5];
    const { currentCue, durationTicks } = note;
    const duration = (durationTicks / p.PPQ) * (60 / p.bpm);
    const x = p.random(-p.width / 2, p.width / 2);
    const y = p.random(-p.height / 2, p.height / 2);
    const z = -p.height;
    
    const loopLength = notesPerBarForLoop.reduce((a, b) => a + b, 0);
    const positionInLoop = ((currentCue - 1) % loopLength) + 1;
    let cumulative = 0;
    
    if (notesPerBarForLoop.some(notes => (cumulative += notes) === positionInLoop)) {
      p.snowflakes = [];
    }

    p.snowflakes.push(new Snowflake(p, x, y, z, duration));
  };

  p.executeTrack2 = (note) => {
    const { durationTicks } = note;
    const duration = (durationTicks / p.PPQ) * (60 / p.bpm);
    
    p.snowSphere = new SnowSphere(p, duration * 1000, true);
    p.rotationFunction = p.random(['rotateX', 'rotateY', 'rotateZ']);
    p.rotationAmount = p.random([-0.005, 0.005]);
    
    const auroraGradient = p.generateAuroraBackground();
    document.documentElement.style.setProperty('--gradient-bg', auroraGradient);
  };

  p.generateAuroraBackground = () => {
    const rgba = (r, g, b, a) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    const gradients = [];

    // Night sky base - gradient from deep space to horizon glow (very dark)
    gradients.push(
      `linear-gradient(180deg, ` +
      `rgba(0, 0, 0, 1) 0%, ` +
      `rgba(${p.random(5, 12)}, ${p.random(3, 10)}, ${p.random(22, 35)}, 1) ${p.random(8, 15)}%, ` +
      `rgba(${p.random(12, 22)}, ${p.random(15, 28)}, ${p.random(55, 75)}, 1) ${p.random(25, 35)}%, ` +
      `rgba(${p.random(18, 28)}, ${p.random(25, 38)}, ${p.random(75, 95)}, 1) ${p.random(40, 50)}%, ` +
      `rgba(${p.random(15, 25)}, ${p.random(32, 48)}, ${p.random(85, 105)}, 1) ${p.random(50, 60)}%, ` +
      `rgba(${p.random(10, 20)}, ${p.random(48, 68)}, ${p.random(95, 115)}, 1) ${p.random(65, 75)}%, ` +
      `rgba(${p.random(3, 10)}, ${p.random(70, 100)}, ${p.random(105, 130)}, 1) ${p.random(85, 92)}%, ` +
      `rgba(0, ${p.random(95, 125)}, ${p.random(115, 145)}, 1) 100%)`
    );

    // Aurora color palette - multiple colors for variety
    const auroraColors = [
      { 
        name: 'green', 
        primary: { r: 0, g: 255, b: 100 }, 
        secondary: { r: 50, g: 200, b: 150 },
        bright: { r: 150, g: 255, b: 200 }
      },
      { 
        name: 'blue-green', 
        primary: { r: 0, g: 255, b: 180 }, 
        secondary: { r: 0, g: 180, b: 255 },
        bright: { r: 100, g: 255, b: 255 }
      },
      { 
        name: 'purple-pink', 
        primary: { r: 180, g: 0, b: 255 }, 
        secondary: { r: 255, g: 0, b: 150 },
        bright: { r: 255, g: 100, b: 255 }
      },
      { 
        name: 'teal-purple', 
        primary: { r: 0, g: 255, b: 200 }, 
        secondary: { r: 150, g: 50, b: 255 },
        bright: { r: 200, g: 150, b: 255 }
      }
    ];
    
    // Pick 2-3 different color types for variety
    p.shuffle(auroraColors);
    const aurora1 = auroraColors[0];
    const aurora2 = auroraColors[1];
    const aurora3 = auroraColors[2];

    // Main concentrated aurora band - thin, bright, wavy with soft glow
    const mainAngle = 75 + p.random(30); // More variation in angle
    const mainPos = 25 + p.random(30); // Position in sky
    const mainWidth = 8 + p.random(8); // Narrow band
    const glowExtend = 12 + p.random(10); // Extended soft glow
    gradients.push(
      `linear-gradient(${mainAngle}deg, ` +
      `rgba(0,0,0,0) 0%, ` +
      `rgba(0,0,0,0) ${mainPos - glowExtend}%, ` +
      `${rgba(aurora1.primary.r, aurora1.primary.g, aurora1.primary.b, 0.06)} ${mainPos - glowExtend/2}%, ` +
      `${rgba(aurora1.primary.r, aurora1.primary.g, aurora1.primary.b, 0.25)} ${mainPos}%, ` +
      `${rgba(aurora1.bright.r, aurora1.bright.g, aurora1.bright.b, 0.5)} ${mainPos + mainWidth/2}%, ` +
      `${rgba(aurora1.primary.r, aurora1.primary.g, aurora1.primary.b, 0.25)} ${mainPos + mainWidth}%, ` +
      `${rgba(aurora1.primary.r, aurora1.primary.g, aurora1.primary.b, 0.06)} ${mainPos + mainWidth + glowExtend/2}%, ` +
      `rgba(0,0,0,0) ${mainPos + mainWidth + glowExtend}%, ` +
      `rgba(0,0,0,0) 100%)`
    );

    // Secondary band - different angle with soft glow (different color)
    const secAngle = 80 + p.random(25);
    const secPos = 40 + p.random(25);
    const secWidth = 6 + p.random(6);
    const secGlowExtend = 10 + p.random(8);
    gradients.push(
      `linear-gradient(${secAngle}deg, ` +
      `rgba(0,0,0,0) 0%, ` +
      `rgba(0,0,0,0) ${secPos - secGlowExtend}%, ` +
      `${rgba(aurora2.secondary.r, aurora2.secondary.g, aurora2.secondary.b, 0.05)} ${secPos - secGlowExtend/2}%, ` +
      `${rgba(aurora2.secondary.r, aurora2.secondary.g, aurora2.secondary.b, 0.2)} ${secPos}%, ` +
      `${rgba(aurora2.secondary.r, aurora2.secondary.g, aurora2.secondary.b, 0.4)} ${secPos + secWidth/2}%, ` +
      `${rgba(aurora2.secondary.r, aurora2.secondary.g, aurora2.secondary.b, 0.2)} ${secPos + secWidth}%, ` +
      `${rgba(aurora2.secondary.r, aurora2.secondary.g, aurora2.secondary.b, 0.05)} ${secPos + secWidth + secGlowExtend/2}%, ` +
      `rgba(0,0,0,0) ${secPos + secWidth + secGlowExtend}%, ` +
      `rgba(0,0,0,0) 100%)`
    );

    // Third band - ensure more coverage (third color)
    const thirdAngle = 70 + p.random(40);
    const thirdPos = 15 + p.random(20);
    const thirdWidth = 5 + p.random(5);
    const thirdGlowExtend = 9 + p.random(7);
    gradients.push(
      `linear-gradient(${thirdAngle}deg, ` +
      `rgba(0,0,0,0) 0%, ` +
      `rgba(0,0,0,0) ${thirdPos - thirdGlowExtend}%, ` +
      `${rgba(aurora3.primary.r, aurora3.primary.g, aurora3.primary.b, 0.04)} ${thirdPos - thirdGlowExtend/2}%, ` +
      `${rgba(aurora3.primary.r, aurora3.primary.g, aurora3.primary.b, 0.18)} ${thirdPos}%, ` +
      `${rgba(aurora3.bright.r, aurora3.bright.g, aurora3.bright.b, 0.35)} ${thirdPos + thirdWidth/2}%, ` +
      `${rgba(aurora3.primary.r, aurora3.primary.g, aurora3.primary.b, 0.18)} ${thirdPos + thirdWidth}%, ` +
      `${rgba(aurora3.primary.r, aurora3.primary.g, aurora3.primary.b, 0.04)} ${thirdPos + thirdWidth + thirdGlowExtend/2}%, ` +
      `rgba(0,0,0,0) ${thirdPos + thirdWidth + thirdGlowExtend}%, ` +
      `rgba(0,0,0,0) 100%)`
    );

    // Vertical curtain rays - tall and narrow, spread across screen (mixed colors)
    const numCurtains = 4 + Math.floor(p.random(5));
    for (let i = 0; i < numCurtains; i++) {
      // Distribute curtains more evenly across the screen
      const curtainX = (i / numCurtains) * 100 + p.random(-15, 15);
      const curtainWidth = 8 + p.random(15); // Narrow vertical rays
      const curtainHeight = 150 + p.random(200); // Very tall
      const curtainY = 20 + p.random(30); // Start position
      
      // Cycle through different aurora colors for variety
      const auroraChoice = [aurora1, aurora2, aurora3][i % 3];
      const useColor = i % 2 === 0 ? auroraChoice.primary : auroraChoice.secondary;
      const intensity = 0.15 + p.random(0.25);
      
      gradients.push(
        `radial-gradient(${curtainWidth}% ${curtainHeight}% at ${curtainX}% ${curtainY}%, ` +
        `${rgba(useColor.r, useColor.g, useColor.b, intensity)} 0%, ` +
        `${rgba(useColor.r, useColor.g, useColor.b, intensity * 0.5)} 20%, ` +
        `rgba(0,0,0,0) 50%)`
      );
    }

    // Diffuse glow behind main bands (blend of colors)
    const glowX = 30 + p.random(40);
    const glowY = 30 + p.random(20);
    gradients.push(
      `radial-gradient(80% 120% at ${glowX}% ${glowY}%, ` +
      `${rgba(aurora1.primary.r, aurora1.primary.g, aurora1.primary.b, 0.15)} 0%, ` +
      `${rgba(aurora2.secondary.r, aurora2.secondary.g, aurora2.secondary.b, 0.08)} 40%, ` +
      `rgba(0,0,0,0) 70%)`
    );

    return gradients.join(', ');
  };

  p.resetAnimation = () => {
  };


  p.mousePressed = () => {
    p.togglePlayback();
  };

  p.keyPressed = () => {
    return p.saveSketchImage();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};


new p5(sketch);
