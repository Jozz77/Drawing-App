const colorInput = document.getElementById('color');
const weightInput = document.getElementById('weight');
const previousButton = document.getElementById('previous');
const restoreButton = document.getElementById('restore');
const clearButton = document.getElementById('clear');
const paths = [];
const deletedPaths = [];
let currentPath = [];
const savePngButton = document.getElementById('savePng');
const saveJpegButton = document.getElementById('saveJpeg');

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    background(255);

    // Touch events
    canvas.ontouchstart = touchStarted;
    canvas.ontouchmove = touchMoved;
    canvas.ontouchend = touchEnded;
}

function draw() {
    noFill();

    if (mouseIsPressed || touches.length > 0) {
        const point = {
            x: touches.length > 0 ? touches[0].x : mouseX,
            y: touches.length > 0 ? touches[0].y : mouseY,
            color: colorInput.value,
            weight: weightInput.value
        };
        currentPath.push(point);
    }

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

    console.log("Current path length:", currentPath.length);
    console.log("Paths length:", paths.length);
}

previousButton.addEventListener('click', () => {
    const lastPaths = paths.splice(-2);
    deletedPaths.push(lastPaths);
    background(255);
    console.log("Paths length after 'previous' click:", paths.length);
    console.log("Deleted paths:", deletedPaths.length);
});

restoreButton.addEventListener('click', () => {
    const lastDeletedPaths = deletedPaths.pop();
    if (lastDeletedPaths) {
        paths.push(...lastDeletedPaths);
        background(255);
        console.log("Paths length after 'restore' click:", paths.length);
        console.log("Deleted paths:", deletedPaths.length);
    }
});

clearButton.addEventListener('click', () => {
    deletedPaths.push(...paths);
    paths.splice(0);
    background(255);
    console.log("Paths length after 'clear' click:", paths.length);
    console.log("Deleted paths:", deletedPaths.length);
});
savePngButton.addEventListener('click', savePngDrawing);
saveJpegButton.addEventListener('click', saveJpegDrawing);

function savePngDrawing() {
    // Save the canvas as an image (PNG format)
    saveCanvas('my_drawing', 'png');
    // Alternatively, you can use saveCanvas('my_drawing', 'jpg') for JPEG format
}
function saveJpegDrawing() {
    // Save the canvas as an image (PNG format)
    saveCanvas('my_drawing', 'jpeg');
}