// JavaScript to handle modals
document.addEventListener('DOMContentLoaded', () => {
    // Get all current and upcoming movie buttons and modals
    const movieButtons = document.querySelectorAll('.movie-button');
    const upcomingMovieButtons = document.querySelectorAll('.upcoming-movie-button');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-button');

    // Function to open a modal
    const openModal = (modal) => {
        modal.style.display = 'block';
    };

    // Function to close a modal
    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    // Add event listeners for current movie buttons
    movieButtons.forEach((button, index) => {
        button.addEventListener('click', () => openModal(modals[index]));
    });

    // Add event listeners for upcoming movie buttons
    upcomingMovieButtons.forEach((button, index) => {
        button.addEventListener('click', () => openModal(modals[movieButtons.length + index]));
    });

    // Add event listeners for close buttons
    closeButtons.forEach((button) => {
        button.addEventListener('click', () => closeModal(button.closest('.modal')));
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Find all trailer buttons
    const trailerButtons = document.querySelectorAll('.trailer-btn');

    // Add click event to each button
    trailerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoUrl = button.getAttribute('data-trailer-url');
            window.open(videoUrl, '_blank'); // Open the video in a new tab
        });
    });
});
document.querySelectorAll('.book-now-btn').forEach((button, index) => {
    button.addEventListener('click', function() {
        let movieModalId = `ticket-modal-movie-${index + 1}`;
        document.getElementById(movieModalId).style.display = 'block';
        // If you want to close the current movie modal when opening the ticket modal, uncomment the line below
        // this.closest('.modal').style.display = 'none';
        updateMovieModal(`movie-${index + 1}`, `https://www.omdbapi.com/?i=tt${index + 1}&apikey=`);
    });
});

// Close the respective ticket modal
document.querySelectorAll('[id^="close-ticket-modal-movie-"]').forEach(closeButton => {
  closeButton.addEventListener('click', function() {
      this.closest('.modal').style.display = 'none';
  });
});
document.addEventListener("DOMContentLoaded", function() {
    // Generate an array of the next 7 dates, starting from today
    let dates = [];
    let currentDate = new Date();
    for (let i = 0; i < 7; i++) {
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
        let formattedDate = `${day}.${month < 10 ? '0' + month : month}`;
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    // Function to disable past time buttons and set click event for message
    function disablePastTimeButtons(timeSlot, currentDate) {
        const timeButtons = timeSlot.querySelectorAll('.time-button');
        const currentTime = new Date();

        timeButtons.forEach(button => {
            const timeString = button.textContent.trim().split(" ")[0]; // Assuming format is "HH:MM ..."
            const [hours, minutes] = timeString.split(":").map(Number);
            let slotTime = new Date(currentDate);
            slotTime.setHours(hours, minutes, 0, 0);

            if (slotTime < currentTime) {
                button.disabled = true;
                button.addEventListener('click', () => {
                    alert('The movie has already started. You cannot purchase a ticket for this slot. Please select a new time slot.');
                });
            }
        });
    }

    // Select all the modals
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        const dateButtons = modal.querySelectorAll('.date-button');
        const locationButtons = modal.querySelectorAll('.location-button');
        const dateSelectionContainer = modal.querySelector('.date-selection-container');
        const timeSelectionContainer = modal.querySelector('.time-selection-container');
        const timeSlots = modal.querySelectorAll('.time-slot');

        // Update the date buttons in this modal
        dateButtons.forEach((button, index) => {
            if (dates[index]) { 
                button.textContent = dates[index];
                button.setAttribute('data-date', dates[index]);

                if(timeSlots[index]) { 
                    timeSlots[index].setAttribute('data-date', dates[index]);

                    // Disable past time buttons for the current date
                    if (index === 0) { // First date button is for the current date
                        disablePastTimeButtons(timeSlots[index], new Date());
                    }
                }
            }
        });

        // Function to show the date selection container
        function showDateSelection() {
            dateSelectionContainer.style.display = 'block';
        }

        // Function to show the time selection container and the appropriate time slots
        function showTimeSelection(event) {
            timeSlots.forEach(slot => slot.style.display = 'none');

            const selectedDate = event.target.getAttribute('data-date');
            const matchingTimeSlot = Array.from(timeSlots).find(slot => slot.getAttribute('data-date') === selectedDate);

            if (matchingTimeSlot) {
                matchingTimeSlot.style.display = 'flex';
            }

            timeSelectionContainer.style.display = 'block';
        }

        // Add click event listeners to each location button within the current modal
        locationButtons.forEach(button => {
            button.addEventListener('click', showDateSelection);
        });

        // Add click event listeners to each date button
        dateButtons.forEach(button => {
            button.addEventListener('click', showTimeSelection);
        });
    });
});

  var globalTotalPrice = 0;
   // Global counter for total tickets

  // Function to update ticket count
  // Function to update ticket count
function changeTicketCount(button, change) {
    var counterDiv = button.parentElement; 
    var input = counterDiv.querySelector('input[type="text"]');
    var currentValue = parseInt(input.value);
    var newValue = currentValue + change;
    if (modal) {
        globalTotalPrice = updateTotal(modal);
        updateBuyTicketModal(globalTotalPrice); // Update the buy ticket modal with the new total price
        checkAndToggleBuyButton(modal); // Check and toggle Buy Now button state
    }
    if (newValue >= 0) {
        // Update global ticket counter
        globalTicketCounter += change;

        // Check if the global ticket counter exceeds the limit
        if (globalTicketCounter > 10) {
            globalTicketCounter -= change; // Revert the change
            alert('A total of 10 tickets can be purchased at once. If you want to purchase tickets for a larger group, please contact moviereservationsite@email.com or call +358-XXX-XXX-XXX');
            return; // Prevent adding more tickets
        }

        // Update count if within the limit
        input.value = newValue;
        var modal = counterDiv.closest('.modal');
        if (modal) {
            globalTotalPrice = updateTotal(modal);
            updateBuyTicketModal(globalTotalPrice); // Update the buy ticket modal with the new total price
        }
    }
}
// Function to update seat buttons based on globalTicketCounter
function updateSeatButtons(modal) {
    var seats = modal.querySelectorAll('.seat-button.active');
    var totalTickets = globalTicketCounter;
    seats.forEach(function(seat, index) {
        if (index < totalTickets) {
            seat.disabled = false;
        } else {
            seat.disabled = true;
            seat.classList.remove('selected');
            seat.style.backgroundColor = '#FFFFFF'; // Reset color for deselected seats
        }
    });
}

var globalTicketCounter = 0;
// Function to calculate and update the total price for a given modal
function updateTotal(modal) {
    var adultPrice = 16.52;
    var childrenPrice = 11.92;
    var seniorPrice = 13.72;
    var studentPrice = 11.92;
    var wheelchairPrice = 11.92;

    var total = 0;

    // Safely calculating total
    total += calculatePrice(modal, '#adults', adultPrice);
    total += calculatePrice(modal, '#children', childrenPrice);
    total += calculatePrice(modal, '#seniors', seniorPrice);
    total += calculatePrice(modal, '#students', studentPrice);
    total += calculatePrice(modal, '#wheelchair', wheelchairPrice);

    // Update total
    var totalElement = modal.querySelector('#total');
    if (totalElement) {
        totalElement.value = `€${total.toFixed(2)}`;
    }

    return total;
}

// Helper function to safely calculate price for each ticket type
function calculatePrice(modal, selector, price) {
    var element = modal.querySelector(selector);
    return element ? parseInt(element.value) * price : 0;
}

