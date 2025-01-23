interface OptionsModalProps {
  isOpen: boolean
  onClose: () => void
  visibleFields: {
    customerName: boolean
    sellerName: boolean
    customerPhone: boolean
    sellerPhone: boolean
    customerAddress: boolean
    sellerAddress: boolean
  }
  onToggleField: (fieldId: keyof typeof visibleFields) => void
}

export function OptionsModal({ isOpen, onClose, visibleFields, onToggleField }: OptionsModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">خيارات الحقول</h2>
          <button onClick={onClose} className="text-2xl">&times;</button>
        </div>
        {Object.entries(visibleFields).map(([key, value]) => (
          <div key={key} className="flex items-center mb-2">
            <input
              type="checkbox"
              id={`toggle-${key}`}
              checked={value}
              onChange={() => onToggleField(key as keyof typeof visibleFields)}
            />
            <label htmlFor={`toggle-${key}`} className="mr-2">
              {key === 'customerName' && 'اسم العميل'}
              {key === 'sellerName' && 'اسم البائع'}
              {key === 'customerPhone' && 'هاتف العميل'}
              {key === 'sellerPhone' && 'هاتف البائع'}
              {key === 'customerAddress' && 'عنوان العميل'}
              {key === 'sellerAddress' && 'عنوان البائع'}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

