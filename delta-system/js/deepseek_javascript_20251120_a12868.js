// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = initMap();
    
    // Update time
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // Add interactive functionality
    initializeEventListeners();
});

function updateDateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    // This would update a datetime element if added to the header
}

function initializeEventListeners() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Control buttons
    const controlBtns = document.querySelectorAll('.control-btn');
    controlBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            alert(`Функція: ${this.textContent}`);
        });
    });

    // Action buttons
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.querySelector('.action-icon').textContent;
            alert(`Виконано дію: ${action}`);
        });
    });
}

// Search functionality
function performSearch(query) {
    console.log('Пошук:', query);
    // Implementation would connect to backend
}

// Generate report
function generateReport() {
    const reportData = {
        timestamp: new Date().toLocaleString('uk-UA'),
        objects: 1247,
        cameras: 5892,
        persons: 284156,
        events: 23
    };
    
    alert(`Звіт згенеровано:\nЧас: ${reportData.timestamp}\nОб'єктів: ${reportData.objects}\nКамер: ${reportData.cameras}\nОсіб: ${reportData.persons}\nПодій: ${reportData.events}`);
}
