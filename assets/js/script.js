const baseURL = "http://localhost:3000"; // Base URL for JSON Server

// Utility function to fetch data
const fetchData = (endpoint, options = {}) => {
    return fetch(`${baseURL}/${endpoint}`, options).then(response => response.json());
};

// Function to show the authentication modal
const showAuthModal = () => {
    document.getElementById("auth-modal").classList.add("show");
};

// Display inventory
const displayInventory = () => {
    fetchData("cars").then(cars => {
        const carList = document.getElementById("car-list");
        carList.innerHTML = ""; // Clear previous inventory
        cars.forEach(car => {
            const priceInUSD = parseFloat(car.price);
            const priceInKES = (priceInUSD * 140).toFixed(2); // Convert to KES
            const carDiv = document.createElement("div");
            carDiv.innerHTML = `
                <h3>${car.make} ${car.model}</h3>
                <p>Price: KES ${priceInKES}</p>
                <img src="${car.image}" alt="${car.make} ${car.model}" width="200">
                <button class="details-button" data-id="${car.id}">Details</button>
                <button class="buy-button" data-id="${car.id}">Buy</button>
            `;
            carList.appendChild(carDiv);
        });

        // Add event listeners for the buttons
        document.querySelectorAll('.details-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const carId = event.target.getAttribute('data-id');
                showCarDetails(carId); // Show car details in modal
            });
        });

        document.querySelectorAll('.buy-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const carId = event.target.getAttribute('data-id');
                alert(`Buying car ID: ${carId}`);
            });
        });
    });
};

// Function to show car details in a modal
const showCarDetails = (carId) => {
    fetchData(`cars/${carId}`).then(car => {
        const carDetails = `
            <strong>Make:</strong> ${car.make}<br>
            <strong>Model:</strong> ${car.model}<br>
            <strong>Engine:</strong> ${car.engine || 'N/A'}<br>
            <strong>Transmission:</strong> ${car.transmission || 'N/A'}<br>
            <strong>Fuel Type:</strong> ${car["fuel type"] || 'N/A'}<br>
            <strong>Mileage:</strong> ${car.mileage || 'N/A'}<br>
            <strong>Type:</strong> ${car.type || 'N/A'}<br>
        `;
        document.getElementById("car-details").innerHTML = carDetails;
        document.getElementById("car-details-modal").classList.add("show");
    });
};

// Close car details modal
document.getElementById("close-car-details-modal").addEventListener("click", () => {
    document.getElementById("car-details-modal").classList.remove("show");
});

// Close car details modal when the close button is clicked
document.getElementById("close-details-button").addEventListener("click", () => {
    document.getElementById("car-details-modal").classList.remove("show");
});

// Handle user login
document.getElementById("login-form").addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    fetchData(`users?email=${email}&password=${password}`).then(users => {
        if (users.length > 0) {
            alert("Login successful!");
            document.getElementById("auth-modal").classList.remove("show"); // Hide modal
            displayInventory(); // Show inventory
        } else {
            alert("Invalid email or password.");
        }
    });
});

// Handle user registration
document.getElementById("register-form").addEventListener("submit", event => {
    event.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    // Check if user already exists
    fetchData(`users?email=${email }`).then(existingUsers => {
        if (existingUsers.length > 0) {
            alert("User  already exists. Please log in.");
        } else {
            // Register new user
            fetchData("users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            }).then(() => {
                alert("Registration successful! Please log in.");
                document.getElementById("auth-modal").classList.remove("show"); // Hide modal
            });
        }
    });
});

// Show splash screen on load
window.addEventListener("load", () => {
    const splashScreen = document.querySelector(".splash-screen");
    splashScreen.style.opacity = "1"; // Show splash screen
    setTimeout(() => {
        splashScreen.style.opacity = "0"; // Fade out splash screen
        setTimeout(() => {
            splashScreen.style.display = "none"; // Remove from view
            showAuthModal(); // Show the login/register modal after splash screen
        }, 500); // Match the duration of the fade out
    }, 2000); // Show for 2 seconds
});

// Initial call to display inventory
displayInventory();