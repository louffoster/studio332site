module.exports = {
    // "parser": "@babel/eslint-parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "env": {
        "es2023": true,
        "browser": true,
        "node": true
    },
    "extends": ["eslint:recommended","plugin:vue/vue3-recommended"],
    "rules": {
        "semi": 2
    }
}