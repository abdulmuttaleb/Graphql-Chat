import Joi from '@hapi/joi'

export default Joi.object().keys({
  email: Joi.string().email().required().label('Email'),
  username: Joi.string().alphanum().min(4).max(30).required().label('Username'),
  name: Joi.string().max(254).required().label('Name'),
  password: Joi.string().min(8).max(50).required().regex(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d).*$/)
    .message('must have at least one lowercase letter, one uppercase letter, one digit.').label('Password')
})
