"use client"
import React, { useEffect, useRef, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModalConfigTask from '@/components/modals/ConfigModal';

export type Tarefa = {
    id: string;
    titulo: string;
    descricao: string;
    status: "A_FAZER" | "FAZENDO" | "PRONTO";
    setor: string;
    prioridade: "BAIXA" | "MEDIA" | "ALTA";
    usuario: {
        id: string;
        nome: string;
    } | null;
    criadoEm: string;
    fechaEm: string;
}

const statusLabels = {
    A_FAZER: "A Fazer",
    FAZENDO: "Fazendo",
    PRONTO: "Pronto",
};

function Kanban() {
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [tarefaModalAberto, setTarefaModalAberto] = useState<string | null>(null);
    const modalRef = useRef<HTMLDivElement>(null)

    const abrirModal = (id: string) => setTarefaModalAberto(id);
    const fecharModal = () => setTarefaModalAberto(null);

    useEffect(() => {
        async function fetchTarefas() {
            try {
                const res = await fetch('/api/tabelas');
                const data = await res.json();

                const tarefasComIdString = data.map((t: any) => ({
                    ...t,
                    id: String(t.id),
                    usuario: t.usuario ? { ...t.usuario, id: String(t.usuario.id) } : null,
                }));

                setTarefas(tarefasComIdString);
            } catch (error) {
                console.error("Erro ao buscar tarefas:", error);
            }
        }
        fetchTarefas();
    }, []);

    async function atualizarTarefaStatus(id: string, status: Tarefa["status"]) {
        try {
            await fetch(`/api/tabelas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    }

    async function fetchDelete(id: string) {
        try {
            await fetch(`/api/tabelas/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    }

    async function handleDelete(id: string) {
        try {
            await fetchDelete(id);
            setTarefas((old) => old.filter((t) => t.id !== id));
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
        }
    }

    function onDragEnd(result: DropResult) {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        setTarefas((oldTarefas) => {
            const tarefaMovida = oldTarefas.find((t) => t.id === draggableId);
            if (!tarefaMovida) return oldTarefas;

            const novaTarefa = {
                ...tarefaMovida,
                status: destination.droppableId as Tarefa["status"],
            };

            // Remove a tarefa movida da lista antiga
            const outrasTarefas = oldTarefas.filter((t) => t.id !== draggableId);

            // Pega tarefas que estarão no status de destino e insere a tarefa na posição correta
            const tarefasNoDestino = outrasTarefas.filter(
                (t) => t.status === destination.droppableId
            );
            tarefasNoDestino.splice(destination.index, 0, novaTarefa);

            // Pega as tarefas que não estão no status de destino
            const tarefasForaDestino = outrasTarefas.filter(
                (t) => t.status !== destination.droppableId
            );

            // Atualiza no backend (sem await para não travar o UI)
            atualizarTarefaStatus(draggableId, destination.droppableId as Tarefa["status"]).catch(console.error);

            // Retorna a nova lista reordenada
            return [...tarefasForaDestino, ...tarefasNoDestino];
        });
    }

    const CorPorPrioridade = (prioridade: string) => {
        switch (prioridade.toLowerCase()) {
            case 'baixa':
                return 'bg-green-300';
            case 'media':
                return 'bg-yellow-300';
            case 'alta':
                return 'bg-red-300';
            default:
                return 'bg-gray-500';
        }
    }


    return (
        <div className="">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex gap-6 p-6 min-h-screen">
                    {Object.entries(statusLabels).map(([statusKey, statusLabel]) => (
                        <Droppable droppableId={statusKey} key={statusKey}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="p-4 w-80 bg-gray-100 rounded"
                                >
                                    <h2 className="text-gray-600 font-medium uppercase">
                                        {statusLabel}
                                    </h2>

                                    <div className="mt-5 min-h-[200px]">
                                        {tarefas
                                            .filter((t) => t.status === statusKey)
                                            .map((tarefa, index) => (
                                                <Draggable
                                                    draggableId={tarefa.id}
                                                    index={index}
                                                    key={tarefa.id}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white p-4 mb-4 rounded shadow-sm flex flex-col ${snapshot.isDragging ? "bg-blue-100" : ""
                                                                }`}
                                                        >
                                                            <div className="flex justify-between">
                                                                <div className="flex gap-3">
                                                                    <p className={`rounded-[15px] text-[14px] text-white w-fit px-5 py-1 mb-3 ${CorPorPrioridade(tarefa.prioridade)}`}>
                                                                        {tarefa.prioridade}
                                                                    </p>
                                                                    <p className="rounded-[15px] text-[14px] text-gray-600 bg-[#d8d8d8] w-fit px-5 py-1 mb-3">
                                                                        {tarefa.setor}
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    onClick={() => handleDelete(tarefa.id)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Trash size={17} className="text-red-500" />
                                                                </div>
                                                            </div>
                                                            <h1 className="font-bold">{tarefa.titulo}</h1>
                                                            <p className="text-black mt-[1.5px]">
                                                                {tarefa.descricao}
                                                            </p>
                                                            <div className="flex gap-2 mt-4">
                                                                <p className="text-gray-800">Vinculado a: </p>
                                                                <span className="text-gray-400">
                                                                    {tarefa.usuario
                                                                        ? tarefa.usuario.nome
                                                                        : "Usuário não vinculado"}
                                                                </span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <p className="text-gray-800">Término em:</p>
                                                                <span className="text-gray-400">
                                                                    {new Date(tarefa.fechaEm).toLocaleDateString(
                                                                        "pt-BR",
                                                                        {
                                                                            day: "2-digit",
                                                                            month: "short",
                                                                            year: "numeric",
                                                                        }
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <Button variant={'outline'} onClick={() => abrirModal(tarefa.id)} className='cursor-pointer mt-5'>
                                                                Editar
                                                            </Button>

                                                        </div>
                                                    )}
                                                </Draggable>

                                            ))}
                                        {provided.placeholder}
                                    </div>
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
            {tarefaModalAberto && (
                <div
                    ref={modalRef}
                    className="fixed inset-0 bg-[#0000006e] flex justify-center items-center z-50"
                >
                    <div className="">
                        <ModalConfigTask
                            fecharModal={fecharModal}
                            tarefa={tarefas.find(t => t.id === tarefaModalAberto)!}
                            atualizarTarefa={(tarefaAtualizada) => {
                                setTarefas((old) =>
                                    old.map((t) => (t.id === tarefaAtualizada.id ? tarefaAtualizada : t))
                                );
                                fecharModal();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Kanban;
