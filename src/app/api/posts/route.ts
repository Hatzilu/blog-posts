import { db } from "@/server/db";
import { posts } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(){
    const posts = await db.query.posts.findMany()

    return NextResponse.json(posts);
}
export async function POST(req: NextRequest){
    const token = req.headers.get('authorization')?.split('Bearer ')[1] === process.env.ACCESS_TOKEN;
    console.log(req.headers);
    
    if (!token) {
        return NextResponse.json("Unauthorized", {status: 401});
    }
    if (!req.body) {
        return NextResponse.json("Bad Request", {status: 400});
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await req.json();

    const postSchema = z.object({
        authorName: z.string(),
        authorHref: z.string(),
        body: z.string(),
        title: z.string(),
    });
    const post = postSchema.parse(json);
    
    const success = await db.insert(posts).values(post);
    console.log({success});
    

    return NextResponse.json({message: 'Success'}, {status: 200});
}
export async function DELETE(req: NextRequest){
    const token = req.headers.get('authorization')?.split('Bearer ')[1] === process.env.ACCESS_TOKEN;
    console.log(req.headers);
    
    if (!token) {
        return NextResponse.json("Unauthorized", {status: 401});
    }
    if (!req.body) {
        return NextResponse.json("Bad Request", {status: 400});
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await req.json();

    const postSchema = z.object({
        id: z.number(),
    });
    const post = postSchema.parse(json);
    
    const success = await db.delete(posts).where(eq(posts.id, post.id));
    console.log('deleted post ',post.id);
    

    return NextResponse.json({message: 'Success'}, {status: 200});
}