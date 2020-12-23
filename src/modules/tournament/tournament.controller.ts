// import BaseError from '../../errors/BaseError';
// import { Request, Response } from "express";
// const asyncWrapper = require("../utils/asyncWrapper");
// const Tournament = require("@src/models/tournament.models");
// import tournamentService from '@src/modules/tournament/tournament.service'

// export const getTournaments = asyncWrapper(async (req: Request, res: Response) => {
//   const tournaments = await Tournament.find();
//   res.status(200).json({
//     success: true,
//     data: tournaments,
//   });
// });

// export const getTournament = asyncWrapper(async (req: Request, res: Response) => {
//   const todo = await tournamentService.getTodoById(req.params.id);
//   res.status(200).json({
//     success: true,
//     data: todo,
//   });
// });

// export const createTournament = asyncWrapper(async (req: Request, res: Response) => {
//   const todo = await Tournament.create(req.body);
//   res.status(201).json({
//     success: true,
//     data: todo,
//   });
// });

// export const updateTournament = asyncWrapper(async (req: Request, res: Response) => {
//   const todo = await tournamentService.updateTodo(req.params.id, req.body);
//   res.status(200).json({
//     success: true,
//     data: todo,
//   });
// });

// export const deleteTournament = asyncWrapper(async (req: Request, res: Response) => {
//   const todo = await tournamentService.deleteTodoById(req.params.id);
//   res.status(200).json({
//     success: true,
//     data: {}
//   });
// });