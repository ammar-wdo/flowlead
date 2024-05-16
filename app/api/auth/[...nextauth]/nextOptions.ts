import prisma from "@/lib/prisma";
import { comparePasswords } from "@/lib/utils";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter"





export const authOptions = {
    pages: {
        signIn: '/signin',
        signOut: '/signout'
    },
    session: {
        strategy: 'jwt'
    },
    adapter:PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({

            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "text", },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                if (!credentials?.email || !credentials.password) return null

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })
if(!user) return null 

const passwordMatch = await comparePasswords(credentials.password, user.password)
if(!passwordMatch) return null 


return {email:user.email,name:user.name || '',id:user.id}
              
            }
        })

    ],
} satisfies NextAuthOptions