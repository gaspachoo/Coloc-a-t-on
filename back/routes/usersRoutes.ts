
import express from 'express';
import usersCtrl from '../controllers/usersCtrl';
const router = express.Router();

// Exemple : Route pour créer un utilisateur
router.post('/', usersCtrl.createUser);

// Exemple : Route pour lister les utilisateurs
router.get('/', usersCtrl.getUsers);

router.delete('/:id', usersCtrl.deleteUser);

export default router;
