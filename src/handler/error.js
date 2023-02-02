module.exports = (client, Client) => {
    process.on('unhandledRejection', (reason) => {
        if(reason === "resolve") return;
        console.log(reason);
    });

    process.on('uncaughtException', (reason) => {
        if(reason === "resolve") return;
        console.log(reason);
    });

    process.on('multipleResolves', (reason) => {
        if(reason === "resolve") return;
        console.log(reason);
    });
};