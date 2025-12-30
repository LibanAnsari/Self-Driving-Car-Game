const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 350;
// carCanvas.width = 400;
// carCanvas.width = window.innerWidth;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;
// networkCanvas.width = 850;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9, 3);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "AI");
const traffic = [
    // new Car(road.getLaneCenter(0), -150, 30, 100, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    // new Car(road.getLaneCenter(2), -50, 30, 50, "DUMMY", 3)
]

animate();

function animate(){
    for(let i = 0 ; i < traffic.length ; i++){
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y + carCanvas.height*0.7);

    road.draw(carCtx);
    car.draw(carCtx, "white"); 
    for(let i = 0 ; i < traffic.length ; i++){
        traffic[i].draw(carCtx, "pink");
    }

    carCtx.restore();
    requestAnimationFrame(animate);
}