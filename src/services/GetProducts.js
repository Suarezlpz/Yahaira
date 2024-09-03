const GetProducts = ({token}) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", token);
  
  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow"
  };
  
  return fetch("http://34.234.73.134:8088/api/products", requestOptions)
  .then((response) => response.json())
  .then((result) => result)
  .catch((error) => error);
}

const CreateProducts = ({token, data}) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", token);
  
  const raw = JSON.stringify({
    "name": data.name,
    "brand_id": data.brand,
    "product_type_id": data.type,
    "upc": "AJAM2024",
    "skus":data.skus.map((sku) => {
      return {
        "amount": sku.cantidad,
        "price": sku.price,
        "sku": sku.sku,
        "store_id": sku.tienda,
        "attributes": [
          3,
          8
        ]
      }
    })
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  return fetch("http://34.234.73.134:8088/api/products", requestOptions)
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}


export {
  GetProducts,
  CreateProducts,
}
