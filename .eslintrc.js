module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
      "indent": ["error",2],
      "linebreak-style": ["error","windows"],
      "quotes": ["error","single"],
      "semi": ["error","never"],
      "no-console": 0
    }
};