import { GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { client as sanityClient } from "../client";

import logo from "../assets/logowhite.png";
import shareVideo from "../assets/share.mp4";

export default function Login() {
  const navigate = useNavigate();

  function responseGoogle(response) {
    if (!response) return;

    // sub is just a unique ID assigned by Google
    // using image instead of picture to be consistent with JSM
    const {
      name,
      sub: googleId,
      picture: image,
    } = jwtDecode(response.credential);

    localStorage.setItem("user", JSON.stringify({ name, googleId, image }));

    const document = {
      _id: googleId,
      _type: "user",
      userName: name,
      image: image,
    };

    sanityClient
      .createIfNotExists(document)
      .then(() => {
        // Dispatch custom event to notify other components about login
        window.dispatchEvent(new Event("userLogin"));
        navigate("/", { replace: true });
      });
  }

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          className="w-full h-full object-cover"
          src={shareVideo}
          type="video/mp4"
          autoPlay
          loop
          controls={false}
          muted
        />
        <div className="absolute flex flex-col justify-center items-center inset-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} alt="" style={{ width: "130px" }} />
          </div>
          <div className="shadow-2xl">
            <GoogleLogin
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
