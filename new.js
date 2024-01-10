const savePngButton = document.getElementById('savePng');
const saveJpegButton = document.getElementById('saveJpeg');
const shareButton = document.getElementById('share');
const shareImageButton = document.getElementById('shareImage');
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

savePngButton.addEventListener('click', savePng);
saveJpegButton.addEventListener('click', saveJpeg);
shareButton.addEventListener('click', shareDrawing);
shareImageButton.addEventListener('click', shareDrawingImage);

function savePng() {
    // Save the canvas as an image (PNG format)
    saveCanvas('my_drawing', 'png');
    // Alternatively, you can use saveCanvas('my_drawing', 'jpg') for JPEG format
}
function saveJpeg() {
    saveCanvas('my_drawing', 'jpeg');
}

function shareDrawing() {
    // Convert the canvas content to a data URL
    const canvasDataURL = canvas.toDataURL('image/png');

    // Upload the image to Imgur (you need to replace 'YOUR_CLIENT_ID' with your Imgur API client ID)
    uploadToImgur(canvasDataURL, '3ab02e65618e972')
        .then(imgurResponse => {
            // Check if the Web Share API is supported
            if (navigator.share) {
                // Use the Web Share API to invoke the native sharing dialog
                navigator.share({
                    title: 'My Drawing',
                    text: 'Check out my drawing!',
                    url: imgurResponse.data.link
                })
                .then(() => console.log('Successfully shared'))
                .catch((error) => console.error('Error sharing:', error));
            } else {
                // Fallback for devices or browsers that do not support the Web Share API
                alert('Sharing is not supported on this device/browser.');
            }
        })
        .catch(error => console.error('Error uploading to Imgur:', error));
}

async function uploadToImgur(dataURL, clientId) {
    const response = await fetch('https://api.imgur.com/3/image', {
        method: 'POST',
        headers: {
            Authorization: `Client-ID ${clientId}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            image: dataURL.split(',')[1], // Remove the "data:image/png;base64," prefix
            type: 'base64',
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to upload to Imgur');
    }

    return response.json();
}

// share direct image
function shareDrawingImage() {
    // Convert the canvas content to a data URL
    const canvasDataURL = canvas.toDataURL('image/png');

    // Extract the base64-encoded part of the data URL (excluding the prefix)
    const base64Data = canvasDataURL.split(',')[1];

    // Convert base64 to a blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });

    // Create a file from the blob
    const imageFile = new File([blob], 'my_drawing.png', { type: 'image/png' });

    // Check if the Web Share API is supported
    if (navigator.share) {
        // Use the Web Share API to invoke the native sharing dialog
        navigator.share({
            files: [imageFile],
            title: 'My Drawing',
            text: 'Check out my drawing!'
        })
        .then(() => console.log('Successfully shared'))
        .catch((error) => console.error('Error sharing:', error));
    } else {
        // Fallback for devices or browsers that do not support the Web Share API
        alert('Sharing is not supported on this device/browser.');
    }
}


