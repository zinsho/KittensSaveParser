function getTriValue (value, stripe) {
    return (Math.sqrt(1+8 * value / stripe)-1)/2;
}

function getTriValueReligion (value) {
    return getTriValue(value,0.1)/0.1;
}