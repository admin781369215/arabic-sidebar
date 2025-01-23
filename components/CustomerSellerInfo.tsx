interface CustomerSellerInfoProps {
  visibleFields: {
    customerName: boolean
    sellerName: boolean
    customerPhone: boolean
    sellerPhone: boolean
    customerAddress: boolean
    sellerAddress: boolean
  }
}

export function CustomerSellerInfo({ visibleFields }: CustomerSellerInfoProps) {
  return (
    <div className="grid grid-cols-2 gap-4 mb-4">
      {visibleFields.customerName && (
        <div className="flex items-center">
          <label className="block mb-1 ml-2">اسم العميل</label>
          <input type="text" className="w-full border border-gray-300 p-2 rounded" />
        </div>
      )}
      {visibleFields.sellerName && (
        <div className="flex items-center">
          <label className="block mb-1 ml-2">اسم البائع</label>
          <input type="text" className="w-full border border-gray-300 p-2 rounded" />
        </div>
      )}
      {visibleFields.customerPhone && (
        <div className="flex items-center">
          <label className="block mb-1 ml-2">هاتف العميل</label>
          <input type="text" className="w-full border border-gray-300 p-2 rounded" />
        </div>
      )}
      {visibleFields.sellerPhone && (
        <div className="flex items-center">
          <label className="block mb-1 ml-2">هاتف البائع</label>
          <input type="text" className="w-full border border-gray-300 p-2 rounded" />
        </div>
      )}
      {visibleFields.customerAddress && (
        <div className="flex items-center">
          <label className="block mb-1 ml-2">عنوان العميل</label>
          <input type="text" className="w-full border border-gray-300 p-2 rounded" />
        </div>
      )}
      {visibleFields.sellerAddress && (
        <div className="flex items-center">
          <label className="block mb-1 ml-2">عنوان البائع</label>
          <input type="text" className="w-full border border-gray-300 p-2 rounded" />
        </div>
      )}
    </div>
  )
}

