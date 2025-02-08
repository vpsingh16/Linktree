import Link from "next/link"
import clientPromise from "@/lib/mongodb"
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    const handle = (await params).handle
    const client = await clientPromise;
    const db = client.db("LinkTree")
    const collection = db.collection("links")

    // If the handle is already claimed, you cannot create the LinkTree
    const item = await collection.findOne({handle: handle})
    if(!item){
        return notFound()
    }

    console.log(item)

    return <div className="flex min-h-screen bg-purple-400 justify-center items-start py-10">
        {item && <div className="photo flex justify-center flex-col items-center gap-4"> 
            <img src={item.pic} alt="" />
            <span className="font-bold text-xl">@{item.handle}</span>
            <span className="desc w-80 text-center">{item.desc}</span>
            <div className="links">
                {item.links.map((item, index)=>{
                    return <Link  key={index} href= {item.link}><div className="bg-purple-100 py-4 shadow-lg px-2 min-w-96 flex justify-center rounded-md my-3">
                       {item.linktext}
                       
                    </div></Link> 
                })}
            </div>
      </div>}
    </div>
}