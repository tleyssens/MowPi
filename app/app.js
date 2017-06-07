var socket = io();

function moveForward(){
    socket.emit('forward');
}

function turnRight(){
    socket.emit('right');
}

function rotateLeft(){
    socket.emit('rotLeft');
}

function rotateRight(){
    socket.emit('rotRight');
}

function turnLeft(){
    socket.emit('left');
}

function moveReverse(){
    socket.emit('reverse');
}

function stop(){
    socket.emit('stop');
}

document.getElementById('forward').onclick = moveForward;
document.getElementById('right').onclick = turnRight;
document.getElementById('rotRight').onclick = rotateRight;
document.getElementById('rotLeft').onclick = rotateLeft;
document.getElementById('left').onclick = turnLeft;
document.getElementById('reverse').onclick = moveReverse;
document.getElementById('stop').onclick = stop;
