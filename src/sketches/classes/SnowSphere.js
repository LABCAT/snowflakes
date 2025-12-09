/**
 * SnowSphere - 3D Snowstorm for p5.js WEBGL
 * Static snowflakes distributed within a sphere
 */
export default class SnowSphere {
  constructor(p, revealDuration = 5000, useSongTime = false, options = {}) {
    this.p = p;
    
    this.defaultSize = p.height >= p.width ? p.height : p.width;
    this.density = options.density || 1200;
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
    
    for (let i = 0; i < this.density; i++) {
      const theta = p.random(p.TWO_PI);
      const phi = Math.acos(2 * p.random() - 1); 
      const r = Math.pow(p.random(), 1/3) * this.radius; 
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      this.pos.push(p.createVector(x, y, z));
      
      sizeset = p.lerp(sizeset, 5, 0.1);
      this.size.push(7 - sizeset);
      
      this.rot.push(p.random(-p.PI, p.PI));
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
    
    for (let i = 0; i < this.visibleCount; i++) {
      const px = this.pos[i].x;
      const py = this.pos[i].y;
      const pz = this.pos[i].z;
      const rot = this.rot[i];
      const size = this.size[i];
      const flip = p.map(rot, -p.TWO_PI, p.TWO_PI, -size * 4, size * 4);
      
      const c = Math.cos(rot);
      const s = Math.sin(rot);
      
      let lx1 = -size - flip, ly1 = 0;
      let lx2 = size + flip, ly2 = 0;
      p.vertex(px + lx1 * c - ly1 * s, py + lx1 * s + ly1 * c, pz);
      p.vertex(px + lx2 * c - ly2 * s, py + lx2 * s + ly2 * c, pz);
      
      lx1 = 0; ly1 = size + flip;
      lx2 = 0; ly2 = -size - flip;
      p.vertex(px + lx1 * c - ly1 * s, py + lx1 * s + ly1 * c, pz);
      p.vertex(px + lx2 * c - ly2 * s, py + lx2 * s + ly2 * c, pz);
      
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
