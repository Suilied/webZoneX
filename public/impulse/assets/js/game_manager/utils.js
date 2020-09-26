const SpawnerType = {
    MONSTER: 'MONSTER',
    CHEST: 'CHEST',
};

function getCenterX(obj){ return obj.x + ( obj.width / 2 ); }
function getCenterY(obj){ return obj.y + ( obj.height / 2 ); }

function randomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}

// This utility is only needed for maps created with a newer (v1.4.2 or later) version of Tiled
function getTiledProperty(obj, property_name) {
    for (var property_index = 0; property_index < obj.properties.length; property_index += 1) {
        var property = obj.properties[property_index];
        if (property.name == property_name) {
            return property.value;
        }
    }
}