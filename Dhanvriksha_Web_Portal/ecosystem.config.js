module.exports = {
  apps : [
      {
        name: "Dhanvriksha_web",
        script: "npm",
        args: "start",
        instances: 1,
        exec_mode: "fork",
        watch: false,
        increment_var : 'PORT',
        env: {
            "PORT": 3101,
            "NODE_ENV": "production"
        }
      }
  ]
}
