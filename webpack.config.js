const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Only alias for web builds
  if (env.platform === 'web') {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Redirect react-native-maps to a small web shim so webpack doesn't
      // try to include native-only internals (like codegenNativeCommands).
      'react-native-maps': path.resolve(__dirname, 'web', 'react-native-maps.js'),
    };
  }

  return config;
};
