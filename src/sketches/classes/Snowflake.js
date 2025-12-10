import Particle from './Particle.js';  

export default class Snowflake {
    constructor(p, x, y, z, duration) {
        this.p = p;

        const screenMinDimension = Math.min(p.width, p.height);
        this.baseSize = screenMinDimension * 0.15;
        this.size = this.baseSize;

        this.buffer = this.p.createGraphics(128, 128);
        this.buffer.colorMode(this.p.HSB);
        this.buffer.translate(this.buffer.width / 2, this.buffer.height / 2);
        this.buffer.rotate(this.p.PI / 6);
        this.buffer.noFill();

        this.generateParticles();
        this.drawToBuffer(1);

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

     generateParticles() {
        const flake1 = [];
        const flake2 = [];

        // Helper function to generate a batch
        const generateBatch = (flakeArray, strokeWeight, strokeColor) => {
        let isFinish = false;
        while (!isFinish) {
            let current = new Particle(
            this.p,
            this.buffer,
            flakeArray,
            this.buffer.width / 2,
            this.p.random(2),
            strokeWeight,
            strokeColor
            );
            while (!current.finished() && !current.intersects()) {
            current.update();
            }
            flakeArray.push(current);
            if (current.pos.x >= this.buffer.width / 2) {
            isFinish = true;
            }
        }
        };

        generateBatch(flake1, 2, [0, 0, 100, 0.8]); // white particles
        // colored particles
        generateBatch(
            flake2, 
            1, 
            [
                this.p.random(0, 360),
                100,
                100,
                1,
            ]
        );
            
        this.flake1 = flake1;
        this.flake2 = flake2;
    }

    drawToBuffer(progress) {
        this.buffer.clear();
        // Calculate how many particles to show based on progress (index limit)
        const count1 = Math.floor(this.flake1.length * progress);
        const count2 = Math.floor(this.flake2.length * progress);
        for (let j = 0; j < 6; j++) {
            this.buffer.rotate(this.p.PI / 3);

            // Draw partial flake1
            for (let i = 0; i < count1; i++) {
                this.flake1[i].show();
            }

            this.buffer.push();
            this.buffer.scale(1, -1);
            for (let i = 0; i < count1; i++) {
                this.flake1[i].show();
            }
            this.buffer.pop();
        }

        for (let j = 0; j < 6; j++) {
            this.buffer.rotate(this.p.PI / 3);

            // Draw partial flake2
            for (let i = 0; i < count2; i++) {
                this.flake2[i].show();
            }

            this.buffer.push();
            this.buffer.scale(1, -1);
            for (let i = 0; i < count2; i++) {
                this.flake2[i].show();
            }
            this.buffer.pop();
        }
    }
    draw() {
        this.p.push();
        this.p.translate(this.loc.x, this.loc.y, this.loc.z);
        
        const currentRotation = this.p.frameCount * this.p.rotationAmount;
        if (this.p.rotationFunction === 'rotateX') {
            this.p.rotateX(-currentRotation);
        } else if (this.p.rotationFunction === 'rotateY') {
            this.p.rotateY(-currentRotation);
        } else if (this.p.rotationFunction === 'rotateZ') {
            this.p.rotateZ(-currentRotation);
        }
        
        this.p.rotateZ(this.p.frameCount / this.rotspd);
        this.p.texture(this.buffer);
        this.p.noStroke();
        this.p.plane(this.size, this.size);
        this.p.pop();
    }
}