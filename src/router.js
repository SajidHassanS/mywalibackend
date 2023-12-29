const Router = require("express").Router;
const router = new Router();
const { authenticate } = require("./middleware/authenticate");

// ===================      All Controllers   ==================//
//const dashboardController = require("./controller/dashboard");
const authController = require("./controller/auth");
const userController = require("./controller/user");
const dashboardController = require("./controller/dashboard");
const brideDashboardController = require("./controller/brideDashboard");

const maritalController = require("./controller/marital");
const ethnicityController = require("./controller/ethnicity");
const countryController = require("./controller/country");
const cityController = require("./controller/city");

// ================== Chat Controller  ======================//
const chatController = require("./controller/chat");

// ===================      joi validations    ==================//
const authJoiValidation = require("./utils/validation/authJoiValidation");
const maritalJoi = require("./utils/validation/marital");
const ethnicityJoi = require("./utils/validation/ethnicity");
const countryJoi = require("./utils/validation/country");
const cityJoi = require("./utils/validation/city");
const usersJoi = require("./utils/validation/users");

//===================      dashboard Route         ==============//

router.get(
  "/getSuperAdminDashboard",
  // authenticate,
  dashboardController.getSuperAdminDashboard
);
router.get(
  "/getMonthlyAnalytics",
  // authenticate,
  dashboardController.getMonthlyAnalytics
);
router.get(
  "/getDailyAnalytics",
  // authenticate,
  dashboardController.getDailyAnalytics
);

//===================       Auth Route       ==============//
router.post("/signUp", authJoiValidation.signUp, authController.signUp);
router.post("/login", authController.signIn);
router.get("/getProfile", authenticate, authController.getProfile);
router.put("/updateProfile", authenticate, authController.updateProfile);
router.put("/changePassword", authenticate, authController.changePassword);

//===================      Users Route         ==============//
router.get("/getUsers/:query", authenticate, userController.getUsers);
router.post(
  "/addUsers",
  //usersJoi.addValidation,
  //authenticate,
  userController.addUsers
);
router.put(
  "/updateUsers",
  usersJoi.updateValidation,
  authenticate,
  userController.updateUsers
);
router.put(
  "/activeUserAccount",
  usersJoi.activeUserAccount,
  authenticate,
  userController.activeUserAccount
);
router.put(
  "/deleteUsers",
  usersJoi.deleteValidation,
  authenticate,
  userController.deleteUsers
);
router.put("/resetPassword", authenticate, userController.resetPassword);
router.get(
  "/getUserDetailById",
  //authenticate,
  userController.getUserDetailById
);

//===================      Bride dashboard Route         ==============//
router.get(
  "/getBrideDashboard",
  // authenticate,
  brideDashboardController.getBrideDashboard
);
router.get(
  "/getBrideMonthlyAnalytics",
  // authenticate,
  brideDashboardController.getBrideMonthlyAnalytics
);

//===================      Groom Route         ==============//
router.post("/addGroom", userController.AddGroom);
router.get("/getAllGroom", userController.getAllGroom);
router.put("/manageFavouritePeople", userController.manageFavouritePeople);
router.get(
  "/getFavouriteList/:query",
  authenticate,
  userController.getFavouriteList
);

router.get("/searchGroom/:query", authenticate, userController.searchGroom);

router.post(
  "/addFavourite",
  usersJoi.addValidationGroom,
  authenticate,
  userController.addFavourite
);
router.get(
  "/getGroomDetails/:query",
  //authenticate,
  userController.getGroomDetails
);

//===================      dashboard Route         ==============//
router.get(
  "/getSuperAdminDashboard",
  // authenticate,
  dashboardController.getSuperAdminDashboard
);

router.get(
  "/getMonthlyAnalytics",
  // authenticate,
  dashboardController.getMonthlyAnalytics
);

//===================      Marital Route         ==============//
router.get("/getMarital/:query", authenticate, maritalController.getMarital);
router.post(
  "/addMarital",
  maritalJoi.addValidation,
  authenticate,
  maritalController.addMarital
);
router.put(
  "/updateMarital",
  maritalJoi.updateValidation,
  authenticate,
  maritalController.updateMarital
);
router.delete(
  "/deleteMarital",
  maritalJoi.deleteValidation,
  authenticate,
  maritalController.deleteMarital
);

//===================      ethnicity Route         ==============//
router.get(
  "/getEthnicity/:query",
  authenticate,
  ethnicityController.getEthnicity
);
router.post(
  "/addEthnicity",
  ethnicityJoi.addValidation,
  authenticate,
  ethnicityController.addEthnicity
);
router.put(
  "/updateEthnicity",
  ethnicityJoi.updateValidation,
  authenticate,
  ethnicityController.updateEthnicity
);
router.delete(
  "/deleteEthnicity",
  ethnicityJoi.deleteValidation,
  authenticate,
  ethnicityController.deleteEthnicity
);

//===================      Country Route         ==============//
router.get(
  "/getCountry/:query",
  //authenticate,
  countryController.getCountry
);
router.get("/getCountryName/:query", countryController.getCountryName);
router.post(
  "/addCountry",
  countryJoi.addValidation,
  //authenticate,
  countryController.addCountry
);
router.put(
  "/updateCountry",
  countryJoi.updateValidation,
  authenticate,
  countryController.updateCountry
);
router.delete(
  "/deleteCountry",
  countryJoi.deleteValidation,
  authenticate,
  countryController.deleteCountry
);

//===================      City Route         ==============//
router.get("/getCity/:query", authenticate, cityController.getCity);
router.post(
  "/addCity",
  cityJoi.addValidation,
  authenticate,
  cityController.addCity
);
router.put(
  "/updateCity",
  cityJoi.updateValidation,
  authenticate,
  cityController.updateCity
);
router.delete(
  "/deleteCity",
  cityJoi.deleteValidation,
  authenticate,
  cityController.deleteCity
);

//============================  sendMessage  =============================//
router.post(
  "/sendMessage",chatController.sendMessage
);

router.get("/getUserChat/:query", chatController.getUserChat);



module.exports = router;
