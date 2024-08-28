import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

function useGetBrands({token}) {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const response = await fetch('http://34.234.73.134:8088/api/brands', {
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

function useCreateBrands({token}){
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (brand) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": brand.name
      });
      const response = await fetch('http://34.234.73.134:8088/api/brands', {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['brands'] }), 
  });
}

function useUpdateBrands({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (brand) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      const raw = JSON.stringify({
        "name": brand.name
      });
      let id = brand.id;
      const response = await fetch(`http://34.234.73.134:8088/api/brands/${id}`, {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['brands'] }), //refetch users after mutation, disabled for demo
  });
}

function useDeleteBrands({token}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (TiendaId) => {
      let id = TiendaId;
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", token);
      //send api update request here
      const response = await fetch(`http://34.234.73.134:8088/api/brands/${id}`, {
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['brands'] }), //refetch users after mutation, disabled for demo
  });
}

export {
  useGetBrands,
  useCreateBrands,
  useUpdateBrands,
  useDeleteBrands,
}