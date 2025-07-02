import { db } from "@/lib/db";

export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const TwoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email: email,
      },
    });
    return TwoFactorToken;
  } catch (error) {
    return null;
  }
};

export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const TwoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token: token,
      },
    });

    return TwoFactorToken;
  } catch (error) {
    return null;
  }
};
