// hooks/useTarefas.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useTarefas() {
  const { data, error, mutate } = useSWR("/api/tabelas", fetcher);

  return {
    tarefas: data,
    isLoading: !error && !data,
    isError: error,
    mutate, 
  };
}
