import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '../services/error';

const defaultExtract = (response) => {
  const container =
    response?.data && !Array.isArray(response.data) && Array.isArray(response.data.data)
      ? response.data
      : response;

  return {
    items: Array.isArray(container?.data) ? container.data : [],
    total: Number(container?.total ?? 0),
    totalPages: Math.max(1, Number(container?.totalPages ?? 1)),
  };
};

/**
 * Hook reutilizable para tablas con paginación, búsqueda y filtros en servidor.
 * Centraliza estado de carga, normalización de respuesta y manejo de errores.
 */
export function usePaginatedList(
  fetcher,
  {
    initialLimit = 10,
    initialFilters = {},
    extract = defaultExtract,
    errorMessage = 'No se pudieron cargar los registros',
    debounceMs = 250,
  } = {},
) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearchState] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFiltersState] = useState(initialFilters);
  const [loading, setLoading] = useState(false);

  const fetcherRef = useRef(fetcher);
  const extractRef = useRef(extract);
  fetcherRef.current = fetcher;
  extractRef.current = extract;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [search, debounceMs]);

  const filtersKey = JSON.stringify(filters);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      const parsedFilters = JSON.parse(filtersKey);
      const params = {
        page,
        limit,
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
        ...Object.fromEntries(
          Object.entries(parsedFilters).filter(
            ([, v]) => v !== '' && v !== null && v !== undefined,
          ),
        ),
      };

      const response = await fetcherRef.current(params);
      if (response?.ok === false) {
        toast.error(getApiErrorMessage(response, errorMessage));
        return;
      }

      const normalized = extractRef.current(response);
      setItems(normalized.items);
      setTotal(normalized.total);
      setTotalPages(normalized.totalPages);
    } catch (error) {
      toast.error(getApiErrorMessage(error, errorMessage));
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedSearch, filtersKey, errorMessage]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleLimitChange = useCallback((nextLimit) => {
    setLimit(nextLimit);
    setPage(1);
  }, []);

  const setSearch = useCallback((value) => {
    setSearchState(value);
    setPage(1);
  }, []);

  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
    search,
    filters,
    loading,
    setPage,
    setLimit: handleLimitChange,
    setSearch,
    setFilter,
    reload,
  };
}
