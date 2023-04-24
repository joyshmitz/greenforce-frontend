export default {
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              customElement: true,
            },
          },
        },
      },
    ],
  },
};
