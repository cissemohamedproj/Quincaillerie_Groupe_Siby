import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import api from './api';

// Créer une nouvelle produits
export const useCreateProduit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/produits/addProduit', data),
    onSuccess: () => queryClient.invalidateQueries(['produits']),
  });
};

// Mettre à jour une produits
export const useUpdateProduit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/produits/updateProduit/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries(['produits']),
  });
};

// Lire toutes les produits
export const useAllProduit = () =>
  useQuery({
    queryKey: ['produits'],
    queryFn: () => api.get('/produits/getAllProduits').then((res) => res.data),
    keepPreviousData: true,
  });

// Lire toutes les produits
export const usePagignationProduit = (page = 1, limit = 35) =>
  useQuery({
    queryKey: ['produits', page, limit],
    queryFn: () =>
      api
        .get('/produits/getPagignationProduits', { params: { page, limit } })
        .then((res) => res.data),
    keepPreviousData: true,
  });

// Produit dont le Stock est terminé
export const useAllProduitWithStockInferieure = () =>
  useQuery({
    queryKey: ['produits'],
    queryFn: () =>
      api.get('/produits/getAllProduitWithStockFinish').then((res) => res.data),
  });

// Obtenir un Produit
export const useOneProduit = (id) =>
  useQuery({
    queryKey: ['getProduit', id],
    queryFn: () =>
      api.get(`/produits/getOneProduit/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 1, //chaque 5 minutes rafraichir les données
  });

// Affficher le produit lors de l'approvisonnement
export const useOneProduitWhenApprovisionne = (id) =>
  useQuery({
    queryKey: ['getProduit', id],
    queryFn: () => api.get(`/approvisonnement/${id}`).then((res) => res.data),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 1, //chaque 1 minutes rafraichir les données
  });

// Supprimer une produits
export const useDeleteProduit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/produits/deleteProduit/${id}`),
    onSuccess: () => queryClient.invalidateQueries(['produits']),
  });
};
