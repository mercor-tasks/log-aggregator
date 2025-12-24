const getInputValue = (inputId) => {
    return $(`#${inputId}`).val();
}

const addParamToURI = (name, value) => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set(name, value);
    window.location.search = urlParams;
}

const getTimeRangeFromUI = () => {
    const timerangeValue = parseInt(getInputValue("timerangeValue"));
    const timerangeMode = getInputValue("timerangeMode");

    const now = Date.now();
    let start = parseInt(now);
    if (timerangeMode == 'm') {
        start -= timerangeValue * 60 * 1000;
    } else if (timerangeMode == 'h') {
        start -= timerangeValue * 60 * 60 * 1000;
    } else if (timerangeMode == 'd') {
        start -= timerangeValue * 24 * 60 * 60 * 1000;
    }
    return {
        "start": start,
        "end": now
    };
}

function updateUrlParam(key, value, method = 'replace') {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value); // Add or update the parameter

    if (method === 'push') {
        window.history.pushState({}, '', url);
    } else {
        window.history.replaceState(null, '', url);
    }
}

const addFormParamsToURI = () => {
    const application = getInputValue("application");
    const searchTerms = getInputValue("searchTerms");
    const timeRange = getTimeRangeFromUI();
    const startTime = timeRange.start;
    const endTime = timeRange.end;

    updateUrlParam("application", application);
    updateUrlParam("searchTerms", searchTerms);
    updateUrlParam("startTime", startTime);
    updateUrlParam("endTime", endTime);
}

const addParamsToURI = (paramsDict) => {
    Object.entries(paramsDict).forEach(([key, value]) => {
        updateUrlParam(key, value);
    });
}

const clearExistingLogs = () => {
    $('#log-pre').html("");
}

const addLogItem = (ts, logLine) => {
    $('#log-pre').append(`
        <div class="log-item">
            <span><i>${ts}:</i> ${logLine}</span>
        </div>
    `);
}

const renderLogs = (logs) => {
    logs.forEach((log) => {
        addLogItem(log['ts'], log['logLine']);
    })
}

const executeSearch = () => {
    const application = getInputValue("application");
    const searchTerms = getInputValue("searchTerms");
    const timeRange = getTimeRangeFromUI();
    const startTime = timeRange.start;
    const endTime = timeRange.end;

    const logSearchParams = {
        application: application,
        searchTerms: searchTerms,
        startTime: startTime,
        endTime: endTime,
    };

    addParamsToURI(logSearchParams);

    $.ajax({
        url: searchUrl,
        type: 'POST',
        data: JSON.stringify(logSearchParams),
        success: (data) => {
            const logs = data.logs;
            clearExistingLogs();
            renderLogs(logs);
        },
        error: (e) => {
            alert(e);
        },
        cache: false,
    });
}

$("#searchButton").on('click', () => {
    executeSearch();
})