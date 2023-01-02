import { Router } from "express";
import validator from "express-validator/check/index.js";
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
const router = Router();
import auth from "../middleware/auth.js";
import User from "../models/User.js";

/**
 * @method - POST
 * @param - /signup
 * @description - User SignUp
 */

router.post(
  "/signup",
  [
    validator.check("username", "Please Enter a Valid Username")
      .not()
      .isEmpty(),
    validator.check("email", "Please enter a valid email").isEmail(),
    validator.check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0]['msg']
      });
    }

    const { username, email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (user) {
        return res.status(400).json({
          msg: "User Already Exists"
        });
      }

      user = new User({
        username,
        email,
        password
      });

      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };

      jsonwebtoken.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
  }
);

router.post(
  "/login",
  [
    validator.check("email", "Please enter a valid email").isEmail(),
    validator.check("password", "Please enter a valid password").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: errors.array()[0]['msg']
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({
        email
      });
      if (!user)
        return res.status(400).json({
          message: "User Not Exist"
        });

      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          message: "Incorrect Password !"
        });
//
       user = await User.findOneAndUpdate(
        {email},
        {
            $set: {
                loggedIn: 1,
                grid: {}
            }
        })
//    

      const payload = {
        user: {
          id: user.id
        }
      };

      jsonwebtoken.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token
          });
        }
      );
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error"
      });
    }
  }
);

/**
 * @method - POST
 * @description - Get LoggedIn User
 * @param - /user/me
 */

router.get("/me", auth, async (req, res) => {
  try {
    console.log('getting')
    // request.user is getting fetched from Middleware after token authentication
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
});

router.get("/all", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.find({
        loggedIn: 1
      }, {email: 1, _id: 0})
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });
  

router.put("/score", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findOneAndUpdate(
        {_id: req.user.id},
        {
            $set: {
                userScore: req.body.userScore,
                botScore: req.body.botScore
            }
        })
    } catch (e) {
      res.send({ message: "Error in updating user" });
    }
  });

  router.put("/notify", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.findOneAndUpdate(
        {email: req.body.email},
        {
            $set: {
                notify: req.body.user,
            }
        })
        console.log('hooo')
        console.log(user)
    } catch (e) {
      res.send({ message: "Error in updating user" });
    }
  });

  router.put("/updateGrid", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const { row, col } = req.body;
      console.log(req.body.grid)
      console.log('hihi')
      const user = await User.findOneAndUpdate(
        {email: req.body.user},
        {
            $set: {
                grid: req.body.grid,
            }
        })
        console.log(user)
    } catch (e) {
      res.send({ message: "Error in updating user" });
    }
  });
  
  router.get("/getGrid", auth, async (req, res) => {
    try {
      // request.user is getting fetched from Middleware after token authentication
      const user = await User.find({
        _id: req.user.id
      }, {grid: 1, _id: 0})
      res.json(user);
    } catch (e) {
      res.send({ message: "Error in Fetching user" });
    }
  });
  

export default router;

//        {_id: req.user.id},
