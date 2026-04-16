const getTopCountry = (country) => {
    return country.reduce((max, current) => 
    current.probability > max.probability ? current : max
);
};

module.exports = getTopCountry;