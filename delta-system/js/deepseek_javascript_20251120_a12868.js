// Инициализация системы Delta
let deltaMap;
let currentCamera = null;
let nightVision = false;

// Инициализация карты Delta
function initDeltaMap() {
    deltaMap = new ol.Map({
        target: 'deltaMap',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([30.5234, 50.4501]), // Центр Киева
            zoom: 10
        }),
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false
            }
        })
    });

    // Добавление объектов Delta на карту
    addDeltaObjectsToMap();
    
    // Обновление статистики
    updateSystemStatistics();
    
    // Запуск системного времени
    updateSystemTime();
    setInterval(updateSystemTime, 1000);
    
    // Обработчик кликов по карте
    deltaMap.on('click', handleMapClick);
}

// Добавление объектов на карту
function addDeltaObjectsToMap() {
    const objects = DeltaDBSystem.getAllObjects();
    const features = [];

    Object.keys(objects).forEach(objId => {
        const obj = objects[objId];
        const feature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(obj.coordinates)),
            objectId: objId,
            type: obj.type,
            security: obj.security_level
        });

        // Стили в зависимости от уровня безопасности
        let color, radius;
        switch(obj.security_level) {
            case 'ДЕЛЬТА':
                color = '#ff4444';
                radius = 10;
                break;
            case 'АЛЬФА':
                color = '#ffaa00';
                radius = 8;
                break;
            case 'БЕТА':
                color = '#ffff00';
                radius = 6;
                break;
            default:
                color = '#00ff00';
                radius = 4;
        }

        feature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: radius,
                fill: new ol.style.Fill({color: color}),
                stroke: new ol.style.Stroke({
                    color: '#ffffff',
                    width: 2
                })
            })
        }));

        features.push(feature);
    });

    const vectorSource = new ol.source.Vector({
        features: features
    });

    const vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });

    deltaMap.addLayer(vectorLayer);
}

// Обработчик клика по карте
function handleMapClick(evt) {
    const feature = deltaMap.forEachFeatureAtPixel(evt.pixel, function(feature) {
        return feature;
    });

    if (feature) {
        const objectId = feature.get('objectId');
        displayObjectDetails(objectId);
    }
}

