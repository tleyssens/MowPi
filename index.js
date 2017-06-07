var express = require('express'),
    app = express(),
    io = require('socket.io')(app.listen(3000)),
    Gpio = require('pigpio').Gpio,
    LL = new Gpio(17,{mode: Gpio.OUTPUT}),  //moet 17 zijn
    LR = new Gpio(27,{mode: Gpio.OUTPUT}),
    LE = new Gpio(22,{mode: Gpio.OUTPUT}),  //moet 22 zijn
    RL = new Gpio(10,{mode: Gpio.OUTPUT}),
    RR = new Gpio( 9,{mode: Gpio.OUTPUT}),
    RE = new Gpio(11,{mode: Gpio.OUTPUT}),
    minDutyL = 40,
    minDutyR = 40,
    dutyCycleLE = 0,
    dutyCycleRE = 0
    ;

//Setting the path to static assets
app.use(express.static(__dirname + '/app'));

//Serving the static HTML file
app.get('/', function (res) {
    res.sendFile('app/index.html')
});

    var commands = null,
        speed = 255;
        X = 0.0,
        Y = 0.0,
        V = 0.0,
        W = 0.0,
        RM = 0.0,
        LM = 0.0;

    io.on('connection', function (socket) {
        
        socket.on('stop', function () {
            console.log("stop");
            LE.digitalWrite(0);
            RE.digitalWrite(0);
        });
       socket.on('key', KeyReceived);  //Key received from client

function KeyReceived(data)
{
    //DATA IS PRINTED HERE
    console.log(data);

    switch(data.Key)
    {
    case "Steering":
        X = -data.value;
        console.log(" X= " + X);
        break;
    case "Speed": //Y
        Y = -data.value;
        console.log(" Y= " + Y);
        break;
    }
    V = parseFloat((100 - Math.abs(X))*(Y/100)+Y);
    W = parseFloat((100 - Math.abs(Y))*(X/100)+X);
    //console.log ('V=' + V + ' W=' + W);
    RM = (V+W)/2;
    LM = (V-W)/2;
    console.log ('L=' + parseInt(LM) + ' R=' + RM.toFixed(1));
    drive(parseInt(LM),parseInt(RM));
}
   });
//});

process.on('SIGINT', exit);


function drive(LM , RM) {
   console.log('in drive');
   if (LM > 0) {
      LR.digitalWrite(1);
      LL.digitalWrite(0);
   }
   else {
      LR.digitalWrite(0);
      LL.digitalWrite(1);
   }
   LM = Math.abs(LM)*2;
   LE.pwmWrite(LM);
   if (RM > 0) {
      RR.digitalWrite(0);
      RL.digitalWrite(1);
   }
   else {
      RR.digitalWrite(1);
      RL.digitalWrite(0);
   }
   RM = Math.abs(RM)*2;
   RE.pwmWrite(Math.abs(RM));
}       

function exit() {
  LE.digitalWrite(0);
  RE.digitalWrite(0);
  console.log('bye');
  process.exit();
}
