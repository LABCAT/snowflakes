/**
 * SnowSphere - 3D Snowstorm for p5.js WEBGL
 * Static snowflakes distributed within a sphere
 */
export default class SnowSphere {
  constructor(p, revealDuration = 5000, useSongTime = false, options = {}) {
    this.p = p;
    
    this.defaultSize = Math.max(p.width, p.height);
    const screenArea = p.width * p.height;
    const baseArea = 1920 * 1080;
    this.density = options.density || Math.floor(Math.sqrt(screenArea / baseArea) * 400);
    this.radius = options.radius || this.defaultSize / 2;
    this.revealDuration = revealDuration;
    this.useSongTime = useSongTime;
    
    this.pos = [];
    this.size = [];
    this.rot = [];
    
    this.startTime = useSongTime ? (p.song ? p.song.currentTime() * 1000 : 0) : p.millis();
    this.visibleCount = 0;
    
    this.init();
  }
  
  init() {
    const p = this.p;
    let sizeset = 0;
    const maxSize = this.defaultSize * 0.0075;
    const minSize = this.defaultSize * 0.0015;
    const TWO_PI = p.TWO_PI;
    const PI = p.PI;
    
    for (let i = 0; i < this.density; i++) {
      const theta = p.random(TWO_PI);
      const phi = Math.acos(2 * p.random() - 1); 
      const r = Math.pow(p.random(), 1/3) * this.radius; 
      
      const sinPhi = Math.sin(phi);
      const x = r * sinPhi * Math.cos(theta);
      const y = r * sinPhi * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      this.pos.push(p.createVector(x, y, z));
      
      sizeset = sizeset + (1 - sizeset) * 0.1;
      this.size.push(maxSize + (minSize - maxSize) * sizeset);
      
      this.rot.push(p.random(-PI, PI));
    }
  }
  
  show() {
    const p = this.p;
    
    const currentTime = this.useSongTime ? (p.song ? p.song.currentTime() * 1000 : 0) : p.millis();
    const elapsed = currentTime - this.startTime;
    const progress = p.constrain(elapsed / this.revealDuration, 0, 1);
    this.visibleCount = Math.floor(progress * this.density);
    
    p.stroke(200, 150);
    p.strokeWeight(2);
    p.beginShape(p.LINES);
    
    const TWO_PI = p.TWO_PI;
    
    for (let i = 0; i < this.visibleCount; i++) {
      const pos = this.pos[i];
      const px = pos.x;
      const py = pos.y;
      const pz = pos.z;
      const rot = this.rot[i];
      const size = this.size[i];
      const flip = (rot / TWO_PI) * size * 4;
      
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      
      let lx1 = -size - flip, ly1 = 0;
      let lx2 = size + flip, ly2 = 0;
      p.vertex(px + lx1 * c, py + lx1 * s, pz);
      p.vertex(px + lx2 * c, py + lx2 * s, pz);
      
      lx1 = 0; ly1 = size + flip;
      lx2 = 0; ly2 = -size - flip;
      p.vertex(px - ly1 * s, py + ly1 * c, pz);
      p.vertex(px - ly2 * s, py + ly2 * c, pz);
      
      lx1 = size; ly1 = size;
      lx2 = -size; ly2 = -size;
      p.vertex(px + lx1 * c - ly1 * s, py + lx1 * s + ly1 * c, pz);
      p.vertex(px + lx2 * c - ly2 * s, py + lx2 * s + ly2 * c, pz);
      
      lx1 = size; ly1 = -size;
      lx2 = -size; ly2 = size;
      p.vertex(px + lx1 * c - ly1 * s, py + lx1 * s + ly1 * c, pz);
      p.vertex(px + lx2 * c - ly2 * s, py + lx2 * s + ly2 * c, pz);
    }
    
    p.endShape();
  }
}
