const emoji = require('emoji.json');

// Return price per emoji
exports.price = async () => {
    return 999;
}

// Return emojis by Unicode category
function getEmojis(categories) {
    categories = categories || [];

    const matches = [];

    for (let e of emoji) {
        if (categories.length == 0 || ~categories.indexOf(e.category)) {
            matches.push(e);
        }
    }

    return matches;
}

// Return products grouped by category
exports.list = async () => {
    let products = {};

    let emojis = getEmojis(['Smileys & Emotion', 'Smileys & Emotion (face-affection)', 'Smileys & Emotion (face-neutral-skeptical)', 'Smileys & Emotion (face-concerned)']);
    //let emojis = getEmojis();

    // group emojis by category
    emojis = emojis.reduce((result, value) => {
        if (result[value.category]) {
            result[value.category].push(value);
        } else {
            result[value.category] = [value];
        }

        return result;
    }, {});

    return emojis;
}