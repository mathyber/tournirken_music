import './App.css';
import MainRoute from "./router";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
    return (
        <>
            <Header/>
            <MainRoute/>
            <Footer/>
        </>
    );
}

export default App;
