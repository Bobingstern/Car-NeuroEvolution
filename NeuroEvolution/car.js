
class Car{
  constructor(x, y){
  this.pos = createVector(x, y);
  this.vel = createVector(0, 0);
  this.mag = 0;
  this.dir = PI*2;
  this.sensors = []
  this.map = []
  this.all_collisions = []
  this.collision_data = []

  this.reward_gates = [[1000, 1180, 1000, 1000], [700, 1180, 700, 1000], [500, 1180, 500, 1000], [200, 900, 450, 900], [134, 683, 427, 667], [234, 393, 499, 469], [359, 175, 587, 282],
                        [664, 53, 715, 225], [944, 50, 953, 209], [1253, 50, 1253, 193], [1455, 53, 1473, 185], [1749, 49, 1732, 185], [1741, 319, 1975, 303],
                      [1783, 551, 1998, 583], [1784, 806, 1994, 903], [1785, 1009, 1945, 1136], [1643, 1004, 1636, 1213], [1403, 1012, 1395, 1205], [1212, 1009, 1210, 1203]]
  this.da = 1


  this.data = []
  this.color = [round(random(255)), round(random(255)), round(random(255))]
  this.brain = new NeuralNetwork(7, round(random(7, 30)), 3)
  this.ded = false;
  this.on = 0
  this.fitness = 0
  this.map.push([1919, 1180, 409, 1192])
  this.map.push([410, 1190, 223, 950])
  this.map.push([222, 948, 205, 604])
  this.map.push([206, 605, 378, 157])
  //this.map.push([363, 338, 378, 157])
  this.map.push([379, 157, 471, 80])
  this.map.push([471, 80, 1919, 65])
  this.map.push([1924, 66, 1983, 147])
  this.map.push([1982, 147, 1949, 324])
  this.map.push([1949, 324, 1987, 753])
  this.map.push([1990, 748, 1917, 1179])
  this.map.push([479, 1059, 1810, 1055])
  this.map.push([483, 1058, 406, 926])
  this.map.push([405, 928, 387, 615])
  this.map.push([389, 622, 576, 198])
  //this.map.push([460, 407, 476, 198])
  this.map.push([576, 202, 1747, 174])
  this.map.push([1746, 174, 1807, 221])
  this.map.push([1807, 225, 1764, 308])
  this.map.push([1762, 314, 1852, 716])
  this.map.push([1853, 713, 1807, 1053])

  this.cols = []
  //this.map.push()

  //console.log(this.map)

  }

  forward(){
    this.mag += 0.1;
    if (this.mag >= 10) {
      this.mag = 10;
    }
  }
  stopForward(){
    if (this.mag > 0) {
      this.mag -= 0.1;
    } else {
      this.mag = 0;
    }
  }


  controls() {
    if (keyIsDown(87)) {
      this.forward()
    } else {
      this.stopForward()
    }
    if (keyIsDown(65)) {
      this.dir += -0.07;
    }
    if (keyIsDown(68)) {
      this.dir += 0.07;
    }
    this.vel = p5.Vector.fromAngle(this.dir, this.mag);
  };

  show() {

    push();
    //background(150)
    fill(this.color);
    noStroke();
    rectMode(CENTER);
    translate(-(this.pos.x - width / 2) + width / 2, -(this.pos.y - height / 2) + height / 2);
    rotate(this.dir + PI);
    rect(0, 0, 40, 20);
    ellipseMode(CENTER);
    fill(255, 255, 0);
    circle(17.5, 7.5, 5);
    circle(17.5, -7.5, 5);


    pop();



    for (var i=0;i<this.all_collisions.length;i++){
      if (this.all_collisions[i][0] != -1){
        //circle(this.all_collisions[i][0], this.all_collisions[i][1], 10)
      }
    }



  };

