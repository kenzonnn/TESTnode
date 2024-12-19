var Ordinateur = require('./ordinateurModel');
var socketIo = require('socket.io')

function socketIO(server) {
    const io = require('socket.io')(server);
    io.on('connection', (socket) => {
        console.log('Un utilisateur est connecté');
        socket.on('searchByCategory', async (category) => {
            console.log(`Recherche par catégorie : ${category}`);
            try {
                const ordinateurs = await Ordinateur.find({ categorie: category });
                socket.emit('searchByCategoryResult', ordinateurs); 
            } catch (err) {
                socket.emit('error', { message: "Erreur lors de la recherche par catégorie", details: err });
            }
        });

        socket.on('disconnect', () => {
            console.log('Un utilisateur s\'est déconnecté');
        });
    });

    return io;
}

function OrdinateurView(req, res, next) {
    res.render('ordinateur');
}

async function list(req, res, next) {
    try {
        const data = await Ordinateur.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la récupération des ordinateurs', details: err });
    }
}

const create = async (req, res, next) => {
    const { module, categorie, dateFabrication, prix } = req.body;

    try {
        const newOrdinateur = new Ordinateur({
            module,
            categorie,
            dateFabrication,
            prix
        });

        const savedOrdinateur = await newOrdinateur.save();
        res.status(201).json({
            message: 'Ordinateur ajouté avec succès',
            ordinateur: savedOrdinateur
        });
    } catch (err) {
        res.status(500).json({
            error: 'Erreur lors de l\'ajout de l\'ordinateur',
            details: err
        });
    }
};

const update = async (req, res, next) => {
    try {
        const updatedOrdinateur = await Ordinateur.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrdinateur) {
            res.status(404).json({ error: 'Ordinateur non trouvé' });
        } else {
            res.status(200).json({ message: 'Ordinateur mis à jour', ordinateur: updatedOrdinateur });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la mise à jour', details: err });
    }
};

async function deleteU(req, res, next) {
    try {
        const deletedOrdinateur = await Ordinateur.findByIdAndDelete(req.params.id);
        if (!deletedOrdinateur) {
            res.status(404).json({ error: 'Ordinateur non trouvé' });
        } else {
            res.status(200).json({ message: 'Ordinateur supprimé avec succès', ordinateur: deletedOrdinateur });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erreur lors de la suppression', details: err });
    }
}

const searchByPriceRange = async (req, res, next) => {
    const { minPrice, maxPrice } = req.query;

    if (!minPrice || !maxPrice) {
        return res.status(400).json({
            error: "Vous devez fournir 'minPrice' et 'maxPrice' comme paramètres de requête."
        });
    }

    try {
        const ordinateurs = await Ordinateur.find({
            prix: { $gte: Number(minPrice), $lte: Number(maxPrice) }
        });

        res.status(200).json({
            message: "Résultats trouvés",
            ordinateurs
        });
    } catch (err) {
        res.status(500).json({
            error: "Erreur lors de la recherche",
            details: err
        });
    }
};

const searchByCategory = async (category, socket) => {
    try {
        const ordinateurs = await Ordinateur.find({ categorie: category });
        socket.emit('searchByCategoryResult', ordinateurs); 
    } catch (err) {
        socket.emit('error', { message: "Erreur lors de la recherche par catégorie", details: err });
    }
};




module.exports = {socketIO , OrdinateurView, create, list, update, deleteU , searchByPriceRange ,searchByCategory };
