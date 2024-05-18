import { create } from 'zustand'


type ModalInputs ={
    type:'company-modal'
} | null

type Modal = {
  open: boolean
  modalInputs:ModalInputs
  setOpen:(inputs:ModalInputs)=>void
  setClose:()=>void
}

export const useModal = create<Modal>()((set) => ({
 open:false,
 modalInputs:null,
  setOpen: (modalInputs:ModalInputs) => set((state) => ({ open: true ,modalInputs})),
  setClose:()=>set((state)=>({open:false}))
}))