// Отображение деталей объекта
function displayObjectDetails(objectId) {
    const obj = DeltaDBSystem.getObjectById(objectId);
    const detailsContainer = document.getElementById('objectDetails');
    
    if (!obj) return;

    detailsContainer.innerHTML = `
        <div class="building-info">
            <h3>${obj.address}</h3>
            <div class="object-meta">
                <p><strong>ID СИСТЕМИ:</strong> ${obj.id}</p>
                <p><strong>ТИП:</strong> ${obj.type}</p>
                <p><strong>РІВЕНЬ БЕЗПЕКИ:</strong> <span class="security-badge">${obj.security_level}</span></p>
                <p><strong>ПОВЕРХІВ:</strong> ${obj.floors}</p>
                <p><strong>ОСІБ:</strong> ${obj.residents}</p>
                <p><strong>РІК:</strong> ${obj.year}</p>
            </div>
            ${obj.special_notes ? `<p class="special-note">${obj.special_notes}</p>` : ''}
        </div>
        
        <div class="residents-section">
            <h4>ЗАРЕЄСТРОВАНІ ОСОБИ:</h4>
            <table class="residents-table">
                <thead>
                    <tr>
                        <th>ПІБ</th>
                        <th>ПРИМІЩЕННЯ</th>
                        <th>ДАТА РЕЄСТРАЦІЇ</th>
                        <th>ДОСТУП</th>
                    </tr>
                </thead>
                <tbody>
                    ${obj.registered.map(person => `
                        <tr>
                            <td>${person.name}</td>
                            <td>${person.apartment}</td>
                            <td>${person.registration_date}</td>
                            <td class="clearance-${person.clearance.toLowerCase().replace(' ', '_')}">${person.clearance}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="cameras-section">
            <h4>СИСТЕМА СПОСТЕРЕЖЕННЯ:</h4>
            <div class="camera-list">
                ${obj.cameras.map(camId => {
                    const cam = deltaCameraSystem[camId];
                    return `
                        <button class="delta-btn camera-select" onclick="selectCamera('${camId}')">
                            📹 ${camId} (${cam ? cam.status : 'UNKNOWN'})
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Выбор камеры
function selectCamera(cameraId) {
    currentCamera = cameraId;
    const cam = deltaCameraSystem[cameraId];
    const container = document.getElementById('cameraContainer');
    
    if (cam) {
        container.innerHTML = `
            <div class="live-feed-container">
                <video class="live-feed" autoplay muted controls>
                    <source src="${cam.url}" type="video/mp4">
                    СИСТЕМА: ПОТІК НЕДОСТУПНИЙ
                </video>
                <div class="camera-info-overlay">
                    <span>${cameraId}</span>
                    <span>${cam.resolution}</span>
                    <span class="status-active">● LIVE</span>
                </div>
            </div>
        `;
        
        if (nightVision) {
            applyNightVision();
        }
    }
}

// Расширенный поиск
function advancedSearch() {
    const query = document.getElementById('searchInput').value;
    if (!query) return;
    
    const results = DeltaDBSystem.searchObjects(query);
    const detailsContainer = document.getElementById('objectDetails');
    
    if (results.length === 0) {
        detailsContainer.innerHTML = `<div class="no-results">РЕЗУЛЬТАТІВ НЕ ЗНАЙДЕНО</div>`;
        return;
    }
    
    let html = `<div class="search-results"><h3>РЕЗУЛЬТАТИ ПОШУКУ: "${query}"</h3>`;
    
    results.forEach(result => {
        if (result.type === 'object') {
            html += `
                <div class="search-result-item" onclick="displayObjectDetails('${result.id}')">
                    <strong>ОБ'ЄКТ:</strong> ${result.data.address}<br>
                    <small>ID: ${result.data.id} | ТИП: ${result.data.type}</small>
                </div>
            `;
        } else if (result.type === 'person') {
            html += `
                <div class="search-result-item" onclick="displayObjectDetails('${result.objectId}')">
                    <strong>ОСОБА:</strong> ${result.person.name}<br>
                    <small>АДРЕСА: ${result.objectData.address} | ПРИМІЩЕННЯ: ${result.person.apartment}</small>
                </div>
            `;
        }
    });
    
    html += `</div>`;
    detailsContainer.innerHTML = html;
}

// Обновление системной статистики
function updateSystemStatistics() {
    const stats = DeltaDBSystem.getStatistics();
    document.getElementById('objectsCount').textContent = stats.objects;
    document.getElementById('activeCameras').textContent = stats.cameras;
    document.getElementById('personsCount').textContent = stats.persons;
}

// Обновление системного времени
function updateSystemTime() {
    const now = new Date();
    const timestamp = now.toLocaleString('uk-UA', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('timestamp').textContent = timestamp;
}

// Системные функции
function toggleSatellite() {
    alert('СУПУТНИКОВІ ЗОБРАЖЕННЯ: ФУНКЦІОНАЛ АКТИВОВАНО');
}

function scanForThreats() {
    alert('СКАНУВАННЯ ЗАГРОЗ: СИСТЕМА АНАЛІЗУЄ ДАНІ...');
}

function showAllUnits() {
    deltaMap.getView().setZoom(10);
    deltaMap.getView().setCenter(ol.proj.fromLonLat([30.5234, 50.4501]));
}

function recordFootage() {
    alert('ЗАПИС АКТИВОВАНО: АРХІВУВАННЯ ВІДЕОМАТЕРІАЛІВ');
}

function takeScreenshot() {
    alert('ЗНИМОК ЕКРАНА: ЗОБРАЖЕННЯ ЗБЕРЕЖЕНО В АРХІВ');
}

function toggleNightVision() {
    nightVision = !nightVision;
    const video = document.querySelector('.live-feed');
    if (video) {
        video.style.filter = nightVision ? 'grayscale(1) brightness(0.5) contrast(2)' : 'none';
    }
}

function generateReport() {
    const stats = DeltaDBSystem.getStatistics();
    const report = `
        ЗВІТ СИСТЕМИ DELTA
        Час: ${new Date().toLocaleString('uk-UA')}
        
        СТАТИСТИКА:
        - Моніторинг об'єктів: ${stats.objects}
        - Активні камери: ${stats.cameras} 
        - Зареєстровані особи: ${stats.persons}
        
        СТАТУС: СИСТЕМА ПРАЦЮЄ В ШТАТНОМУ РЕЖИМІ
    `;
    
    alert(report);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initDeltaMap();
    
    // Симуляция загрузки системы
    setTimeout(() => {
        console.log('Δ DELTA SYSTEM: INITIALIZATION COMPLETE');
        console.log('Δ SECURITY LEVEL: MAXIMUM');
        console.log('Δ ALL MODULES: OPERATIONAL');
    }, 1000);
});