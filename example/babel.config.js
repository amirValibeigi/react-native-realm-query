const path = require('path');
const pak = require('../package.json');

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      ['@babel/plugin-transform-flow-strip-types', {allowDeclareFields: true}],
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.json'],
          alias: {
            // For development, we want to alias the library to the source
            [pak.name]: path.join(__dirname, '..', pak.source),
          },
        },
      ],
    ],
  };
};
