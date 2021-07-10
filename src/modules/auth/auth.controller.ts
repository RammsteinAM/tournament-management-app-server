import { asyncWrapper } from "../../utils/asyncWrapper";
import { EmailCheckData, UserAuthData, UserCreateData, UserCreationData, UserEditRequestData, UserLoginCheckData, UserLoginData, UserLoginTokenData, UserPasswordResetData, UserResetPasswordRequestData, UserVerificationData, UserVerifiedData } from "./auth.types";
import { validateUserCreate, validateUserUpdate } from "../auth/auth.validators";
import { Request, Response } from "express";
import { StatusCodesOkay } from "../../types/status";
import * as authServices from "./auth.service";
import { Locales, ResBody, RequestWithUserId } from "../../types/main";
import BadRequestError from "../../errors/BadRequestError";

export const registerUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserCreateData;
  const reqLocale: string = req.query.lang?.toString();
  let locale: keyof typeof Locales = Locales.en;
  if (Object.values(Locales).includes(reqLocale as Locales)) {
    locale = reqLocale as Locales;
  }
  validateUserCreate(data);
  const { id, displayName, email, createdAt, updatedAt } = await authServices.registerUser(data, locale);
  const resBody: ResBody<UserCreationData> = {
    success: true,
    data: { id, displayName, email },
  };
  res.status(StatusCodesOkay.Created).json(resBody);
});

export const checkEmail = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as EmailCheckData;
  await authServices.isEmailRegistered(data.email);
  const resBody: ResBody = {
    success: true
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});

export const verifyUser = asyncWrapper(async (req: Request<UserVerificationData>, res: Response): Promise<void> => {
  const { token } = req.params;
  const { id, email, displayName, isVerified } = await authServices.verifyUser({ token });
  const resBody: ResBody<UserVerifiedData> = {
    success: true,
    data: { id, displayName, email, isVerified },
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});

export const login = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserAuthData;
  const { id, displayName, email } = await authServices.getAuthorizedAndVerifiedUser(data);
  const { accessToken, refreshToken } = authServices.getLoginTokens(id);

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
  const data = await authServices.loginCheck(tokenData);

  const reqBody: ResBody<UserCreationData> = {
    success: true,
    data
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const checkAccessToken = asyncWrapper<Response>(async (req: Request, res: Response): Promise<Response> => {
  const cookieAccessToken = req.cookies['x-auth-token'];
  const { refreshToken } = req.body as UserLoginCheckData;
  const tokenData: UserLoginTokenData = {
    accessToken: cookieAccessToken,
    refreshToken
  }
  const newAccessToken = await authServices.checkAccessToken(tokenData);

  if (newAccessToken) {
    return res.status(StatusCodesOkay.OK).json({
      success: true,
      data: { accessToken: newAccessToken }
    });
  }
  return res.status(StatusCodesOkay.NoContent).json({
    success: true,
  });
});

export const requestVerificationEmail = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserAuthData;
  const reqLocale: string = req.query.lang?.toString();
  let locale: keyof typeof Locales = Locales.en;
  if (Object.values(Locales).includes(reqLocale as Locales)) {
    locale = reqLocale as Locales;
  }
  const dbUser = await authServices.getAuthorizedUser(data);
  await authServices.generateAndSendVerificationEmail(dbUser, locale, true);

  const reqBody: ResBody = {
    success: true,
    message: "Verification Email sent",
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const requestPasswordResetEmail = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserPasswordResetData;
  const reqLocale: string = req.query.lang?.toString();
  let locale: keyof typeof Locales = Locales.en;
  if (Object.values(Locales).includes(reqLocale as Locales)) {
    locale = reqLocale as Locales;
  }
  await authServices.sendPasswordResetEmail(data.email, locale);

  const reqBody: ResBody = {
    success: true,
    message: "Password Reset Email sent",
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const resetPassword = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
  const { token } = req.params;
  const data = req.body as UserResetPasswordRequestData;
  validateUserUpdate({ password: data.password });
  const { email } = await authServices.resetPassword({ token, password: data.password });
  const resBody: ResBody<UserLoginData> = {
    success: true,
    message: `Password for ${email} was reset`,
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});

export const getUser = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
  const { email, displayName } = await authServices.getUserById(parseInt(`${req.userId}`, 10));

  res.status(StatusCodesOkay.OK).json({
    success: true,
    data: { email, displayName },
  });
})

export const editUser = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
  const data = req.body as UserEditRequestData;
  if (!data.displayName && !data.currentPassword) throw new BadRequestError();
  if (data.currentPassword) {
    validateUserUpdate(data);
  }
  const { email, displayName } = await authServices.updateUser(parseInt(`${req.userId}`, 10), data);

  res.status(StatusCodesOkay.OK).json({
    success: true,
    data: { id: req.userId, email, displayName },
  });
})

export const deleteUserEmailRequest = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
  const reqLocale: string = req.query.lang?.toString();
  let locale: keyof typeof Locales = Locales.en;
  if (Object.values(Locales).includes(reqLocale as Locales)) {
    locale = reqLocale as Locales;
  }
  const { email, displayName } = await authServices.deleteAccountEmailRequest(parseInt(`${req.userId}`, 10), locale);

  res.status(StatusCodesOkay.OK).json({
    success: true,
    data: { id: req.userId, email, displayName },
  });
});

export const deleteUser = asyncWrapper(async (req: Request<UserVerificationData>, res: Response): Promise<void> => {
  const { token } = req.params;
  const reqLocale: string = req.query.lang?.toString();
  let locale: keyof typeof Locales = Locales.en;
  if (Object.values(Locales).includes(reqLocale as Locales)) {
    locale = reqLocale as Locales;
  }
  await authServices.deleteUser({ token }, locale);
  res.status(StatusCodesOkay.NoContent).json({
    success: true,
  });
});