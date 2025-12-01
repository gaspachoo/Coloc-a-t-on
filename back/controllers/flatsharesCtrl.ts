import { Request, Response } from 'express';
import flatsharesService from '../services/flatsharesService';

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
    }
};

export default flatsharesCtrl;