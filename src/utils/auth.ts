import { jwtDecode } from "jwt-decode";
import { toastError } from "./toast";
import { loginApi } from "@/services/user.service"

export const storeAuthData = async (value: any) => {
    try {
        const jsonValue = JSON.stringify(value);
        await localStorage.setItem("AUTH_TOKEN", jsonValue);
        return jsonValue;
    } catch (e) {
        console.error("Auth Error", e);
    }
};

export const getAuth = async () => {
    try {
        const jsonValue = await localStorage.getItem("AUTH_TOKEN");

        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Auth Error", e);
        return null;
    }
};

export const checkAuth = async () => {
    try {
        const jsonValue = await localStorage.getItem("AUTH_TOKEN");
        return jsonValue != null ? true : false;
    } catch (e) {
        console.error("Auth Error", e);
    }
};

export const loginUser = async (formData: any) => {
    try {
        let { data: response } = await loginApi(formData);
        if (response) {
            console.log(response);
            let decodedToken: any = await jwtDecode(response.token);
            let authToken = {
                ...response,
                token: response.token,
                role: decodedToken.role,
                userId: decodedToken.userId,
                user: decodedToken.user,
            };
            await storeAuthData(authToken);
            return { success: true, token: authToken, msg: "Login Successfully" };
        }
    } catch (err) {
        return { success: false, token: "", msg: toastError(err) };
    }
};

export const logoutUser = async () => {
    await localStorage.removeItem("AUTH_TOKEN");

    return true;
};