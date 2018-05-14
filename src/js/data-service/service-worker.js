const serviceworker = (() => {
    const getLogData = (method, url, data) => {
        let logData = $.ajax({
            method: method,
            url: url,
            data: data,
            success: ((logs) => {
                return logs;
            }),
            fail: ((jqXHR, textStatus) => {
                alert(jqXHR, textStatus);
            })
        });


        return logData.done((data) => {
            return data
        });

    };

    const getConfigData = (method, url) => {
        let configData = $.ajax({
            method: method,
            url: url,
            success: ((config) => {
                return config;
            }),
            fail: ((jqXHR, textStatus) => {
                alert(jqXHR, textStatus);
            })
        });

        return configData.done((data) => {
            return data
        });
    };

    return {
        getLogData,
        getConfigData
    }
})();