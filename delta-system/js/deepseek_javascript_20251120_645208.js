// Расширенная база данных СБУ Delta System
const deltaDatabase = {
    // Киев - стратегические объекты
    "kyiv_government": {
        id: "GOV-UA-001",
        type: "урядовий_обєкт",
        address: "Київ, вул. Банкова, 11",
        security_level: "ДЕЛЬТА",
        floors: 8,
        apartments: 0,
        residents: 324,
        year: 1938,
        registered: [
            {"name": "ПЕТРЕНКО ВОЛОДИМИР ІВАНОВИЧ", "apartment": "301", "registration_date": "2019-05-15", "clearance": "СЕКРЕТНО"},
            {"name": "СІДОРЕНКО ОЛЕНА ВАСИЛІВНА", "apartment": "205", "registration_date": "2020-11-20", "clearance": "ЦІЛКОМ СЕКРЕТНО"},
            {"name": "КОВАЛЕНКО СЕРГІЙ МИКОЛАЙОВИЧ", "apartment": "108", "registration_date": "2018-03-10", "clearance": "СЕКРЕТНО"}
        ],
        cameras: ["cam_gov_entrance_delta", "cam_gov_hall_alpha", "cam_gov_perimeter_beta"],
        coordinates: [30.5238, 50.4482],
        special_notes: "ОБ'ЄКТ ПІДВИЩЕНОЇ ОХОРОНИ"
    },

    // Военные объекты
    "military_hq_kyiv": {
        id: "MIL-UA-045",
        type: "військовий_обєкт", 
        address: "Київ, вул. Михайла Грушевського, 30",
        security_level: "АЛЬФА",
        floors: 6,
        apartments: 0,
        residents: 187,
        year: 1975,
        registered: [
            {"name": "ШЕВЧЕНКО АНДРІЙ ВІКТОРОВИЧ", "apartment": "командування", "registration_date": "2015-08-12", "clearance": "ЦІЛКОМ СЕКРЕТНО"},
            {"name": "МЕЛЬНИК ТЕТЯНА ОЛЕКСАНДРІВНА", "apartment": "оперативний", "registration_date": "2017-02-28", "clearance": "СЕКРЕТНО"}
        ],
        cameras: ["cam_mil_entrance", "cam_mil_compound", "cam_mil_rooftop"],
        coordinates: [30.5364, 50.4543],
        special_notes: "ЦЕНТР УПРАВЛІННЯ ОБОРОНОЮ"
    },

    // Критическая инфраструктура  
    "power_plant_kyiv": {
        id: "INF-UA-112",
        type: "енергетичний_обєкт",
        address: "Київська обл., м. Вишгород, вул. Енергетиків, 1",
        security_level: "БЕТА",
        floors: 3,
        apartments: 0, 
        residents: 89,
        year: 1980,
        registered: [
            {"name": "ЗАХАРЧЕНКО МИХАЙЛО ПЕТРОВИЧ", "apartment": "диспетчерська", "registration_date": "2010-09-05", "clearance": "СЕКРЕТНО"},
            {"name": "ПАВЛЕНКО ІРИНА СТЕПАНІВНА", "apartment": "технічний", "registration_date": "2012-12-15", "clearance": "ДОСТУП ОБМЕЖЕНО"}
        ],
        cameras: ["cam_pp_main", "cam_pp_turbine", "cam_pp_transformer"],
        coordinates: [30.4891, 50.5849],
        special_notes: "ОБ'ЄКТ КРИТИЧНОЇ ІНФРАСТРУКТУРИ"
    },

    // Жилые массивы с повышенным вниманием
    "kyiv_troyeshchina_block45": {
        id: "RES-UA-789",
        type: "житловий_масив",
        address: "Київ, пр-т Маяковського, 45",
        security_level: "ГАММА", 
        floors: 16,
        apartments: 240,
        residents: 685,
        year: 1985,
        registered: [
            {"name": "БОНДАРЕНКО ОЛЕКСАНДР СЕРГІЙОВИЧ", "apartment": "145", "registration_date": "1998-05-12", "clearance": "СТАНДАРТ"},
            {"name": "КОЗЛОВА МАРІЯ ВАСИЛІВНА", "apartment": "145", "registration_date": "2005-08-23", "clearance": "СТАНДАРТ"},
            {"name": "ГРИЦЕНКО ПЕТРО ВОЛОДИМИРОВИЧ", "apartment": "278", "registration_date": "1989-11-03", "clearance": "СТАНДАРТ"}
        ],
        cameras: ["cam_troy_entrance", "cam_troy_elevator", "cam_troy_parking"],
        coordinates: [30.6022, 50.4825],
        special_notes: "ЩІЛЬНЕ ЗАСЕЛЕННЯ, ПОТЕНЦІЙНИЙ РИЗИК"
    },

    // Пограничные зоны
    "border_checkpoint_krakovets": {
        id: "BDR-UA-023",
        type: "прикордонний_пункт",
        address: "Львівська обл., пункт пропуску Краковець",
        security_level: "ДЕЛЬТА",
        floors: 2,
        apartments: 0,
        residents: 34,
        year: 2005,
        registered: [
            {"name": "ЛИСОВИЙ ВАСИЛЬ МИХАЙЛОВИЧ", "apartment": "казарма", "registration_date": "2018-07-20", "clearance": "СЕКРЕТНО"},
            {"name": "ПЕТРІВ ІГОР СТЕПАНОВИЧ", "apartment": "комендатура", "registration_date": "2019-11-08", "clearance": "СЕКРЕТНО"}
        ],
        cameras: ["cam_border_main", "cam_border_zone_a", "cam_border_zone_b", "cam_border_thermal"],
        coordinates: [23.1567, 50.1123],
        special_notes: "ПРИКОРДОННИЙ КОНТРОЛЬ ВИЩОГО РІВНЯ"
    }
};

