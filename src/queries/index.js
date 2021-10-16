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
              name
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

export const GET_PRODUCTS_BY_CATEGORY = (category) =>`
{
 category(input:{title: "${category}"}) {
   products {
      description
      brand
      name
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
}
`;

export const GET_PRODUCT_BY_ID = (id) => `
{
  product(id: "${id}"){
    name,
    brand,
    gallery,
    attributes {
        name,
        id,
        items {
          displayValue,
          value,
          id
        }
    },
    inStock,
    id,
    description,
    prices {
      amount,
      currency
    }
  }
}
`;
