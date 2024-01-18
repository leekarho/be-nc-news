const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("GET:200 returns topics with correct properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET /api", () => {
  test("returns an object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body).toBe("object");
      });
  });
  test("endPoints has correct keys", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const respEndpoints = response.body;
        expect(respEndpoints).toEqual(endPoints);

        delete respEndpoints["GET /api"];
        for (keys in respEndpoints) {
          expect(respEndpoints[keys].hasOwnProperty("description")).toBe(true);
          expect(respEndpoints[keys].hasOwnProperty("queries")).toBe(true);
          expect(respEndpoints[keys].hasOwnProperty("exampleResponse")).toBe(
            true
          );
        }
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("GET: 200 sends a single article", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.article_id).toBe(3);
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("some gifs");
        expect(article.created_at).toBe(new Date(1604394720000).toJSON());
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("GET:404 sends error message when given a non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("GET:400 sends error message when given a bad request", () => {
    return request(app)
      .get("/api/articles/pokemon")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("return an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBe(13);

        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("GET: 200 should be sorted by article.created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("GET:200 get all comments from article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.article_id).toBe("number");
        });
      });
  });
  test("GET:400 sends error message when given a bad request", () => {
    return request(app)
      .get("/api/articles/pokemon/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET:404 sends error message when given a non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("GET:200 responds with empty array if article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toEqual([]);
      });
  });
  test("GET:200 array of comments is in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201 can add a comment to an article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i bloody love coding",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.comment_id).toBe(19);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("i bloody love coding");
      });
  });
  test("POST 201: trying to post a comment with more key-value pairs than expected", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i bloody love coding",
      votes: 5,
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(201);
  });
  test("POST 400: trying to post a comment with fewer key-value pairs than expected", () => {
    const newComment = {
      body: "i bloody love coding",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("POST 404: trying to post a comment with a non-existent username", () => {
    const newComment = {
      username: "nc_student",
      body: "i bloody love coding",
    };
    return request(app)
      .post("/api/articles/3/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("POST 400: sends error when given a bad request", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i bloody love coding",
      votes: 5,
    };
    return request(app)
      .post("/api/articles/sandwich/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 404: sends error message when given a non-existent id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "i bloody love coding",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("PATCH 200 can update an article", () => {
    const updatedVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVote)
      .expect(200)
      .then((response) => {
        const article = response.body.article;
        expect(article.title).toBe("Living in the shadow of a great man");
        expect(article.topic).toBe("mitch");
        expect(article.body).toBe("I find this existence challenging");
        expect(article.votes).toBe(103);
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
      });
  });
  test("PATCH 200 trying to patch article with more than just votes", () => {
    const updatedVote = { inc_votes: 3, topic: "sandwich" };
    return request(app).patch("/api/articles/1").send(updatedVote).expect(200);
  });
  test("PATCH 400 trying to update vote with no inc_vote key", () => {
    const updatedVote = { topic: "pie" };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404 sends error message when given a non-existent id", () => {
    const updatedVote = { inc_votes: 3 };
    return request(app)
      .patch("/api/articles/999")
      .send(updatedVote)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("PATCH 400 sends error message when given a non-existent id", () => {
    const updatedVote = { inc_votes: "sandwich" };
    return request(app)
      .patch("/api/articles/1")
      .send(updatedVote)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("DELETE 204 can delete a comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE 404 cannot delete a previously deleted comment", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe("Not found");
          });
      });
  });
  test("DELETE 404 trying to delete a non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("DELETE 400 when id is a string rather than an integer", () => {
    return request(app)
      .delete("/api/comments/sandwich")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET 200 returns an array of all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("GET 200 can filter articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBeGreaterThan(0);

        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("GET 404 if non existant topic entered", () => {
    return request(app)
      .get("/api/articles?topic=sandwich")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
  test("GET 200 returns all topics if query is empty", () => {
    return request(app)
      .get("/api/articles?topic=")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;

        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("string");
        });
      });
  });
  test("GET 200 returns empty array if valid topic has no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toEqual([]);
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("GET 200 article object should include comments count", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((response) => {
        const article = response.body.article;

        expect(article.article_id).toBe(3);
        expect(article.title).toBe("Eight pug gifs that remind me of mitch");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("icellusedkars");
        expect(article.body).toBe("some gifs");
        expect(article.created_at).toBe(new Date(1604394720000).toJSON());
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.comment_count).toBe(2);
      });
  });
});

