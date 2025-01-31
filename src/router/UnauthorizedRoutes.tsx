import LoginPage from "@/pages/LoginPage/LoginPage";
import { Route, Routes } from "react-router-dom";


export default function UnauthorizedRoutes() {
    return (
        <section className="body_bg">
            <div className="row">
                <div className="col-12">
                    <Routes>
                        <Route path="/" element={<LoginPage />}></Route>
                    </Routes>
                </div>
            </div>
        </section>
    );
}