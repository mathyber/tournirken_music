import './App.css';
import MainRoute from "./router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import {ToastContainer} from "react-toastify";
import React, {useEffect} from "react";
import 'react-toastify/dist/ReactToastify.css';
import {useDispatch} from "react-redux";
import {getInfo} from "./ducks/contest";

function App() {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getInfo());
    }, []);

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
