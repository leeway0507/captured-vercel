'use client'

import { Dialog, TransitionChild, Transition, DialogPanel } from '@headlessui/react'
import { Fragment } from 'react'

function SideModal({
    children,
    isOpen,
    closeModal,
}: {
    children: React.ReactNode
    isOpen: boolean
    closeModal: () => void
}) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <TransitionChild
                    as={Fragment}
                    enter="opacity-0 duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-30 h-full" />
                </TransitionChild>

                <div className="fixed top-0 right-0 h-full">
                    <TransitionChild
                        as={Fragment}
                        enter="transition duration-500 ease-in-out transform"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition duration-500 ease-in-out transform"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <DialogPanel className="ms-auto h-full w-[85%] max-w-[500px] overflow-hidden bg-white ">
                            <div className="mx-auto overflow-auto h-full">{children}</div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    )
}

export default SideModal
