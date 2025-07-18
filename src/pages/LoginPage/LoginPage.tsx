import React, { useContext, useState } from "react";
import loginimg from "@/assets/LoginPages/loginimg.webp";
import loginlogo from "@/assets/LoginPages/biglogo.webp";
import logo from "@/assets/mainlogo/logo.png";
import { FaEye, FaEyeSlash, FaRegIdBadge } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
// import googleicn from '@/assets/LoginPages/googleicn.webp'
import { Link, useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "@/utils/toast";
import { loginUser, changePasswordUser } from "@/utils/auth";
import { AuthContext } from "@/context/AuthProvider";
import { colors } from "@mui/material";

export default function LoginPage() {
  const { isAuthorized, setIsAuthorized } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleDashboardRoute = () => {
    window.location.reload();
  };

  const handleSubmit = async () => {
    try {
      if (!email || email == "") {
        toastError("Please Enter Your Email");
        return 0;
      }
      if (!password || password == "") {
        toastError("Please Enter Your Password");
        return 0;
      }
      let obj = {
        email,
        password,
      };
      let response = await loginUser(obj);
      if (response?.success) {

        console.log(response, "check response value");

        if (password.split("-")[0] === "demo") {
          setShowChangePassword(true);
        } else {
          setIsAuthorized(true);
          navigate("/");
        }
      } else {
        toastError(response?.msg);
      }
    } catch (error) {
      toastError(error);
    }
  }

  const handleChnagePassword = async () => {
    try {
      if (!newPassword || newPassword == "") {
        toastError("Please Enter New Password");
        return 0;
      }

      if (newPassword !== confirmPassword) {
        toastError("Password Not Match");
        return 0;
      }
      let obj = {

        email,
        oldPassword: password,
        newPassword,
        confirmPassword: confirmPassword,
      };
      let response = await changePasswordUser(obj);
      if (response?.success) {
        toastSuccess("Password Changed Successfully");
        setShowChangePassword(false);
        setIsAuthorized(true);
        navigate("/");
      } else {
        toastError(response?.msg);
      }
    } catch (error) {
      toastError(error);
    }
  };

  return (
    <>

      <header className="w-full border-b border-gray-200 px-8 h-[75px]  bg-white">
        <div className="max-w-screen-xl  mt-4 flex items-center justify-between">
          <img
            src={logo}
            alt="360 Icon"
            className="h-[80px]  object-contain"
          />

        </div>
      </header>
      <div className="login_box pt-[6%]">
        <div className="flex justify-center items-center">
          {/* <div className="w-1/2">
            <div className="image w-full h-[100vh]">
              <img
                src={loginimg}
                alt="loginimg"
                className="w-full h-full object-cover"
              />
            </div>
          </div> */}
          <div className="w-1/2">
            <div className="login-form bg-[url('/loginbg.webp')] w-full h-full bg-cover bg-no-repeat flex items-center">
              <div className="w-[65%] mx-auto font-zoho ">
                {/* <Link to="/login-page">
                  <div className="logo relative w-[350px] h-[100px]">
                    <img
                      src={loginlogo}
                      alt="loginlogo"
                      className="w-full h-full"
                    />
                  </div>
                </Link> */}
                <h2 className="heading font-bold text-gray-900 text-3xl mt-8 mb-5  ">
                  Log-In Your Account
                </h2>
                <p className="text-sm text-gray-600">
                  Welcome back to <span className="font-semibold text-black">360 Solution</span>. Please log in to access your account.
                </p>

                <div className="form mt-5">
                  <div className="flex flex-wrap -mx-3 items-center  ">
                    <div className="w-full relative px-3 mb-3">
                      <label
                        className="block  tracking-wide text-txtcolor  font-medium mb-2"
                        htmlFor="grid-first-name"
                      >
                        Email/PhoneNo.<span className="text-red-500">*</span>
                      </label>
                      <input
                        className="appearance-none  text-sm font-normal block w-full  text-graytext border border-black rounded p-3 py-4  leading-tight focus:outline-none focus:border-blue-500"
                        type="text"
                        placeholder="Phone Number or Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                     
                    </div>
                    <div className="w-full relative px-3 mb-3">
                      <label
                        className="block  tracking-wide text-txtcolor  font-medium mb-2"
                        htmlFor="grid-first-name"
                      >
                        Password<span className="text-red-500">*</span>
                      </label>
                      <input
                        className="appearance-none  text-sm font-normal block w-full  text-graytext border border-black rounded p-3 py-4  leading-tight focus:outline-none focus:border-blue-500"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                      {/* <p className='text-end mt-3'>

                <Link to="/forgot-password" className='text-red-500'>Forgot Password ?</Link>
                </p> */}
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-[25px] top-[60%] translate-y-[-15%] cursor-pointer text-[#e1e1e1] text-[20px] hover:text-red-500"

                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </span>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-red-600 py-4 w-full mt-3  border    rounded-md text-white font-bold tracking-widest uppercase"
                  >
                    {" "}
                    Login
                  </button>

                  {showChangePassword && (
                    <div className="mt-5">
                      <div className="flex flex-wrap -mx-3 items-center  ">
                        <div className="w-full relative px-3 mb-3">
                          <label
                            className="block  tracking-wide text-txtcolor  font-medium mb-2"
                            htmlFor="grid-first-name"
                          >
                            New Password<span className="text-red-500">*</span>
                          </label>
                          <input
                            className="appearance-none  text-sm font-normal block w-full  text-graytext border border-black rounded p-3 py-4  leading-tight focus:outline-none focus:border-blue-500"
                            type="password"
                            placeholder="New Password"
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                          />
                        </div>


                        <div className="w-full relative px-3 mb-3">
                          <label
                            className="block  tracking-wide text-txtcolor  font-medium mb-2"
                            htmlFor="grid-first-name"
                          >
                            Confirm Password<span className="text-red-500">*</span>
                          </label>
                          <input
                            className="appearance-none  text-sm font-normal block w-full  text-graytext border border-black rounded p-3 py-4  leading-tight focus:outline-none focus:border-blue-500"
                            type="password"
                            placeholder="Confirm Password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                          />
                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={handleChnagePassword}
                        className="bg-red-600 py-4 w-full mt-3  border    rounded-md text-white font-bold tracking-widest uppercase"
                      >
                        {" "}
                        Change Password
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


