import { signUp, signIn, objectId } from '../schemas'
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
    user: async (root, args, { req }, info) => {
      // TODO: projection
      await objectId.validateAsync(args)
      return User.findById(args.id)
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
  },
  User: {
    chats: async (user, args, context, info) => {
      return (await user.populate('chats').execPopulate()).chats
    }
  }
}
