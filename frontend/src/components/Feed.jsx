import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client as sanityClient } from "../client";
import { feedQuery, searchQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

export default function Feed() {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    const query = categoryId ? searchQuery(categoryId) : feedQuery;

    sanityClient.fetch(query).then((data) => {
      setPins(data);
      setLoading(false);
    });
  }, [categoryId]);

  if (loading) {
    return <Spinner message="We are adding new ideas to your feed!" />;
  }

  if (!pins?.length) {
    return <h2>No pins available</h2>;
  }

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
}
