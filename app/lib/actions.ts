"use server"
import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { signIn } from "@/auth"
// import { signIn } from "next-auth/react"
import { AuthError } from "next-auth"

const FormSchema = z.object({
	id: z.string(),
	customerId: z.string({
		invalid_type_error: "Please select a customer."
	}),
	amount: z.coerce.number().gt(0, { message: "Please enter an amount greater than $0." }),
	status: z.enum(["pending", "paid"], {
		invalid_type_error: "Please select an invoice status."
	}),

	date: z.string()
})

export type State = {
	errors?: {
		customerId?: string[]
		amount?: string[]
		status?: string[]
	}
	message?: string | null
}

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export async function createInvoice(prevState: State, formData: FormData) {
	const validatedFields = CreateInvoice.safeParse({
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status")
	})

	// If form validation fails, return errors early. Otherwise, continue.
	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: "Missing Fields. Failed to Create Invoice."
		}
	}

	const { customerId, amount, status } = validatedFields.data
	const amountInCents = amount * 100
	const date = new Date().toISOString().split("T")[0]

	// function POST HERE
	//     await sql`
	//     INSERT INTO invoices (customer_id, amount, status, date)
	//     VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
	//   `;

	revalidatePath("/dashboard/invoices")
	redirect("/dashboard/invoices")
}

export async function updateInvoice(id: string, formData: FormData) {
	const { customerId, amount, status } = UpdateInvoice.parse({
		customerId: formData.get("customerId"),
		amount: formData.get("amount"),
		status: formData.get("status")
	})

	const amountInCents = amount * 100

	// await sql`
	//   UPDATE invoices
	//   SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
	//   WHERE id = ${id}
	// `

	revalidatePath("/dashboard/invoices")
	redirect("/dashboard/invoices")
}

export async function deleteInvoice(id: string) {
	// await sql`DELETE FROM invoices WHERE id = ${id}`
	revalidatePath("/dashboard/invoices")
}

// AUTHENTICATION
export async function authenticate(prevState: string | undefined, formData: FormData) {
	try {
		const result = await signIn("credentials", {
			redirect: false,
			email: formData.get("email"),
			password: formData.get("password")
		})

		if (result?.error) {
			switch (result.error) {
				case "CredentialsSignin":
					return { message: "Invalid credentials." }
				default:
					return { message: "Something went wrong." }
			}
		}

		redirect("/dashboard")
	} catch (error) {
		console.error("Authentication error:", error)
		return { message: "Something went wrong." }
	}
}
