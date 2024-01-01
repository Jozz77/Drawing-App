const colorInput = document.getElementById('color');
const weight = document.getElementById('weight');
const previous = document.getElementById('previous');
const clear = document.getElementById('clear');
const paths = [];
let currentPath = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(253);
}

function draw() {
    noFill();

    if (mouseIsPressed) {
        const point = {
            x: mouseX,
            y: mouseY,
            color: colorInput.value,
            weight: weight.value
        };
        currentPath.push(point);
    }
    // console.log("points length:", point);
    paths.forEach(path => {
        beginShape();
        path.forEach(point => {
            stroke(point.color);
            strokeWeight(point.weight);
            vertex(point.x, point.y);
        });
        endShape();
    });
    
}

function mousePressed() {
    currentPath = [];
    paths.push(currentPath);
    // console.log("Current path length:", currentPath.length);
console.log("Paths length:", paths.length);
}

previous.addEventListener('click', () => {
    paths.splice(-2);
    background(255);
    console.log("Paths length after 'previous' click:", paths.length);
});


clear.addEventListener('click', () => {
    paths.splice(0);
    background(255);
    console.log("Paths length after 'clear' click:", paths.length);
});