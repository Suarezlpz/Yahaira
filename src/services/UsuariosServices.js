import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

//lista
function useGetUsers({token}) {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const response = await fetch('http://34.234.73.134:8088/api/users', {
        method: 'GET',
        headers: myHeaders,
      });

      if (!response.ok) {
        console.log(response.json())
      }

      return response.json();
    },
    refetchOnWindowFocus: false,
  });
}

//crear
function useCreateUsers({token}){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": user.name,
        "role": user.role,
        "email": user.email,
        "password": "123456789",
      });
      const response = await fetch('http://34.234.73.134:8088/api/users', {
        method: 'POST',
        headers: myHeaders,
        body: raw,
      });
    
      if (!response.ok) {
        let data = await response.json()

        console.log(data, 'jelou')
        
      }
    
      return response.json();
    },
    //client side optimistic update
    /*onMutate: (newUserInfo) => {
      queryClient.setQueryData(['users'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
        },
      ]);
    },*/
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), 
  });
}

//actualizar
function useUpdateUsers({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (user) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": user.name,
        "email": user.email,
        "password": '123456789',
        "role": user.role,
      });
      let id = user.id;
      const response = await fetch(`http://34.234.73.134:8088/api/users/${id}`, {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

//borrar
function useDeleteUsers({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (TiendaId) => {
      let id = TiendaId;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      //send api update request here
      const response = await fetch(`http://34.234.73.134:8088/api/users/${id}`, {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['users'] }), //refetch users after mutation, disabled for demo
  });
}

export {
  useGetUsers,
  useCreateUsers,
  useUpdateUsers,
  useDeleteUsers,
}