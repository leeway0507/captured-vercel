import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GetMetaData = async (req:NextRequest) => {
  const key = req.nextUrl.searchParams.get('key');
  if (key === 'yangoos') {
    const reqUrl = new URL('api/product/reset-product-cache', process.env.NEXT_PUBLIC_BACKEND!);
    await fetch(reqUrl.href);
    return NextResponse.json('true');
  }
  return NextResponse.json('false');
};

export { GetMetaData as GET };
