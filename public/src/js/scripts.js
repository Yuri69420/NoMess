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

    // Form Validation and Submission Script
    document.getElementById('registrationForm').addEventListener('submit', function(event) {
        event.preventDefault();
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phoneNumber = document.getElementById('phoneNumber').value;
        var nationality = document.getElementById('nationality').value;
        var message = '';

        if (name === '' || email === '' || phoneNumber === '' || nationality === '') {
            message = 'All fields are required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            message = 'Please enter a valid email address.';
        } else if (!validatePhoneNumber(phoneNumber)) {
            message = 'Please enter a valid phone number.';
        } else {
            document.getElementById('formMessage').textContent = 'Submitting...';
            fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ name, email, phoneNumber, nationality }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                window.location.href = '/thankyou.html'; // Redirect to thankyou.html on success
            })
            .catch((error) => {
                console.error('Error:', error);
                document.getElementById('formMessage').textContent = 'Registration failed. Please try again.';
            });

            return; // Exit the function to prevent showing 'Registration successful!' prematurely
        }

        document.getElementById('formMessage').textContent = message;
    });

    function validatePhoneNumber(phoneNumber) {
        var phoneRegex = /^\+?[1-9]\d{1,14}$/; // International format
        return phoneRegex.test(phoneNumber);
    }

    // Video Loading Indicator Script
    function hideLoadingIndicator() {
        document.getElementById('videoContainer').innerHTML = '';
    }

    document.querySelector('video').addEventListener('loadeddata', hideLoadingIndicator);
});
/*
function loadCategory(category) {
    document.getElementById('gallery').innerHTML = 'Loading...';
    
    gapi.client.drive.files.list({
        q: `'YOUR_FOLDER_ID' in parents and name contains '${category}' and mimeType contains 'image/'`,
        fields: 'files(id, name, webContentLink, webViewLink)'
    }).then(function(response) {
        const files = response.result.files;
        if (files && files.length > 0) {
            displayImages(files);
        } else {
            document.getElementById('gallery').innerHTML = 'No images found.';
        }
    });
}

function displayImages(files) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '';

    files.forEach(file => {
        const img = document.createElement('img');
        img.src = file.webContentLink;
        img.alt = file.name;
        gallery.appendChild(img);
    });
}
*/