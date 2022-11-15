import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"


const obtenerProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        '$or' :[
            {'colaboradores': {$in: req.usuario}},
            {'creador': {$in: req.usuario}},
        ]
    }).select("-tareas")
    res.json(proyectos)
}

const nuevoProyecto = async (req, res) => { 
    console.log(req.body)
    console.log(req.usuario)
    const proyecto = new Proyecto(req.body) 
    proyecto.creador = req.usuario._id
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const obtenerProyecto = async (req, res) => {
    const { id } = req.params
    // const proyecto = await Proyecto.findById(id)
    const proyecto = await Proyecto.findById(id).populate({ path: 'tareas', populate: {path: 'completado', select: "nombre"}}).populate('colaboradores', "nombre email")
    // console.log("proyect", proyecto)
    if(!proyecto) {
        const error = new Error("no válido")
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some( colaborador => colaborador._id.toString() === req.usuario._id.toString() )) {
        const error = new Error("Acción no válida")
        return res.status(404).json({msg: error.message})
    }

    // Obtener las tareas del proyecto
    // const tareas = await Tarea.find().where('proyecto').equals(proyecto._id)
    
    res.json(
        proyecto
        // tareas
    )

}

const editarProyecto = async (req, res) => {
    const { id } = req.params
    // const proyecto = await Proyecto.findById(id)
    const proyecto = await Proyecto.findOne({_id: id})
    console.log(id,proyecto)
    if(!proyecto) {
        const error = new Error("no válido")
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida")
    }
    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }
}

const eliminarProyecto = async (req, res) => {
    const { id } = req.params
    // const proyecto = await Proyecto.findById(id)
    const proyecto = await Proyecto.findOne({_id: id})
    console.log(id,proyecto)
    if(!proyecto) {
        const error = new Error("no válido")
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida")
    }
    try {
        await proyecto.deleteOne()
        res.json({msg: "proyecto eliminado"})
    } catch (error) {
        console.log(error)
    }
}

const buscarColaborador = async (req, res) => {
    const {email} =  req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createAt -password -token -updatedAt -__v')
    if(!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }
    res.json(usuario)
}

const agregarColaborador = async (req, res) => {
    const proyecto = await Proyecto.findById(req.params.id)
    if(!proyecto) {
        const error = new Error('Proyecto no enontrado')
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no álida")
        return res.status(404).json({msg: error.message})
    }
    
    const {email} =  req.body

    const usuario = await Usuario.findOne({email}).select('-confirmado -createAt -password -token -updatedAt -__v')
    if(!usuario) {
        const error = new Error('Usuario no encontrado')
        return res.status(404).json({msg: error.message})
    }

    // El colaborador no es el admini
    if(proyecto.creador.toString() === usuario._id.toString()) {
        const error = new Error('El creador del prpyecto o puede ser colaborador')
        return res.status(404).json({msg: error.message})
    }
    // Que no se agregue dos veces
    if(proyecto.colaboradores.includes(usuario._id)){
        const error = new Error('El usuario ya pertenece al proyecto')
        return res.status(404).json({msg: error.message})
    }
    // Esta bien se puede agregar
    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({msg: 'Colaborador agregado correctamente'})

}

const eliminarColaborador = async (req, res) => {

    const proyecto = await Proyecto.findById(req.params.id)
    if(!proyecto) {
        const error = new Error('Proyecto no enontrado')
        return res.status(404).json({msg: error.message})
    }
    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no válida")
        return res.status(404).json({msg: error.message})
    }
    // ok se puede elimianr
    proyecto.colaboradores.pull(req.body.id)
    // console.log(proyecto)
    await proyecto.save()
    res.json({msg: 'Colaborador eliminado correctamente'})

}


// Lo de abajo se hace todo desde obtener en signgular
// const obtenerTareas = async (req, res) => {
//     const { id } = req.params;

//     const proyecto = await Proyecto.findOne({_id: id})
//     console.log(id,proyecto)
//     if(!proyecto) {
//         const error = new Error("no válido")
//         return res.status(404).json({msg: error.message})
//     }

//     const tareas = await Tarea.find().where('proyecto').equals(id)

//     res.json(tareas)

// }

export {
    obtenerProyecto,
    nuevoProyecto,
    obtenerProyectos,
    editarProyecto,
    eliminarProyecto,
    agregarColaborador,
    eliminarColaborador,
    buscarColaborador
    // obtenerTareas,
}