  crash_detection(){

    var x = -(this.pos.x - width / 2) + width / 2
    var y = (-(this.pos.y - height / 2) + height / 2)
    var maxiu = 10;
    this.cols = []

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x+maxiu, y+maxiu))

    this.cols.push([x, y, rote.x, rote.y])

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x-maxiu, y+maxiu))

    this.cols.push([x, y, rote.x, rote.y])

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x, y+maxiu))

    this.cols.push([x, y, rote.x, rote.y])

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x+maxiu, y-maxiu))

    this.cols.push([x, y, rote.x, rote.y])

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x-maxiu, y-maxiu))

    this.cols.push([x, y, rote.x, rote.y])

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x, y-maxiu))

    this.cols.push([x, y, rote.x, rote.y])



    var rote = this.rotat(x, y, this.dir, new p5.Vector(x+maxiu, y))

    this.cols.push([x, y, rote.x, rote.y])

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x-maxiu, y))

    this.cols.push([x, y, rote.x, rote.y])



    var cold = false
    for (var i=0;i<this.cols.length;i++){
      var po = this.cols[i]
      for (var n=0;n<this.map.length;n++){
        var ca = this.map[n]
        var hit = collideLineLine(po[0], po[1], po[2], po[3], ca[0], ca[1], ca[2], ca[3], false)
        if (hit == true){
          cold = true
        }
      }
    }
    return cold

  }


  collision(){
    this.all_collisions = []

    for (var x=0;x<this.map.length;x++){
      var point = this.map[x]
      var na = 0
      for (var i=0;i<this.sensors.length;i++){
        var sen = this.sensors[i]

        var hit = collideLineLine(point[0], point[1], point[2], point[3], sen[0], sen[1], sen[2], sen[3], true);
        if (hit.x != false && na < 5){
          //background(150)
          this.all_collisions.push([hit.x, hit.y])
          na++

        }
        else{
          this.all_collisions.push([-1, -1])

        }
      }
    }


    //console.log(this.all_collisions.length)
  }

  think(){
    this.data = [0, 0, 0, 0, 0]
    var ia=0
    for (var i=0;i<this.all_collisions.length;i++){
      if (this.all_collisions[i][0] != -1 && ia<6){
        this.data[ia] = round(dist(this.pos.x, this.pos.y, this.all_collisions[i][0], this.all_collisions[i][1]))
        ia ++
      }
    }
    this.data.push(round(this.dir))
    this.data.push(round(this.mag))
    if (this.data.length > 7){

    }
    var output = this.brain.predict(this.data)
    //console.log(this.data.length)
    if (output[0] > 0.5){
      this.forward()
      //console.log("frow")

    }
    else{
      this.stopForward()
      //console.log("for")
    }

    if (output[1] > 0.5){
      this.dir += 0.07
      //console.log("right")
    }

    if (output[2] > 0.5){
      this.dir -= 0.07
      //console.log("left")
    }
    this.vel = p5.Vector.fromAngle(this.dir, this.mag);


  }

  update() {
    var old = this.pos.copy()
    if (!this.ded){
      this.think()


      //this.controls();
      this.pos.add(this.vel);
      this.show();
      this.sensor()
      this.collision()
      this.Fitness()
      if (this.crash_detection() || this.da > 100){
        //this.color = [0, 0, 0]
        this.ded = true
      }
      else{
        //this.color = [255, 0, 0]

      }
    }

    if (abs(this.pos.x-old.x) < 0.6 || abs(this.pos.y-old.y) < 0.6){
      this.da++

    }
    else{
      this.da--
    }


  };

  Fitness(){

      var point = this.reward_gates[this.on]
      for (var i=0;i<this.cols.length;i++){
        var sen = this.cols[i]

        var hit = collideLineLine(point[0], point[1], point[2], point[3], sen[0], sen[1], sen[2], sen[3], true);
        if (hit.x != false){
          //background(150)
          this.fitness++
          //console.log('pooggerr')
          this.on++

          if (this.on > this.reward_gates.length-1){
            this.on = 0
          }

        }

      }

  }


  sensor(){
    this.sensors = []

    //rotate(this.dir + PI);
    var x = -(this.pos.x - width / 2) + width / 2
    var y = -(this.pos.y - height / 2) + height / 2
    var maxiu = 100;

    var rote = this.rotat(x, y, this.dir, new p5.Vector(x, y+maxiu))

    //line(x, y, rote.x, rote.y)
    this.sensors.push([x, y, rote.x, rote.y])

    rote = this.rotat(x, y, this.dir, new p5.Vector(x, y-maxiu))

    //line(x, y, rote.x, rote.y)
    this.sensors.push([x, y, rote.x, rote.y])

    rote = this.rotat(x, y, this.dir, new p5.Vector(x-maxiu, y))

    //line(x, y, rote.x, rote.y)
    this.sensors.push([x, y, rote.x, rote.y])

    rote = this.rotat(x, y, this.dir, new p5.Vector(x-maxiu, y+maxiu))

    //line(x, y, rote.x, rote.y)
    this.sensors.push([x, y, rote.x, rote.y])

    rote = this.rotat(x, y, this.dir, new p5.Vector(x-maxiu, y-maxiu))

    //line(x, y, rote.x, rote.y)
    this.sensors.push([x, y, rote.x, rote.y])


  }

  rotat(cx, cy, angle, pos){
    let p = pos.copy()
    var s = sin(angle);
    var c = cos(angle);

    // translate point back to origin:

    p.x -= cx;
    p.y -= cy;

    // rotate point
    var xnew = p.x * c - p.y * s;
    var ynew = p.x * s + p.y * c;

    // translate point back:
    p.x = xnew + cx;
    p.y = ynew + cy;
    return p;
  }

  intersect_point(point1, point2, point3, point4) {
   const ua = ((point4[0] - point3[0]) * (point1[1] - point3[1]) -
             (point4[1] - point3[1]) * (point1[0] - point3[0])) /
            ((point4[1] - point3[1]) * (point2[0] - point1[0]) -
             (point4[0] - point3[0]) * (point2[1] - point1[1]));

  const ub = ((point2[0] - point1[0]) * (point1[1] - point3[1]) -
             (point2[1] - point1[1]) * (point1[0] - point3[0])) /
            ((point4[1] - point3[1]) * (point2[0] - point1[0]) -
             (point4[0] - point3[0]) * (point2[1] - point1[1]));

  const x = point1[0] + ua * (point2[0] - point1[0]);
  const y = point1[1] + ua * (point2[1] - point1[1]);

  return [x, y]
  }
}


// var hc = []
//
// function mouseClicked(){
//   hc.push(mouseX, mouseY)
//   if (hc.length == 4){
//     console.log(hc)
//     hc = []
//   }
// }