// Attach event listeners to all + and - buttons and initialize the total for each modal
document.querySelectorAll('.modal').forEach(function(modal) {
    modal.querySelectorAll('.button').forEach(function(button) {
        button.onclick = function() {
            var change = button.textContent.trim() === '+' ? 1 : -1;
            changeTicketCount(button, change);
            updateTotal(modal); // Update the total price
        };
    });
    updateTotal(modal);
});
var countdownTimerInterval; // holds the interval ID of the timer
var countdownTimerElement; // holds the reference to the timer DOM element
function startCountdown(modal) {
    var timeLeft = 10 * 60; // 10 minutes in seconds
    var timerElement = document.createElement("div");
    timerElement.id = "countdown-timer";
    timerElement.style.display = "block"; // Make sure the timer is visible
    modal.appendChild(timerElement);

    var interval = setInterval(function() {
        timeLeft -= 1;
        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;
        

        if (timeLeft <= 0) {
            clearInterval(interval);
            location.reload(); // Refresh the page
        }
    }, 1000);

    return interval; // Return the interval ID for clearing later
}
// This function starts or updates the countdown timer
function startOrUpdateCountdown(modal) {
    var timeLeft = 10 * 60; // 10 minutes in seconds

    // Clear any existing timer intervals
    if (countdownTimerInterval) {
        clearInterval(countdownTimerInterval);
    }

    // Locate the timer element in the DOM
    var timerElement = modal.querySelector("#countdown-timer");
    
    // Start a new countdown timer
    countdownTimerInterval = setInterval(function() {
        timeLeft -= 1;
        var minutes = Math.floor(timeLeft / 60);
        var seconds = timeLeft % 60;
        timerElement.textContent = "Time left to finalize purchase: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;

        if (timeLeft <= 0) {
            clearInterval(countdownTimerInterval);
            location.reload(); // Refresh the page
        }
    }, 1000);
}

// Function to update the timer display
function updateTimerDisplay(timeLeft, timerElement) {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    timerElement.textContent = "Time left to finalize purchase: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
// JavaScript for Seat Selection with Dynamic Content and Seat Buttons
document.addEventListener("DOMContentLoaded", function() {
    var modals = document.querySelectorAll('.modal');
    var modalSeatStates = {}; // Object to store seat states for each modal

    // Function to generate random seat states
    function generateRandomSeatStates(totalSeats) {
        var activeSeats = Math.floor(Math.random() * (totalSeats + 1)); // Random number between 0 and totalSeats
        var seatStates = new Array(totalSeats).fill(false);
        for (let i = 0; i < activeSeats; i++) {
            let index;
            do {
                index = Math.floor(Math.random() * totalSeats);
            } while (seatStates[index]);
            seatStates[index] = true;
        }
        return seatStates;
    }
    function determineHallNumber(buttonText) {
        // Create a hash from the button text to determine the hall number
        let hash = 0;
        for (let i = 0; i < buttonText.length; i++) {
            hash = ((hash << 5) - hash) + buttonText.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash % 7) + 1; // Returns a number between 1 and 7
    }
    
    document.querySelectorAll('.modal').forEach(function(modal, modalIndex) {
        var timeButtons = modal.querySelectorAll('.time-button');
        modalSeatStates[modalIndex] = {}; // Initialize seat state storage for this modal
    
        timeButtons.forEach(function(button) {
            var buttonTextParts = button.textContent.trim().split(' ');
            var time = buttonTextParts[0]; // Extract the time part
            var totalSeats = parseInt(buttonTextParts[1].split('/')[1]);
            var seatStates = generateRandomSeatStates(totalSeats);
    
            // Calculate the percentage of active seats
            var activeSeats = seatStates.filter(state => state).length; // Count true values
            var activeSeatsPercentage = (activeSeats / totalSeats) * 100;
    
            // Determine the hall number
            var hallNumber = determineHallNumber(button.textContent);
    
            // Update the button text with hall number
            button.textContent = `Hall ${hallNumber} - ${time} ${activeSeats}/${totalSeats}`;
    
            // Apply low availability styling if active seats are <= 20% of total seats
            if (activeSeatsPercentage <= 20) {
                button.classList.add('low-availability');
            }
    
            // Store the seat states
            modalSeatStates[modalIndex][button.textContent] = seatStates;
        });
    
        // Add event listeners to time buttons
        timeButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                // Reset selectedSeats array and count when changing time slots
                selectedSeats = [];
                resetSeatSelection(modal);
    
                var timeButtonText = button.textContent.trim();
                updateSeatSelection(timeButtonText, modal, modalIndex);
            });
        });
    });
    

    // Function to update seat selection
    function updateSeatSelection(timeButtonText, modal, modalIndex) {
        var seatStates = modalSeatStates[modalIndex][timeButtonText];
        var seatSelectionContainer = modal.querySelector('.seat-selection-container');
        var seatSelectionHeader = seatSelectionContainer.querySelector('h3');
        var seatsContainer = modal.querySelector('.seats-container');
        var totalTickets = getTotalTickets(modal);
        var activeSeats = seatStates.filter(state => state).length; // Count of active seats
        var countdownTimer = startCountdown(modal);
        // Check if selected tickets exceed available active seats
        if (totalTickets > activeSeats) {
            alert('Not enough seats available for the selected time slot. Please select fewer tickets or choose a different time slot.');
            return; // Exit the function to prevent seat selection
        }
        if (countdownTimerInterval) {
            clearInterval(countdownTimerInterval);
        }
        
        startOrUpdateCountdown(modal);
        seatsContainer.innerHTML = '';
    
        var totalSeats = parseInt(timeButtonText.split('/')[1]);
        const seatsPerRow = 20;
        const numberOfRows = Math.ceil(totalSeats / seatsPerRow);
    
        // Create row labels and seat buttons
        for (let row = 0; row < numberOfRows; row++) {
            let rowLabel = document.createElement('div');
            rowLabel.className = 'row-label';
            rowLabel.textContent = 'Row ' + (row + 1);
            seatsContainer.appendChild(rowLabel);
    
            for (let seat = 0; seat < seatsPerRow; seat++) {
                let seatIndex = row * seatsPerRow + seat;
                if (seatIndex < totalSeats) {
                    let seatButton = document.createElement('button');
                    let isActive = seatStates[seatIndex];
                    seatButton.className = isActive ? 'seat-button active' : 'seat-button inactive';
                    seatButton.textContent = 'Seat ' + (seat + 1);
                    seatButton.dataset.seatId = `Row ${row + 1} Seat ${seat + 1}`; // Add seat identifier
    
                    if (isActive) {
                        seatButton.style.backgroundColor = '#FFFFFF'; // Initial color for active seats
    
                        seatButton.addEventListener('click', function() {
                            if (selectedSeats.length < totalTickets || seatButton.classList.contains('selected')) {
                                let seatId = seatButton.dataset.seatId;
                                let seatIndex = selectedSeats.indexOf(seatId);
    
                                if (seatIndex === -1) {
                                    selectedSeats.push(seatId); // Add seat if not already selected
                                    seatButton.style.backgroundColor = '#32527B'; // Selected color
                                    seatButton.classList.add('selected');
                                } else {
                                    selectedSeats.splice(seatIndex, 1); // Remove seat if already selected
                                    seatButton.style.backgroundColor = '#FFFFFF'; // Original color
                                    seatButton.classList.remove('selected');
                                }
    
                                updateBuyTicketModal(globalTotalPrice); // Update modal with current seat selections
                                checkAndToggleBuyButton(modal); // Check and toggle Buy Now button state
                            } else {
                                alert('You cannot select more seats than the number of tickets.');
                            }
                        });
                    }
    
                    seatsContainer.appendChild(seatButton);
                }
            }
        }
    
        // Check if the buy-ticket-section already exists, and create it if not
    var buyTicketSection = modal.querySelector('.buy-ticket-section');
    if (!buyTicketSection) {
        buyTicketSection = document.createElement('div');
        buyTicketSection.className = 'buy-ticket-section';
        seatSelectionContainer.appendChild(buyTicketSection); // Append buy-ticket-section to the seat-selection-container
    }
    
    // Remove any existing buy ticket buttons before adding a new one
    var existingButton = buyTicketSection.querySelector('.buy-ticket-button');
    if (existingButton) {
        buyTicketSection.removeChild(existingButton);
    }
    

    // Create the Buy Ticket button and append it to the buy-ticket-section
    var buyTicketButton = document.createElement('button');
    buyTicketButton.className = 'buy-ticket-button';
    buyTicketButton.textContent = 'Buy Ticket';
    buyTicketButton.addEventListener('click', function() {
        openBuyTicketModal();
        clearInterval(countdownTimer);
        var timerElement = modal.querySelector("#countdown-timer");
        if(timerElement) {
            timerElement.remove();
        }
        if (countdownTimerInterval) {
            clearInterval(countdownTimerInterval);
        }
        if (countdownTimerElement) {
            countdownTimerElement.textContent = ""; // Resets the text content
        }
    });
    buyTicketSection.appendChild(buyTicketButton); // Append the button to the buy-ticket-section

    // Display the seat selection container
    seatSelectionContainer.style.display = 'flex';
    }
    function resetSeatSelection(modal) {
        var seatsContainer = modal.querySelector('.seats-container');
        seatsContainer.innerHTML = ''; // Clear all existing seat buttons
    }
      
    // Function to get the total number of tickets
    function getTotalTickets(modal) {
        var adultTickets = parseInt(modal.querySelector('#adults').value) || 0;
        var childrenTickets = parseInt(modal.querySelector('#children').value) || 0;
        var seniorTickets = parseInt(modal.querySelector('#seniors').value) || 0;
        var studentTickets = parseInt(modal.querySelector('#students').value) || 0;
        var wheelchairTickets = parseInt(modal.querySelector('#wheelchair').value) || 0;
        return adultTickets + childrenTickets + seniorTickets + studentTickets + wheelchairTickets;
    }
    function checkAndToggleBuyButton(modal) {
        var totalTickets = getTotalTickets(modal);
        var buyTicketButton = modal.querySelector('.buy-ticket-button');
    
        if (selectedSeats.length === totalTickets) {
            buyTicketButton.disabled = false; // Enable the Buy Now button if the condition is met
        } else {
            buyTicketButton.disabled = true; // Disable the Buy Now button otherwise
        }
    }
});  
document.querySelectorAll('.modal').forEach(function(modal) {
    modal.querySelectorAll('.button').forEach(function(button) {
        button.onclick = function() {
            var change = button.textContent.trim() === '+' ? 1 : -1;
            changeTicketCount(button, change);
            updateTotal(modal); // Update the total price

            // After updating the total, recheck seat availability for the selected time slot
            var selectedTimeButton = modal.querySelector('.time-button.selected');
            if (selectedTimeButton) {
                updateSeatSelection(selectedTimeButton.textContent.trim(), modal, modalIndex);
            }
            checkAndToggleBuyButton(modal);
        };
    });
    // Initial setup
    updateSeatButtons(modal);
    updateTotal(modal);
});   

