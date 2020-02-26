import mongoose from 'mongoose'
import { UserInputError } from 'apollo-server-express'
import { signUp, signIn } from '../schemas'
import { User } from '../models'
import { attemptSignIn, signOut } from '../auth'

export default {
  Query: {
    me: (root, args, { req }, info) => {
      // TODO: add projection

      return User.findById(req.session.userId)
    },
    users: (root, args, { req }, info) => {
      // TODO: projection, pagination, sanitization

      return User.find({})
    },
    user: (root, { id }, { req }, info) => {
      // TODO: projection

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new UserInputError('User ID is not a valid Object ID.')
      }
      return User.findById(id)
    }
  },
  Mutation: {
    signUp: async (root, args, { req }, info) => {
      // TODO: not auth

      await signUp.validateAsync(args, { abortEarly: false })

      const user = await User.create(args)

      req.session.userId = user.id

      return user
    },

    signIn: async (root, args, { req }, info) => {
      await signIn.validateAsync(args, { abortEarly: false })

      const user = await attemptSignIn(args.email, args.password)

      req.session.userId = user.id

      return user
    },

    signOut: async (root, args, { req, res }, info) => {
      return signOut(req, res)
    }
  }
}
