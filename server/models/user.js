// import { mongoose } from 'mongoose';
import { mongoose } from '../db/mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import _ from 'lodash';
import bcrypt from 'bcryptjs';

// {
//   email: 'aaa@bb.com',
//   password: 'adfadfadfasdfa',
//   tokens: [{
//     access: 'auth',             -> token tyep: different login methods
//                                                have different tokens
//     token: 'adadfadfadfdfgdfa',
//   }],
// }
//

let userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
});

userSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  let User = this;

  return User.findOne({email})
  .then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, success) => {
        if (success) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  })
  .catch(e => {
    return Promise.reject();
  });
};

// overwrite the toJSON() method here????
//
userSchema.methods.toJSON = function() {
  let user = this;
  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = 'auth';
  let token = jwt.sign({
    _id: user._id.toHexString(),
    access,
  }, 'abc123').toString();

  user.tokens.pop();
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

userSchema.methods.removeToken = function(token) {
  let user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

// ================================================================
// mongoose middlerware
//

// hash the password before is is saved to the db
//
userSchema.pre('save', function(next) {
  let user = this;

  // check to see if password is modified
  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// ================================================================

let User = mongoose.model('User', userSchema);

module.exports = { User };
