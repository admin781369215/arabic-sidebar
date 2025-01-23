import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sales = await prisma.sale.findMany()
    return NextResponse.json(sales)
  } catch (error) {
    console.error('Error fetching sales:', error)
    return NextResponse.json({ error: 'Error fetching sales' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sale = await prisma.sale.create({
      data: body,
    })
    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error creating sale:', error)
    return NextResponse.json({ error: 'Error creating sale' }, { status: 500 })
  }
}

