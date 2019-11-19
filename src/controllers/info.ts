import { NextFunction, Request, Response } from "express";

export const getInfo = async (req: Request, res: Response, next: NextFunction) => {
  return res
    .status(200)
    .json({
      superSecretMessage: 'Only logged user can see this message'
    });
};
