import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Person from './models/person.js';

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await Person.findOne({ username });
    
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }  // ← Close the !user block HERE

    // Now compare password using bcrypt (since you hash it in the model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

const localAuthmiddleware = (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || 'Unauthorized' });
    req.user = user;
    next();
  })(req, res, next);
};

export { localAuthmiddleware };
export default passport;