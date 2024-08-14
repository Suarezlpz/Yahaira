const Login = ({email, password}) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      "email": email,
      "password": password
    });
    
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    
    return fetch("http://34.234.73.134:8088/api/tokens/create", requestOptions)
      .then((response) => response.json())
      .then((result) => result)
      .catch((error) => error);
}

export {
    Login
}