document.getElementById('confirm-ticket-button').addEventListener('click', function() {
    // Stop the timer when confirmation is clicked
    if (countdownTimerInterval) {
        clearInterval(countdownTimerInterval);
        var timerElement = document.getElementById("countdown-timer");
        if(timerElement) {
            timerElement.textContent = "Reservation confirmed"; // Update text or hide the timer
        }
    }
    // Additional confirmation actions...
});

  // Function to reset all buttons of a particular class to the initial color
  function resetButtonColors(buttonClass) {
      let buttons = document.querySelectorAll(buttonClass);
      buttons.forEach(button => {
        button.classList.remove('clicked');
      });
    }
    
    // Function to handle location button click
    function handleLocationClick(event) {
      resetButtonColors('.location-button');
      event.currentTarget.classList.add('clicked');
      // You can add more functionality here like showing the date-selection-container, etc.
    }
    
    // Function to handle date button click
    function handleDateClick(event) {
      resetButtonColors('.date-button');
      event.currentTarget.classList.add('clicked');
      // You can add more functionality here like showing the time-selection-container, etc.
    }
    
    // Function to handle time button click
    function handleTimeClick(event) {
      resetButtonColors('.time-button');
      event.currentTarget.classList.add('clicked');
      // You can add more functionality here if needed.
    }
    
    // Attach event listeners to the location buttons
    document.querySelectorAll('.location-button').forEach(button => {
      button.addEventListener('click', handleLocationClick);
    });
    
    // Attach event listeners to the date buttons
    document.querySelectorAll('.date-button').forEach(button => {
      button.addEventListener('click', handleDateClick);
    });
    
    // Attach event listeners to the time buttons within each time-slot
    document.querySelectorAll('.time-slot .time-button').forEach(button => {
      button.addEventListener('click', handleTimeClick);
    });  
  document.getElementById('userIcon').addEventListener('click', function() {
    var modal = document.getElementById("modal-user");
    modal.style.display = "block";

    // When the user clicks on <span> (x), close the modal
    document.getElementsByClassName("close")[0].onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});
function savePurchases() {
    if (typeof Storage !== 'undefined') {
        localStorage.setItem('userPurchases', JSON.stringify(userPurchases));
    } else {
        alert('Unfortunately, localStorage is not supported in your browser.');
    }
}

function loadPurchases() {
    if (typeof Storage !== 'undefined') {
        let storedPurchases = localStorage.getItem('userPurchases');
        if (storedPurchases) {
            userPurchases = JSON.parse(storedPurchases);
        } else {
            // If there's nothing in localStorage, initialize userPurchases
            userPurchases = {};
        }
    }
}
// Object to store user purchases keyed by email
let userPurchases = {};
function isValidEmail(email) {
    // This regular expression checks for the basic structure of an email: 
    // some text, an @ symbol, more text, a period, and some more text.
    return /\S+@\S+\.\S+/.test(email);
}



function isValidEmail(email) {
    // This regular expression checks for the basic structure of an email: 
    // some text, an @ symbol, more text, a period, and some more text.
    return /\S+@\S+\.\S+/.test(email);
}
function saveUserInfo(firstName, lastName, email) {
    const userInfo = {
        firstName,
        lastName,
        email,
        timestamp: new Date().getTime() // current time in milliseconds
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Set a timeout to automatically clear user info after 20 minutes
    setTimeout(() => {
        clearUserInfo();
    }, 1200000); // 20 minutes in milliseconds
}

// Function to clear user info
function clearUserInfo() {
    localStorage.removeItem('userInfo');
    // Clear the form and any user greetings or other user-specific UI elements
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    var greetingElement = document.getElementById('greeting');
    if(greetingElement) {
        greetingElement.textContent = '';
    }
    var signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.style.display = 'none';
    }
    // Update other UI elements as necessary
}
function loadUserInfo() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const timeElapsed = new Date().getTime() - userInfo.timestamp;
        if (timeElapsed < 1200000) { // 20 minutes haven't passed
            document.getElementById('firstName').value = userInfo.firstName;
            document.getElementById('lastName').value = userInfo.lastName;
            document.getElementById('email').value = userInfo.email;

            var greetingElement = document.getElementById('greeting');
            if (greetingElement) {
                greetingElement.textContent = 'Hi ' + userInfo.firstName + '!';
            }
            // Make sure the sign out button is visible as the user info is valid
            document.getElementById('signOutButton').style.display = 'block';
        } else {
            // If more than 20 minutes have passed, clear the user info
            clearUserInfo();
        }
    } else {
        // If there's no userInfo in localStorage, ensure the sign-out button is not visible
        document.getElementById('signOutButton').style.display = 'none';
    }
}

