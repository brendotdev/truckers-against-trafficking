exports.handleAnnonymousePosts = (posts) => {
    posts = JSON.parse(JSON.stringify(posts));
    return posts.map(post => {
        if (post.isAnonymous) {
            post.author.username = "Anonymous"
            post.author.id = "-1";
        }
        return post;
    });
}