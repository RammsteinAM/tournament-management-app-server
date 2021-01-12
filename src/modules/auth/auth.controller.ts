import { asyncWrapper } from "../../utils/asyncWrapper";
import { UserAuthData, UserCreateData, UserData, UserLoginData, UserVerificationData } from "../user/user.types";
import { validateUserCreate } from "../user/user.validators";
import { Request, Response } from "express";
import { StatusCodesOkay } from "../../types/status";
import { generateAndSendVerificationEmail, getAuthorizedAndVerifiedUser, getAuthorizedUser, getLoginTokens, registerUserService, verifyUserService } from "./auth.service";
import { ReqBody as ResBody } from "../../types/main";

export const registerUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserCreateData;
  validateUserCreate(data);
  const { displayName, email } = await registerUserService(data);
  const resBody: ResBody<UserData> = {
    success: true,
    data: { displayName, email },
  };
  res.status(StatusCodesOkay.Created).json(resBody);
});

export const verifyUser = asyncWrapper(async (req: Request<UserVerificationData>, res: Response): Promise<void> => {
  const { token } = req.params;
  const { email, displayName, isVerified } = await verifyUserService({ token });
  const resBody: ResBody<UserData> = {
    success: true,
    data: { displayName, email, isVerified },
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});

export const login = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserAuthData;
  const { id: userId } = await getAuthorizedAndVerifiedUser(data);
  const { accessToken, refreshToken } = getLoginTokens(userId);

  const reqBody: ResBody<UserLoginData> = {
    success: true,
    data: { accessToken, refreshToken },
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
  // const user = await userService.verifyUser(req.params.id);
  // res.status(StatusCodesOkay.OK).json({
  //   success: true,
  //   data: user,
  // });
});

export const requestVerificationEmail = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as UserAuthData;
  const dbUser = await getAuthorizedUser(data);
  await generateAndSendVerificationEmail(dbUser);

  const reqBody: ResBody = {
    success: true,
    message: "Verification Email sent",
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});

export const requestAccessToken = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  // const data = req.header as UserAuthData;
  // const dbUser = await getAuthorizedUser(data);
  // await generateAndSendVerificationEmail(dbUser);

  const reqBody: ResBody = {
    success: true,
    message: "Verification Email sent",
  };
  res.status(StatusCodesOkay.OK).json(reqBody);
});