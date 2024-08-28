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

export {
  GetProducts
}