// Система камер Delta
const deltaCameraSystem = {
    "cam_gov_entrance_delta": {
        url: "rtsp://delta_sbu_gov_001:encrypted_stream@gov-ua-001/entrance/main",
        status: "ACTIVE",
        resolution: "4K",
        features: ["facial_recognition", "license_plate", "thermal_imaging"]
    },
    "cam_gov_hall_alpha": {
        url: "rtsp://delta_sbu_gov_001:encrypted_stream@gov-ua-001/hall/central", 
        status: "ACTIVE",
        resolution: "1080p",
        features: ["facial_recognition", "behavior_analysis"]
    },
    "cam_mil_entrance": {
        url: "rtsp://delta_sbu_mil_045:military_secure@mil-ua-045/gate/main",
        status: "ACTIVE", 
        resolution: "4K",
        features: ["biometric_scan", "weapon_detection", "thermal_imaging"]
    },
    "cam_pp_main": {
        url: "rtsp://delta_sbu_inf_112:power_plant@inf-ua-112/entrance/secure",
        status: "ACTIVE",
        resolution: "1080p", 
        features: ["access_control", "intrusion_detection"]
    },
    "cam_troy_entrance": {
        url: "rtsp://delta_sbu_res_789:residential_mon@res-ua-789/entrance/main",
        status: "ACTIVE",
        resolution: "1080p",
        features: ["motion_detection", "night_vision"]
    },
    "cam_border_main": {
        url: "rtsp://delta_sbu_bdr_023:border_control@bdr-ua-023/checkpoint/main",
        status: "ACTIVE",
        resolution: "4K",
        features: ["facial_recognition", "passport_scan", "thermal_imaging", "vehicle_scan"]
    }
};

// Функции работы с базой данных Delta
class DeltaDBSystem {
    static getAllObjects() {
        return deltaDatabase;
    }

    static searchObjects(query) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        Object.keys(deltaDatabase).forEach(objId => {
            const obj = deltaDatabase[objId];
            
            // Поиск по адресу
            if (obj.address.toLowerCase().includes(searchTerm)) {
                results.push({type: 'object', id: objId, data: obj});
            }
            
            // Поиск по ID объекта
            if (obj.id.toLowerCase().includes(searchTerm)) {
                results.push({type: 'object', id: objId, data: obj});
            }
            
            // Поиск по ФИО
            obj.registered.forEach(person => {
                if (person.name.toLowerCase().includes(searchTerm)) {
                    results.push({
                        type: 'person',
                        objectId: objId,
                        person: person,
                        objectData: obj
                    });
                }
            });
        });
        
        return results;
    }

    static getObjectById(objectId) {
        return deltaDatabase[objectId];
    }

    static getCameraSystem() {
        return deltaCameraSystem;
    }

    static getStatistics() {
        let totalObjects = 0;
        let totalCameras = 0;
        let totalPersons = 0;
        
        Object.keys(deltaDatabase).forEach(objId => {
            totalObjects++;
            totalCameras += deltaDatabase[objId].cameras.length;
            totalPersons += deltaDatabase[objId].registered.length;
        });
        
        return {
            objects: totalObjects,
            cameras: totalCameras,
            persons: totalPersons
        };
    }
}