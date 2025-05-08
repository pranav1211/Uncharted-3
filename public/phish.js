document.addEventListener('DOMContentLoaded', function () {
    // Find all close buttons and ensure they're properly visible and functional
    const closeButtons = document.querySelectorAll('.close-fake-site');

    closeButtons.forEach(button => {
        // Make sure the button is visible
        button.style.display = 'block';

        // Add click event listener
        button.addEventListener('click', function (e) {
            // Find the parent fake-site element
            const fakeSite = this.closest('.fake-site');
            if (fakeSite) {
                fakeSite.style.display = 'none';
                console.log('Fake site closed!');

                // This is where the secret key functionality would be triggered
                // Secret key found!
            }
            e.stopPropagation();
        });
    });

    // Add resize event listener to ensure compatibility on window resize
    window.addEventListener('resize', function () {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        // Adjust elements if needed based on screen size
        if (screenWidth >= 1920 && screenHeight >= 1080) {
            // Desktop-specific adjustments
            console.log('Desktop resolution detected: 1920x1080');

            // Ensure close buttons are still properly positioned
            closeButtons.forEach(button => {
                button.style.top = '20px';
                button.style.right = '20px';
            });
        }
    });
});

// Add functionality for the brightness slider
document.getElementById('brightness-slider').addEventListener('input', function () {        
    const value = parseInt(this.value);

    // Calculate visibility based on proximity to the "sweet spot"
    const sweetSpot = 22; // The specific brightness level where text is visible
    const visibilityRange = 1; // How close to the sweet spot you need to be

    // Calculate distance from sweet spot (0 = perfect match, higher = further away)
    const distance = Math.abs(value - sweetSpot);

    // Calculate visibility factor (1 = fully visible, 0 = invisible)
    const visibilityFactor = distance <= visibilityRange ?
        1 - (distance / visibilityRange) : 0;

    // Apply visibility to text elements
    applyVisibility(visibilityFactor);
});

// Function to apply visibility to hidden elements
function applyVisibility(factor) {
    // Set text colors based on visibility factor
    // Background is always light gray
    const bgColor = "#f0f0f0";

    // Text color approaches background color as factor decreases
    // When factor = 1, text is black (#000000)
    // When factor = 0, text matches background (#f0f0f0)
    const textColor = calculateBlendedColor("#000000", bgColor, factor);
    const letterColor = calculateBlendedColor("#ff0000", "#fefefe", factor);

    // Update the elements
    document.getElementById('hidden-message').style.color = textColor;
    document.getElementById('hidden-message-container').style.backgroundColor = bgColor;
    document.getElementById('secret-letter').style.color = letterColor;
}

// Helper function to blend between two colors
function calculateBlendedColor(visibleColor, invisibleColor, factor) {
    // Parse the hex colors
    const r1 = parseInt(visibleColor.substring(1, 3), 16);
    const g1 = parseInt(visibleColor.substring(3, 5), 16);
    const b1 = parseInt(visibleColor.substring(5, 7), 16);

    const r2 = parseInt(invisibleColor.substring(1, 3), 16);
    const g2 = parseInt(invisibleColor.substring(3, 5), 16);
    const b2 = parseInt(invisibleColor.substring(5, 7), 16);

    // Blend the colors based on factor
    const r = Math.round(r2 + (r1 - r2) * factor);
    const g = Math.round(g2 + (g1 - g2) * factor);
    const b = Math.round(b2 + (b1 - b2) * factor);

    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Game state
const gameState = {
    currentLevel: 0,
    currentQuestion: {},
    score: 0,
    maxScore: 9,
    collectedLetters: {
        level1: {},
        level2: {},
        level3: {}
    },
    passwords: {
        level1: "OGA",
        level2: "RPS",
        level3: "XNT"
    }
};

// Initialize game
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('start-game').addEventListener('click', function () {
        startLevel(1);
    });
});

// Start specified level
function startLevel(level) {
    // Hide all sections
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });

    // Hide intro
    document.getElementById('game-intro').classList.remove('active');

    // Show selected level
    document.getElementById('level' + level).classList.add('active');

    // Reset current level questions
    document.querySelectorAll('#level' + level + ' .question-container').forEach((question, index) => {
        if (index === 0) {
            question.classList.add('active');
        } else {
            question.classList.remove('active');
        }
    });

    // Update game state
    gameState.currentLevel = level;
}

