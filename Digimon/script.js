const digimonSprite = document.getElementById('digimon-sprite');
const digimonWrapper = document.getElementById('digimon-wrapper');
const message = document.getElementById('inspiration-message');
const speechBubble = document.getElementById('speech-bubble');
const container = document.getElementById('digimon-container');

// Initialize positions and states
let currentLeft = 50;
let currentTop = 250; // Initial Y-axis position
let jumping = false;
let isTalking = false;
let walkInterval;
let currentDirection = 'right';

// Image arrays for walking and speaking animations
let walkImages = {
    right: ['Images/WalkingRight/walk1.jpg', 'Images/WalkingRight/walk2.jpg', 'Images/WalkingRight/walk3.jpg'],
    left: ['Images/WalkingLeft/walk1.jpg', 'Images/WalkingLeft/walk2.jpg', 'Images/WalkingLeft/walk3.jpg']
};
let speakImages = ['Images/Speaking/speak1.jpg', 'Images/Speaking/speak2.jpg'];
let walkIndex = 0;
let speakIndex = 0;

const messages = [
    "Keep pushing forward!",
    "Believe in yourself!",
    "You are stronger than you think!",
    "Never give up!",
    "Every day is a new opportunity!",
    "加油！",
    "你是最棒的！",
    "坚持下去！",
    "不要放弃！",
];

// Function to adjust Digimon size based on screen width
function adjustDigimonSize() {
    const screenWidth = window.innerWidth;
    const digimonSize = screenWidth / 8; // 1/8th of the screen width
    digimonWrapper.style.width = `${digimonSize}px`;
    digimonWrapper.style.height = `${digimonSize}px`;
}

// Function to position the speech bubble above the Digimon
function positionSpeechBubble() {
    const digimonRect = digimonWrapper.getBoundingClientRect();
    const speechBubbleHeight = speechBubble.offsetHeight;
    speechBubble.style.top = `${window.scrollY + digimonRect.top - speechBubbleHeight - 10}px`; // Slight offset above
    speechBubble.style.left = `${window.scrollX + digimonRect.left + (digimonRect.width / 2) - (speechBubble.offsetWidth / 2)}px`;
}

// Function to show speaking animation
function showSpeakingAnimation() {
    clearInterval(walkInterval);
    isTalking = true;

    // Show random inspirational message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    message.textContent = randomMessage;
    positionSpeechBubble();

    // Display and animate the speech bubble
    speechBubble.style.opacity = 1;
    speechBubble.style.display = 'block';

    const speakAnimation = setInterval(() => {
        speakIndex = (speakIndex + 1) % speakImages.length;
        digimonSprite.src = speakImages[speakIndex];
    }, 300);

    // Hide the speech bubble after a delay
    setTimeout(() => {
        speechBubble.style.opacity = 0;
        setTimeout(() => {
            speechBubble.style.display = 'none';
            clearInterval(speakAnimation);
            isTalking = false;
            startWalking(); // Resume walking after talking
        }, 500);
    }, 3000);
}

// Function to update walking images based on direction
function animateWalk() {
    if (isTalking) return;
    const images = currentDirection === 'right' ? walkImages.right : walkImages.left;
    walkIndex = (walkIndex + 1) % images.length;
    digimonSprite.src = images[walkIndex];
}

// Function to start smoother walking animation with reduced speed
function startWalking() {
    if (walkInterval) clearInterval(walkInterval);
    walkInterval = setInterval(() => {
        currentLeft += currentDirection === 'right' ? 3 : -3; // Slower step size

        const containerWidth = container.offsetWidth;

        // Reverse direction if Digimon hits container boundaries (50px inset)
        if (currentLeft <= 50) {
            currentDirection = 'right';
            currentLeft = 50;
        } else if (currentLeft + digimonWrapper.offsetWidth >= containerWidth - 50) {
            currentDirection = 'left';
            currentLeft = containerWidth - digimonWrapper.offsetWidth - 50;
        }

        // Apply new position and animate
        digimonWrapper.style.left = `${currentLeft}px`;
        animateWalk();
        positionSpeechBubble();
    }, 60); // Slower interval for smoother animation
}

// Keydown event listener to manually move the Digimon
document.addEventListener('keydown', (event) => {
    if (isTalking) return;

    const containerHeight = container.offsetHeight;
    const containerWidth = container.offsetWidth;

    switch (event.key) {
        case 'ArrowUp':
            // Move up by 5 pixels, but ensure Digimon stays within bounds
            currentTop = Math.max(50, currentTop - 5);  // Prevent moving above the top
            break;
        case 'ArrowDown':
            // Move down by 5 pixels, but ensure Digimon stays within bounds
            currentTop = Math.min(containerHeight - digimonWrapper.offsetHeight - 50, currentTop + 5);  // Prevent moving below the bottom
            break;
        case 'ArrowLeft':
            // Move left by 5 pixels, but ensure Digimon stays within bounds
            currentLeft = Math.max(50, currentLeft - 5);  // Prevent moving beyond the left side
            break;
        case 'ArrowRight':
            // Move right by 5 pixels, but ensure Digimon stays within bounds
            currentLeft = Math.min(containerWidth - digimonWrapper.offsetWidth - 50, currentLeft + 5);  // Prevent moving beyond the right side
            break;
    }

    // Update Digimon's position
    digimonWrapper.style.left = `${currentLeft}px`;
    digimonWrapper.style.top = `${currentTop}px`;

    // Update the speech bubble position
    positionSpeechBubble();
});


// Event listener to trigger speaking animation on click
digimonWrapper.addEventListener('click', () => {
    if (!isTalking) showSpeakingAnimation();
});

// Adjust Digimon size on window resize
window.addEventListener('resize', adjustDigimonSize);
adjustDigimonSize(); // Initial size adjustment

// Start smoother and slower autonomous movement
startWalking();
