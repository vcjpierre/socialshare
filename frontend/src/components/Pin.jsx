import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { MdDownloadForOffline } from "react-icons/md";

import { client as sanityClient, urlFor } from "../client";
import { fetchUser } from "../utils/fetchUser";
import Avatar from "./Avatar";

export default function Pin({
  pin: { _id, image, destination, postedBy, save },
}) {
  const [postHovered, setPostHovered] = useState(false);
  const navigate = useNavigate();
  const user = fetchUser();

  const alreadySaved = Boolean(
    save?.filter((item) => item?.postedBy?._id === user?.googleId)?.length
  );

  function savePin(_id) {
    if (!alreadySaved) {
      sanityClient
        .patch(_id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: { _type: "postedBy", _ref: user?.googleId },
          },
        ])
        .commit()
        .then(() => window.location.reload());
    }
  }

  function deletePin(_id) {
    sanityClient.delete(_id).then(window.location.reload());
  }

  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className="rounded-lg w-full"
        />

        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>

              {user && (
                alreadySaved ? (
                  <button
                    type="button"
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                  >
                    {save?.length} Saved
                  </button>
                ) : (
                  <button
                    type="button"
                    className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      savePin(_id);
                    }}
                  >
                    Save
                  </button>
                )
              )}
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? `${destination.slice(8, 20)}...`
                    : destination}
                </a>
              )}

              {postedBy?._id === user?.googleId && (
                <button
                  type="button"
                  className="bg-white p-2 opacity-70 hover:opacity-100 font-bold  text-dark rounded-3xl hover:shadow-md outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <Avatar
          src={postedBy?.image}
          alt="user-profile"
          name={postedBy?.userName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
}

Pin.propTypes = {
  pin: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.shape({
      asset: PropTypes.shape({
        url: PropTypes.string,
      }),
    }),
    destination: PropTypes.string,
    postedBy: PropTypes.shape({
      _id: PropTypes.string,
      image: PropTypes.string,
      userName: PropTypes.string,
    }),
    save: PropTypes.arrayOf(
      PropTypes.shape({
        postedBy: PropTypes.shape({
          _id: PropTypes.string,
        }),
      })
    ),
  }),
};
