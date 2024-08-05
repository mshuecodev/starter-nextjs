import Form from "@/app/ui/invoices/edit-form"
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs"
import { latestInvoices, customers } from "@/app/lib/placeholder-data"

export default async function Page({ params }: { params: { id: string } }) {
	const id = params.id
	const invoice = latestInvoices.find((x) => x.id === id)
	return (
		<main>
			<Breadcrumbs
				breadcrumbs={[
					{ label: "Invoices", href: "/dashboard/invoices" },
					{
						label: "Edit Invoice",
						href: `/dashboard/invoices/${id}/edit`,
						active: true
					}
				]}
			/>
			<Form
				invoice={invoice}
				customers={customers}
			/>
		</main>
	)
}