// Call this function when the page loads to check user info

// Call loadUserInfo on page load to check if the user is still logged in
document.addEventListener('DOMContentLoaded', loadUserInfo);

// Update your existing form submission to use saveUserInfo
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var email = document.getElementById('email').value;
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address");
        return;
    }
    saveUserInfo(firstName, lastName, email);
    // Other code to close modal or update UI
});
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting in the traditional way

    var firstName = document.getElementById('firstName').value;
    // You can retrieve lastName and email as well if needed

    // Update the greeting
    var greetingElement = document.getElementById('greeting');
    greetingElement.textContent = 'Hi ' + firstName + '!';
    var signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.style.display = 'block'; // Make the button visible
    }
    var showHistoryButton = document.getElementById('showHistoryButton');
    if (showHistoryButton) {
        showHistoryButton.style.display = 'block'; // Make the button visible
    }
    // Optionally, close the modal after submission
    document.getElementById('modal-user').style.display = 'none';
});
// Confirm Ticket Button Logic
document.getElementById('confirm-ticket-button').addEventListener('click', function() {
    if (!userEmail || !isValidEmail(userEmail)) {
        userEmail = prompt("Please enter your email to confirm your purchase:");
        if (!userEmail || !isValidEmail(userEmail)) {
            alert("Valid email is required to confirm purchase.");
            return;
        }
    }

    // Store the purchase history
    if (!userPurchases[userEmail]) {
        userPurchases[userEmail] = []; // Initialize if not present
    }
    userPurchases[userEmail].push(purchaseDetails);
    savePurchases(); 

    if (userEmail && isValidEmail(userEmail)) {
        // Capture and structure purchase details
        let purchaseDetails = {
            movieTitle: selectedMovieTitle,
            location: selectedLocation,
            date: selectedDate,
            time: selectedTime,
            hall: hallSelected,
            seats: selectedSeats.join(', '),
            totalPrice: globalTotalPrice.toFixed(2),
            purchaseDate: new Date().toLocaleString(), // Capture purchase date
        };

        // Add to userPurchases object
        if (!userPurchases[userEmail]) {
            userPurchases[userEmail] = []; // Initialize if not present
        }
        userPurchases[userEmail].push(purchaseDetails);

        // Save updated purchases
        savePurchases();
    }
});
document.getElementById('signOutButton').addEventListener('click', function() {
    // Ask the user if they want to sign out
    var confirmSignOut = confirm("Are you sure you want to sign out?");

    if (confirmSignOut) {
        // Clear user information if confirmed
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        userEmail = '';

        // Clear the greeting
        var greetingElement = document.getElementById('greeting');
        if(greetingElement) {
            greetingElement.textContent = ''; // Clear the greeting text
        }
        var showHistoryButton = document.getElementById('showHistoryButton');
        if (showHistoryButton) {
            showHistoryButton.style.display = 'none'; // Hide the button
        }
        // Optionally, provide feedback or close the modal
        alert("You have been signed out.");
        document.getElementById('modal-user').style.display = 'none';
        clearUserInfo();
    }
    // If the user selects "no", nothing happens, and they remain signed in
});

// Confirm Ticket Button Logic
document.getElementById('confirm-ticket-button').addEventListener('click', function() {
    if (!userEmail || !isValidEmail(userEmail)) {
        userEmail = prompt("Please enter your email to confirm your purchase:");
        if (!userEmail || !isValidEmail(userEmail)) {
            alert("Valid email is required to confirm purchase.");
            return;
        }
    }

    // Ensure to define purchaseDetails here before using it
    let purchaseDetails = {
        movieTitle: selectedMovieTitle,
        location: selectedLocation,
        date: selectedDate,
        time: selectedTime,
        hall: hallSelected,
        seats: selectedSeats.join(', '),
        totalPrice: globalTotalPrice.toFixed(2),
        purchaseDate: new Date().toLocaleString(), // Capture purchase date
    };

    // Then proceed to use it
    if (!userPurchases[userEmail]) {
        userPurchases[userEmail] = []; // Initialize if not present
    }
    userPurchases[userEmail].push(purchaseDetails);
    savePurchases();
});
// Save user info and timestamp
function saveUserInfo(firstName, lastName, email) {
    const userInfo = {
        firstName,
        lastName,
        email,
        timestamp: new Date().getTime() // current time in milliseconds
    };
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    // Set a timeout to automatically clear user info after 20 minutes
    setTimeout(() => {
        clearUserInfo();
    }, 1200000); // 20 minutes in milliseconds
}

// Clear user info from local storage and UI
function clearUserInfo() {
    localStorage.removeItem('userInfo');
    // Clear the form and any user greetings or other user-specific UI elements
    document.getElementById('firstName').value = '';
    document.getElementById('lastName').value = '';
    document.getElementById('email').value = '';
    var greetingElement = document.getElementById('greeting');
    if(greetingElement) {
        greetingElement.textContent = '';
    }
    // Update other UI elements as necessary
}

// Load user info from local storage
function loadUserInfo() {
    const userInfoString = localStorage.getItem('userInfo');
    if (userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        const timeElapsed = new Date().getTime() - userInfo.timestamp;
        if (timeElapsed < 1200000) { // 20 minutes haven't passed
            // Populate the form with user info
            document.getElementById('firstName').value = userInfo.firstName;
            document.getElementById('lastName').value = userInfo.lastName;
            document.getElementById('email').value = userInfo.email;
            // Update other UI elements as necessary
            var greetingElement = document.getElementById('greeting');
            greetingElement.textContent = 'Hi ' + userInfo.firstName + '!';
        } else {
            // If more than 20 minutes have passed, clear the user info
            clearUserInfo();
        }
    }
}
let userEmail = '';

