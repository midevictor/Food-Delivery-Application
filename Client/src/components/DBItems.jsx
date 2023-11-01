import React from 'react'
import DataTable from './DataTable'
import { HiCurrencyRupee } from '../assets/icons/index'
import { useSelector } from 'react-redux'

const DBItems = () => {
  const products = useSelector((state) => state.products)
  
  return (
    <div className='flex items-center justify-self-center gap-4 pt-6 w-full'>
      <DataTable columns={[
        {title: "Image", field: "imageUrl", render: (rowData) => (
          <img 
          src={rowData.imageUrl}
          className='w-32 h-16 objext-contain rounded-md'
          alt=''/>
        ),},{
          title: "Name",
          field: "product_name",
        },
        {
          title: "Category",
          field: "product_category",
        },
        {
          title: "Price",
          field: "product_price",
          render: (rowData) => (
            <p className="text-xl font-semibold text-textColor flex items-center justify-center ">
            <HiCurrencyRupee className="text-red-400" />
            {parseFloat(rowData.product_price).toFixed(2)}
          </p>
          )
        },
      ]}
       data={products}
      />
         
 
    </div>
  )
}

export default DBItems
