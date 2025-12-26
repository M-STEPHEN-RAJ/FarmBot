import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { initServer } from "@/app/backend/server";
import User from "@/app/backend/models/User.js";
import { API } from "@/app/utils/api";

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

      let dbUser = await User.findOne({ email: user.email });

      if (!dbUser) {
        dbUser = await User.create({
          name: user.name,
          email: user.email,
          avatar: user.image || "",
          provider: "google",
          role: "user",
        });
      } else {
        if (!dbUser.provider.includes("google")) dbUser.provider += ",google";
        if (!dbUser.avatar && user.image) dbUser.avatar = user.image;
        await dbUser.save();
      }

      return `${API}/auth/google/callback?email=${encodeURIComponent(user.email)}`;
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
