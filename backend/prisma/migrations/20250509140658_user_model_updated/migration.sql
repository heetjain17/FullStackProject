-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerificationExpiry" TIMESTAMP(3),
ADD COLUMN     "emailVerificationToken" TEXT,
ADD COLUMN     "forgotPasswordExpiry" TIMESTAMP(3),
ADD COLUMN     "forgotPasswordToken" TEXT,
ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refreshToken" TEXT;
