import type { NextPage } from "next";
import Head from "next/head";
import { Toaster, toast } from "react-hot-toast";
import React, { useState } from "react";
import { UPIForm } from "../types";

const formEmptyState = { name: "", vpa: "" };

const Home: NextPage = () => {
  const [upi, setUPI] = useState<UPIForm>(formEmptyState);
  const handleField = (value: string, field: keyof UPIForm) => {
    setUPI((upi) => ({
      ...upi,
      [field]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const response = await fetch("/api/form", {
      method: "POST",
      body: JSON.stringify(upi),
    });

    // toast.dismiss(loadingToastId);
    if (!response.ok) {
      toast.error("Already sent ₹1", { id: toastId });
    } else {
      toast.success("Successfully sent ₹1", { id: toastId });
    }

    setUPI(formEmptyState);
  };
  return (
    <div>
      <Head>
        <title>UPI Demo</title>
        <meta name="description" content="A demonstration on how UPI works" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster />
      <div className="flex justify-center items-center flex-col">
        <div className="flex flex-col border border-black rounded-lg p-4 my-24 w-[360px] gap-8">
          <h1 className="text-3xl text-center">UPI Demo</h1>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Legal Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                value={upi.name}
                onChange={(e) => handleField(e.target.value, "name")}
                placeholder="Ashok Kumar"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="upi"
              >
                UPI VPA
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="upi"
                type="text"
                value={upi.vpa}
                onChange={(e) => handleField(e.target.value, "vpa")}
                placeholder="sequoia@ybl"
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm disabled:cursor-not-allowed"
              disabled={upi.name === "" || upi.vpa === ""}
            >
              Get ₹1
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;
