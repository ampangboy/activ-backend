module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        shippedProposals: true,
        ignoreBrowserslistConfig: true,
      },
    ],
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};
