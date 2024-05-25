import { elementSchema } from '@/schemas'
import { Element, ElementType } from '@prisma/client'
import { z } from 'zod'
import { create } from 'zustand'


type SelectedElement={id:string,type:ElementType} | null

type Modal = {

    selectedElement:SelectedElement 
    setSelectedElement: (selectedElement: SelectedElement) => void
    setSelectedElementNull: () => void
}

export const useSelectedElement = create<Modal>()((set) => ({
    selectedElement: null,

    setSelectedElement: (selectedElement: SelectedElement) => set((state) => ({ selectedElement })),
    setSelectedElementNull: () => set((state) => ({ selectedElement: null }))
}))