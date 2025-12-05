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
    },

    checkOwnership: async (req: any, res: Response, next: any) => {
        try {
            const userId = Number(req.params.id);
            const currentUserId = req.user?.id;

            if (!currentUserId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            if (userId !== currentUserId) {
                return res.status(403).json({ error: 'Vous ne pouvez modifier que votre propre compte' });
            }

            next();
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to check ownership', details: message });
        }
    },

    uploadProfilePhoto: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const user = await usersService.uploadProfilePhoto(userId, req.file.buffer);
            return res.status(200).json(user);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to upload profile photo', details: message });
        }
    },

    deleteProfilePhoto: async (req: Request, res: Response) => {
        try {
            const userId = Number(req.params.id);
            const user = await usersService.deleteProfilePhoto(userId);
            return res.status(200).json(user);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to delete profile photo', details: message });
        }
    }
};

export default usersCtrl;