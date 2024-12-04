// API configuration
const apiKey = "&appid=c3000a5ee592c6fa693f1faa86a5d2bd&units=imperial";
const baseUrl = "https://api.openweathermap.org/data/2.5/weather?zip=";

// Page element selection
const zipInput = document.getElementById('zip');
const feelingsInput = document.getElementById('feelings');
const generateButton = document.getElementById('generate');
const entrySection = document.getElementById('entry');

// Button click event
generateButton.addEventListener('click', performAction);

// Main action handler
function performAction() {
    // Get current date
    const d = new Date();
    const newDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

    // Fetch and process weather data
    getWeather(baseUrl, zipInput.value, apiKey)
        .then(function(weatherData) {
            console.log('Full Weather Data:', weatherData); // Added detailed logging
            
            // Save data to server
            postData('/postData', {
                date: newDate,
                temp: Math.round(weatherData.main.temp),
                content: feelingsInput.value
            });
            
            // Show entry section
            entrySection.style.display = 'block';
            
            // Update UI
            updateUI();
        })
        .catch(function(error) {
            // Detailed error logging
            console.error('Detailed Error:', error);
            
            // More informative error alert
            alert(`Error: ${error.message}. 
                   - Check your zip code 
                   - Ensure you have a stable internet connection
                   - Verify API key is valid`);
        });
}


// Weather data retrieval
async function getWeather(baseUrl, zip, key) {
    // Input validation
    if (!zip) {
        throw new Error('Please enter a zip code');
    }

    try {
        const response = await fetch(baseUrl + zip + key);
        const data = await response.json();
        
        console.log('Raw API Response:', data); // Log raw API response
        
        // Comprehensive status checking
        if (data.cod !== 200) {
            throw new Error(data.message || 'Unable to retrieve weather data');
        }
        
        return data;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw error;
    }
}

// Send data to server
async function postData(url, data) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    return response.json();
}

// Update user interface
async function updateUI() {
    try {
        const request = await fetch('/getAll');
        const allData = await request.json();
        
        document.getElementById('date').innerHTML = `Date: ${allData.date}`;
        document.getElementById('temp').innerHTML = `Temperature: ${allData.temp}°F`;
        document.getElementById('content').innerHTML = `Feelings: ${allData.content}`;
    } catch (error) {
        console.log('UI update error', error);
        alert('Unable to update display');
    }
}