describe("GET /api/articles (sorting queries)", () => {
  test("GET: 200 can sort by title, default descending", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("GET: 200 can sort by topic, default descending", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("topic", {
          descending: true,
        });
      });
  });
  test("GET: 200 can sort by author, default descending", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("GET: 200 can sort by article_img_url, default descending", () => {
    return request(app)
      .get("/api/articles?sort_by=article_img_url")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("article_img_url", {
          descending: true,
        });
      });
  });
  test("GET: 200 can sort by author, in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=author&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("author", {
          descending: false,
        });
      });
  });
  test("GET: 400 error message when sorting by non-existent topic", () => {
    return request(app)
      .get("/api/articles?sort_by=pie")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("GET: 200 can order by create_at ascending", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles).toBeSortedBy("created_at", {
          descending: false,
        });
      });
  });
  test("GET: 400 error message when given a non-existant order", () => {
    return request(app)
      .get("/api/articles?order=pie")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/users/:username", () => {
  test("GET 200 returns correct user object", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then((response) => {
        const user = response.body.user;
        expect(user.username).toBe("butter_bridge");
        expect(user.name).toBe("jonny");
        expect(user.avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
        );
      });
  });
  test("GET 404 error message if given a non-existent username", () => {
    return request(app)
      .get("/api/users/pie")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("PATCH 200 can update votes", () => {
    const updateVotes = { inc_votes: 3 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(typeof comment.body).toBe("string");
        expect(comment.votes).toBe(19);
        expect(comment.author).toBe("butter_bridge");
        expect(comment.article_id).toBe(9);
        expect(typeof comment.created_at).toBe("string");
      });
  });
  test("PATCH 200 can update votes with a negative vote", () => {
    const updateVotes = { inc_votes: -3 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.votes).toBe(13);
      });
  });
  test("PATCH 200 can update votes with a negative vote", () => {
    const updateVotes = { inc_votes: -3 };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.votes).toBe(13);
      });
  });
  test("PATCH 200 can update comments with object containing more than just votes", () => {
    const updateVotes = { inc_votes: -3, topic: "pie" };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(200)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment.votes).toBe(13);
      });
  });
  test("PATCH 400 error message when object contains no inc_vote", () => {
    const updateVotes = { topic: "pie" };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 400 error message when object is given a string", () => {
    const updateVotes = { inc_votes: "pie" };
    return request(app)
      .patch("/api/comments/1")
      .send(updateVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("PATCH 404 error message when looking for a non-existent id", () => {
    const updateVotes = { inc_votes: 5 };
    return request(app)
      .patch("/api/comments/999")
      .send(updateVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not found");
      });
  });
});

describe("POST /api/articles", () => {
  test("POST 201 can add a new article", () => {
    const newArticle = {
      title: "Standing on the shoulders of giants",
      topic: "mitch",
      author: "butter_bridge",
      body: "This test file is over 600 lines long!",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then((response) => {
        const article = response.body.article;
        expect(article.title).toBe("Standing on the shoulders of giants");
        expect(article.topic).toBe("mitch");
        expect(article.author).toBe("butter_bridge");
        expect(article.body).toBe("This test file is over 600 lines long!");
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(article.hasOwnProperty("article_id")).toBe(true);
        expect(article.hasOwnProperty("votes")).toBe(true);
        expect(article.hasOwnProperty("created_at")).toBe(true);
        expect(article.hasOwnProperty("comment_count")).toBe(true);
      });
  });
  test("POST 201: trying to post a comment with more key-value pairs than expected", () => {
    const newArticle = {
      title: "Standing on the shoulders of giants",
      topic: "mitch",
      author: "butter_bridge",
      body: "This test file is over 600 lines long!",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      lunch: "wrap",
    };
    return request(app).post("/api/articles").send(newArticle).expect(201);
  });
  test("POST 400: trying to post a comment with fewer key-value pairs than expected", () => {
    const newArticle = {
      title: "Standing on the shoulders of giants",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 400: trying to post a comment with unknown topic", () => {
    const newArticle = {
      title: "Standing on the shoulders of giants",
      topic: "endpoints",
      author: "butter_bridge",
      body: "This test file is over 600 lines long!",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
  test("POST 400: trying to post a comment with unknown author", () => {
    const newArticle = {
      title: "Standing on the shoulders of giants",
      topic: "endpoints",
      author: "pie",
      body: "This test file is over 600 lines long!",
      article_img_url:
        "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});
