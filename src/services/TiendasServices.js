import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

function useGetTiendas({token}) {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const response = await fetch('http://34.234.73.134:8088/api/stores', {
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

function useCreateTienda({token}){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tienda) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": tienda.name
      });
      const response = await fetch('http://34.234.73.134:8088/api/stores', {
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
    /*onMutate: (newTiendaInfo) => {
      queryClient.setQueryData(['stores'], (prevTiendas) => [
        ...prevTiendas,
        {
          ...newTiendaInfo,
        },
      ]);
    },*/
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['stores'] }), 
  });
}

function useUpdateTienda({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tienda) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": tienda.name
      });
      let id = tienda.id;
      const response = await fetch(`http://34.234.73.134:8088/api/stores/${id}`, {
        method: 'PUT', 
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['stores'] }), //refetch users after mutation, disabled for demo
  });
}

function useDeleteTienda({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (TiendaId) => {
      let id = TiendaId;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      //send api update request here
      const response = await fetch(`http://34.234.73.134:8088/api/stores/${id}`, {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['stores'] }), //refetch users after mutation, disabled for demo
  });
}

export {
  useGetTiendas,
  useCreateTienda,
  useUpdateTienda,
  useDeleteTienda,
}