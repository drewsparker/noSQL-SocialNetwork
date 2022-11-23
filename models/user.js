// Define Mongoose
const { Schema, Types } = require('mongoose');
const Thought = require('./thought');

// Create a new instance of the Mongoose schema to define shape of each document
const userSchema = new Schema({
  // Add individual properties and their types
  // Setting required to true will disallow null values
  username: { type: String, required: true, unique: true, trimmed: true },
  email: {
    type: String, unique: true,
    validate: {
      validator: function (phoneNumber) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(phoneNumber);
      },
      message: props => `${props.value} is not a valid email address!`
    },
    required: [true, 'User phone number required']
  },
  thoughts: [{ type: ObjectId, ref: 'thought' }],
  friends: [{ type: ObjectId, ref: 'user' }],
},
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

// Create a virtual property `friendCount` that gets the amount of comments per user
userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

// Initialize our Post model
const user = model('user', userSchema);

module.exports = user;

