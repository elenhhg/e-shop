// app/api/search/route.js
import { products } from "@/lib/product"

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase().trim() || ''
  
  if (!query) {
    return Response.json({ results: [] })
  }

  // Φιλτράρουμε τα products βάσει του query
  const results = products.filter(product => {
    const searchText = `${product.name} ${product.category} ${product.description} ${product.materials?.join(' ') || ''}`.toLowerCase()
    return searchText.includes(query)
  }).slice(0, 10) // Περιορίζουμε σε 10 αποτελέσματα

  // Προσομοίωση network delay
  await new Promise(resolve => setTimeout(resolve, 100))

  return Response.json({ results })
}