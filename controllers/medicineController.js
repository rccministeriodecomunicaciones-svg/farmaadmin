const Medicine = require('../models/medicineModel');

// Obtener todos los medicamentos
exports.getAllMedicines = async (req, res) => {
    try {
        const medicines = await Medicine.findAll();
        res.render('medicine/allMedicine', {
            nombrePagina: 'Medicamentos ',
            medicines
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los medicamentos' });
    }
};


exports.muestraformulario = async (req, res) => {
    
}

// Crear un nuevo medicamento
exports.createMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.create(req.body);
        res.status(201).json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el medicamento' });
    }
};

// Obtener un medicamento por ID
exports.getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el medicamento' });
    }
};

// Actualizar un medicamento
exports.updateMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        await medicine.update(req.body);
        res.status(200).json(medicine);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el medicamento' });
    }
};

// Eliminar un medicamento
exports.deleteMedicine = async (req, res) => {
    try {
        const medicine = await Medicine.findByPk(req.params.id);
        if (!medicine) {
            return res.status(404).json({ error: 'Medicamento no encontrado' });
        }
        await medicine.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el medicamento' });
    }
};
