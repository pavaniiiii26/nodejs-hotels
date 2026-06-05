import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Person from './models/person.js';

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    //console.log('Authenticating user:', username);
    const user = await Person.findOne({ username });
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
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