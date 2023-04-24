const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'libs/**/!(*.stories|*.spec).{ts,html,svelte}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
    colors: {
      teal: {
        100: '#02525E',
        300: '#005D5C',
        500: '#00847C',
        700: '#B2D0D2',
        900: '#EBF5F5',
      },
    },
  },
  plugins: [],
};
