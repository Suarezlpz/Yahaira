import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
  } from '@tanstack/react-query';

  //lista
  function useGetClients({token}) {
    return useQuery({
      queryKey: ['clients'],
      queryFn: async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        const response = await fetch('http://34.234.73.134:8088/api/clients', {
          method: 'GET',
          headers: myHeaders,
        });
  
        if (!response.ok) {
          throw new Error('Error en la llamada a la API');
        }
  
        return response.json();
      },
      refetchOnWindowFocus: false,
    });
  }
  //data desde api saime

  const useGetClientsBySaime = ({cedula, nacionalidad}) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let e_v = nacionalidad.toLowerCase();
  
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    return fetch(`https://apisaime.premierpluss.com/api/semilla/${e_v}${cedula}`, requestOptions)
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error)
  }

  //crear
  function useCreateClients({token}){
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (cliente) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        const raw = JSON.stringify({
          "nacionalidad": cliente.nacionalidad,
          "cedula": cliente.cedula,
          "primer_nombre": cliente.nombre,
          "segundo_nombre": cliente.segundoNombre,
          "primer_apellido": cliente.primerApellido,
          "segundo_apellido": cliente.segundoApellido,
          "fecha_nacimiento": cliente.fechaNacimiento,
          "email": cliente.correo,
          "phone": cliente.telefono,
          });
        const response = await fetch('http://34.234.73.134:8088/api/clients', {
          method: 'POST',
          headers: myHeaders,
          body: raw,
        });
      
        if (!response.ok) {
          throw new Error('Error en la llamada a la API');
        }
      
        return response.json();
      },
      //client side optimistic update
      /*onMutate: (newclientsInfo) => {
        queryClient.setQueryData(['clients'], (prevclients) => [
          ...prevclients,
          {
            ...newclientsInfo,
          },
        ]);
      },*/
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['clients'] }), 
    });
  }

  //actualizar
  function useUpdateClients({token}) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (cliente) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        const raw = JSON.stringify({
          "nacionalidad": cliente.nacionalidad,
          "primer_nombre": cliente.primer_nombre,
          "segundo_nombre": cliente.segundo_nombre,
          "primer_apellido": cliente.primer_apellido,
          "segundo_apellido": cliente.segundo_apellido,
          "fecha_nacimiento": cliente.fecha_nacimiento,
          "email": cliente.email,
          "phone": cliente.phone,
        });
        let id = cliente.id;
        const response = await fetch(`http://34.234.73.134:8088/api/clients/${id}`, {
          method: 'PATCH', 
          headers: myHeaders,
          body: raw,
        });
  
        if (!response.ok) {
          throw new Error('Error en la llamada a la API');
        }
      
        return response.json();
      },
      //client side optimistic update
      /*onMutate: (newTiendaInfo) => {
        queryClient.setQueryData(['stores'], (prevTiendas) =>
          prevTiendas?.map((prevTienda) =>
            prevTienda.id === newTiendaInfo.id ? newTiendaInfo : prevTienda,
          ),
        );
      },*/
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['clients'] }), //refetch users after mutation, disabled for demo
    });
  }

  //Borrar
  function useDeleteClients({token}) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (clienteID) => {
        let id = clienteID;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        //send api update request here
        const response = await fetch(`http://34.234.73.134:8088/api/clients/${id}`, {
          method: 'DELETE', 
          headers: myHeaders,
        });
  
        if (!response.ok) {
          throw new Error('Error en la llamada a la API');
        }
      
        return response.json();
      },
      //client side optimistic update
      /*onMutate: (TiendaId) => {
        queryClient.setQueryData(['users'], (prevUsers) =>
          prevUsers?.filter((user) => user.id !== TiendaId),
        );
      },*/
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['clients'] }), //refetch users after mutation, disabled for demo
    });
  }
  
  export {
    useGetClients,
    useCreateClients,
    useUpdateClients,
    useDeleteClients,
    useGetClientsBySaime,
  }