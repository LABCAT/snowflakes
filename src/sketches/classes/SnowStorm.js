/**
 * SnowStorm - 3D Snowstorm for p5.js WEBGL
 * Based on Ed Cavett's Snow Storm (December 2021)
 * Optimized for WEBGL performance
 */
export default class SnowStorm {
  constructor(p, options = {}) {
    this.p = p;
    
    this.density = options.density || 600;
    this.depthRange = options.depthRange || p.height;
    this.spreadX = options.spreadX || p.height;
    this.spreadY = options.spreadY || p.height;
    
    this.pos = [];
    this.vel = [];
    this.size = [];
    this.flow = [];
    this.rot = [];
    this.yoff = [];
    
    this.init();
  }
  
  init() {
    const p = this.p;
    let sizeset = 0;
    
    for (let i = 0; i < this.density; i++) {
      this.yoff.push(p.random(1000));
      this.pos.push(p.createVector(
        p.random(-this.spreadX / 2, this.spreadX / 2),
        p.random(-this.spreadY / 2, this.spreadY / 2),
        p.random(-this.depthRange / 2, this.depthRange / 2)
      ));
      
      sizeset = p.lerp(sizeset, 5, 0.1);
      this.size.push(7 - sizeset);
      
      this.vel.push(p.createVector(0, this.size[i] * 1.25, 0));
      
      this.flow.push(0);
      this.rot.push(p.random(-p.PI, p.PI));
    }
  }
  
  update() {
    const p = this.p;
    const fc = p.frameCount;
    
    for (let i = 0; i < this.density; i++) {
      this.yoff[i] += 0.05;
      this.pos[i].add(this.vel[i]);
      
      this.flow[i] = p.map(
        p.noise((i + 1) * 0.01, this.yoff[i], fc * 0.01),
        0, 1,
        -this.size[i] * 4,
        this.size[i] * 4
      );
      
      this.rot[i] = p.map(
        p.noise(this.yoff[i] * 0.1, fc * 0.00001),
        0, 1,
        -p.TWO_PI,
        p.TWO_PI
      );
      
      let switchmove = p.map(
        p.noise(this.yoff[i] * 0.1, fc * 0.005),
        0, 1,
        -3, 3
      );
      
      let move = p.map(this.size[i], 1, 5, 0.1, 2) * switchmove;
      this.pos[i].x += move;
      
      this.bounds(i);
    }
  }
  
  show() {
    const p = this.p;
    
    p.stroke(200, 150);
    p.strokeWeight(2);
    p.beginShape(p.LINES);
    
    for (let i = 0; i < this.density; i++) {
      const px = this.pos[i].x + this.flow[i];
      const py = this.pos[i].y + this.flow[i];
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
  
  bounds(i) {
    const p = this.p;
    
    if (this.pos[i].y > this.spreadY / 2) {
      this.pos[i].x = p.random(-this.spreadX / 2, this.spreadX / 2);
      this.pos[i].y = -this.spreadY / 2;
      this.pos[i].z = p.random(-this.depthRange / 2, this.depthRange / 2);
      this.vel[i].set(0, this.size[i] * 1.25, 0);
    }
    if (this.pos[i].x > this.spreadX / 2) {
      this.pos[i].x = -this.spreadX / 2;
    }
    if (this.pos[i].x < -this.spreadX / 2) {
      this.pos[i].x = this.spreadX / 2;
    }
  }
}
