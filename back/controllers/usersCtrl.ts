import { Request, Response } from 'express';
import usersService from '../services/usersService';

const usersCtrl = {
  createUser: async (req: Request, res: Response) => {
    const user = await usersService.createUser(req);
    return res.status(201).json(user);
    },

    getUsers: async (req: Request, res: Response) => {
      const users = await usersService.getUsers();
      return res.status(200).json(users);
    },

    deleteUser: async (req: Request, res: Response) => {
        const user = await usersService.deleteUser(Number(req.params.id));
        return res.status(200).json(user);
    }
};

export default usersCtrl;