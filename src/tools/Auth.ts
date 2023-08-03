import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import passport from "passport";
import { UserModel, User } from "../Models/UserModel";

export const initPassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
        callbackURL: process.env.GOOGLE_CALLBACK as string,
        scope: ["email", "profile"],        
      },
      async (accessToken, refreshToken, profile: User, done) => {
        console.log(accessToken, refreshToken);
        // console.log(profile);
        const member=await UserModel.findOrCreate(profile);
        
        done(null, member);
      }
    )
  );
};
