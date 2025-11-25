import { Request, Response } from 'express';
import prisma from '../services/databaseService';

const usersCtrl = {
  createUser: async (req: Request, res: Response) => {
    const { last_name, first_name, class_year, email, password_hash, role } = req.body;
    const user = await prisma.user.create({
        data: { last_name, first_name, class_year, email, password_hash, role }
    });
    return res.status(201).json(user);
    }
    

};

export default usersCtrl;