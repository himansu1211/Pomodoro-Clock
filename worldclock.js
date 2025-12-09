// worldclock.js - World Clock logic

document.addEventListener('DOMContentLoaded', () => {
    let currentTimezone = 'America/New_York';
    let timezoneOffset = 0; // Offset in seconds
    let lastFetchTime = null;

    // DOM Elements
    const worldTimeDisplay = document.getElementById('world-time-display');
    const timezoneSelect = document.getElementById('timezone-select');

    // Timezone options
    const timezones = [
        'Asia/Kolkata',
        'Europe/London',
        'America/New_York',
        'Asia/Tokyo',
        'Australia/Sydney'
    ];

    // Populate timezone select
    timezones.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz.replace('_', ' ').split('/')[1];
        timezoneSelect.appendChild(option);
    });

    // Set default
    timezoneSelect.value = currentTimezone;

    async function fetchTimezoneOffset(timezone) {
        try {
            const response = await fetch(`https://worldtimeapi.org/api/timezone/${timezone}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Parse the UTC offset (format like "+05:30" or "-08:00")
            const utcOffset = data.utc_offset;
            const offsetHours = parseInt(utcOffset.split(':')[0]);
            const offsetMinutes = parseInt(utcOffset.split(':')[1]);
            const offsetSeconds = (offsetHours * 3600) + (offsetMinutes * 60);

            return {
                offset: offsetSeconds,
                datetime: new Date(data.datetime)
            };
        } catch (error) {
            console.error('Error fetching timezone data:', error);
            // Fallback to local time if API fails
            return {
                offset: 0,
                datetime: new Date()
            };
        }
    }

    function updateDisplay() {
        if (!lastFetchTime) return;

        const now = new Date();
        const elapsed = Math.floor((now - lastFetchTime) / 1000);
        const currentTime = new Date(lastFetchTime.getTime() + (elapsed + timezoneOffset) * 1000);

        const hours = currentTime.getUTCHours();
        const minutes = currentTime.getUTCMinutes();
        const seconds = currentTime.getUTCSeconds();

        const timeString = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        const timezoneName = currentTimezone.split('/')[1].replace('_', ' ');

        worldTimeDisplay.textContent = `${timezoneName}: ${timeString}`;
    }

    async function changeTimezone(newTimezone) {
        currentTimezone = newTimezone;
        const data = await fetchTimezoneOffset(newTimezone);
        if (data) {
            timezoneOffset = data.offset;
            lastFetchTime = data.datetime;
            updateDisplay();
        }
    }

    // Event Listeners
    timezoneSelect.addEventListener('change', (e) => {
        changeTimezone(e.target.value);
    });

    // Initialize
    changeTimezone(currentTimezone);

    // Update every second
    setInterval(updateDisplay, 1000);
});
