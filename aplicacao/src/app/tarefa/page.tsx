'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { tarefaSchema } from "../validations/tarefa"

type TarefaForm = z.infer<typeof tarefaSchema>

type Usuario = {
  id: number
  nome: string
}

const Tarefa = () => {
  const [sonner, setSonner] = useState(false)
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TarefaForm>({
    resolver: zodResolver(tarefaSchema),
  })

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await fetch('/api/usuarios')
        if (!res.ok) {
          throw new Error('Erro em buscar usuarios')
        }
        const data = await res.json()
        setUsuarios(data)
      } catch (error) {
        console.error("Erro em carregar usuários: ", error)
      }
    }
    fetchUsuarios()
  }, [])

  const onSubmit = async (formData: TarefaForm) => {
    console.log("Formulário recebido:", formData); // <-- aqui

    try {
      const response = await fetch(`/api/tabelas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao cadastrar tarefa')
      }

      console.log('Tarefa cadastrada')
      setSonner(true)
      reset()
    } catch (error) {
      console.log("Erro: ", error)
    }
  }

  useEffect(() => {
    if (sonner) {
      toast("Tarefa criada com sucesso!", { description: '' })
      setSonner(false)
    }
  }, [sonner])

  return (
    <div className="m-10">
      <div>
        <h1 className="text-3xl font-bold text-black">Cadastrar Tarefa</h1>
        <p className="text-gray-600">Preencha os dados abaixo para criar uma nova tarefa.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 flex gap-8 w-[720px] max-w-full">
        <div className="flex-1 flex flex-col gap-5">
  
          <div>
            <label className="text-gray-800">Título</label>
            <input {...register("titulo")} className="w-full bg-transparent border border-gray-600 h-[36px] rounded text-gray-700 p-2" />
            {errors.titulo && <p className="text-red-500">{errors.titulo.message}</p>}
          </div>

          <div>
            <label className="text-gray-800">Descrição</label>
            <textarea {...register("descricao")} className="w-full bg-transparent border border-gray-600 rounded text-gray-700 p-2" />
            {errors.descricao && <p className="text-red-500">{errors.descricao.message}</p>}
          </div>

          <div>
            <label className="text-gray-800">Setor</label>
            <input {...register("setor")} className="w-full bg-transparent border border-gray-600 h-[36px] rounded text-gray-700 p-2" />
            {errors.setor && <p className="text-red-500">{errors.setor.message}</p>}
          </div>

          <div>
            <label className="text-gray-800">Usuário</label>
            <select {...register("usuarioId", { valueAsNumber: true })} className="w-full bg-transparent border border-gray-600 h-[36px] rounded text-gray-700 p-2">
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
            {errors.usuarioId && <p className="text-red-500">{errors.usuarioId.message}</p>}
          </div>

          <div>
            <label className="text-gray-800">Status</label>
            <select {...register("status")} className="w-full bg-transparent border border-gray-600 h-[36px] rounded text-gray-700 p-2">
              <option value="A_FAZER">A fazer</option>
              <option value="FAZENDO">Fazendo</option>
              <option value="PRONTO">Pronto</option>
            </select>
            {errors.status && <p className="text-red-500">{errors.status.message}</p>}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-5">

          <div>
            <label className="text-gray-800">Prioridade</label>
            <select {...register("prioridade")} className="w-full bg-transparent border border-gray-600 h-[36px] rounded text-gray-700 p-2">
              <option value="BAIXA">Baixa</option>
              <option value="MEDIA">Média</option>
              <option value="ALTA">Alta</option>
            </select>
            {errors.prioridade && <p className="text-red-500">{errors.prioridade.message}</p>}
          </div>

          <div>
            <label className="text-gray-800">Data de Finalização (opcional)</label>
            <input type="datetime-local" {...register("fechaEm")} className="w-full bg-transparent border border-gray-600 h-[36px] rounded text-gray-700 p-2" />
          </div>

          <button type="submit" className="mt-4 px-12 py-2 rounded cursor-pointer text-white bg-[#0056b3]">
            Cadastrar
          </button>
        </div>
      </form>

    </div>
  )
}

export default Tarefa
