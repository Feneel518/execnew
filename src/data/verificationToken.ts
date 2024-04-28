import { db } from "@/lib/db";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificcationToken = await db.verificationToken.findFirst({
      where: {
        email: email,
      },
    });
    return verificcationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificcationToken = await db.verificationToken.findUnique({
      where: {
        token: token,
      },
    });

    return verificcationToken;
  } catch (error) {
    return null;
  }
};
