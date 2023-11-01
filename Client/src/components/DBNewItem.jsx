import React, { useState } from "react";
import { statuses } from "../utils/style";
import { Spinner, Progress } from "../components";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { storage } from "../config/firebase.config";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { alertDanger, alertNull, alertSuccess } from "../context/actions/alertAction";
import {motion} from "framer-motion"
import { buttonClick } from "../animations";
import { MdDelete } from "react-icons/md";
import { addNewProduct,  getAllProduct } from "../api";
import { setAllProducts } from "../context/actions/productAction";

const DBNewItem = () => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState(false);
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const [imageDownloadUrl, setImageDownloadUrl] = useState(null);
  const alert = useSelector((state) => state.alert);
  const dispatch = useDispatch();

  const uploadImage = (e) => {
    setIsLoading(true);
    const imageFile = e.target.files[0];
    // console.log(imageFile);
    const storageRef = ref(storage, `Images/${Date.now()}_${imageFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        dispatch(alertDanger(`Error : ${error}`));
        setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log("File available at", downloadURL);
          setImageDownloadUrl(downloadURL);
          setIsLoading(false);
          setProgress(null)
          dispatch(alertSuccess("Image uploaded successfully"));
          setTimeout(() => {
            dispatch(alertNull());
          }, 3000);
          
        });
      }
    );
  };


  const deleteImageFromFirebase = () => {
    setIsLoading(true);
    const deleteRef = ref(storage, imageDownloadUrl);

    deleteObject(deleteRef).then(() => {
      setImageDownloadUrl(null);
      setIsLoading(false);
      dispatch(alertSuccess("Image deleted successfully"));
         setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
    })

  }
//upload item details to firebase
  const submitNewData = () =>  {
    const data = {
      product_name : itemName,
      product_category: category,
      producy_price: price,
      imageUrl: imageDownloadUrl
    };
    addNewProduct(data).then(res => {
      console.log(res)
      dispatch(alertSuccess("Product added successfully"));
         setTimeout(() => {
          dispatch(alertNull());
        }, 3000);
        setImageDownloadUrl(null);
        setItemName("")
        setPrice("")
        setCategory(null)
    })

    getAllProduct().then((data) => {
      dispatch(setAllProducts(data));
    })
  }

  return (
    <div className="flex items-center justify-center flex-col pt-6 px-24 w-full">
      <div className="border border-gray-300 rounded-md p-4 w-full flex flex-col items-center justify-center gap-4">
        <InputValueField
          type="text"
          placeHolder={"Item name here"}
          stateFunc={setItemName}
          stateValue={itemName}
        />

        <div className="w-full flex items-center justify-around gap-3 flex-wrap">
          {statuses &&
            statuses?.map((data) => (
              <p
                key={data.id}
                onClick={() => setCategory(data.category)}
                className={`px-4 py-3 rounded-md text-xl text-textColor font-semibold cursor-pointer hover:shadow-md border border-gray-200 backdrop-blur-md
        ${
          data.category === category
            ? "bg-red-400 text-primary"
            : "bg-transparent"
        }
        `}
              >
                {data.title}
              </p>
            ))}
        </div>

        <InputValueField
          type="number"
          placeHolder={"Item price here"}
          stateFunc={setPrice}
          stateValue={price}
        />

        <div className="w-full bg-card backdrop-blur-md h-370 rounded-md border-2 border-gray-300 cursor-pointer">
          {isLoading ? (
            <div className="w-full h-full flex flex-col items-center justify-evenly px-24">
              <Spinner />
              {Math.round(progress > 0) && (
                <div className=" w-full flex flex-col items-center justify-center gap-2">
                  <div className="flex justify-between w-full">
                    <span className="text-base font-medium text-textColor">
                      Progress
                    </span>
                    <span className="text-sm font-medium text-textColor">
                      {Math.round(progress) > 0 && (
                        <>{`${Math.round(progress)}%`}</>
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-red-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${Math.round(progress)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              {!imageDownloadUrl ? (
                <>
                  <label>
                    <div className="flex flex-col items-center justify-center h-full w-full cursor-pointer ">
                      <div className="flex flex-col justify-center items-center cursor-pointer">
                        <p className="font-bold text-4xl">
                          <FaCloudDownloadAlt className="-rotate-0" />
                        </p>
                        <p className="text-lg text-textColor">
                          Click to upload Images
                        </p>
                      </div>
                    </div>
                    <input
                      type="file"
                      name="uplaod-image"
                      accept="image/*"
                      onChange={uploadImage}
                      className="w-0 h-0"
                    />
                  </label>
                </>
              ) : (
                <>
                <div className="relative w-full h-full overflow-hidden rounded-md">
                  <motion.img
                  whileHover={{scale: 1.5}}
                  src={imageDownloadUrl}
                  className="w-full h-full object-cover"
                  />

                  <motion.button
                  {...buttonClick}
                  type="button"
                  className="absolute top-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline hover:shadow-md duration-500 transition-all ease-in-out"
                  onClick={() => deleteImageFromFirebase(imageDownloadUrl)}>
                    <MdDelete className="-rotate-0"/>

                  </motion.button>


                </div>
                </>
              )}
            </>
          )}
        </div>

        <motion.button
          onClick={submitNewData}
          {...buttonClick}
          className="w-9/12 py-2 rounded-md bg-red-400 text-primary hover:bg-red-500 cursor-pointer"
        >
          Save
        </motion.button>
      </div>
    </div>
  );
};

export const InputValueField = ({
  type,
  placeHolder,
  stateValue,
  stateFunc,
}) => {
  return (
    <>
      <input
        type={type}
        placeHolder={placeHolder}
        className="w-full px-4 py-3 bg-lightOverlay shadow-md outline-none rounded-md border-gray-200 focus:border-red-400"
        value={stateValue}
        onChange={(e) => stateFunc(e.target.value)}
      />
    </>
  );
};

export default DBNewItem;
