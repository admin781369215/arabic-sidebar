import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const sale = await prisma.sale.update({
      where: { id: params.id },
      data: body,
    })
    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error updating sale:', error)
    return NextResponse.json({ error: 'Error updating sale' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sale = await prisma.sale.delete({
      where: { id: params.id },
    })
    return NextResponse.json(sale)
  } catch (error) {
    console.error('Error deleting sale:', error)
    return NextResponse.json({ error: 'Error deleting sale' }, { status: 500 })
  }
}

