module.exports = {
  'presets': [
    ['@babel/preset-env', {
      targets: {
        browsers: [
          '>0.25%',
          'not ie 11',
          'not op_mini all'
        ]
      }
    }]
  ],
  'plugins': [
    '@babel/plugin-proposal-class-properties'
  ]
}
