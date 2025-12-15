import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { client as sanityClient } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

export default function Search({ searchTerm }) {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const query = searchTerm
      ? searchQuery(searchTerm.toLowerCase())
      : feedQuery;

    sanityClient.fetch(query).then((data) => {
      setPins(data);
      setLoading(false);
    });
  }, [searchTerm]);

  return (
    <div>
      {loading && <Spinner message="Searching for pins..." />}

      {pins?.length !== 0 && <MasonryLayout pins={pins} />}

      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <div className="mt-10 text-center text-xl">No Pins found</div>
      )}
    </div>
  );
}

Search.propTypes = {
  searchTerm: PropTypes.string,
};
