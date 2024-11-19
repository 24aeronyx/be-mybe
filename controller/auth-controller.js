const { Credential, Profile, sequelize } = require("../models")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {Op} = require('sequelize')
const {validationResult} = require('express-validator')

const authController = {
  register: async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }

    const {
      email,
      username,
      password,
      full_name,
      date_of_birth,
      phone_number,
      address,
    } = req.body

    try {
      const existingUser = await Credential.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      })

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email or username already exists" })
      }

      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await sequelize.transaction(async (t) => {
        const credential = await Credential.create(
          { email, username, password: hashedPassword },
          { transaction: t }
        )

        await Profile.create(
          {
            credential_id: credential.id,
            full_name,
            date_of_birth,
            phone_number,
            address,
          },
          { transaction: t }
        )
        return credential;
      })

      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser })
    } catch (error) {
      console.error("Error during user registration:", error)
      res.status(500).json({ mesage: "Internal server error" })
    }
  },

  login: async (req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()})
    }

    const { emailOrUsername, password} = req.body

    try{
        const user = await Credential.findOne({
            where:{
                [Op.or]: [{email: emailOrUsername}, {username: emailOrUsername}]
            }
        })

        if(!user) {
            return res.status(401).json({message: "Invalid credentials"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid password"})
        }

        const payload = {
            credential_id: user.id,
            email: user.email,
            username: user.username
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "1h"
        })

        res.status(200).json({message: "Login successful", token})
    } catch(error){
        console.error("Error during login:", error)
        res.status(500).json({message: "Internal server error"})
    }
  }
};

module.exports = authController
