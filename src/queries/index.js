export const GET_CATEGORIES = `
    {
      categories {
        name
      }
    }`;

export const GET_PRODUCTS = `
    query getClothes {
          categories {
            name
            products {
              description
              brand
              id
              gallery
              inStock
              category
              prices {
                amount,
                currency
              }
              attributes {
                name,
                id,
                items {
                  displayValue,
                  value,
                  id
                }
              }
            }
          }
        }`;

export const GET_CURRENCIES = `
    {
      currencies 
    }`;
