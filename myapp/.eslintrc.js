module.exports = {
    root: true,
    env: {
      node: true,
    },
    extends: [
      'plugin:vue/essential',
    //   '@vue/standard'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false, // <== ADD THIS
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports
      },
    rules: {
      // Your custom rules here
      "vue/multi-word-component-names": "off"
    },
  };
  