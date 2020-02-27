import Joi from '@hapi/joi'
import mongoose from 'mongoose'

const objectId =
  {
    type: 'string',
    base: Joi.string(),
    messages: {
      'string.objectId': '{{#label}} must be a valid object ID'
    },
    rules: {
      objectId: {
        validate (value, helpers) {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('string.objectId')
          }
          return value
        }
      }
    }
  }

export default Joi.extend(objectId)
