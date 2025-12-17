import Particle from './Particle.js';  

export default class Snowflake {
    static createBufferPool(p, poolSize = 6) {
        const screenMinDimension = Math.min(p.width, p.height);
        const bufferSize = screenMinDimension < 600 ? 32 : 64;
        const pool = [];
        
        for (let i = 0; i < poolSize; i++) {
            const buffer = p.createGraphics(bufferSize, bufferSize);
            buffer.colorMode(p.HSB);
            buffer.translate(buffer.width / 2, buffer.height / 2);
            buffer.rotate(p.PI / 6);
            buffer.noFill();
            
            const flake1 = [];
            const flake2 = [];
            
            const generateBatch = (flakeArray, strokeWeight, strokeColor) => {
                let isFinish = false;
                while (!isFinish) {
                    let current = new Particle(
                        p,
                        buffer,
                        flakeArray,
                        buffer.width / 2,
                        p.random(2),
                        strokeWeight,
                        strokeColor
                    );
                    while (!current.finished() && !current.intersects()) {
                        current.update();
                    }
                    flakeArray.push(current);
                    if (current.pos.x >= buffer.width / 2) {
                        isFinish = true;
                    }
                }
            };
            
            generateBatch(flake1, 2, [0, 0, 100, 0.8]);
            generateBatch(flake2, 1, [p.random(0, 360), 100, 100, 1]);
            
            Snowflake._drawToBuffer(buffer, flake1, flake2, p.PI / 3);
            
            pool.push(buffer);
        }
        
        return pool;
    }
    
    static _drawToBuffer(buffer, flake1, flake2, rotAngle) {
        buffer.clear();
        
        for (let j = 0; j < 6; j++) {
            buffer.rotate(rotAngle);
            
            for (let i = 0; i < flake1.length; i++) {
                flake1[i].show();
            }
            
            buffer.push();
            buffer.scale(1, -1);
            for (let i = 0; i < flake1.length; i++) {
                flake1[i].show();
            }
            buffer.pop();
        }
        
        for (let j = 0; j < 6; j++) {
            buffer.rotate(rotAngle);
            
            for (let i = 0; i < flake2.length; i++) {
                flake2[i].show();
            }
            
            buffer.push();
            buffer.scale(1, -1);
            for (let i = 0; i < flake2.length; i++) {
                flake2[i].show();
            }
            buffer.pop();
        }
    }

    constructor(p, x, y, z, duration, bufferPool) {
        this.p = p;

        const screenMinDimension = Math.min(p.width, p.height);
        this.baseSize = screenMinDimension * 0.1;
        this.size = this.baseSize;

        this.buffer = bufferPool[Math.floor(p.random(bufferPool.length))];

        this.loc = this.p.createVector(x, y, z);

        this.spd = this.p.random(0.3, 1.5);
        this.rotspd = this.p.random(30, 150);
        if (Math.random() < 0.5) { 
            this.rotspd *= -1; 
        }
        this.duration = duration * 1000;
        this.birthTime = p.song.currentTime() * 1000;
        this.reversed = false;
    }

    draw() {
        const p = this.p;
        p.push();
        p.translate(this.loc.x, this.loc.y, this.loc.z);
        
        const rotationFrames = p.frameCount - p.rotationStartFrame;
        const currentRotation = rotationFrames * p.rotationAmount;
        
        switch (p.rotationFunction) {
            case 'rotateX':
                p.rotateX(-currentRotation);
                break;
            case 'rotateY':
                p.rotateY(-currentRotation);
                break;
            case 'rotateZ':
                p.rotateZ(-currentRotation);
                break;
        }
        
        p.rotateZ(p.frameCount / this.rotspd);
        p.texture(this.buffer);
        p.noStroke();
        p.plane(this.size, this.size);
        p.pop();
    }
}