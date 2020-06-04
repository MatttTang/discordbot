const rng = require('random-words');

// Generate a random word, and return it
function random(){
    return rng();
}

module.exports = random();