import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcrypt"
import { authConfig } from "./auth.config"

interface User {
	id: string
	name: string
	email: string
	password: string
}

async function getUser(email: string): Promise<User | undefined> {
	try {
		const user: User = {
			id: "410544b2-4001-4271-9855-fec4b6a6442a",
			name: "User",
			email: "user@nextmail.com",
			password: await bcrypt.hash("123456", 10) // Hashing the password for comparison
		}
		return user
	} catch (error) {
		console.error("Failed to fetch user:", error)
		throw new Error("Failed to fetch user.")
	}
}

// const options = {
// 	...authConfig,
// 	providers: [
// 		CredentialsProvider({
// 			name: "Credentials",
// 			credentials: {
// 				email: { label: "Email", type: "text", placeholder: "user@nextmail.com" },
// 				password: { label: "Password", type: "password" }
// 			},
// 			async authorize(credentials) {
// 				const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials)

// 				if (!parsedCredentials.success) {
// 					console.log("Invalid credentials")
// 					return null
// 				}

// 				const { email, password } = parsedCredentials.data
// 				const user = await getUser(email)

// 				if (!user) {
// 					console.log("User not found")
// 					return null
// 				}

// 				const passwordsMatch = await bcrypt.compare(password, user.password)
// 				if (!passwordsMatch) {
// 					console.log("Incorrect password")
// 					return null
// 				}

// 				return user
// 			}
// 		})
// 	],
// 	pages: {
// 		signIn: "/login"
// 	},
// 	session: {
// 		jwt: true
// 	}
// }

export const { auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text", placeholder: "user@nextmail.com" },
				password: { label: "Password", type: "password" }
			},
			async authorize(credentials) {
				const parsedCredentials = z.object({ email: z.string().email(), password: z.string().min(6) }).safeParse(credentials)

				if (!parsedCredentials.success) {
					console.log("Invalid credentials")
					return null
				}

				const { email, password } = parsedCredentials.data
				const user = await getUser(email)

				if (!user) {
					console.log("User not found")
					return null
				}

				const passwordsMatch = await bcrypt.compare(password, user.password)
				if (!passwordsMatch) {
					console.log("Incorrect password")
					return null
				}

				return user
			}
		})
	]
})

// export default (req, res) => NextAuth(req, res, options)
