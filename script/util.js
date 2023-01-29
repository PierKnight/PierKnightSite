function generateRandomNumber(bound) {
    return Math.floor(Math.random() * bound)
}

function getOrDefaultStorage(key, fallback)
{
    const value = localStorage.getItem(key);
    if(value === null)
        return fallback;
    return value;
}