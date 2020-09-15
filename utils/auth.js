import Router from "next/router";
import nextCookie from "next-cookies";
import jwt from 'jsonwebtoken'

export const auth = ctx => {
    const { token } = nextCookie(ctx);

    if (ctx.req && !token) {
        ctx.res.writeHead(302, { Location: "/login" });
        ctx.res.end();
        return;
    }

    if (!token) {
        Router.push("/login");
    }

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return Router.push("/login");
    });

    return token;
};