// Check answer for current question
// Check answer for current question
function checkAnswer(questionId, answer) {
    const correctAnswers = {
        'q1-1': 'phish',
        'q1-2': 'legit',
        'q1-3': 'phish',
        'q2-1': 'phish',
        'q2-2': 'legit',
        'q2-3': 'phish',
        'q3-1': 'phish',
        'q3-2': 'legit',
        'q3-3': 'phish'
    };

    const isCorrect = answer === correctAnswers[questionId];
    const isPhishing = correctAnswers[questionId] === 'phish';
    const feedbackElement = document.getElementById('feedback-' + questionId);

    if (isCorrect) {
        gameState.score++;
        feedbackElement.innerHTML = '<p>Correct! This is ' + (answer === 'phish' ? 'a phishing attempt' : 'legitimate') + '.</p>';
        feedbackElement.className = 'feedback correct';

        // Only show fake site if it's a phishing site AND the user correctly identified it
        if (answer === 'phish' && isPhishing) {
            setTimeout(() => {
                showFakeSite(questionId);
            }, 1000);
        } else {
            // If legitimate or not requiring fake site display, add letter directly
            addLetterToLevel(questionId);
            moveToNextQuestion(questionId);
        }
    } else {
        feedbackElement.innerHTML = '<p>Incorrect. This is actually ' + (correctAnswers[questionId] === 'phish' ? 'a phishing attempt' : 'legitimate') + '.</p>';
        feedbackElement.className = 'feedback incorrect';

        // Show feedback for a short moment before reloading the page
        feedbackElement.style.display = 'block';
        
        // Wait 2 seconds before reloading the page to allow user to see feedback
        setTimeout(() => {
            location.reload(); // Reload the entire page
        }, 2000);
        
        return; // Exit the function early since we're reloading
    }

    feedbackElement.style.display = 'block';
}

// Add letter to current level
function addLetterToLevel(questionId) {
    const letters = {
        'q1-1': 'O',
        'q1-2': 'A',
        'q1-3': 'G',
        'q2-1': 'R',
        'q2-2': 'P',
        'q2-3': 'S',
        'q3-1': 'X',
        'q3-2': 'T',
        'q3-3': 'N'
    };

    const level = questionId.split('-')[0].replace('q', '');
    const questionNum = questionId.split('-')[1];

    gameState.collectedLetters['level' + level][questionNum] = letters[questionId];
    updateCollectedLetters(level);
}

// Update collected letters display
function updateCollectedLetters(level) {
    const letters = gameState.collectedLetters['level' + level];
    let displayText = '';

    for (let i = 1; i <= 3; i++) {
        // Always show underscore regardless of whether letter is collected
        displayText += '';
    }

    document.getElementById('collected-letters-level' + level).textContent = displayText.trim();
}

// Move to next question
function moveToNextQuestion(questionId) {
    const level = questionId.split('-')[0].replace('q', '');
    const questionNum = parseInt(questionId.split('-')[1]);
    const nextQuestionNum = questionNum + 1;

    const currentQuestion = document.getElementById(questionId);
    const nextQuestion = document.getElementById('q' + level + '-' + nextQuestionNum);

    // Hide current question after a delay
    setTimeout(() => {
        currentQuestion.classList.remove('active');

        // If there's a next question, show it
        if (nextQuestion) {
            nextQuestion.classList.add('active');
        } else {
            // If no more questions, show password section
            document.getElementById('password-section-level' + level).style.display = 'block';
        }
    }, 1500);
}

// Show fake phishing site
function showFakeSite(questionId) {
    document.getElementById('fake-site-' + questionId).style.display = 'block';
}

// Close fake site
function closeFakeSite(questionId) {
    document.getElementById('fake-site-' + questionId).style.display = 'none';

    // Add letter to collected letters
    addLetterToLevel(questionId);

    // Move to next question
    moveToNextQuestion(questionId);
}

// Check password
function checkPassword(level) {
    const password = document.getElementById('password-input-level' + level).value.toUpperCase();
    const correctPassword = gameState.passwords['level' + level];
    const feedbackElement = document.getElementById('password-feedback-level' + level);


    if (password == correctPassword) {
        feedbackElement.innerHTML = '<p>Correct! Time portal opening...</p>';
        feedbackElement.className = 'feedback correct';

        // Show level completion
        setTimeout(() => {
            document.getElementById('password-section-level' + level).style.display = 'none';
            document.getElementById('level' + level + '-complete').style.display = 'block';
        }, 1500);
    } else {
        feedbackElement.innerHTML = '<p>Incorrect password. Try again.</p>';
        feedbackElement.className = 'feedback incorrect';
    }

    feedbackElement.style.display = 'block';
}

