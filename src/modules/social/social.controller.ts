import { asyncWrapper } from "../../utils/asyncWrapper";
import { SocialUserLoginData, UserLoginData } from "../user/user.types";
import { Request, Response } from "express";
import { StatusCodesOkay } from "../../types/status";
import { registerOrLoginFacebookUser, registerOrLoginGoogleUser } from "./social.service";
import { ReqBody as ResBody } from "../../types/main";
import { GoogleUserData } from "./social.types";

export const googleLoginOrRegister = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const reqData = req.body as GoogleUserData;
  const data = await registerOrLoginGoogleUser(reqData.token);
  const resBody: ResBody<SocialUserLoginData> = {
    success: true,
    data: { ...data, social: true },
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});

export const facebookLoginOrRegister = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const reqData = req.body;
  const data = await registerOrLoginFacebookUser(reqData);
  const resBody: ResBody<SocialUserLoginData> = {
    success: true,
    data: { ...data, social: true },
  };
  res.status(StatusCodesOkay.OK).json(resBody);
});
