module.exports = {
  HOST: "localhost",
  USER: "halong",
  PASSWORD: "halong",
  DB: "nha_thuoc_cms",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
