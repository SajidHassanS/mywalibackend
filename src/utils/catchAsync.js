module.exports = (fn) => {
  const chalk = require("chalk");

  const log = console.log;

  return (req, res, next) => {
    fn(req, res, next).catch((e) => {
      log(chalk.red(("===== e =======", e)));
      next(e);
    });
  };
};
