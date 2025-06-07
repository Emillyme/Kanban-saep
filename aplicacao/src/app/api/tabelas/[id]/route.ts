import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: Context) {
  const { id } = await context.params;

  const tabela = await prisma.tabela.findUnique({
    where: { id: Number(id) },
  });

  if (!tabela) {
    return NextResponse.json({ erro: 'Tabela não encontrada' }, { status: 404 });
  }

  return NextResponse.json(tabela);
}

export async function PUT(req: Request, context: Context) {
  const { id } = await context.params;
  const { titulo, descricao, status, setor, prioridade, fechaEm } = await req.json();

  try {
    const tabelaAtualizada = await prisma.tabela.update({
      where: { id: Number(id) },
      data: {
        titulo,
        descricao,
        status,
        setor,
        prioridade,
        fechaEm: fechaEm ? new Date(fechaEm) : null,
      },
    });

    return NextResponse.json(tabelaAtualizada);
  } catch {
    return NextResponse.json({ erro: 'Erro ao atualizar tabela' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, context: Context) {
  const { id } = await context.params;

  try {
    await prisma.tabela.delete({ where: { id: Number(id) } });
    return NextResponse.json({ mensagem: 'Tabela deletada com sucesso' });
  } catch {
    return NextResponse.json({ erro: 'Erro ao deletar tabela' }, { status: 500 });
  }
}
