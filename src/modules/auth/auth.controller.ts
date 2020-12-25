import { asyncWrapper } from "../../utils/asyncWrapper";
import { UserData } from "../user/user.types";
import { validateUserCreate } from "../user/user.validators";
import { Request, Response } from "express";
import { StatusCodesOkay } from "../../types/status";

export const registerUser = asyncWrapper(async (req: Request, res: Response): Promise<void> => {
    const data = req.body as UserData;
    validateUserCreate(data);
    //const userModel = new User(req.body as UserData);

    //const { displayName, email } = await userModel.create();
    // res.status(StatusCodesOkay.Created).json({
    //   success: true,
    //   data: { displayName, email },
    // });
  });