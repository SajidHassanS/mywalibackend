const joi = require("joi");

/* ************************************************************************************** */
// Signup parameters validation.
/* ************************************************************************************** */

exports.signUp = function (req, res, next) {
  const data = req.body;
  let objectValidateScheme = joi.object().keys({
    fullName: joi.string().required(),
    email: joi.string().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
    phoneNumber: joi.number().required(),
    
    address: joi.string(),
   
  });

  try {
    const { error, value } = objectValidateScheme.validate(data);
    console.log("========value", value, error);
    if (error) {
      res.status(422).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(422).json({
      status: "ERROR",
      message: error.details[0].message,
    });
  }
};

/* ************************************************************************************** */
// Change password parameters validation.
/* ************************************************************************************** */
exports.changePassword = function (req, res, next) {
  const data = req.body;
  let objectValidateScheme = joi.object().keys({
    oldPassword: joi.string().required(),
    password: joi.string().required(),
  });
  try {
    const { error, value } = objectValidateScheme.validate(data);
    console.log("========value", value);
    if (error) {
      res.status(422).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    res.status(422).json({
      status: "ERROR",
      message: error.details[0].message,
    });
  }
};

/* ************************************************************************************* */
// Forget password parameters validation.
/* ************************************************************************************* */
exports.forgetPassword = function (req, res, next) {
  const data = req.body.data;
  let objectValidateScheme = joi.object().keys({
    email: joi.string().required(),
  });

  try {
    const { error, value } = objectValidateScheme.validate(data);
    console.log("========value", value);
    if (error) {
      res.status(422).json({
        status: "ERROR",
        message: error.details[0].message,
      });
    }
    next();
  } catch (error) {
    res.status(422).json({
      status: "ERROR",
      message: error.details[0].message,
    });
  }
};

exports.setNewPassword = function (req, res, next) {
  const data = req.body.data;
  let objectValidateScheme = joi.object().keys({
    forgetPasswordAuthToken: joi.string().required(),
    password: joi.string().required(),
  });

  joi.validate(
    data,
    objectValidateScheme,
    {
      allowUnknown: true,
    },
    (err) => {
      if (err) {
        // send a 422 error response if validation fails
        res.status(422).json({
          status: "error",
          message: err.details[0].message,
        });
      } else {
        next();
      }
    }
  );
};
