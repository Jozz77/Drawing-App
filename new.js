const saveButton = document.getElementById('save');
const colorInput = document.getElementById('color');
const weightInput = document.getElementById('weight');
const previousButton = document.getElementById('previous');
const restoreButton = document.getElementById('restore');
const clearButton = document.getElementById('clear');
const paths = [];
const deletedPaths = [];
let currentPath = [];
let pathsBeforeDeletion = null;

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

function touchStarted() {
    currentPath = [];
    paths.push(currentPath);
    return false; // Prevent default
}

function touchMoved() {
    return false; // Prevent default
}

function touchEnded() {
    pathsBeforeDeletion = paths.length; // Save the length before deletion
    return false; // Prevent default
}

previousButton.addEventListener('click', () => {
    const lastPaths = paths.splice(-2);
    deletedPaths.push(lastPaths);
    pathsBeforeDeletion = paths.length; // Save the length before deletion
    background(255);
    console.log("Paths length after 'previous' click:", paths.length);
    console.log("Deleted paths:", deletedPaths.length);
});

restoreButton.addEventListener('click', () => {
    if (deletedPaths.length > 0) {
        const lastDeletedPaths = deletedPaths.pop();
        paths.push(...lastDeletedPaths);
        background(255);
        console.log("Paths length after 'restore' click:", paths.length);
        console.log("Deleted paths:", deletedPaths.length);
    }
});

clearButton.addEventListener('click', () => {
    deletedPaths.push(...paths);
    pathsBeforeDeletion = paths.length; // Save the length before clearing
    paths.splice(0);
    background(255);
    console.log("Paths length after 'clear' click:", paths.length);
    console.log("Deleted paths:", deletedPaths.length);
});

saveButton.addEventListener('click', saveDrawing);

function saveDrawing() {
    // Save the canvas as an image (PNG format)
    saveCanvas('my_drawing', 'png');
    // Alternatively, you can use saveCanvas('my_drawing', 'jpg') for JPEG format
}
