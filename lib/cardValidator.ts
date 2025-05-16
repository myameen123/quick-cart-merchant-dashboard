export const getCardType = (cardNumber: string): 'Visa' | 'MasterCard' | 'Invalid' => {
    const sanitizedNumber = cardNumber.replace(/\D/g, ''); // Remove non-numeric characters

    if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(sanitizedNumber)) {
        return 'Visa';
    } 
    if (/^5[1-5][0-9]{14}$/.test(sanitizedNumber) || /^2(2[2-9][1-9]|2[3-9][0-9]{2}|[3-6][0-9]{3}|7[0-1][0-9]{2}|720[0-9])/.test(sanitizedNumber)) {
        return 'MasterCard';
    }
    return 'Invalid';
};
