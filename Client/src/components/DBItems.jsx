import React from "react";
import DataTable from "./DataTable";
import { HiCurrencyRupee } from "../assets/icons";
import { useSelector, useDispatch } from "react-redux";
import { deleteAProduct, getAllProduct } from "../api";
import { setAllProducts } from "../context/actions/productAction";
import { alertNull, alertSuccess } from "../context/actions/alertAction";

const DBItems = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "Image",
            field: "imageUrl",
            render: (rowData) => (
              <img
                src={rowData.imageUrl}
                className="w-32 h-16 objext-contain rounded-md"
                alt=""
              />
            ),
          },
          {
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
            ),
          },
        ]}
        data={products}
        title="List of Products"
        actions={[
          {
            icon: "edit",
            tooltip: "Edit Data",
            onClick: (event, rowData) => {
              alert("You want to  edit" + rowData.productId);
            },
          },
          {
            icon: "delete",
            tooltip: "Delete Data",
            onClick: (event, rowData) => {
              if (
                window.confirm("Are you sure, you want to perform this aciton")
              ) 
              {
                deleteAProduct(rowData.productId).then((res) => {
                  dispatch(alertSuccess("Product Deleted"));
                  setInterval(() => {
                    dispatch(alertNull());
                  }, 3000)
                  getAllProduct().then((data) => {
                    dispatch(setAllProducts(data));
                  });
                });
              }
            },
          },
        ]}
      />
    </div>
  );
};

export default DBItems;
