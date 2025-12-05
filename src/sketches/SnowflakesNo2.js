import p5 from "p5";
import '@/lib/p5.audioReact.js';
import initCapture from '@/lib/p5.capture.js';
import SnowStorm from './classes/SnowStorm.js';


const sketch = (p) => {
  /** 
   * Core audio properties
   */
  p.song = null;
  p.audioSampleRate = 0;
  p.totalAnimationFrames = 0;
  p.PPQ = 3840 * 4;
  p.bpm = 88;
  p.audioLoaded = false;
  p.songHasFinished = false;
  p.snowStorm = null;
  p.cam = null;

  p.preload = () => {
    // p.loadSong(audio, midi, (result) => {
    // });
  };

  p.setup = () => {
    p.pixelDensity(1);
    p.createCanvas(window.innerWidth, window.innerHeight, p.WEBGL);
    p.smooth();
    p.frameRate(60);
    p.canvas.style.position = 'relative';
    p.canvas.style.zIndex = '1';
    initCapture(p, { prefix: 'SnowflakesNo2', enabled: false, captureCSSBackground: false });
    p.hideLoader();
    
    p.cam = p.createCamera();
    p.cam.setPosition(0, 0, p.height / 2);
    
    p.snowStorm = new SnowStorm(p);
  };

  p.draw = () => {
    p.clear();
    
    // Rotate the view
    p.rotateY(p.frameCount * -0.005);
    p.orbitControl();
    
    // p.snowStorm.update();
    p.snowStorm.show();
  };

  p.resetAnimation = () => {
  };

  p.executeTrack1 = (note) => {
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
