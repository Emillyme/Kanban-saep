"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useRouter } from "next/navigation";
import { useTarefas } from "@/hooks/useTarefas"; // hook SWR que já te passei

type Tarefa = {
  id: string;
  titulo: string;
  descricao: string;
  setor: string;
  prioridade: "baixa" | "media" | "alta";
  usuarioVinculado: string;
  status: "A_FAZER" | "FAZENDO" | "PRONTO";
};

const statusLabels = {
  A_FAZER: "A Fazer",
  FAZENDO: "Fazendo",
  PRONTO: "Pronto",
};

export default function KanbanPage() {
  const { tarefas, isLoading, mutate } = useTarefas();
  const router = useRouter();

  // Estado para armazenar mudanças no select de status por tarefa (id => status selecionado)
  const [statusSelecionado, setStatusSelecionado] = React.useState<Record<string, Tarefa["status"]>>({});

  if (isLoading) return <p>Carregando tarefas...</p>;
  if (!tarefas) return <p>Erro ao carregar tarefas</p>;

  const handleDelete = async (id: string) => {
    if (!confirm("Confirma a exclusão dessa tarefa?")) return;

    try {
      const res = await fetch(`/api/tabelas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao deletar tarefa");

      // Atualiza a lista localmente
      mutate();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
    }
  };

  const handleEditar = (id: string) => {
    router.push(`/tarefas/${id}`);
  };

  const handleSelectChange = (id: string, novoStatus: Tarefa["status"]) => {
    setStatusSelecionado((prev) => ({ ...prev, [id]: novoStatus }));
  };

  const handleAlterarStatus = async (id: string) => {
    const novoStatus = statusSelecionado[id];
    if (!novoStatus) return;

    try {
      const res = await fetch(`/api/tabelas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (!res.ok) throw new Error("Erro ao atualizar status");

      setStatusSelecionado((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      mutate();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
    }
  };

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex gap-4 p-6 min-h-screen bg-gray-50">
        {Object.keys(statusLabels).map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="bg-white p-4 w-80 rounded-lg shadow border border-gray-200"
              >
                <h2 className="text-center font-bold text-lg text-gray-700 mb-4">
                  {statusLabels[status as keyof typeof statusLabels]}
                </h2>

                {tarefas
                  .filter((t: Tarefa) => t.status === status)
                  .map((tarefa: Tarefa, index: number) => (
                    <Draggable key={tarefa.id} draggableId={String(tarefa.id)} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-100 p-4 mb-4 rounded shadow-sm flex flex-col"
                        >
                          <h3 className="font-semibold">{tarefa.titulo}</h3>
                          <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                          <p><strong>Setor:</strong> {tarefa.setor}</p>
                          <p><strong>Prioridade:</strong> {tarefa.prioridade}</p>
                          <p><strong>Usuário:</strong> {tarefa.usuarioVinculado}</p>

                          {/* Botões editar e excluir */}
                          <div className="mt-3 flex justify-between">
                            <button
                              onClick={() => handleEditar(tarefa.id)}
                              className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(tarefa.id)}
                              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
