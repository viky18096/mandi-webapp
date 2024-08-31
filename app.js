let tg = window.Telegram.WebApp;

tg.expand();

const VEGETABLES = ['Tomatoes', 'Cucumbers', 'Carrots', 'Lettuce', 'Potatoes', 'Onions'];
let farmerListings = {};
let customerSubscriptions = {};

function selectUserType(type) {
    document.getElementById('user-type-selection').style.display = 'none';
    if (type === 'farmer') {
        document.getElementById('farmer-section').style.display = 'block';
    } else {
        document.getElementById('customer-section').style.display = 'block';
    }
}

// Farmer functions
function showAddListingForm() {
    const form = document.getElementById('add-listing-form');
    form.style.display = 'block';
    form.innerHTML = `
        <div class="space-y-4">
            <select id="vegetable-select" class="w-full p-2 border rounded">
                ${VEGETABLES.map(veg => `<option value="${veg}">${veg}</option>`).join('')}
            </select>
            <input type="number" id="quantity" placeholder="Quantity (kg)" class="w-full p-2 border rounded">
            <input type="number" id="price" placeholder="Price per kg" class="w-full p-2 border rounded">
            <input type="text" id="contact" placeholder="Contact information" class="w-full p-2 border rounded">
            <button onclick="addListing()" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add/Update Listing</button>
        </div>
    `;
}

function addListing() {
    const vegetable = document.getElementById('vegetable-select').value;
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const contact = document.getElementById('contact').value;

    if (!farmerListings[tg.initDataUnsafe.user.id]) {
        farmerListings[tg.initDataUnsafe.user.id] = {};
    }

    farmerListings[tg.initDataUnsafe.user.id][vegetable] = { quantity, price, contact };
    alert('Listing added/updated successfully!');
    viewMyListings();
}

function viewMyListings() {
    const listings = farmerListings[tg.initDataUnsafe.user.id] || {};
    const listingsDiv = document.getElementById('my-listings');
    listingsDiv.innerHTML = '<h3 class="text-xl font-bold mb-4">My Listings</h3>';

    for (const [veg, data] of Object.entries(listings)) {
        listingsDiv.innerHTML += `
            <div class="bg-white p-4 rounded shadow mb-4">
                <h4 class="font-semibold">${veg}</h4>
                <p>${data.quantity}kg at $${data.price}/kg</p>
                <p class="text-sm text-gray-600">Contact: ${data.contact}</p>
            </div>
        `;
    }
}

// Customer functions
function browseVegetables() {
    const listingsDiv = document.getElementById('vegetable-listings');
    listingsDiv.innerHTML = '<h3 class="text-xl font-bold mb-4">Available Vegetables</h3>';

    for (const veg of VEGETABLES) {
        const availableListings = Object.values(farmerListings)
            .filter(farmerListing => farmerListing[veg])
            .map(farmerListing => farmerListing[veg]);

        if (availableListings.length > 0) {
            listingsDiv.innerHTML += `<h4 class="text-lg font-semibold mt-4 mb-2">${veg}</h4>`;
            for (const listing of availableListings) {
                listingsDiv.innerHTML += `
                    <div class="bg-white p-4 rounded shadow mb-4">
                        <p>${listing.quantity}kg at $${listing.price}/kg</p>
                        <p class="text-sm text-gray-600">Contact: ${listing.contact}</p>
                    </div>
                `;
            }
        }
    }
}

function showSearchForm() {
    document.getElementById('search-form').style.display = 'block';
}

function searchProduce() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const listingsDiv = document.getElementById('vegetable-listings');
    listingsDiv.innerHTML = '<h3>Search Results</h3>';

    for (const veg of VEGETABLES) {
        if (veg.toLowerCase().includes(searchTerm)) {
            const availableListings = Object.values(farmerListings)
                .filter(farmerListing => farmerListing[veg])
                .map(farmerListing => farmerListing[veg]);

            if (availableListings.length > 0) {
                listingsDiv.innerHTML += `<h4>${veg}</h4>`;
                for (const listing of availableListings) {
                    listingsDiv.innerHTML += `
                        <p>${listing.quantity}kg at $${listing.price}/kg. Contact: ${listing.contact}</p>
                    `;
                }
            }
        }
    }
}

function manageSubscriptions() {
    const subscriptionDiv = document.getElementById('subscription-management');
    subscriptionDiv.style.display = 'block';
    subscriptionDiv.innerHTML = '<h3 class="text-xl font-bold mb-4">Manage Subscriptions</h3>';

    subscriptionDiv.innerHTML += '<div class="space-y-2">';
    for (const veg of VEGETABLES) {
        const isChecked = customerSubscriptions[tg.initDataUnsafe.user.id]?.includes(veg) ? 'checked' : '';
        subscriptionDiv.innerHTML += `
            <label class="flex items-center space-x-2">
                <input type="checkbox" value="${veg}" ${isChecked} onchange="updateSubscription(this)" class="form-checkbox">
                <span>${veg}</span>
            </label>
        `;
    }
    subscriptionDiv.innerHTML += '</div>';
}

function updateSubscription(checkbox) {
    const userId = tg.initDataUnsafe.user.id;
    if (!customerSubscriptions[userId]) {
        customerSubscriptions[userId] = [];
    }

    if (checkbox.checked) {
        customerSubscriptions[userId].push(checkbox.value);
    } else {
        customerSubscriptions[userId] = customerSubscriptions[userId].filter(v => v !== checkbox.value);
    }

    console.log('Updated subscriptions:', customerSubscriptions[userId]);
}

// Initialize the app
tg.ready();