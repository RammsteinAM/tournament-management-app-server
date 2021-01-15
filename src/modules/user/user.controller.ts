import { Request, Response } from "express";
import { asyncWrapper } from "../../utils/asyncWrapper";
import * as userService from "../../modules/user/user.service";
import { StatusCodesOkay } from '../../../src/types/status';
import { AuthRequest } from '../../types/main';
import { UserEditRequestData } from "./user.types";
import { validateUserUpdate } from "../auth/auth.validators";
import BadRequestError from "../../errors/BadRequestError";

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

export const editUser = asyncWrapper(async (req: AuthRequest<{ id: number }>, res: Response): Promise<void> => {
  const { id } = req.params;
  const data = req.body as UserEditRequestData;
  if (!data.displayName && !data.currentPassword) throw new BadRequestError();
  if (data.currentPassword) {
    validateUserUpdate(data);
  }
  const { email, displayName } = await userService.updateUser(parseInt(`${id}`, 10), data);

  res.status(StatusCodesOkay.OK).json({
    success: true,
    data: { email, displayName },
  });
})

export const deleteUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
  // const user = await userService.deleteUserById(req.params.id);
  // res.status(200).json({
  //   success: true,
  //   data: {}
  // });
});