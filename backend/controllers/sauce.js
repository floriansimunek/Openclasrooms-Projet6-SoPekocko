const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    console.log(sauceObject);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Objet supprimé !'}))
                    .catch(error => res.status(400).json({error}));
            });
        })
        .catch(error => res.status(500).json({error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({error}));
};

///////
exports.likeSauce = (req, res, next) => {
    console.log(req.body);
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => updateLikes(res, sauce, req.body))
        .catch(error => res.status(400).json({error}));
};


function updateLikes(res, sauceInfo, body ){
    switch (body.like){
        case -1 : 
            Sauce.updateOne({_id:sauceInfo._id}, {
                $inc : {likes : -1},
                $push : {usersDisliked : body.userId}
            })
            .then(res.status(200).json(body))
            .catch (error => res.status(400).json({error}));

            break;
        case 0 :
            Sauce.updateOne({_id:sauceInfo._id}, {
                $inc : {likes : 0},
                $push : {usersLiked : body.userId}
            })
            .then(res.status(200).json(body))
            .catch (error => res.status(400).json({error}));

            break;
        case 1 : 
            Sauce.updateOne({_id:sauceInfo._id}, {
                $inc : {likes : 1},
                $push : {usersLiked : body.userId}
            })
            .then(res.status(200).json(body))
            .catch (error => res.status(400).json({error}));

            break;
        default : 
            throw("unsupported like statement");
    }

}