import BaseError from '../../errors/BaseError';
import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import prisma from "../../../prisma/prisma";
import * as userService from "../../modules/user/user.service";
import { sendMail } from './verification.service';
import { StatusCodesOkay } from '../../../src/types/status';
import User from './user.model';
import { UserAuthData, UserData } from './user.types';

export const getUserById = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  sendMail()
  // const user = await userService.getUserById(req.params.id);
  // res.status(200).json({
  //   success: true,
  //   data: user,
  // });
});

export const verifyUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  
  // const user = await userService.verifyUser(req.params.id);
  // res.status(StatusCodesOkay.OK).json({
  //   success: true,
  //   data: user,
  // });
});

export const signIn = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  const user = new User(req.body as UserAuthData);
  const {} = await user.signIn();
  // const user = await userService.verifyUser(req.params.id);
  // res.status(StatusCodesOkay.OK).json({
  //   success: true,
  //   data: user,
  // });
});

export const createUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  // const user = await prisma.user.create({ data });
  const userModel = new User(req.body as UserData);
  const { displayName, email } = await userModel.create();
  // const {displayName, email} = await userService.createUser(req.body);
  res.status(StatusCodesOkay.Created).json({
    success: true,
    data: { displayName, email },
  });
});

export const deleteUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  // const user = await userService.deleteUserById(req.params.id);
  // res.status(200).json({
  //   success: true,
  //   data: {}
  // });
});