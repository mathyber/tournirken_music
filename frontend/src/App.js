import './App.css';
import MainRoute from "./router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {ToastContainer} from "react-toastify";
import React from "react";
import 'react-toastify/dist/ReactToastify.css';

function App() {
    return (
        <>
            <Header/>
            <MainRoute/>
            <Footer/>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='colored'
            />
        </>
    );
}

export default App;
