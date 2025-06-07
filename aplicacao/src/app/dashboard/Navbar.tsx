import React, { ReactNode } from 'react'
import Link from 'next/link'

type Props = {
    children?: ReactNode
}

const Navbar = ({ children }: Props) => {
    return (
        <div className="flex">
            <div className='p-5 bg-gray-100 w-[300px] h-screen'>
                <div className="flex gap-4 items-center">
                    <div className="bg-[#0056b3] w-12 h-12 rounded-md"></div>
                    <div className="">
                        <h1 className='text-[16.5px] font-bold text-black'>Gerenciador de tarefas</h1>
                        <p className='text-gray-600'>SAEP</p>
                    </div>
                </div>

                <div className="mt-14">
                    <h1 className='text-[15px] text-gray-600'>Overview</h1>
                    <ul className='ml-2'>
                        <Link href={"/"}>
                            <li className='my-2 p-2 rounded w-60 cursor-pointer hover:bg-gray-300'>Kanban</li>
                        </Link>
                        <Link href={"/cadastro"}>
                            <li className='my-2 p-2 rounded w-60 cursor-pointer hover:bg-gray-300'>Cadastrar usuário</li>
                        </Link>
                        <Link href={"/tarefa"}>
                            <li className='my-2 p-2 rounded w-60 cursor-pointer hover:bg-gray-300'>Cadastrar tarefa</li>
                        </Link>
                    </ul>
                </div>
            </div>
            <div className="">
                {children}
            </div>
        </div>
    )
}

export default Navbar;