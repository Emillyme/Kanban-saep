import { NextResponse } from "next/server"; //é usado para responder a requisições 
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tabelas = await prisma.tabela.findMany({
      include: {
        usuario: true,
      }
    });
    return NextResponse.json(tabelas);
  } catch {
    return NextResponse.json({ erro: 'Erro ao buscar tabelas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { titulo, descricao, status, setor, prioridade, usuarioId, fechaEm } = await req.json();

    const novaTabela = await prisma.tabela.create({
      data: {
        titulo,
        descricao,
        status,       // A_FAZER | FAZENDO | PRONTO
        setor,
        prioridade,   // BAIXA | MEDIA | ALTA
        usuarioId,
        fechaEm: fechaEm ? new Date(fechaEm) : null,
      },
    });

    return NextResponse.json(novaTabela, { status: 201 });
  } catch (error) {
    return NextResponse.json({ erro: 'Erro ao criar tabela' }, { status: 500 });
  }
}