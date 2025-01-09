import { auth } from './auth'

// eslint-disable-next-line consistent-return
export default auth((req) => {
    const { pathname, origin, href } = req.nextUrl

    if (!req.auth && !pathname.startsWith('/auth')) {
        const newUrl = new URL('/auth/signin', origin)
        newUrl.searchParams.set('redirectTo', href.replace(origin, ''))
        return Response.redirect(newUrl)
    }

    if (req.auth && pathname.startsWith('/auth')) {
        const newUrl = new URL('/mypage', origin)
        return Response.redirect(newUrl.href)
    }
})
export const config = {
    matcher: ['/mypage', '/order', '/auth/:path*'],
}