document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting in the traditional way

    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    userEmail = document.getElementById('email').value; // Store the email
    if (!isValidEmail(userEmail)) {
        alert("Please enter a valid email address");
        return; // Exit the function early if the email is invalid
    }
    console.log(firstName, lastName, userEmail);
    // Optionally, close the modal after submission
    document.getElementById('modal-user').style.display = 'none';
});
document.getElementById('userForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting in the traditional way

    var firstName = document.getElementById('firstName').value;
    // You can retrieve lastName and email as well if needed

    // Update the greeting
    var greetingElement = document.getElementById('greeting');
    greetingElement.textContent = 'Hi ' + firstName + '!';
    var signOutButton = document.getElementById('signOutButton');
    if (signOutButton) {
        signOutButton.style.display = 'block'; // Make the button visible
    }
    var showHistoryButton = document.getElementById('showHistoryButton');
    if (showHistoryButton) {
        showHistoryButton.style.display = 'block'; // Make the button visible
    }
    // Optionally, close the modal after submission
    document.getElementById('modal-user').style.display = 'none';
});
// Confirm Ticket Button Logic
document.getElementById('confirm-ticket-button').addEventListener('click', function() {
    while (!userEmail || !isValidEmail(userEmail)) {
        userEmail = prompt("Please enter your email to confirm your purchase:");
        
        // If the user clicks cancel on the prompt (userEmail is null), return early
        if (userEmail === null) {
            alert("Email is required to confirm purchase. Operation canceled.");
            return;
        }

        // If the user provides an invalid email, continue the loop
        if (!isValidEmail(userEmail)) {
            alert("Please enter a valid email.");
        }
    }

    // Store the purchase history
    if (!userPurchases[userEmail]) {
        userPurchases[userEmail] = []; // Initialize if not present
    }
    userPurchases[userEmail].push(purchaseDetails);
    savePurchases(); 

    if (userEmail && isValidEmail(userEmail)) {
        // Capture and structure purchase details
        let purchaseDetails = {
            movieTitle: selectedMovieTitle,
            location: selectedLocation,
            date: selectedDate,
            time: selectedTime,
            hall: hallSelected,
            seats: selectedSeats.join(', '),
            totalPrice: globalTotalPrice.toFixed(2),
            purchaseDate: new Date().toLocaleString(), // Capture purchase date
        };

        // Add to userPurchases object
        if (!userPurchases[userEmail]) {
            userPurchases[userEmail] = []; // Initialize if not present
        }
        userPurchases[userEmail].push(purchaseDetails);

        // Save updated purchases
        savePurchases();
    }
});
document.getElementById('signOutButton').addEventListener('click', function() {
    // Ask the user if they want to sign out
    var confirmSignOut = confirm("Are you sure you want to sign out?");

    if (confirmSignOut) {
        // Clear user information if confirmed
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        userEmail = '';

        // Clear the greeting
        var greetingElement = document.getElementById('greeting');
        if(greetingElement) {
            greetingElement.textContent = ''; // Clear the greeting text
        }
        var showHistoryButton = document.getElementById('showHistoryButton');
        if (showHistoryButton) {
            showHistoryButton.style.display = 'none'; // Hide the button
        }
        // Optionally, provide feedback or close the modal
        alert("You have been signed out.");
        document.getElementById('modal-user').style.display = 'none';
        clearUserInfo();
    }
    // If the user selects "no", nothing happens, and they remain signed in
});
// Show Purchase History Button Logic
document.getElementById('showHistoryButton').addEventListener('click', function() {
    if (userEmail && userPurchases[userEmail]) {
        let historyContent = "<h3>Purchase History:</h3>";
        userPurchases[userEmail].forEach(purchase => {
            historyContent += `
                <div class="purchase-item">
                    <p><b>Movie:</b> ${purchase.movieTitle}</p>
                    <p><b>Date:</b> ${purchase.date}</p>
                    <p><b>Time:</b> ${purchase.time}</p>
                    <p><b>Hall:</b> ${purchase.hall}</p>
                    <p><b>Seats:</b> ${purchase.seats}</p>
                    <p><b>Total Price:</b> €${purchase.totalPrice}</p>
                    <p><b>Purchase Date:</b> ${purchase.purchaseDate}</p>
                </div>`;
        });
        alert(historyContent); // Consider replacing with a more user-friendly display
    } else {
        alert("No purchase history found or you are not signed in.");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const seeAllCurrentMovies = document.getElementById('seeAllCurrentMovies');
    const seeAllUpcomingMovies = document.getElementById('seeAllUpcomingMovies');
    const allMoviesModal = document.getElementById('allMoviesModal'); // No change needed here
    const moviesGrid = document.querySelector('.movies-grid');
    
    // Update the selector for the close button within the new modal structure
    const closeButton = allMoviesModal.querySelector('.see-all-modal-content .close-button');

    seeAllCurrentMovies.addEventListener('click', function () {
        populateMoviesGrid('current');
        allMoviesModal.style.display = 'block';
    });

    seeAllUpcomingMovies.addEventListener('click', function () {
        populateMoviesGrid('upcoming');
        allMoviesModal.style.display = 'block';
    });

    closeButton.addEventListener('click', function () {
        allMoviesModal.style.display = 'none';
    });

    function populateMoviesGrid(type) {
        // Clear existing content
        moviesGrid.innerHTML = '';

        // Select the source elements based on type
        let sourceElements;
        if (type === 'current') {
            sourceElements = document.querySelectorAll('.current-movies .movie');
        } else {
            sourceElements = document.querySelectorAll('.upcoming-movies .upcoming-movie');
        }

        // Clone and append each source element
        sourceElements.forEach(function (element) {
            const clone = element.cloneNode(true);
            moviesGrid.appendChild(clone);
        });
    }

    // Updated event delegation for movie buttons inside the modal
    moviesGrid.addEventListener('click', function (event) {
    // Check if the clicked element is a movie button or a child of it
        let targetElement = event.target;
        while (targetElement != null && !targetElement.classList.contains('movie-button') && !targetElement.classList.contains('upcoming-movie-button')) {
            targetElement = targetElement.parentElement;
        }

        if (targetElement) {
            const movieId = targetElement.parentElement.id; // Assuming the ID is on the parent element of the button
            const isUpcoming = targetElement.classList.contains('upcoming-movie-button'); // Check if it's an upcoming movie
            openMovieDetailModal(movieId, isUpcoming);
        }
    });
    function openMovieDetailModal(movieId, isUpcoming) {
        allMoviesModal.style.display = 'none';
    
        // Adjust the ID based on whether the movie is current or upcoming
        const prefix = isUpcoming ? 'upcoming-' : '';
        const detailModalId = `modal-${prefix}movie-${movieId.split('-').pop()}`;
    
        // Find the movie detail modal using its ID
        const detailModal = document.getElementById(detailModalId);
    
        if (detailModal) {
            // Display the movie detail modal
            detailModal.style.display = 'block';
    
            // Close button for the movie detail modal
            const closeDetailButton = detailModal.querySelector('.close-button');
    
            // Add event listener to close the movie detail modal
            closeDetailButton.addEventListener('click', function() {
                detailModal.style.display = 'none';
            });
        }
    }
});
document.querySelector('.search-input').addEventListener('input', performLiveSearch);
document.querySelector('.search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        performFullSearch();
    }
});
const movieApiUrls = {
    'movie-1': 'https://www.omdbapi.com/?i=tt1517268&apikey=cafc3dc5',
    'movie-2': 'https://www.omdbapi.com/?i=tt15398776&apikey=cafc3dc5',
    'movie-3': 'https://www.omdbapi.com/?i=tt9362722&apikey=cafc3dc5',
    'movie-4': 'https://www.omdbapi.com/?i=tt15789038&apikey=cafc3dc5',
    'movie-5': 'https://www.omdbapi.com/?i=tt14362112&apikey=cafc3dc5',
    'movie-6': 'https://www.omdbapi.com/?i=tt10545296&apikey=cafc3dc5',
    'movie-7': 'https://www.omdbapi.com/?i=tt6587046&apikey=cafc3dc5',
    // Add more movies here
    'upcoming-movie-1': 'https://www.omdbapi.com/?i=tt1695843&apikey=cafc3dc5',
    'upcoming-movie-2': 'https://www.omdbapi.com/?i=tt9663764&apikey=cafc3dc5',
    'upcoming-movie-3': 'https://www.omdbapi.com/?i=tt15239678&apikey=cafc3dc5',
    'upcoming-movie-4': 'https://www.omdbapi.com/?i=tt6166392&apikey=cafc3dc5',
    'upcoming-movie-5': 'https://www.omdbapi.com/?i=tt11304740&apikey=cafc3dc5',
    'upcoming-movie-6': 'https://www.omdbapi.com/?i=tt11762114&apikey=cafc3dc5'
    // Add more upcoming movies here
};
let searchDebounceTimeout;
function performLiveSearch() {
    clearTimeout(searchDebounceTimeout);
    searchDebounceTimeout = setTimeout(() => {
        const searchText = document.querySelector('.search-input').value.toLowerCase();
        let foundMovies = [];

        if (searchText) {
            Object.keys(movieApiUrls).forEach(movieKey => {
                fetchMovieData(movieKey, searchText, foundMovies, () => {
                    displayLiveSearchResults(foundMovies);
                });
            });
        } else {
            document.getElementById('live-search-results').innerHTML = ''; // Clear live search results
        }
    }, 300); // Debounce for 300 ms
}

