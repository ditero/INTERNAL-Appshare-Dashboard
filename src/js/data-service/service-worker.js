'use strict';

class Service {
    constructor(post, url, data, contentType) {
        this.post = post;
        this.url = url;
        this.data = data;
        this.contentType = contentType;
    }

    onLoadLogData() {
        return $.ajax({
            url: this.url,
            method: this.post,
            data: this.data
        });
    }
};