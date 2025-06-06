import { NextResponse } from "next/server"; //é usado para responder a requisições 
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) { // req: é basicamente todos os dados que o cliente esta mandando
    const body = await req.json() // corpo da requisição recebida
    const { nome, email } = body // desestrutura o JSON para pegar só o nome e email

    try{
        const novoUsuario = await prisma.usuario.create({
            data: {nome, email},
        })
        return NextResponse.json(novoUsuario)
    }catch (erro){
        return NextResponse.json({erro: 'Erro ao criar user'}, { status: 500 })
    }
}

export async function GET(){
    try{
        const usuarios = await prisma.usuario.findMany()
        return NextResponse.json(usuarios)
    }catch (error) {
        return NextResponse.json({erro: 'Erro ao buscar usuarios'}, {status: 500})
    }
}