import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle Bon
export const useCreateBon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/bons/createBon', data),
    onSuccess: () => queryClient.invalidateQueries(['bons']),
  });
};

// Mettre à jour une Bons
export const useUpdateBon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.put(`/bons/updateBon/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['bons']),
  });
};

// Lire toutes les Bons
export const useAllBon = () =>
  useQuery({
    queryKey: ['bons'],
    queryFn: () => api.get('/bons/getAllBon').then((res) => res.data),
  });

// Obtenir un Bon
export const useOneBon = (id) =>
  useQuery({
    queryKey: ['getBon', id],
    queryFn: () => api.get(`/bons/getBon/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5, //chaque 5 minutes rafraichir les données
  });

// Supprimer une Bons
export const useDeleteBon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/bons/deleteBon/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['bons']),
  });
};
