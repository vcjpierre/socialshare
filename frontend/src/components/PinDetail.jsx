import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client as sanityClient, urlFor } from "../client"
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Avatar from "./Avatar";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

export default function PinDetail({ user }) {
  const [pinDetail, setPinDetail] = useState(null);
  const [pins, setPins] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const fetchPinDetail = useCallback(() => {
    const pinQuery = pinDetailQuery(pinId);

    if (pinQuery)
      sanityClient.fetch(pinQuery).then((data) => {
        setPinDetail(data[0]);

        if (data[0]) {
          const relatedPinsQuery = pinDetailMorePinQuery(data[0]);
          sanityClient
            .fetch(relatedPinsQuery)
            .then((relatedPins) => setPins(relatedPins));
        }
      });
  }, [pinId]);

  function addComment() {
    if (comment) {
      setAddingComment(true);

      sanityClient
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetail();
          setComment("");
          setAddingComment(false);
        });
    }
  }

  useEffect(() => {
    fetchPinDetail();
  }, [pinId, fetchPinDetail]);

  if (!pinDetail) {
    return <Spinner message="Loading pin..." />;
  }

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ borderRadius: "32px", maxWidth: "1500px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail?.image).url()}
            alt="user-post"
            className="rounded-t-3xl rounded-b-lg"
          />
        </div>

        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline />
              </a>
            </div>

            <a href={pinDetail.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination}
            </a>
          </div>
          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>
            <p className="mt-3">{pinDetail.about}</p>
          </div>

          <Link
            to={`/user-profile/${pinDetail.postedBy?._id}`}
            className="flex gap-2 mt-5 items-center bg-white rounded-lg"
          >
            <Avatar
              src={pinDetail.postedBy?.image}
              alt="user-profile"
              name={pinDetail.postedBy?.userName}
              className="w-8 h-8 rounded-full object-cover"
            />
            <p className="font-semibold capitalize">
              {pinDetail.postedBy?.userName}
            </p>
          </Link>

          <h2 className="mt-5 text-2xl">Comments</h2>
          <div className="max-h-370 overflow-y-auto">
            {pinDetail?.comments?.map((comment, index) => (
              <div
                className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                key={index}
              >
                <Avatar
                  src={comment.postedBy.image}
                  alt="user-profile"
                  name={comment.postedBy.userName}
                  className="w-10 h-10 rounded-full cursor-pointer"
                />
                <div className="flex flex-col">
                  <p className="font-bold">{comment.postedBy.userName}</p>
                  <p>{comment.comment}</p>
                </div>
              </div>
            ))}
          </div>

          {user ? (
            <div className="flex flex-wrap mt-6 gap-3 items-center">
              <Link to={`/user-profile/${user._id}`} className="">
                <Avatar
                  src={user.image}
                  alt="user-profile"
                  name={user.userName}
                  className="w-8 h-8 rounded-full cursor-pointer"
                />
              </Link>
              <input
                type="text"
                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none disabled:bg-red-300"
                onClick={addComment}
                disabled={addingComment}
              >
                {addingComment ? "Posting the comment..." : "Post"}
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap mt-6 gap-3 items-center justify-center">
              <p className="text-gray-500">
                <Link to="/login" className="text-red-500 font-semibold hover:underline">
                  Sign in
                </Link>{" "}
                to add a comment
              </p>
            </div>
          )}
        </div>
      </div>

      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  );
}

PinDetail.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string,
    image: PropTypes.string,
    userName: PropTypes.string,
  }),
};
