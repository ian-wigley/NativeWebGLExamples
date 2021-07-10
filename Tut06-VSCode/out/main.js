require(["out\\app.js"], function (App) {
    var application = new App();
    application.Initialise();
    application.Run();
});
require.config({
    baseUrl: "out",
    paths: {
        "some": "app"
    },
    waitSeconds: 15,
});
//# sourceMappingURL=main.js.map