'use client'

import { Dialog, DialogPanel } from '@headlessui/react'
import { useState } from 'react'
import { ConfirmButton, CancelButton } from './button'

export function DialogWrapper({
    children,
    isOpen,
    handleClose,
}: {
    children: React.ReactNode
    isOpen: boolean
    handleClose?: () => void
}) {
    const PanelClass =
        'relative max-w-2xl space-y-4 bg-white border py-6 px-6 overflow-auto max-h-[95%] rounded-lg'

    return (
        <Dialog open={isOpen} onClose={handleClose || (() => {})} className="relative z-50 ">
            <div className="fixed inset-0 bg-black/30 h-full w-full overflow-y-auto">
                <div className="flex items-center justify-center p-4 h-full">
                    <DialogPanel className={`${PanelClass}`}>{children}</DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

function ConfirmComponent({
    message,
    trigger,
    handleDialogClose,
}: {
    message: string
    trigger: () => void
    handleDialogClose: () => void
}) {
    const handleConfrim = () => {
        trigger()
        handleDialogClose()
    }
    const handleCancel = () => {
        handleDialogClose()
    }
    return (
        <div className="gap-6 flex justify-start flex-col my-2 mx-4">
            <div className="text-lg">{message}</div>
            <div className="flex gap-2 justify-end items-center">
                <ConfirmButton onClick={handleConfrim}>확인</ConfirmButton>
                <CancelButton onClick={handleCancel}>취소</CancelButton>
            </div>
        </div>
    )
}

export function ConfirmDialog({
    buttonMessage,
    dialogMessage,
    setIsOk,
    buttonClass,
}: {
    buttonMessage: string
    dialogMessage: string
    setIsOk: () => void
    buttonClass: string
}) {
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleDialogOpen = () => setDialogOpen(true)
    const handleDialogClose = () => setDialogOpen(false)
    return (
        <>
            <button className={buttonClass} type="button" onClick={handleDialogOpen}>
                {buttonMessage}
            </button>
            <DialogWrapper isOpen={dialogOpen}>
                <ConfirmComponent
                    message={dialogMessage}
                    trigger={setIsOk}
                    handleDialogClose={handleDialogClose}
                />
            </DialogWrapper>
        </>
    )
}

function AlertComponent({
    message,
    handleDialogClose,
}: {
    message: string
    handleDialogClose: () => void
}) {
    const handleCancel = () => {
        handleDialogClose()
    }
    return (
        <div className="gap-6 flex justify-start flex-col my-2 mx-4 max-w-[350px] text-base">
            <div>{message}</div>
            <div className="flex justify-end items-center">
                <ConfirmButton onClick={handleCancel}>확인</ConfirmButton>
            </div>
        </div>
    )
}
export function AlertDialog({
    dialogMessage,
    dialogOpen,
    setDialogOpen,
}: {
    dialogMessage: string
    dialogOpen: boolean
    setDialogOpen: (b: boolean) => void
}) {
    const handleDialogClose = () => setDialogOpen(false)
    return (
        <DialogWrapper isOpen={dialogOpen}>
            <AlertComponent message={dialogMessage} handleDialogClose={handleDialogClose} />
        </DialogWrapper>
    )
}
