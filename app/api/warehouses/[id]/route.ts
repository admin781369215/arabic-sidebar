import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const warehouse = await prisma.warehouse.delete({
      where: { id: params.id },
    })
    return NextResponse.json(warehouse)
  } catch (error) {
    console.error('Error deleting warehouse:', error)
    return NextResponse.json({ error: 'Error deleting warehouse' }, { status: 500 })
  }
}

