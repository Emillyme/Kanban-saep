import { z } from "zod";

export const tarefaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  setor: z.string().min(1, "Setor é obrigatório"),
  status: z.enum(["A_FAZER", "FAZENDO", "PRONTO"]),
  prioridade: z.enum(["BAIXA", "MEDIA", "ALTA"]),
  fechaEm: z.string().optional(),
});
