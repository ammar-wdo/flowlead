import { create } from 'zustand'


export type ModalInputs = {type:'delete',deleteFunction:()=>Promise<{success:boolean,message?:string,error?:string}>} | {
  type: 'company-modal',
  new?:boolean
} | null

type Modal = {
  open: boolean
  modalInputs: ModalInputs
  setOpen: (inputs: ModalInputs) => void
  setClose: () => void
}

export const useModal = create<Modal>()((set) => ({
  open: false,
  modalInputs: null,
  setOpen: (modalInputs: ModalInputs) => set((state) => ({ open: true, modalInputs })),
  setClose: () => set((state) => ({ open: false }))
}))