import { asyncWrapper } from "../../utils/asyncWrapper";
import { UserAuthData, UserCreateData, UserCreationData, UserLoginCheckData, UserLoginData, UserLoginTokenData, UserResetPasswordRequestData, UserVerificationData, UserVerifiedData } from "../user/user.types";
import { validateUserCreate, validateUserUpdate } from "../auth/auth.validators";
import { Request, Response } from "express";
import { StatusCodesOkay } from "../../types/status";
import {
  generateAndSendVerificationEmail,
  getAuthorizedAndVerifiedUser,
  getAuthorizedUser,
  getLoginTokens,
  registerUserService,
  verifyUserService,
  resetPasswordService,
  loginCheckService
} from "./auth.service";
import { ReqBody as ResBody } from "../../types/main";

export const registerUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserCreateData;
  validateUserCreate(data);
  const { id, displayName, email, createdAt, updatedAt } = await registerUserService(data);
  const resBody: ResBody<UserCreationData> = {
    success: true,
    data: { id, displayName, email },
  };
  res.status(StatusCodesOkay.Created).json(resBody);
});

export const verifyUser = asyncWrapper(async (req: Request<UserVerificationData>, res: Response): Promise<void> => {
  const { token } = req.params;
  const { id, email, displayName, isVerified } = await verifyUserService({ token });
  const resBody: ResBody<UserVerifiedData> = {
    success: true,
    data: { id, displayName, email, isVerified },
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});

export const login = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserAuthData;
  const { id, displayName, email } = await getAuthorizedAndVerifiedUser(data);
  const { accessToken, refreshToken } = getLoginTokens(id);

  const reqBody: ResBody<UserLoginData> = {
    success: true,
    data: { accessToken, refreshToken, email, displayName, id },
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const loginCheck = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const cookieAccessToken = req.cookies['x-auth-token'];
  const { refreshToken } = req.body as UserLoginCheckData;
  const tokenData: UserLoginTokenData = {
    accessToken: cookieAccessToken,
    refreshToken
  }
  const data = await loginCheckService(tokenData);

  const reqBody: ResBody<UserCreationData> = {
    success: true,
    data
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const requestVerificationEmail = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserAuthData;
  const dbUser = await getAuthorizedUser(data);
  await generateAndSendVerificationEmail(dbUser, true);

  const reqBody: ResBody = {
    success: true,
    message: "Verification Email sent",
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const requestAccessToken = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  // TODO
  // const data = req.header as UserAuthData;
  // const dbUser = await getAuthorizedUser(data);
  // await generateAndSendVerificationEmail(dbUser);

  const reqBody: ResBody = {
    success: true,
    message: "Verification Email sent",
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const resetPassword = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;
  const data = req.body as UserResetPasswordRequestData;
  validateUserUpdate({ password: data.password });
  const { email } = await resetPasswordService({ token, password: data.password });
  const resBody: ResBody<UserLoginData> = {
    success: true,
    message: `Password for ${email} was reset`,
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});