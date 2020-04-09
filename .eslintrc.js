module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true,
        "mocha": true,
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 7,
        "sourceType": "module"
    },
    "rules": {
        "no-console": [
            "warn"
        ],
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};
