"use client"
import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type Tarefa = {
    id: string;
    titulo: string;
    descricao: string;
    status: "A_FAZER" | "FAZENDO" | "PRONTO";
    setor: string;
    prioridade: "baixa" | "media" | "alta";
    usuario: {
        id: number;
        nome: string;
    } | null;
}

//cards do kanban 
const statusLabels = {
    A_FAZER: "A Fazer",
    FAZENDO: "Fazendo",
    PRONTO: "Pronto",
};


function Kanban() {
    const [tarefas, setTarefas] = useState<Tarefa[]>([])

    useEffect(() => {
        async function fetchTarefas() {
            try {
                const rest = await fetch('/api/tabelas');
                const data = await rest.json();
                setTarefas(data)
            } catch (error) {
                console.log("Erro ao buscar tarefas:", error);
            }
        }
        fetchTarefas();
    }, [])

    return (
        <div className='flex gap-6 p-6 min-h-scree'>
            {Object.entries(statusLabels).map(([statusKey, statusLabels]) => (
                <div key={statusKey} className='p-4 w-80 '>
                    <h2 className='text-gray-600 font-medium uppercase'>{statusLabels}</h2>

                    <div className="mt-5">
                        {tarefas
                            .filter((t) => t.status === statusKey)
                            .map((tarefa) => (
                                <div
                                    key={tarefa.id}
                                    className='bg-white p-4 mb-4 rounded shadow-sm flex flex-col'
                                >
                                    <div className="flex gap-3">
                                        <p className='rounded-[15px] text-[14px] text-white bg-[#e55] w-fit px-5 py-1 mb-3'>
                                            {tarefa.prioridade}
                                        </p>
                                        <p className='rounded-[15px] text-[14px] text-gray-600 bg-[#d8d8d8] w-fit px-5 py-1 mb-3'>
                                            {tarefa.setor}
                                        </p>
                                    </div>
                                    <h1 className='font-bold'>
                                        {tarefa.titulo}
                                    </h1>
                                    <p className='text-black mt-[1.5px]'>
                                        {tarefa.descricao}
                                    </p>
                                    <div className='flex gap-2 mt-4'>
                                        <p className='text-gray-800'>Vinculado a: </p>
                                        <span className='text-gray-500'>{tarefa.usuario ? tarefa.usuario.nome : 'Usuário não vinculado'}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Kanban