function performFullSearch() {
    const searchText = document.querySelector('.search-input').value.toLowerCase();
    let foundMovies = [];

    Object.keys(movieApiUrls).forEach((movieKey, index, array) => {
        fetchMovieData(movieKey, searchText, foundMovies, () => {
            if (index === array.length - 1) {
                displaySearchResults(foundMovies);
            }
        });
    });
}

function fetchMovieData(movieKey, searchText, foundMovies, callback) {
    const apiUrl = movieApiUrls[movieKey];
    if (!apiUrl) {
        console.error('API URL not found for movie:', movieKey);
        callback();
        return;
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if ((data.Title && data.Title.toLowerCase().includes(searchText)) ||
                (data.Genre && data.Genre.toLowerCase().includes(searchText))) {
                const movieElement = createMovieElement(data, movieKey);
                foundMovies.push({ element: movieElement, type: data.Type });
            }
            callback();
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
            callback();
        });
}

function createMovieElement(movieData, movieKey, isLiveSearch = false) {
    const movieElement = document.createElement('div');
    movieElement.className = 'movie-box';
    movieElement.style.display = 'flex';
    movieElement.style.alignItems = 'flex-start'; // Align items to the start
    movieElement.style.marginBottom = '10px';

    const imageElement = document.createElement('img');
    imageElement.src = movieData.Poster;
    imageElement.alt = movieData.Title;
    imageElement.style.width = '30px'; // Adjust based on context
    imageElement.style.height = '50px';
    imageElement.style.marginRight = '10px';
    movieElement.appendChild(imageElement);

    const textContainer = document.createElement('div'); // Container for text details
    textContainer.style.flexGrow = '1'; // Allow it to fill the space

    const titleElement = document.createElement('h5');
    titleElement.textContent = movieData.Title;
    titleElement.className = 'movie-title';
    titleElement.style.fontSize = isLiveSearch ? '12px' : '18px'; // Adjust font size based on context
    textContainer.appendChild(titleElement);

    const releaseElement = document.createElement('h5');
    releaseElement.textContent = movieData.Year;
    releaseElement.className = 'movie-year';
    releaseElement.style.fontSize = '10px';
    textContainer.appendChild(releaseElement);

    const genreElement = document.createElement('h5');
    genreElement.textContent = movieData.Genre;
    genreElement.className = 'movie-genre';
    genreElement.style.fontSize = '10px';
    textContainer.appendChild(genreElement);

    const ageratingElement = document.createElement('h5');
    ageratingElement.textContent = movieData.Rated;
    ageratingElement.className = 'movie-rating';
    ageratingElement.style.fontSize = '10px';
    textContainer.appendChild(ageratingElement);

    movieElement.appendChild(textContainer); // Add the text container to the movie element

    movieElement.onclick = () => {
        openModal(`modal-${movieKey}`); // Use movieKey to form the modal ID
    };

    return movieElement;
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Modal not found:", modalId);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}
function displayLiveSearchResults(foundMovies) {
    const liveSearchContainer = document.getElementById('live-search-results');
    liveSearchContainer.innerHTML = '';

    foundMovies.forEach(({ element }) => {
        const clonedElement = element.cloneNode(true);
        clonedElement.onclick = element.onclick; // Copy the onclick event
        liveSearchContainer.appendChild(clonedElement);
    });
}
function displaySearchResults(foundMovies) {
    const searchModalContainer = document.getElementById('search-modal-container');
    searchModalContainer.innerHTML = `
    <div class="full-screen-modal show" style="width: 100vw; position: absolute; top: 10; left: 0;">
            <span class="close-button">&times;</span>
            <div class="search-modal-content" style="display: grid; grid-template-columns: 1fr;"></div>
        </div>`;

    const searchModalContent = searchModalContainer.querySelector('.search-modal-content');

    if (foundMovies.length === 0) {
        searchModalContent.innerHTML = 'No search found';
    } else {
        foundMovies.forEach(({ element, type }) => {
            // Style for movie box
            element.classList.add('movie-box');
            element.style.height = 'auto';
            element.style.display = 'flex';
            element.style.height = '170px';
            element.style.backgroundColor = '#232323';
            element.style.borderRadius = '20px';
            element.style.alignItems = 'center';
            element.style.marginBottom = '10px'; // Adds space between the boxes
            

    // Responsive width
    if (window.innerWidth < 768) { // Adjust breakpoint as needed
        element.style.width = '90%'; // Full width for smaller screens
    } else {
        element.style.width = '1450px'; 
    }
    
            // Style for the image
            const img = element.querySelector('img');
            if (img) {
                img.style.width = '114px';
                img.style.height = '171px';
                img.style.marginRight = '30px';
                img.style.objectFit = 'contain';
            }
            const title = element.querySelector('.movie-title');
            if (title) {
                title.style.fontSize = '18px';
            }
            // Add the modified element to the modal content
            searchModalContent.appendChild(element);
        });
        const totalHeight = searchModalContent.scrollHeight;
    if (totalHeight < window.innerHeight * 0.9) {
        searchModalContainer.style.height = totalHeight + 'px';
    } else {
        searchModalContainer.style.height = '90vh';
    }

    }

    // Close button functionality
    const closeButton = searchModalContainer.querySelector('.close-button');
    closeButton.onclick = () => {
        searchModalContainer.innerHTML = '';
    };
} 

function openMovieModal(movieModalId) {
    const modal = document.getElementById(movieModalId);
    if (modal) {
        modal.style.display = 'block';
    }
}


// Variables to store user selections
let selectedLocation = '';
let selectedDate = '';
let selectedTime = '';
let hallSelected = '';
let selectedSeats = []; // Array to store selected seat details
let selectedMovieTitle = ''; // Variable to store selected movie title


// Function to update the modal content
function updateBuyTicketModal(totalPrice) {
    let modalContent = `
        <p>Movie: ${selectedMovieTitle}</p>
        <p>Location: ${selectedLocation}</p>
        <p>Date: ${selectedDate}</p>
        <p>Time: ${selectedTime}</p>
        <p>Hall: ${hallSelected}</p>
        <p>Number of Tickets: ${globalTicketCounter}</p>
        <p>Total Price: €${totalPrice.toFixed(2)}</p>
        <p>Seats: ${selectedSeats.join(', ')}</p>
    `;
    document.getElementById('buy-ticket-modal-content').innerHTML = modalContent;
}

function openBuyTicketModal() {
    var buyTicketModal = document.getElementById('buy-ticket-modal');
    buyTicketModal.style.display = 'block';
    updateBuyTicketModal(globalTotalPrice); // Update modal with the current selections
    var modals = document.querySelectorAll('.modal');
    var movieModal = document.getElementById(modalId);
    var movieTitleElement = movieModal.querySelector('.movie-title');
    if (movieTitleElement) {
        selectedMovieTitle = movieTitleElement.textContent.trim(); // Set the movie title
    }
    modals.forEach(function(modal) {
        updateTotal(modal); // Update the total price
        updateSeatButtons(modal); // Update the seat buttons
        checkAndToggleBuyButton(modal); // Check and toggle Buy Now button state
    });
}
document.addEventListener("DOMContentLoaded", function() {
    // ... existing initialization code ...
    var closeBtn = document.getElementById('close-buy-ticket-modal');
    closeBtn.addEventListener('click', function() {
        var buyTicketModal = document.getElementById('buy-ticket-modal');
        buyTicketModal.style.display = 'none';
    });
    var confirmTicketButton = document.getElementById('confirm-ticket-button');
    var confirmationModal = document.getElementById('confirmation-modal');

    confirmTicketButton.addEventListener('click', function() {
        // Show confirmation modal
        confirmationModal.style.display = 'block';

        // Wait for 5 seconds before hiding the modal and refreshing the page
        setTimeout(function() {
            confirmationModal.style.display = 'none';
            location.reload(); // Refreshes the page
        }, 2500);
    });
});
document.getElementById('confirm-ticket-button').addEventListener('click', function() {
    while (true) {
        // Prompt for email if it's not set or invalid
        if (!userEmail || !isValidEmail(userEmail)) {
            userEmail = prompt("Please enter your email to confirm your purchase:");

            // Check if the provided email is valid
            if (userEmail && isValidEmail(userEmail)) {
                break; // Exit loop if valid email is provided
            } else {
                alert("Please provide a valid email address ending with .com.");
            }
        } else {
            break; // If a valid email is already set, exit the loop
        }
    }

    // Now that we have the email, proceed with showing the confirmation modal
    var confirmationModal = document.getElementById('confirmation-modal');
    confirmationModal.style.display = 'block';

    // Update the confirmation message with the email
    let confirmationMessage = `A summary of your purchase and your tickets have been sent to your email: ${userEmail}. Thank you for purchasing from us!`;
    document.querySelector("#confirmation-modal .modal-content").innerHTML += `<p>${confirmationMessage}</p>`;
});
// Example event listeners to update the selected values
document.querySelectorAll('.location-button').forEach(button => {
    button.addEventListener('click', function() {
        selectedLocation = this.textContent.trim();
        updateBuyTicketModal();
    });
});
document.querySelectorAll('.date-button').forEach(button => {
    button.addEventListener('click', function() {
        selectedDate = this.textContent.trim();
        updateBuyTicketModal();
    });
});
document.querySelectorAll('.time-button').forEach(button => {
    button.addEventListener('click', function() {
        // Extract only the time part from the button's text content
        var buttonTextParts = this.textContent.trim().split(' ');
        selectedTime = buttonTextParts[3]; // Assign the time part to selectedTime

        // Update the Buy Ticket modal with the new time selection
        updateBuyTicketModal(globalTotalPrice);
    });
});
document.querySelectorAll('.time-button').forEach(button => {
    button.addEventListener('click', function() {
        // Extract only the time part from the button's text content
        var buttonTextParts = this.textContent.trim().split(' ');
        hallSelected = buttonTextParts[0] + ' ' + buttonTextParts[1]; // Assign the time part to selectedTime

        // Update the Buy Ticket modal with the new time selection
        updateBuyTicketModal(globalTotalPrice);
    });
});
// Similar event listeners for date, time, and seat selections
// ...

// Example of seat selection logic
// Example of seat selection logic
document.querySelectorAll('.seat-button').forEach(button => {
    button.addEventListener('click', function() {
        // Assuming the seat info is correctly labeled in the button's text
        let seatInfo = this.textContent.trim(); // e.g., "Seat 5"
        let seatRow = this.parentElement.querySelector('.row-label').textContent.trim(); // e.g., "Row 3"
        let fullSeatInfo = `${seatRow} ${seatInfo}`; // Combine to form "Row 3 Seat 5"

        let seatIndex = selectedSeats.indexOf(fullSeatInfo);

        if (seatIndex === -1) {
            selectedSeats.push(fullSeatInfo); // Add seat if not already selected
        } else {
            selectedSeats.splice(seatIndex, 1); // Remove seat if already selected
        }

        updateBuyTicketModal(globalTotalPrice); // Update modal with current seat selections
    });
});


document.querySelectorAll('.time-button').forEach(button => {
    button.addEventListener('click', function() {
        var seatSelectionContainer = this.closest('.modal').querySelector('.seat-selection-container');

        if (seatSelectionContainer) {
            // Scroll to the seat selection container
            seatSelectionContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

            addBounceEffect(seatSelectionContainer);
        }
    });
});

function addBounceEffect(element) {
    // Add bounce effect class
    element.classList.add('bounce-effect');

    // Optional: Remove the class after the animation completes
    setTimeout(() => {
        element.classList.remove('bounce-effect');
    }, 1000); // The timeout should match the duration of the animation
}

// Call this function when the seat selection section is initially displayed
function onSeatSelectionDisplay() {
    var seatSelectionContainer = document.querySelector('.seat-selection-container');
    if (seatSelectionContainer) {
        addBounceEffect(seatSelectionContainer);
    }
}

// Example of calling the function when the modal is displayed
// You might need to adjust this part based on how your modal display logic works
onSeatSelectionDisplay();

function updateMovieInfo(movieId, apiUrl) {
    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Find the elements in the DOM
            const currentMovieModal = document.getElementById(movieId);
            const movieDiv = document.getElementById(movieId);
            const titleElement = movieDiv.querySelector('.title-year h5');
            const yearElement = movieDiv.querySelector('.m-year');
            const imageElement = movieDiv.querySelector('.movie-button img');
            const image1Element = movieDiv.querySelector('.upcoming-movie-button img');

            // Update the elements with data from the API
            titleElement.textContent = data.Title;
            yearElement.textContent = data.Year;
            if (imageElement) {
                imageElement.src = data.Poster;
                imageElement.alt = data.Title;
            } else {
                console.error('Movie button image not found');
            }
            
            if (image1Element) {
                image1Element.src = data.Poster;
                image1Element.alt = data.Title;
            } else {
                console.error('Upcoming movie button image not found');
            }
        const releaseDateElement = movieDiv.querySelector('.release-date');
            const ageRatingElement = movieDiv.querySelector('.age-rating');
            const genreElement = movieDiv.querySelector('.genre');

            if (releaseDateElement && ageRatingElement && genreElement) {
                releaseDateElement.textContent = 'Release Date: ' + data.Released;
                ageRatingElement.textContent = 'Age Rating: ' + data.Rated;
                genreElement.textContent = 'Genre: ' + data.Genre;
            }
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
}

// Example usage for movie-1
updateMovieInfo('movie-1', 'https://www.omdbapi.com/?i=tt1517268&apikey=cafc3dc5');
updateMovieInfo('movie-2', 'https://www.omdbapi.com/?i=tt15398776&apikey=cafc3dc5');
updateMovieInfo('movie-3', 'https://www.omdbapi.com/?i=tt9362722&apikey=cafc3dc5');
updateMovieInfo('movie-4', 'https://www.omdbapi.com/?i=tt15789038&apikey=cafc3dc5');
updateMovieInfo('movie-5', 'https://www.omdbapi.com/?i=tt14362112&apikey=cafc3dc5');
updateMovieInfo('movie-6', 'https://www.omdbapi.com/?i=tt10545296&apikey=cafc3dc5');
updateMovieInfo('movie-7', 'https://www.omdbapi.com/?i=tt6587046&apikey=cafc3dc5');
updateMovieInfo('upcoming-movie-1', 'https://www.omdbapi.com/?i=tt1695843&apikey=cafc3dc5');
updateMovieInfo('upcoming-movie-2', 'https://www.omdbapi.com/?i=tt9663764&apikey=cafc3dc5');
updateMovieInfo('upcoming-movie-3', 'https://www.omdbapi.com/?i=tt15239678&apikey=cafc3dc5');
updateMovieInfo('upcoming-movie-4', 'https://www.omdbapi.com/?i=tt6166392&apikey=cafc3dc5');
updateMovieInfo('upcoming-movie-5', 'https://www.omdbapi.com/?i=tt11304740&apikey=cafc3dc5');
updateMovieInfo('upcoming-movie-6', 'https://www.omdbapi.com/?i=tt11762114&apikey=cafc3dc5');
function updateMovieModal(movieId, apiUrl) {
    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Try to find the current movie modal
            const currentMovieModal = document.getElementById(movieId);

            // Function to update modal content
            function updateModalContent(modal) {
                const titleElement = modal.querySelector('.movie-title');
                const yearElement = modal.querySelector('.year');
                const genreElement = modal.querySelector('.details-text');
                const durationElement = modal.querySelector('.duration');
                const ratingElement = modal.querySelector('.age-rating');
                const synopsisElement = modal.querySelector('.plot');
                const actorElement = modal.querySelector('.actors');
                const directorElement = modal.querySelector('.director');
                const ratesourceElement = modal.querySelector('.source');
                const rateElement = modal.querySelector('.rates');

                titleElement.textContent = data.Title;
                yearElement.textContent = data.Released;
                genreElement.textContent = data.Genre;
                durationElement.textContent = data.Runtime;
                ratingElement.textContent = data.Rated;
                synopsisElement.textContent = data.Plot;
                actorElement.textContent = data.Actors;
                directorElement.textContent = data.Director;
                // Assuming 'data.Source' and 'data.Value' are part of an array of Ratings
                ratesourceElement.textContent = data.Ratings?.[0]?.Source || '';
                rateElement.textContent = data.Ratings?.[0]?.Value || '';
            }

            // Update current movie modal if it exists
            if (currentMovieModal) {
                updateModalContent(currentMovieModal);
            } else {
                console.error(`Current movie modal with ID movieId not found.`);
            }

            // Update upcoming movie modal if it exists
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
}


// Example usage for different movies
updateMovieModal('modal-movie-1', 'https://www.omdbapi.com/?i=tt1517268&apikey=cafc3dc5');
updateMovieModal('modal-movie-2', 'https://www.omdbapi.com/?i=tt15398776&apikey=cafc3dc5');
updateMovieModal('modal-movie-3', 'https://www.omdbapi.com/?i=tt9362722&apikey=cafc3dc5');
updateMovieModal('modal-movie-4', 'https://www.omdbapi.com/?i=tt15789038&apikey=cafc3dc5');
updateMovieModal('modal-movie-5', 'https://www.omdbapi.com/?i=tt14362112&apikey=cafc3dc5');
updateMovieModal('modal-movie-6', 'https://www.omdbapi.com/?i=tt10545296&apikey=cafc3dc5');
updateMovieModal('modal-movie-7', 'https://www.omdbapi.com/?i=tt6587046&apikey=cafc3dc5');
updateMovieModal('modal-upcoming-movie-1', 'https://www.omdbapi.com/?i=tt1695843&apikey=cafc3dc5');
updateMovieModal('modal-upcoming-movie-2', 'https://www.omdbapi.com/?i=tt9663764&apikey=cafc3dc5');
updateMovieModal('modal-upcoming-movie-3', 'https://www.omdbapi.com/?i=tt15239678&apikey=cafc3dc5');
updateMovieModal('modal-upcoming-movie-4', 'https://www.omdbapi.com/?i=tt6166392&apikey=cafc3dc5');
updateMovieModal('modal-upcoming-movie-5', 'https://www.omdbapi.com/?i=tt11304740&apikey=cafc3dc5');
updateMovieModal('modal-upcoming-movie-6', 'https://www.omdbapi.com/?i=tt11762114&apikey=cafc3dc5');

// ... similar calls for other movie modals

var modalStack = []; // Stack to keep track of open modals

// Function to open a modal
function openModal(modalId) {
    closeModal(); // Close any currently open modal
    var modal = document.getElementById(modalId);
    modal.style.display = 'block'; // Show the modal

    modalStack.push(modalId); // Add modal to the stack

    // Push a new state to history if this is a new modal
    if (!history.state || history.state.modal !== modalId) {
        history.pushState({ modal: modalId }, '');
    }
}

// Function to close the currently open modal
function closeModal() {
    var modals = document.querySelectorAll('.modal');
    modals.forEach(function(modal) {
        modal.style.display = 'none'; // Hide the modal
    });
}

// Event listener for the back button
window.onpopstate = function(event) {
    if (modalStack.length > 0) {
        var lastModalId = modalStack.pop(); // Remove the last opened modal from the stack
        closeModal();
        if (modalStack.length > 0) {
            var prevModalId = modalStack[modalStack.length - 1];
            document.getElementById(prevModalId).style.display = 'block'; // Show the previous modal
        }
    }
};

// Event listeners for opening main movie modals
document.querySelectorAll('.movie-button').forEach(function(button, index) {
    button.addEventListener('click', function() {
        openModal('modal-movie-' + (index + 1)); // Open the corresponding movie modal
    });
});

// Event listeners for opening ticket modals from within movie modals
document.querySelectorAll('.modal').forEach(function(modal, index) {
    modal.addEventListener('click', function(event) {
        if (event.target.classList.contains('ticket-button')) {
            openModal('ticket-modal-movie-' + (index + 1)); // Open the corresponding ticket modal
        }
    });
});
function updateTicketMovieModal(modalId, apiUrl) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Select the modal and the title element within it
            const modal = document.getElementById(modalId);
            const titleElement = modal.querySelector('.movie-title-modal');

            // Update the title element with the movie title
            if (titleElement) {
                titleElement.textContent = data.Title || 'Title not available';
            }
        })
        .catch(error => {
            console.error('Error fetching movie data:', error);
        });
}
updateTicketMovieModal('ticket-modal-movie-1', 'https://www.omdbapi.com/?i=tt1517268&apikey=cafc3dc5');
updateTicketMovieModal('ticket-modal-movie-2', 'https://www.omdbapi.com/?i=tt15398776&apikey=cafc3dc5');
updateTicketMovieModal('ticket-modal-movie-3', 'https://www.omdbapi.com/?i=tt9362722&apikey=cafc3dc5');
updateTicketMovieModal('ticket-modal-movie-4', 'https://www.omdbapi.com/?i=tt15789038&apikey=cafc3dc5');
updateTicketMovieModal('ticket-modal-movie-5', 'https://www.omdbapi.com/?i=tt14362112&apikey=cafc3dc5');
updateTicketMovieModal('ticket-modal-movie-6', 'https://www.omdbapi.com/?i=tt10545296&apikey=cafc3dc5');
updateTicketMovieModal('ticket-modal-movie-7', 'https://www.omdbapi.com/?i=tt6587046&apikey=cafc3dc5');