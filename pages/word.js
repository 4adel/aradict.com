import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React from "react";

const fetcher = async () => {
  fetch("/api/hello").then(async (e) => {
    const data = await e.json();
    return data;
  });
};
export default function AddSound() {
  const {
    query: { q },
  } = useRouter();
  const { isLoading, error, data } = useQuery(["repoData"], () =>
    fetch("/api/hello").then((res) => res.json())
  );

  if (isLoading) return "Loading...";

  if (error) return "An error has occurred: " + error.message;
  return (
    <div>
      <h1>{data[0].name}</h1>
    </div>
  );
}
