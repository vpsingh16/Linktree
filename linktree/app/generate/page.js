"use client";
import React, { useState, Suspense } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSearchParams, useRouter } from "next/navigation";

const GenerateWithSuspense = () => {
  const searchParams = useSearchParams();
  return <Generate searchParams={searchParams} />;
};

const Generate = ({ searchParams }) => {
  const [links, setLinks] = useState([{ link: "", linktext: "" }]);
  const [handle, setHandle] = useState(searchParams.get("handle") || "");
  const [pic, setPic] = useState("");
  const [desc, setDesc] = useState("");

  const handleChange = (index, link, linktext) => {
    setLinks((initialLinks) =>
      initialLinks.map((item, i) => (i === index ? { link, linktext } : item))
    );
  };

  const addLink = () => {
    setLinks([...links, { link: "", linktext: "" }]);
  };

  const router = useRouter();

  const submitLinks = async () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ links, handle, pic, desc }),
    };

    try {
     const r = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/add`, requestOptions)
     const result = await r.json();
      if (result.success) {
        toast.success(result.message);
        router.push(`/${handle}`);
        setLinks([{ link: "", linktext: "" }]);
        setPic("");
        setHandle("");
        setDesc("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error submitting data.");
    }
  };

  return (
    <div className="bg-[#E9C0E9] min-h-[140vh] grid grid-cols-2">
      <div className="col1 flex justify-center items-center flex-col text-gray-900">
        <div className="flex flex-col gap-5 my-8">
          <h1 className="font-bold text-4xl">Create your LinkTree</h1>
          <div className="item">
            <h2 className="font-semibold text-2xl">Step 1: Claim your Handle</h2>
            <div className="mx-4">
              <input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                className="px-4 py-2 my-2 focus:outline-pink-500 rounded-full"
                type="text"
                placeholder="Choose a Handle"
              />
            </div>
          </div>

          <div className="item">
            <h2 className="font-semibold text-2xl">Step 2: Add Links</h2>
            {links.map((item, index) => (
              <div key={index} className="mx-4">
                <input
                  value={item.linktext}
                  onChange={(e) => handleChange(index, item.link, e.target.value)}
                  className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
                  type="text"
                  placeholder="Enter link text"
                />
                <input
                  value={item.link}
                  onChange={(e) => handleChange(index, e.target.value, item.linktext)}
                  className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
                  type="text"
                  placeholder="Enter link"
                />
              </div>
            ))}
            <button
              onClick={addLink}
              className="p-5 py-2 mx-2 bg-slate-900 text-white font-bold rounded-3xl"
            >
              + Add Link
            </button>
          </div>

          <div className="item">
            <h2 className="font-semibold text-2xl">Step 3: Add Picture and Description</h2>
            <div className="mx-4 flex flex-col">
              <input
                value={pic}
                onChange={(e) => setPic(e.target.value)}
                className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
                type="text"
                placeholder="Enter link to your Picture"
              />
              <input
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                className="px-4 py-2 mx-2 my-2 focus:outline-pink-500 rounded-full"
                type="text"
                placeholder="Enter description"
              />
              <button
                disabled={!pic || !handle || !links[0].linktext}
                onClick={submitLinks}
                className="disabled:bg-slate-500 p-5 py-2 mx-2 w-fit my-5 bg-slate-900 text-white font-bold rounded-3xl"
              >
                Create your LinkTree
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="col2 w-full h-[120vh] bg-[#E9C0E9]">
        <img className="h-full object-contain" src="/generate.png" alt="Generate your links" />
        <ToastContainer />
      </div>
    </div>
  );
};

// Wrap with Suspense
export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GenerateWithSuspense />
    </Suspense>
  );
}
