class Car{
    constructor(x, y, width, height, controlType, maxSpeed = 3){
        // this allows to remember the car where it is and how big it is.
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.acceleration = 0.2;
        this.maxSpeed = maxSpeed;
        this.friction = 0.05;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlType == "AI";

        if(controlType != "DUMMY"){
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork(
                [this.sensor.rayCount, 6, 4] // 4 output neurons for the four directions
            );
        }
        this.controls = new Controls(controlType);
    }

    update(roadBorders ,traffic){
        if(!this.damaged){
            this.#move();
            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(e => e == null ? 0 : 1 - e.offset);
            const outputs = NeuralNetwork.forward(offsets, this.brain);
            console.log(outputs);

            if(this.useBrain){
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    #createPolygon(){
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        
        // 4 corners of the car
        points.push({
            x:this.x - Math.sin(this.angle - alpha)*rad,
            y:this.y - Math.cos(this.angle - alpha)*rad
        });
        
        points.push({
            x:this.x - Math.sin(this.angle + alpha)*rad,
            y:this.y - Math.cos(this.angle + alpha)*rad
        });

        points.push({
            x:this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
            y:this.y - Math.cos(Math.PI + this.angle - alpha)*rad
        });

        points.push({
            x:this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
            y:this.y - Math.cos(Math.PI + this.angle + alpha)*rad
        });

        return points; 
    }

    #assessDamage(roadBorders, traffic){
        for(let i = 0 ; i < roadBorders.length ; i++){
            if(polyIntersect(this.polygon, roadBorders[i])){ // roadBroder is a line segment
                return true;
            }
        }
        for(let i = 0 ; i < traffic.length ; i++){
            if(polyIntersect(this.polygon, traffic[i].polygon)){ // roadBroder is a line segment
                return true;
            }
        }
        return false;
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

    draw(ctx, color){
        if(this.damaged){
            ctx.fillStyle = "gray";
        }else{
            ctx.fillStyle = color;
        }

        // Draw the car using corner points of the poylgon
        // ctx.beginPath();
        // ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        // for(let i=1;i<this.polygon.length;i++){
        //     ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        // }
        // ctx.fill();

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
        
        ctx.fill();
        ctx.restore();

        if(this.sensor){
            this.sensor.draw(ctx);
        }
    }
}