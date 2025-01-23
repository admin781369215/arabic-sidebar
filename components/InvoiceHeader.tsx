interface InvoiceHeaderProps {
  onOpenModal: () => void
}

export function InvoiceHeader({ onOpenModal }: InvoiceHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded" onClick={onOpenModal}>
        خيارات
      </button>
      <h1 className="text-xl font-bold">فاتورة نقد</h1>
    </div>
  )
}

