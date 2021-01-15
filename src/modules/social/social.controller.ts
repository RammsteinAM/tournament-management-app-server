import { asyncWrapper } from "../../utils/asyncWrapper";
import { UserLoginData } from "../user/user.types";
import { Request, Response } from "express";
import { StatusCodesOkay } from "../../types/status";
import { registerOrLoginFacebookUser, registerOrLoginGoogleUser } from "./social.service";
import { ReqBody as ResBody } from "../../types/main";
import { GoogleUserData } from "./social.types";

export const googleLoginOrRegister = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body as GoogleUserData;
  const { accessToken, refreshToken } = await registerOrLoginGoogleUser(data.token);
  const resBody: ResBody<UserLoginData> = {
    success: true,
    data: { accessToken, refreshToken },
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});

export const facebookLoginOrRegister = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const { accessToken, refreshToken } = await registerOrLoginFacebookUser(data);
  const resBody: ResBody<UserLoginData> = {
    success: true,
    data: { accessToken, refreshToken },
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});