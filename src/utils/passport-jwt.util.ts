// passport-jwt.ulti

import User from '../models/user.model';
import { Strategy, ExtractJwt } from 'passport-jwt';

const optsJwt = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
    issuer: process.env.JWT_ISSUER,
    audience: process.env.JWT_AUDIENCE,
};

const strategyJwt = new Strategy(optsJwt, async (payload, done) => {

    try {

        const user = await User.findById(payload.id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }

    } catch (error) {

        done(error, false);
    }

});

export default strategyJwt;

