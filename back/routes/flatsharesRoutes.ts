
import express from 'express';
import flatsharesCtrl from '../controllers/flatsharesCtrl';
const router = express.Router();

router.post('/', flatsharesCtrl.createFlatshare);
router.get('/', flatsharesCtrl.getFlatshares);
router.delete('/:id', flatsharesCtrl.deleteFlatshare);
router.get('/:id', flatsharesCtrl.getFlatshareById);
router.patch('/:id', flatsharesCtrl.updateFlatshare);

export default router;
