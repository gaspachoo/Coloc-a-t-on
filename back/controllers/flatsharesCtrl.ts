import { Request, Response } from 'express';
import flatsharesService from '../services/flatsharesService';
import { AuthenticatedRequest } from '../types/express';

const flatsharesCtrl = {
  createFlatshare: async (req: Request, res: Response) => {
    try {
        const flatshare = await flatsharesService.createFlatshare(req);
        return res.status(201).json(flatshare);
    } catch(err: any) {
        const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
        return res.status(500).json({ error: 'Fail to create flatshare', details: message });
    }    
    },

    getFlatshares: async (req: Request, res: Response) => {
        try{

                const flatshares = await flatsharesService.getFlatshares();
                return res.status(200).json(flatshares);
        } catch(err: any) {
                const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
                return res.status(500).json({ error: 'Fail to get flatshares', details: message });
        }
    },

    getFlatshareById: async (req: Request, res: Response) => {
        try{
            const flatshare = await flatsharesService.getFlatshareById(Number(req.params.id));
            return res.status(200).json(flatshare);
        } catch(err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to get flatshare', details: message });
        }
    },

    updateFlatshare: async (req: Request, res: Response) => {
        try{
            const flatshare = await flatsharesService.updateFlatshare(Number(req.params.id), req.body);
            return res.status(200).json(flatshare);
        } catch(err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to update flatshare', details: message });
        }
    },

    deleteFlatshare: async (req: Request, res: Response) => {
        try{
            const flatshare = await flatsharesService.deleteFlatshare(Number(req.params.id));
            return res.status(200).json(flatshare);
        } catch(err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to delete flatshare', details: message });
        }
    },

    checkMembership: async (req: any, res: Response, next: any) => {
        try {
            const flatshareId = Number(req.params.id);
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const isMember = await flatsharesService.checkUserMembership(flatshareId, userId);

            if (!isMember) {
                return res.status(403).json({ error: 'Vous n\'êtes pas membre de cette colocation' });
            }

            next();
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to check membership', details: message });
        }
    },

    getMembers: async (req: Request, res: Response) => {
        try {
            const flatshareId = Number(req.params.id);
            const members = await flatsharesService.getMembers(flatshareId);
            return res.status(200).json(members);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to get members', details: message });
        }
    },

    uploadPhoto: async (req: Request, res: Response) => {
        try {
            const flatshareId = Number(req.params.id);
            
            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }

            const position = req.body.position ? Number(req.body.position) : undefined;
            
            const photo = await flatsharesService.addPhoto(
                flatshareId,
                req.file.buffer,
                position
            );

            return res.status(201).json(photo);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to upload photo', details: message });
        }
    },

    getPhotos: async (req: Request, res: Response) => {
        try {
            const flatshareId = Number(req.params.id);
            const photos = await flatsharesService.getPhotos(flatshareId);
            return res.status(200).json(photos);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to get photos', details: message });
        }
    },

    deletePhoto: async (req: Request, res: Response) => {
        try {
            const photoId = Number(req.params.photoId);
            await flatsharesService.deletePhoto(photoId);
            return res.status(204).send();
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to delete photo', details: message });
        }
    },

    updatePhotoPosition: async (req: Request, res: Response) => {
        try {
            const photoId = Number(req.params.photoId);
            const { position } = req.body;

            if (position === undefined) {
                return res.status(400).json({ error: 'Position is required' });
            }

            const photo = await flatsharesService.updatePhotoPosition(photoId, position);
            return res.status(200).json(photo);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to update photo position', details: message });
        }
    },

    createApplication: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const flatshareId = Number(req.params.id);
            const userId = req.user?.id;
            const { message } = req.body;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const application = await flatsharesService.createApplication(flatshareId, userId, message);
            return res.status(201).json(application);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to create application', details: message });
        }
    },

    getApplications: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const flatshareId = Number(req.params.id);
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const applications = await flatsharesService.getApplications(flatshareId, userId);
            return res.status(200).json(applications);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to get applications', details: message });
        }
    },

    acceptApplication: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const applicationId = Number(req.params.applicationId);
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const application = await flatsharesService.acceptApplication(applicationId, userId);
            return res.status(200).json(application);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to accept application', details: message });
        }
    },

    rejectApplication: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const applicationId = Number(req.params.applicationId);
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const application = await flatsharesService.rejectApplication(applicationId, userId);
            return res.status(200).json(application);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to reject application', details: message });
        }
    },

    getUserApplications: async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;

            if (!userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const applications = await flatsharesService.getUserApplications(userId);
            return res.status(200).json(applications);
        } catch (err: any) {
            const message = err?.meta?.driverAdapterError?.cause?.originalMessage || err.message || 'Unknown error';
            return res.status(500).json({ error: 'Fail to get user applications', details: message });
        }
    }
};

export default flatsharesCtrl;