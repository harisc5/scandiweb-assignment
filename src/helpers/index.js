export const removeTags = (text) => text.replace( /(<([^>]+)>)/ig, '');

export const getProductPrice = (prices, currentCurrency) => {
    const price = prices?.find((price) => price?.currency === currentCurrency);
    switch (price?.currency) {
        case "USD":
            return `$ ${price.amount}`;
        case "GBP":
            return `£ ${price.amount}`;
        case "JPY":
            return `¥ ${price.amount}`;
        default:
            break;
    }
}
