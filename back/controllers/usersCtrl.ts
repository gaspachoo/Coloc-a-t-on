import { Request, Response } from 'express';
import usersService from '../services/usersService';

const usersCtrl = {
  createUser: async (req: Request, res: Response) => {
    try {
        const user = await usersService.createUser(req);
        return res.status(201).json(user);
    } catch(err: any) {
        const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
        return res.status(500).json({ error: 'Fail to create user', details: message });
    }    
    },

    getUsers: async (req: Request, res: Response) => {
        try{

                const users = await usersService.getUsers();
                return res.status(200).json(users);
        } catch(err: any) {
                const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
                return res.status(500).json({ error: 'Fail to get users', details: message });
        }
    },

    getUserById: async (req: Request, res: Response) => {
        try{
            const user = await usersService.getUserById(Number(req.params.id));
            return res.status(200).json(user);
        } catch(err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to get user', details: message });
        }
    },

    updateUser: async (req: Request, res: Response) => {
        try{
            const user = await usersService.updateUser(Number(req.params.id), req.body);
            return res.status(200).json(user);
        } catch(err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to update user', details: message });
        }
    },

    deleteUser: async (req: Request, res: Response) => {
        try{
            const user = await usersService.deleteUser(Number(req.params.id));
            return res.status(200).json(user);
        } catch(err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to delete user', details: message });
        }
    }
};

export default usersCtrl;