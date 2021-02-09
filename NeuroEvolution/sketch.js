let cars = [];
let pop_size = 300

function setup() {
  // put setup code here
  createCanvas(window.innerWidth, window.innerHeight);
  for (var i=0;i<pop_size;i++){
    let car = new Car(1000, 200)
    cars[i] = car
  }


}

function draw() {
  // put drawing code here
  background(120);
  var deds = 0

  for (var i=0;i<cars[0].map.length;i++){
    var point = cars[0].map[i]

    line(point[0], point[1], point[2], point[3])
  }

  for (var i=0;i<cars[0].reward_gates.length;i++){
    var point = cars[0].reward_gates[i]
    push()
    stroke(0, 255, 255)
    line(point[0], point[1], point[2], point[3])
    pop()
  }


  for (var i=0;i<cars.length;i++){
    if (!cars[i].ded){
    cars[i].show()
    cars[i].update()
  }
    if (cars[i].ded){
      deds++
    }

  }
  if (deds >= pop_size){
    New_Population()
  }

  //console.log(cars[0].data)


}



function New_Population(){
  var best = 0
  var best_index = 0
  for (var i=0;i<cars.length;i++){
    if (cars[i].fitness > best){
      best = cars[i].fitness
      best_index = i
    }
  }
  console.log(cars[best_index].fitness)
  let best_nn = cars[best_index].brain.copy()
  for (var i=0;i<pop_size;i++){
    let car = new Car(1000, 200)
    car.brain = best_nn.copy()
    car.brain.mutate(0.15)
    cars[i] = car
  }



}