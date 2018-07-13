// The below code should pass all 9 tests if inserted into index.js

app.get('/api/v1/fibonacci', (req, res) => {
    let { start, end, sort } = req.query;
    let toUseDefaultResultLength = true;

    let queryParameters = Object.keys(req.query);
    let startIndex = queryParameters.indexOf('start');
    if (startIndex > -1) {queryParameters.splice(startIndex, 1);}
    let endIndex = queryParameters.indexOf('end');
    if (endIndex > -1) {queryParameters.splice(endIndex, 1);}
    let sortIndex = queryParameters.indexOf('sort');
    if (sortIndex > -1) {queryParameters.splice(sortIndex, 1);}

    if (queryParameters.length > 0) {
        return res.status(400).send({status: "failed", result: "unknown query parameters"});
    }

    if ((end && !start) || (parseInt(start) < 1) || parseInt(end) < parseInt(start))  {
        return res.status(400).send({status: "failed", result: "invalid input"});
    };
    
    if (start) {start = parseInt(start)};
    if (end) {end = parseInt(end)};
    let queryString = `SELECT number FROM fibonacci`;
    if (start) {
        queryString += ` WHERE id >= ${start}`;
        if (end) {
            queryString += ` AND id <= ${end}`;
            toUseDefaultResultLength = false;
        };
    };
    if (toUseDefaultResultLength) {queryString += ` LIMIT 20`};
    db.query(queryString, (err, result) => {
        let toSend = result.rows.map(obj => parseInt(obj.number));
        if (sort === 'desc') {toSend = toSend.sort((a,b) => {return b-a})};
        res.status(200).send({
            status: "success",
            result: toSend
        });
    });
});

app.get('/api/v1', (req, res) => {
    res.status(200).send({
        status: "server is up",
        result: null
    })
})