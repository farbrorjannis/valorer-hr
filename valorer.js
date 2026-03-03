// valorer.js

let originalImage = null;
let canvas = document.getElementById('imageCanvas');
let ctx = canvas.getContext('2d');

// Ladda bild
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                originalImage = img;
                processImage();
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Ändra antal valörer
document.getElementById('levels').addEventListener('input', function(e) {
    document.getElementById('levelValue').textContent = e.target.value;
    if (originalImage) processImage();
});

// Huvudfunktion för bildbehandling
function processImage() {
    if (!originalImage) return;
    
    const levels = parseInt(document.getElementById('levels').value);
    
    // Sätt canvas till originalbildens storlek (ingen nedskalning!)
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;
    
    // Rita originalbilden i full storlek
    ctx.drawImage(originalImage, 0, 0);
    
    // Hämta bilddata för bearbetning
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Konvertera till gråskala och kvantisera till valda valörer
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        
        // Beräkna valör baserat på antal nivåer
        const levelSize = 256 / levels;
        const quantized = Math.floor(gray / levelSize) * levelSize + levelSize / 2;
        
        data[i] = quantized;     // R
        data[i + 1] = quantized; // G
        data[i + 2] = quantized; // B
        // data[i + 3] är alpha, lämnas orörd
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Visa nedladdningsknapp
    document.getElementById('downloadBtn').style.display = 'inline-block';
}

// Ladda ner resultatet
document.getElementById('downloadBtn').addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = 'valorbild.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Uppdatera slider-text
document.getElementById('levelValue').textContent = document.getElementById('levels').value;
