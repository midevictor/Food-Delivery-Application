import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllUsers } from "../api"
import { setAllUserDetails } from '../context/actions/allUsersAction'
import DataTable from './DataTable'
import { Avatar } from '../assets'
import { deleteAProduct, getAllProduct } from "../api";
import { setAllProducts } from "../context/actions/productAction";
import { alertNull, alertSuccess } from "../context/actions/alertAction";


const DBUsers = () => {
  const allUsers  = useSelector((state) => state.allUsers);
 
  const dispatch = useDispatch();

  useEffect(() => {
    if(!allUsers) {
      getAllUsers().then((data) => {
        dispatch(setAllUserDetails(data))
      })
    }
  })
  return (
    <div className="flex items-center justify-self-center gap-4 pt-6 w-full">
      <DataTable
        columns={[
          {
            title: "Image",
            field: "imageUrl",
            render: (rowData) => (
              <img
                src={rowData.photoUrl ? rowData.photoUrl : Avatar}
                className="w-32 h-16 objext-contain rounded-md"
                alt=""
              />
            ),
          },
          {
            title: "Name",
            field: "displayName",
          },
          {
            title: "Email",
            field: "email",
          },
          {
            title: "Verified",
            field: "emailVerified",
            render: (rowData) => (
              <p
                className={`px-2 py-1 w-32 text-center text-primary rounded-md ${
                  rowData.emailVerified ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {rowData.emailVerified ? "Verified" : "Not Verified"}
              </p>
            ),
          },
        ]}
        data={allUsers}
        title="List of Users"
        // actions={[
        //   {
        //     icon: "edit",
        //     tooltip: "Edit Data",
        //     onClick: (event, rowData) => {
        //       alert("You want to  edit" + rowData.productId);
        //     },
        //   },
        //   {
        //     icon: "delete",
        //     tooltip: "Delete Data",
        //     onClick: (event, rowData) => {
        //       if (
        //         window.confirm("Are you sure, you want to perform this aciton")
        //       ) 
        //       {
        //         deleteAProduct(rowData.productId).then((res) => {
        //           dispatch(alertSuccess("Product Deleted"));
        //           setInterval(() => {
        //             dispatch(alertNull());
        //           }, 3000)
        //           getAllProduct().then((data) => {
        //             dispatch(setAllProducts(data));
        //           });
        //         });
        //       }
        //     },
        //   },
        // ]}
      />
    </div>
  )
}

export default DBUsers