// Complete game
function completeGame() {
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.remove('active');
    });

    document.getElementById('game-complete').style.display = 'block';
}

// Reset game
function resetGame() {
    gameState.currentLevel = 0;
    gameState.score = 0;
    gameState.collectedLetters = {
        level1: {},
        level2: {},
        level3: {}
    };

    document.getElementById('game-complete').style.display = 'none';
    document.getElementById('game-intro').classList.add('active');

    // Reset all questions
    document.querySelectorAll('.question-container').forEach(question => {
        question.classList.remove('active');
    });

    // Reset all feedback
    document.querySelectorAll('.feedback').forEach(feedback => {
        feedback.style.display = 'none';
        feedback.innerHTML = '';
    });

    // Reset all fake sites
    document.querySelectorAll('.fake-site').forEach(site => {
        site.style.display = 'none';
    });

    // Reset all password sections
    document.querySelectorAll('.password-section').forEach(section => {
        section.style.display = 'none';
    });

    // Reset all level completion sections
    document.querySelectorAll('.level-complete').forEach(section => {
        section.style.display = 'none';
    });

    // Reset all password inputs
    document.querySelectorAll('.password-input').forEach(input => {
        input.value = '';
    });

    // Reset all collected letters displays
    for (let i = 1; i <= 3; i++) {
        document.getElementById('collected-letters-level' + i).textContent = '_ _ _';
    }
}

// Adjust brightness for hidden clues
function adjustBrightness(value, questionId) {
    const fakeSite = document.getElementById('fake-site-' + questionId);
    const hiddenText = fakeSite.querySelector('.hidden-bright-text');

    if (value > 80) {
        hiddenText.style.color = 'rgba(255, 255, 255, 0.8)';
    } else {
        hiddenText.style.color = 'rgba(255, 255, 255, 0.05)';
    }
}

// Add draggable functionality (more interactive than just hover)
document.addEventListener('DOMContentLoaded', function () {
    const box = document.getElementById('movable-box-q3-3');
    const hiddenContent = document.getElementById('hidden-content-q3-3');

    // Initially hide the content (make text transparent)
    hiddenContent.style.color = 'transparent';

    // Variables for tracking drag
    let isDragging = false;
    let offsetX, offsetY;
    let hasRevealed = false;

    // Mouse events for dragging
    box.addEventListener('mousedown', function (e) {
        isDragging = true;
        box.classList.add('dragging');

        // Calculate offset from the element's top-left corner
        const rect = box.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;

        // Move the box
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        box.style.position = 'absolute';
        box.style.left = x + 'px';
        box.style.top = y + 'px';

        // Reveal hidden content only when box is moved significantly
        const boxRect = box.getBoundingClientRect();
        const contentRect = hiddenContent.getBoundingClientRect();

        // Check if the box has been moved enough to reveal content
        // We'll check if there's a significant movement from the original position
        const originalX = parseFloat(getComputedStyle(box).left) || 0;
        const originalY = parseFloat(getComputedStyle(box).top) || 0;

        // If moved more than 50px in any direction, reveal the content
        if (Math.abs(x - originalX) > 30 || Math.abs(y - originalY) > 30) {
            hiddenContent.style.color = '#0ff'; // Make text visible
            hasRevealed = true;
        }
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;
            box.classList.remove('dragging');
        }
    });

    // Touch events for mobile devices
    box.addEventListener('touchstart', function (e) {
        isDragging = true;
        box.classList.add('dragging');

        const touch = e.touches[0];
        const rect = box.getBoundingClientRect();
        offsetX = touch.clientX - rect.left;
        offsetY = touch.clientY - rect.top;

        e.preventDefault();
    });

    document.addEventListener('touchmove', function (e) {
        if (!isDragging) return;

        const touch = e.touches[0];
        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;

        box.style.position = 'absolute';
        box.style.left = x + 'px';
        box.style.top = y + 'px';

        // Check if the box has been moved enough to reveal content
        // We'll check if there's a significant movement from the original position
        const originalX = parseFloat(getComputedStyle(box).left) || 0;
        const originalY = parseFloat(getComputedStyle(box).top) || 0;

        // If moved more than 30px in any direction, reveal the content
        if (Math.abs(x - originalX) > 30 || Math.abs(y - originalY) > 30) {
            hiddenContent.style.color = '#0ff'; // Make text visible
            hasRevealed = true;
        }

        e.preventDefault();
    });

    document.addEventListener('touchend', function () {
        if (isDragging) {
            isDragging = false;
            box.classList.remove('dragging');
        }
    });
});