// Initialize map
function initMap() {
    const map = L.map('map').setView([50.4501, 30.5234], 10);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for key locations
    const locations = [
        { coords: [50.4501, 30.5234], title: 'Київ', type: 'capital' },
        { coords: [49.8397, 24.0297], title: 'Львів', type: 'city' },
        { coords: [48.4647, 35.0462], title: 'Дніпро', type: 'city' },
        { coords: [46.4825, 30.7233], title: 'Одеса', type: 'city' },
        { coords: [49.9935, 36.2304], title: 'Харків', type: 'city' }
    ];

    locations.forEach(loc => {
        const marker = L.marker(loc.coords).addTo(map);
        marker.bindPopup(`
            <div class="map-popup">
                <h4>${loc.title}</h4>
                <p>Тип: ${loc.type === 'capital' ? 'Столиця' : 'Місто'}</p>
                <button onclick="viewCityDetails('${loc.title}')">Детальніше</button>
            </div>
        `);
    });

    return map;
}

function viewCityDetails(cityName) {
    alert(`Перегляд деталей для міста: ${cityName}`);
}
