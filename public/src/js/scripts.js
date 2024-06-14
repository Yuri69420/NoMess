document.addEventListener("DOMContentLoaded", function() {
    // Countdown Timer Script
    var endDate = new Date("2024-11-15T20:30:00");

    function updateCountdown() {
        try {
            var now = new Date();
            var timeDiff = endDate.getTime() - now.getTime();

            if (timeDiff < 0) {
                throw new Error("The event has already started or the date is invalid.");
            }

            var days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            var hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

            document.getElementById("days").textContent = days;
            document.getElementById("hours").textContent = hours;
            document.getElementById("minutes").textContent = minutes;
            document.getElementById("seconds").textContent = seconds;
        } catch (error) {
            console.error(error);
            document.getElementById("countdown").textContent = "Countdown unavailable.";
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    function hideLoadingIndicator() {
        document.getElementById('videoContainer').innerHTML = '';
    }

    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(this);

        fetch('/register', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('formMessage').textContent = 'Registration successful!';
        })
        .catch(error => {
            console.error('Error during registration:', error);
            document.getElementById('formMessage').textContent = 'Registration failed. Please try again.';
        });
    });
});
