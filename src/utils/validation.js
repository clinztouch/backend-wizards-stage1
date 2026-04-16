const validateExternalData = ({ gender, age, nationality }) => {
    // Genderize failure 
    if (!gender.gender || gender.count === 0) {
        const err = new Error("Genderize returned an invalid response");
        err.status = 502;
        throw err;
    }

    // Agify failure 
    if (age.age === null) {
        const err = new Error("Agify returned an invalid response");
        err.status = 502;
        throw err;
    }

    // Nationalize failure
    if (!nationality.country || nationality.country.length === 0) {
        const err = new Error("Nationalize returned an invalid response");
            err.status = 502;
            throw err;
    }
};

module.exports = validateExternalData;