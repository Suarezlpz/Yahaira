import {
    QueryClient,
    QueryClientProvider,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';


  function useGetAttributes({token}) {
    return useQuery({
      queryKey: ['attributes'],
      queryFn: async () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        const response = await fetch('http://34.234.73.134:8088/api/product_types/1/attributes', {
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
  

  function useCreateAttributes({token}){
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (attributes) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        const raw = JSON.stringify({
          "name": attributes.name
        });
        const response = await fetch('http://34.234.73.134:8088/api/product_types/1/attributes', {
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
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['attributes'] }), 
    });
  }
  
  function useUpdateAttributes({token}) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (attributes) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        const raw = JSON.stringify({
          "name": attributes.name
        });
        let id = attributes.id;
        const response = await fetch(`http://34.234.73.134:8088/api/product_types/1/attributes/${id}`, {
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
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['attributes'] }), //refetch users after mutation, disabled for demo
    });
  }
  
  function useDeleteAttributes({token}) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (attributesID) => {
        let id = attributesID;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", token);
        //send api update request here
        const response = await fetch(`http://34.234.73.134:8088/api/product_types/1/attributes/${id}`, {
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
      onSettled: () => queryClient.invalidateQueries({ queryKey: ['attributes'] }), //refetch users after mutation, disabled for demo
    });
  }
  
  export {
    useGetAttributes,
    useCreateAttributes,
    useUpdateAttributes,
    useDeleteAttributes,
  }