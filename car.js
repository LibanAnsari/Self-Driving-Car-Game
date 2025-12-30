class Car{
    constructor(x, y, width, height){
        // this allows to remember the car where it is and how big it is.
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = 3;
        this.friction = 0.05;
        this.angle = 0;

        this.sensor = new Sensor(this);
        this.controls = new Controls();
    }

    update(roadBorders){
        this.#move();
        this.sensor.update(roadBorders);
    }

    #move(){
        if(this.controls.forward){
            this.speed += this.acceleration;
        }
        if(this.controls.reverse){
            this.speed -= this.acceleration;
        }

        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed / 2){
            this.speed = -this.maxSpeed / 2;
        }

        // always apply friction
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }

        if(Math.abs(this.speed) < this.friction){
            this.speed = 0;
        }

        if(this.speed != 0){
            const flip = this.speed > 0 ? 1 : -1;
            if(this.controls.left){
                this.angle += 0.03 * flip;
            }
            if(this.controls.right){
                this.angle -= 0.03 * flip;
            }
        }

        this.x -= Math.sin(this.angle)*this.speed;
        this.y -= Math.cos(this.angle)*this.speed;
    }

    draw(ctx){
        ctx.save();
        
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        // Shadow for the 3D uplifted look
        ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 10;

        ctx.beginPath();
        
        // Draw rounded rectangle (capsule shape)
        const radius = Math.min(this.width, this.height) / 3;
        
        // Check if roundRect is supported, otherwise fallback to rect
        ctx.roundRect(
            -this.width/2,
            -this.height/2,
            this.width,
            this.height,
            radius
        );
        
        ctx.fillStyle = "white";
        ctx.fill();
        
        ctx.restore();

        this.sensor.draw(ctx);
    }
}