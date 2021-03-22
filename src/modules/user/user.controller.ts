// import { Request, Response } from "express";
// import { asyncWrapper } from "../../utils/asyncWrapper";
// import * as userService from "../../modules/user/user.service";
// import { StatusCodesOkay } from '../../../src/types/status';
// import { RequestWithUserId, ReqBody, Locales } from '../../types/main';
// import { UserEditRequestData, UserPasswordResetData } from "../auth/auth.types";
// import { validateUserUpdate } from "../auth/auth.validators";
// import BadRequestError from "../../errors/BadRequestError";
// import { sendPasswordResetEmail } from "../../modules/user/user.service";

// export const getUser = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {
//   const { email, displayName } = await userService.getUserById(parseInt(`${req.userId}`, 10));

//   res.status(StatusCodesOkay.OK).json({
//     success: true,
//     data: { email, displayName },
//   });
// })

// export const editUser = asyncWrapper(async (req: RequestWithUserId, res: Response): Promise<void> => {  
//   const data = req.body as UserEditRequestData;
//   if (!data.displayName && !data.currentPassword) throw new BadRequestError();
//   if (data.currentPassword) {
//     validateUserUpdate(data);
//   }
//   const { email, displayName } = await userService.updateUser(parseInt(`${req.userId}`, 10), data);

//   res.status(StatusCodesOkay.OK).json({
//     success: true,
//     data: { id: req.userId, email, displayName },
//   });
// })
