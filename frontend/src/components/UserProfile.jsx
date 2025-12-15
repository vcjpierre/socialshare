import { googleLogout } from "@react-oauth/google";
import { useEffect, useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { useNavigate, useParams } from "react-router-dom";

import { client as sanityClient } from "../client";
import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomeImage =
  "https://source.unsplash.com/1600x900/?nature,photography,technology,city";
const activeButtonStyles =
  "bg-red-500 text-white font-bold mt-4 px-4 py-2 rounded-full w-29 outline-none";
const notActiveButtonStyles =
  "bg-primary-500 text-black font-bold mt-4 px-4 py-2 rounded-full w-29 outline-none";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [text, setText] = useState("Created"); // Created or Saved
  const [activeButton, setActiveButton] = useState("created");
  const { userId } = useParams();
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  useEffect(() => {
    const query = userQuery(userId);
    sanityClient.fetch(query).then((data) => {
      setUser(data[0]);
      document.title = `${data[0].userName} | ShareMe`;
    });

    return () => {
      document.title = `ShareMe`;
    };
  }, [userId]);

  useEffect(() => {
    const query =
      text === "Created"
        ? userCreatedPinsQuery(userId)
        : userSavedPinsQuery(userId);

    sanityClient.fetch(query).then((data) => setPins(data));
  }, [text, userId]);

  if (!user) {
    return <Spinner message="Loading profile..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={randomeImage}
              alt="banner"
              className="w-full h-370 2xl:h-510 shadow-lg object-cover"
            />
            <img
              src={user?.image}
              alt="user-profile"
              className="rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-3xl text-center mt-3">
              {user.userName}
            </h1>
            <div className="absolute top-0 z-1 right-0 p-2">
              {userId === user._id && (
                <AiOutlineLogout
                  color="red"
                  fontSize={36}
                  className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
                  onClick={() => {
                    googleLogout();
                    logout();
                  }}
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveButton("created");
              }}
              className={
                activeButton === "created"
                  ? activeButtonStyles
                  : notActiveButtonStyles
              }
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveButton("saved");
              }}
              className={
                activeButton === "saved"
                  ? activeButtonStyles
                  : notActiveButtonStyles
              }
            >
              Saved
            </button>
          </div>

          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-xl mt-2">
              No Pins found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
