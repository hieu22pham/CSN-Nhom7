import React, { useEffect, useState } from 'react';
import useFirestore from '../../hooks/useFirestore';
import { AuthContext } from './AthProvider';
import 'firebase/firestore';
import { db } from '../firebase/config';

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  // const setProducts = [];

  const {
    user: { uid },
  } = React.useContext(AuthContext);

  // No need to use any specific condition to fetch all products
  const [products, setProducts] = useState([])

  React.useEffect(() => {
    const data = db.collection('LichKham');

    data
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc.data());
        setProducts(data); // Lưu trữ dữ liệu vào state
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  }, []);

  const selectedRoom = React.useMemo(
    () => products.find((product) => product.id === selectedRoomId) || {},
    [products, selectedRoomId]
  );

  const clearState = () => {
    setSelectedRoomId('');
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
  };

  // Function to add data to the 'products' collection
  const addProductToFirestore = async (name, photoURL) => {
    try {
      const productsRef = db.firestore().collection('LichKham');
      await productsRef.add({
        name,
        photoURL,
      });
      console.log('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        setProducts,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        clearState,
        addProductToFirestore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}