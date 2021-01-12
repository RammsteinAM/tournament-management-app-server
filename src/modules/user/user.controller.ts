import BaseError from '../../errors/BaseError';
import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import prisma from "../../../prisma/prisma";
import * as userService from "../../modules/user/user.service";
import { StatusCodesOkay } from '../../../src/types/status';
import User from './user.model';
import { UserAuthData, UserData, UserVerificationData } from './user.types';
import { validateUserCreate } from './user.validators';
import BadRequestError from '../../errors/BadRequestError';
import { AuthRequest } from '../../types/main';

export const getUser = asyncWrapper(async (req: AuthRequest<{ id: number }>, res: Response): Promise<void> => {

  // const user = new User({ id: 70 })
  // const userData = await user.getUserById();
  const { id } = req.params;
  const { email, displayName } = await userService.getUserById(parseInt(`${id}`, 10));

  res.status(StatusCodesOkay.OK).json({
    success: true,
    data: { email, displayName },
  });
})

// export const verifyUser = asyncWrapper(async (req: Request<{ token: string }>, res: Response): Promise<void> => {
//   const token = req.params.token;
//   const userModel = new User({verificationCode: token});
//   const { email, displayName, isVerified } = await userModel.verify();
//   res.status(StatusCodesOkay.OK).json({
//     success: true,
//     data: { displayName, email, isVerified },
//   });
// });

// export const registerUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
//   const data = req.body as UserData;
//   validateUserCreate(data);
//   const userModel = new User(req.body as UserData);
//   const { displayName, email } = await userModel.create();
//   res.status(StatusCodesOkay.Created).json({
//     success: true,
//     data: { displayName, email },
//   });
// });

export const deleteUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  // const user = await userService.deleteUserById(req.params.id);
  // res.status(200).json({
  //   success: true,
  //   data: {}
  // });
});