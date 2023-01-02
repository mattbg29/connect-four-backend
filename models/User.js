import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  userScore: {
    type: Number,
    default: 0
  },
  botScore: {
    type: Number,
    default: 0
  },
  loggedIn: {
    type: Number,
    default: 1
  },
  notify: {
    type: String,
    default: ''
  },
  grid: {
    type: Object
  }
});

let User = mongoose.model("user", userSchema);

export default User;


