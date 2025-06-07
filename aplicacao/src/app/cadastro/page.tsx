'use client'

import Navbar from "../dashboard/Navbar";
import { signupSchema } from "../validations/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type Props = {}

type SignupForm = z.infer<typeof signupSchema>

const Cadastro = (props: Props) => {
    // const router = useRouter()
    const [sonner, setSonner] = useState(false)
    const [mensagemErro, setMensagemErro] = useState(false)
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    })

    const onSubmit = async (formData: SignupForm) => {
        try {
            const response = await fetch(`/api/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: formData.username,
                    email: formData.email,
                })
            })

            if (!response.ok) {
                throw new Error('Erro na requisição de signup de usuário comum')
            }
            console.log('Cadastrado')
            setSonner(true)
            reset()
        } catch (error) {
            console.log("Deu erro: ", error)
        }
    }

    useEffect(() => {
        if (sonner) {
            toast("Cadastro concluído com sucesso!", {
                description: 'Obrigada pelo cadastroo',
            });
            setSonner(false);
        }
    }, [sonner]);

    return (
        <div className="m-10">
            <div className="">
                <h1 className="text-3xl font-bold text-black">Cadastro</h1>
                <p className="text-gray-600">Faça o cadastro de usuários aqui!</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-10">
                <div className="flex flex-col w-120">
                    <label className="text-gray-800">Username</label>
                    <input {...register("username")} type="text" className="bg-transparent border-1 border-gray-600 h-[30px] rounded text-gray-700 p-2 w-[360px]" />
                    {errors.username && <span className="text-red-500">{errors.username.message}</span>}

                    <span className='h-5'></span>

                    <label className="text-gray-800">E-mail</label>
                    <input {...register("email")} type="text" className="bg-transparent border-1 border-gray-600 h-[30px] rounded text-gray-700 p-2 w-[360px]" />
                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                </div>
                <p className='text-red-500 pt-6 flex justify-center'>
                    {mensagemErro ? 'Nome de usuário ou senha inválidos' : ''}
                </p>

                <button type="submit" className="mt-5 px-12 py-2 rounded cursor-pointer text-white bg-[#0056b3]">Cadastrar</button>
            </form>
        </div>
    )
}

export default Cadastro;