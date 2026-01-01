class Sensor{
    constructor(car){
        this.car = car;
        this.rayCount = 5;
        this.rayLength = 150;
        this.raySpread = Math.PI / 2; // 45 deg here, angle between the rays

        this.rays = [];
        this.readings = []; // for each ray, tell how far the collision is....in case of no collision null.
    }
    
    update(roadBorders, traffic){
        this.#castRays();
        this.readings = [];
        for(let i = 0 ; i < this.rays.length ; i++){
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
    }

    #getReading(ray, roadBorders, traffic){
        let touches = []; // intersection points the ray touches or passes through

        for(let i = 0 ; i < roadBorders.length ; i++){
            const touch = getIntersection( // returns x, y, offset
                ray[0],
                ray[1],
                roadBorders[i][0],
                roadBorders[i][1]
            );

            if(touch){
                touches.push(touch);
            }
        }

        for(let i = 0 ; i < traffic.length ; i++){
            const poly = traffic[i].polygon;
            for(let j = 0 ; j < poly.length ; j++){
                const value = getIntersection(
                    ray[0],
                    ray[1],
                    poly[j],
                    poly[(j + 1) % poly.length]
                );
                
                if(value){
                    touches.push(value);
                }
            }
        }

        if(touches.length == 0){
            return null;
        }else{
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets); // always want the first interction to cut the lights off

            return touches.find(e => e.offset == minOffset); // return the first touch location
        }

    }

    #castRays(){
        this.rays = [];
        for(let i = 0 ; i < this.rayCount ; i++){
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1) // between 0 and 1
            ) + this.car.angle;


            const start = {x:this.car.x, y:this.car.y}; // start the ray from the car
            const end = { // end pos of ray, based on rayAngle
                x:this.car.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.car.y-
                    Math.cos(rayAngle)*this.rayLength
            };

            this.rays.push([start, end]);
        }
    }

    draw(ctx){
        for(let i = 0; i < this.rayCount ; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){
                end = this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y,
            );
            ctx.lineTo(
                end.x,
                end.y,
            );
            ctx.stroke();

            // check where the ray could have gone without intersection
            // ctx.beginPath();
            // ctx.lineWidth = 2;
            // ctx.strokeStyle = "black";
            // ctx.moveTo(
            //     end.x,
            //     end.y,
            // );
            // ctx.lineTo(
            //     this.rays[i][1].x,
            //     this.rays[i][1].y,
            // );
            // ctx.stroke();
            
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.arc(end.x, end.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.stroke();
        }
    }
}