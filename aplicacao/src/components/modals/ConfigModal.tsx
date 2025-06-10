import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import type { Tarefa } from '@/app/(kanban)/page';

type Props = {
    fecharModal: () => void;
    tarefa: Tarefa;
    atualizarTarefa: (tarefaAtualizada: Tarefa) => void;
};

const ModalConfigTask: React.FC<Props> = ({ fecharModal, tarefa, atualizarTarefa }) => {
    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [descricao, setDescricao] = useState(tarefa.descricao);
    const [prioridade, setPrioridade] = useState<Tarefa['prioridade']>(tarefa.prioridade);

    async function salvarEdicao(id: string, dadosAtualizados: any) {
        try {
            const res = await fetch(`/api/tabelas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados),
            });

            if (!res.ok) {
                let errorMessage = 'Erro ao atualizar';
                try {
                    const text = await res.text();
                    if (text) {
                        const errorData = JSON.parse(text);
                        errorMessage = errorData.message || errorMessage;
                    }
                } catch { }
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error('Erro ao atualizar:', error.message);
            alert(`Erro ao atualizar: ${error.message}`);
            throw error;
        }
    }

    async function handleSalvar() {
        const dadosAtualizados = {
            ...tarefa,
            titulo,
            descricao,
            prioridade,
        };

        try {
            await salvarEdicao(tarefa.id, dadosAtualizados);
            atualizarTarefa(dadosAtualizados);
            fecharModal();
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="flex flex-col bg-white p-6 rounded shadow-lg w-96 relative">
            <div className="flex justify-between items-center mb-4">
                <p>Editar Tarefa</p>
                <Button
                    variant="ghost"
                    onClick={fecharModal}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                    <X />
                </Button>
            </div>

            <label className="mb-2 flex flex-col">
                Título:
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="border p-2 rounded"
                />
            </label>

            <label className="mb-2 flex flex-col">
                Descrição:
                <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="border p-2 rounded"
                />
            </label>

            <label className="mb-2 flex flex-col">
                Prioridade:
                <select
                    value={prioridade}
                    onChange={(e) => setPrioridade(e.target.value as Tarefa['prioridade'])}
                    className="border p-2 rounded"
                >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                </select>
            </label>

            <Button onClick={handleSalvar} className="mt-4 bg-[#0056b3] hover:bg-[#283858] cursor-pointer">
                Salvar
            </Button>
        </div>
    );
};

export default ModalConfigTask;
