import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const warehouses = await prisma.warehouse.findMany()
    return NextResponse.json(warehouses)
  } catch (error) {
    console.error('Error fetching warehouses:', error)
    return NextResponse.json({ error: 'Error fetching warehouses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const warehouse = await prisma.warehouse.create({
      data: body,
    })
    return NextResponse.json(warehouse)
  } catch (error) {
    console.error('Error creating warehouse:', error)
    return NextResponse.json({ error: 'Error creating warehouse' }, { status: 500 })
  }
}

