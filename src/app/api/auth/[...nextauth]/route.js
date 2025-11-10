import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { initServer } from "@/app/backend/server";
import User from "@/app/backend/models/User.js";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      await initServer();

      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          name: user.name,
          email: user.email,
          avatar: user.image || "",
          provider: "google",
          role: "user",
        });
      } else {
        if (!existingUser.provider.includes("google")) {
          existingUser.provider += ",google";
        }

        if (!existingUser.avatar && user.image) {
          existingUser.avatar = user.image;
        }

        await existingUser.save();
      }

      return true;
    },

    async session({ session }) {
      await initServer();
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        session.user.role = dbUser.role;
        session.user.provider = dbUser.provider;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
