const express = require("express");
const router = express.Router();

function routes(app) {

    router.get("/imovel/:id", (req, res) => {
        console.log("ID ", req.params.id)
        res.render("imovel", { id: req.params.id });
    });

    return router;
};

module.exports = routes;