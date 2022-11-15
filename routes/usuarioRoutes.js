import express from "express"

const router = express.Router();

import { 
    registrar,
    autenticar, 
    confirmar, 
    olvidePassword, 
    comprobarToken, 
    nuevoPassword,
    perfil
} from '../controllers/usuarioController.js'

import checkAuth from '../middleware/checkAuth.js'


// autenticacion, registro y confirmacion de usuarios
router.post('/', registrar)
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
router.post('/olvide-password', olvidePassword)
router.get('/olvide-password/:token', comprobarToken)
router.post('/olvide-password/:token', nuevoPassword)

router.get('/perfil', checkAuth, perfil )



// router.get('/confirmar', (req, res) => {
//     res.json({msg: "confimando user"})
// })
// router.post('/', (req, res) => {
//     res.send("Desde -POST- API/USUARIOS")
// })
// router.put('/', (req, res) => {
//     res.send("Desde -PUT- API/USUARIOS")
// })
// router.delete('/', (req, res) => {
//     res.send("Desde -DELETE- API/USUARIOS")
// })

export default router