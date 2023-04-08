import { body, validationResult } from "express-validator";

function userRegisterValidation() {
  return [
    body("firstname", "Invalid FirstName")
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Minimum length is 3"),
    body("lastname", "Invalid LastName").notEmpty(),
    body("email", "Invalid Email").isEmail(),
    body("address", "Maximum Length Address").isLength({ min: 2, max: 100 }),
    body("password", "Password length > 6").isLength({ min: 6 }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirm Password Does Not Match");
      }
      return true;
    }),
  ];
}

function userLoginValidation() {
  return [
    body("email", "Invalid Email").isEmail(),
    body("password", "Password length > 6").isLength({ min: 6 }),
  ];
}

function errorValidator(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(201).json({ error: errors["errors"] });
  }
  return next();
}

export { userRegisterValidation, userLoginValidation, errorValidator };
