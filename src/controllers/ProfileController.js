const Profile = require('../models/Profile');

module.exports = {

    async store(req, res) {
        const { name } = req.body;

        const profile = await Profile.findOne({ where: { name }  });

        if(profile){
            return res.json(profile);
        }

        const newProfile = await Profile.create({
            name
        });

        return res.json(newProfile);
    }

}