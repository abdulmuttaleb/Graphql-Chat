import Joi from './joi'
import mongoose from 'mongoose'

export const startChat = userId => Joi.object().keys({
  title: Joi.string().min(6).max(30).label('Title'),
  userIds: Joi.array().min(1).max(100).unique().items(
    Joi.string().objectId().not(userId).label('User ID')
  ).label('User IDs')
})
