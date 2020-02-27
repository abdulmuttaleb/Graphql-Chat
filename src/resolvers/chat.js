import { startChat } from '../schemas'
import Joi from '@hapi/joi'
import { User, Chat } from '../models'
import { UserInputError } from 'apollo-server-express'

export default {
  Mutation: {
    startChat: async (root, args, { req }, info) => {
      const { userId } = req.session
      const { title, userIds } = args
      await startChat(userId).validateAsync(args, { abortEarly: false })

      const idsFound = await User.where('_id').in(userIds).countDocuments()

      if (idsFound !== userIds.length) {
        throw new UserInputError('One or more user IDs are invalid.')
      }

      userIds.push(userId)

      const chat = await Chat.create({ title, users: userIds })

      await User.updateMany({ _id: { '$in': userIds } }, {
        $push: { chats: chat }
      })
      return chat
    }
  }
}
