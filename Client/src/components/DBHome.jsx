import React, {useEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getAllProduct } from '../api';
import { setAllProducts } from '../context/actions/productAction';

const DBHome = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect (() => {
    if(!products){
      getAllProduct().then((data) => {
        dispatch(setAllProducts(data))
      })
    }

  }, []);
  return (
    <div>
      hhhhhl
    </div>
  )
}

export default DBHome
