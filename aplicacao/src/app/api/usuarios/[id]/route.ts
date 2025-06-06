import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const usuario = await prisma.usuario.findUnique({ where: { id: Number(id) } });

  if (!usuario) {
    return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });
  }
  return NextResponse.json(usuario);
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  try {
    const usuario = await prisma.usuario.delete({ where: { id: Number(id) } });
    return NextResponse.json({ mensagem: "Usuário deletado" });
  } catch (error) {
    return NextResponse.json({ erro: "Usuário não encontrado" }, { status: 404 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const { id } = context.params;
  const { nome, email } = await request.json();

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: { nome, email },
    });
    return NextResponse.json(usuarioAtualizado);
  } catch (error) {
    return NextResponse.json({ erro: "Erro ao atualizar usuário" }, { status: 500 });
  }
}
