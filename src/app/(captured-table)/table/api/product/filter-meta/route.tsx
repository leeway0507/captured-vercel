import { NextResponse } from 'next/server';
import getData from '../../../components/fetch/fetch';

export const dynamic = 'force-dynamic';

const GetMetaData = async () => {
  const res = await getData('product/filter-meta');
  return NextResponse.json(res);
};

export { GetMetaData as GET };
