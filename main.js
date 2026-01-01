const carCanvas = document.getElementById("carCanvas");
// carCanvas.width = 300;
carCanvas.width = 400;
carCanvas.width = window.innerWidth / 4;

const networkCanvas = document.getElementById("networkCanvas");
// networkCanvas.width = 500;
networkCanvas.width = window.innerWidth / 2;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
// const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS");

const N = 100; // 100 AI cars, hoping one would do right
const cars = generateCars(N);
let bestCar = cars[0];

if(localStorage.getItem("bestBrain")){
    for(let i = 0 ; i < cars.length ; i++){
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if(i != 0){
            NeuralNetwork.mutate(cars[i].brain, 0.15); // higher value, high randomness between cars mutation
        }
    }
}

const trafficNumber = 50;
const traffic = [];
let seed = 1;
for(let i = 0 ; i < trafficNumber ; i++){
    const emptyLane = Math.floor(getRandom(seed++) * road.laneCount);
    for(let j = 0; j < road.laneCount ; j++){
        if(j != emptyLane && getRandom(seed++) > 0.5){
            traffic.push(
                new Car(road.getLaneCenter(j),-100-i * 200, 30, getRandom(seed++) >= 0.5 ? 50 : 100, "DUMMY", 2)
            );
        }
    }
}

animate();

function save(){
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );
}

function discard(){
    localStorage.removeItem("bestBrain");
}


function generateCars(N){
    const cars = [];
    for(let i = 1 ; i <= N ; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }

    return cars;
}


function animate(time){
    for(let i = 0 ; i < traffic.length ; i++){
        traffic[i].update(road.borders, []);
    }
    for(let i = 0 ; i < cars.length ; i++){
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find( // find the best car that moves the farthest
        c => c.y == Math.min(...cars.map(c => c.y))
    );

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i = 0 ; i < traffic.length ; i++){
        traffic[i].draw(carCtx, "pink");
    }

    carCtx.globalAlpha = 0.2;
    for(let i = 1 ; i < cars.length ; i++){
        cars[i].draw(carCtx, "white"); 
    }
    
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "white", true); 
    

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}