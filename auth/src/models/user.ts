import mongoose from 'mongoose';
import { PasswordManager } from '../services/password-manager';

// describes the properties to create a User model in MongoDB/Mongoose
interface UserAttrs {
  email: string;
  password: string;
}

// describes the props User Model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

// describes the properties that User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

// 'function' keyword is intentional due to use of 'this' inside here
// and lexical context that => syntax provides which means conflict will occur
userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await PasswordManager.toHash(this.get('password'));
    this.set('password', hashed);
  }
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };
