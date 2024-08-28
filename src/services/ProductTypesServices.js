import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

function useGetProductTypes({token}) {
  return useQuery({
    queryKey: ['product_types'],
    queryFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const response = await fetch('http://34.234.73.134:8088/api/product_types', {
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

function useCreateProductTypes({token}){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (producType) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": producType.name
      });
      const response = await fetch('http://34.234.73.134:8088/api/product_types', {
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
   /* onMutate: (newUserInfo) => {
      queryClient.setQueryData(['product_types'], (prevUsers) => [
        ...prevUsers,
        {
          ...newUserInfo,
      
        },
      ]);
    },*/
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['product_types'] }), 
  });
}


function useUpdateProductTypes({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (producType) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": producType.name
      });
      let id = producType.id;
      const response = await fetch(`http://34.234.73.134:8088/api/product_types/${id}`, {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['product_types'] }), //refetch users after mutation, disabled for demo
  });
}

function useDeleteProductTypes({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (TiendaId) => {
      let id = TiendaId;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      //send api update request here
      const response = await fetch(`http://34.234.73.134:8088/api/product_types/${id}`, {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['product_types'] }), //refetch users after mutation, disabled for demo
  });
}

export {
  useGetProductTypes,
  useCreateProductTypes,
  useUpdateProductTypes,
  useDeleteProductTypes,
}