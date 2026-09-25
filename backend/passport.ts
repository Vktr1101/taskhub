import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "./models/User.ts";

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: process.env.GOOGLE_CALLBACK_URL!
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error('No email from Google'));
        }
        const googleId = profile.id;

        let user = await User.findOne({ where: { email } });
        if (!user) {
            user = await User.create({
                username: profile.displayName + '-' + profile.id.slice(-4),
                email: email,
                googleId: googleId,
                admin: true
            });
        }

        return done(null, user);
    } catch (error) {
        return done(error as Error);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await User.findByPk(id);
        done(null, user);
    } catch (error) {
        done(error as Error);
    }
});

export default passport;