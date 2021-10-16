export const getProductPrice = (prices, currentCurrency) => {
    const price = prices?.find((price) => price?.currency === currentCurrency);
    switch (price?.currency) {
        case "USD":
        case "AUD":
            return `$ ${price.amount}`;
        case "GBP":
            return `£ ${price.amount}`;
        case "JPY":
            return `¥ ${price.amount}`;
        case "RUB":
            return `₽ ${price.amount}`;
        default:
            break;
    }
}

export const getCurrencySign = (currency) => {
    switch (currency) {
        case "USD":
        case "AUD":
            return "$";
        case "GBP":
            return "£";
        case "JPY":
            return "¥";
        case "RUB":
            return "₽";
        default:
            return "$";
    }
}

export const stringContainsDangerousTags = (stringTag) =>
    stringTag?.includes('<script>') || stringTag?.includes('<iframe>');

export const getNumberOfItemsInCart = (cart) => {
    let amount = 0;
    cart.forEach(item => {
        amount += item.quantity;
    });

    return amount;
}
