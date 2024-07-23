import React, { useEffect, useState } from "react";
import "./App.css";
import OffLineApp from "./OffLineApp";
import OffLineAppOld from "./OffLineAppOld";
// import OnlineApp from "./OnlineApp";
import localforage from 'localforage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

//localForage.defineDriver(memoryDriver)
//localforage.setDriver([localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL])

localforage.config({
  driver: [
    localforage.INDEXEDDB,
    localforage.WEBSQL,
    localforage.LOCALSTORAGE
  ],
  name: 'offline-storage'
});

const isFirstOnline = navigator.onLine;

function App() {

  // const [base64String, setBase64String] = useState('');

  // const fetchImageAsBase64 = async (imageUrl) => {
  //   try {
  //     // Fetch the image
  //     const response = await fetch(imageUrl);
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch image: ${response.statusText}`);
  //     }

  //     // Convert the image to a blob
  //     const blob = await response.blob();

  //     // Convert the blob to a Base64 string
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       //console.log(reader.result.toString());
  //       //setBase64String(reader.result);
  //       //console.log(`base64String: ${base64String}`)
  //       Array.from({ length: 10 }).map((_, index) => {
  //         const saveData = async () => {
  //           try {
  //             await localforage.setItem(`myData + ${index}`, reader.result)
  //             //setData(inputValue);
  //           } catch (error) {
  //             console.error('데이터를 저장하는 중 오류 발생:', error);
  //           }
  //         };
  //         saveData()
  //       })
  //     };
  //     reader.readAsDataURL(blob);
  //   } catch (error) {
  //     console.error('Error fetching or converting image:', error);
  //   }
  // };

  const fetchImageAsBase642 = async (imageUrl) => {
    try {
      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }

      // Convert the image to a blob
      const blob = await response.blob();

      // Convert the blob to a Base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        const saveData = async () => {
          try {
            await localforage.setItem(`tar.bz2`, reader.result)
            //setData(inputValue);
          } catch (error) {
            console.error('데이터를 저장하는 중 오류 발생:', error);
          }
        };
        saveData()
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error fetching or converting image:', error);
    }
  };

  //  localforage.config({
  //     driver      : localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  //     name        : 'myApp',
  //     version     : 1.0,
  //     size        : 4980736, // Size of database, in bytes. WebSQL-only for now.
  //     storeName   : 'keyvaluepairs', // Should be alphanumeric, with underscores.
  //     description : 'some description'
  //   });

  const [isNetworkOnline, setIsNetworkOnline] = useState(isFirstOnline);
  window.addEventListener("online", (event) => { });

  // let AppComponent = <OffLineApp />;
  // let AppComponent = <OffLineAppOld />;
  // if (!isNetworkOnline) {
  //   AppComponent = <OffLineApp />;
  // }

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<OffLineApp />} />
          <Route path="old" element={<OffLineAppOld />} />
        </Routes>
      </Router>
    </div>
  )


  // useEffect(() => {
  //   window.addEventListener("online", (event) => {
  //     setIsNetworkOnline(true);
  //   });
  //   window.addEventListener("offline", (event) => {
  //     setIsNetworkOnline(false);
  //   });

  //   //const imageUrl = 'http://upload.eyine.com/uploads/2024_06_02_02_40_43.mp3'; // Replace with your image URL
  //   //fetchImageAsBase64(imageUrl);

  //   const imageUrl2 = 'https://dev3.eyine.com/test.app.tar.bz2'; // Replace with your image URL
  //   fetchImageAsBase642(imageUrl2);

  //   const imageUrl3 = 'https://dev3.eyine.com/driver.zip'; // Replace with your image URL
  //   fetchImageAsBase643(imageUrl3);

  //   // const fetchData = async () => {
  //   //   try {
  //   //     const storedData = await localforage.getItem('myData');
  //   //     if (storedData) {
  //   //       console.log(`storeData: ${storedData}`)
  //   //     }
  //   //   } catch (error) {
  //   //     console.error('데이터를 불러오는 중 오류 발생:', error);
  //   //   }
  //   // };

  //   // fetchData();
  // }, []);

  // return (
  //   <div className="App">
  //     App Root
  //     {AppComponent}
  //   </div>
  // );
}

export default App;
