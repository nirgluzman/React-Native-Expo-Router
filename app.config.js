// see: https://docs.expo.dev/eas/environment-variables/#creating-and-using-environment-variables

export default ({ config }) => {
  const { android } = config;

  return {
    ...config,
    android: {
      ...android,
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json', // Android app config for Firebase
    },
  };
};
