import React from 'react'
import { Button } from '../ui/button'

type Props = {}

const ModalConfigTask = (props: Props) => {
    return (
        <div className='flex flex-col bg-white shadow w-50 p-3 space-y-2'>
            <Button

                variant={'ghost'}
                className='flex justify-start cursor-pointer text-md font-normal'>
                Set a list
            </Button>

            <Button
                variant={'ghost'}
                className='flex justify-start cursor-pointer text-md font-normal'>
                Set a date
            </Button>

            <Button
                variant={'ghost'}
                className='flex justify-start hover:bg-red-400 text-black cursor-pointer text-md font-normal'>
                Delete
            </Button>
        </div >
    )
}

export default ModalConfigTask;