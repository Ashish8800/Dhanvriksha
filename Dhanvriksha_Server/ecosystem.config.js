module.exports = {
  apps: [
    {
      name: "DhanvrikshaServer",
      script: "./server.js",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      increment_var: "PORT",
      env: {
        PORT: 5001,
        NODE_ENV: "production",
      },
    },
  ],
};
