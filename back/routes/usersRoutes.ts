
import express from 'express';
import usersCtrl from '../controllers/usersCtrl';
const router = express.Router();

router.post('/', usersCtrl.createUser);
router.get('/', usersCtrl.getUsers);
router.delete('/:id', usersCtrl.deleteUser);
router.get('/:id', usersCtrl.getUserById);
router.patch('/:id', usersCtrl.updateUser);

export default router;
