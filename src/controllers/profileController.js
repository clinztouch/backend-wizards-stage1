const Profile = require("../models/Profile");
const fetchExternalData = require("../services/externalApis");
const getAgeGroup = require("../utils/ageGroup");
const getTopCountry = require("../utils/country");
const validateExternalData = require("../utils/validation");
const { v7: uuidv7 } = require("uuid");

// Create profile

exports.createProfile = async (req, res) => {
  try {
    const { name } = req.body;

    //  400 - Missing or empty name
    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Missing or empty name"
      });
    }

    //  422 - Invalid type
    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Invalid type"
      });
    }

    const normalizedName = name.trim().toLowerCase();

    //  Check existing (idempotency)
    const existing = await Profile.findOne({ name: normalizedName });

    if (existing) {
      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: {
          id: existing.id,
          name: existing.name,
          gender: existing.gender,
          gender_probability: existing.gender_probability,
          sample_size: existing.sample_size,
          age: existing.age,
          age_group: existing.age_group,
          country_id: existing.country_id,
          country_probability: existing.country_probability,
          created_at: existing.created_at
        }
      });
    }

    //  Fetch APIs
    const data = await fetchExternalData(normalizedName);

    //  Validate APIs (502 handling)
    validateExternalData(data);

    const topCountry = getTopCountry(data.nationality.country);

    //  Create profile
    const newProfile = await Profile.create({
      id: uuidv7(),
      name: normalizedName,
      gender: data.gender.gender,
      gender_probability: data.gender.probability,
      sample_size: data.gender.count,
      age: data.age.age,
      age_group: getAgeGroup(data.age.age),
      country_id: topCountry.country_id,
      country_probability: topCountry.probability,
      created_at: new Date()
    });

    //  Success response (STRICT FORMAT)
    return res.status(201).json({
      status: "success",
      data: {
        id: newProfile.id,
        name: newProfile.name,
        gender: newProfile.gender,
        gender_probability: newProfile.gender_probability,
        sample_size: newProfile.sample_size,
        age: newProfile.age,
        age_group: newProfile.age_group,
        country_id: newProfile.country_id,
        country_probability: newProfile.country_probability,
        created_at: newProfile.created_at
      }
    });

  } catch (err) {
    //  502 errors (external API)
    if (err.status === 502) {
      return res.status(502).json({
        status: "error",
        message: err.message
      });
    }

    //  Duplicate race condition fallback
    if (err.code === 11000) {
      const existing = await Profile.findOne({
        name: req.body.name.toLowerCase()
      });

      return res.status(200).json({
        status: "success",
        message: "Profile already exists",
        data: existing
      });
    }



    //  500 fallback
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

// Get profile by ID 
exports.getProfileById = async (req, res) => {
    try{
    const profile = await Profile.findOne({ id: req.params.id });

    if (!profile) {
        return res.status(404).json({
            status: "error",
            message: "Profile not found"
        });
    }

     return res.status(200).json({
      status: "success",
      data: {
        id: profile.id,
        name: profile.name,
        gender: profile.gender,
        gender_probability: profile.gender_probability,
        sample_size: profile.sample_size,
        age: profile.age,
        age_group: profile.age_group,
        country_id: profile.country_id,
        country_probability: profile.country_probability,
        created_at: profile.created_at
      }
    });

} catch (err) {
    return res.status(500).json({ 
        status: "error",
        message: "Internal server error"
    })
}
};

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const { gender, country_id, age_group } = req.query;

    const filter = {};

    if (gender) {
      filter.gender = gender.toLowerCase();
    }

    if (country_id) {
      filter.country_id = country_id.toUpperCase();
    }

    if (age_group) {
      filter.age_group = age_group.toLowerCase();
    }

    const profiles = await Profile.find(filter);

    const formattedProfiles = profiles.map((profile) => ({
      id: profile.id,
      name: profile.name,
      gender: profile.gender,
      age: profile.age,
      age_group: profile.age_group,
      country_id: profile.country_id
    }));

    return res.status(200).json({
      status: "success",
      count: formattedProfiles.length,
      data: formattedProfiles
    });

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};

// Delete profile by ID
exports.deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Profile.findOneAndDelete({ id });

    // Not found
    if (!deleted) {
      return res.status(404).json({
        status: "error",
        message: "Profile not found"
      });
    }

    //  Success (STRICT: no body)
    return res.status(204).send();

  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
};